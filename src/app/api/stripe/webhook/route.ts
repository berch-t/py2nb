import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const db = getAdminDb();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const firebaseUid = session.metadata?.firebaseUid;

        if (firebaseUid && session.subscription) {
          // Determine plan from subscription
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription as string
          );
          const priceId = subscription.items.data[0]?.price.id;

          const plan =
            priceId === process.env.STRIPE_PREMIUM_PRICE_ID
              ? "premium"
              : "pro";

          await db.collection("users").doc(firebaseUid).update({
            plan,
            stripeSubscriptionId: session.subscription,
            updatedAt: FieldValue.serverTimestamp(),
          });

          // Log payment
          await db.collection("payments").add({
            userId: firebaseUid,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent,
            type: "subscription",
            plan,
            amount: session.amount_total,
            currency: session.currency,
            status: "completed",
            createdAt: FieldValue.serverTimestamp(),
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const usersSnap = await db
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!usersSnap.empty) {
          const userDoc = usersSnap.docs[0];
          const priceId = subscription.items.data[0]?.price.id;
          const plan =
            priceId === process.env.STRIPE_PREMIUM_PRICE_ID
              ? "premium"
              : "pro";

          await userDoc.ref.update({
            plan,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const usersSnap = await db
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!usersSnap.empty) {
          await usersSnap.docs[0].ref.update({
            plan: "free",
            stripeSubscriptionId: null,
            updatedAt: FieldValue.serverTimestamp(),
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const usersSnap = await db
          .collection("users")
          .where("stripeCustomerId", "==", customerId)
          .limit(1)
          .get();

        if (!usersSnap.empty) {
          await db.collection("payments").add({
            userId: usersSnap.docs[0].id,
            stripeSessionId: null,
            stripePaymentIntentId: invoice.payment_intent,
            type: "subscription",
            plan: null,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: "failed",
            createdAt: FieldValue.serverTimestamp(),
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
  }

  return NextResponse.json({ received: true });
}
