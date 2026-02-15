import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getStripe, getPayPerUsePrice } from "@/lib/stripe";
import { MAX_CODE_LENGTH } from "@/lib/constants";

export const maxDuration = 30;

/**
 * Endpoint pour initier un paiement pay-per-use (utilisateurs non connectés)
 *
 * Flow :
 * 1. Reçoit le code Python
 * 2. Calcule le prix selon le nombre de lignes
 * 3. Stocke le code temporairement dans Firestore avec un UUID
 * 4. Crée une Stripe Checkout Session
 * 5. Retourne l'URL de checkout
 */
export async function POST(request: NextRequest) {
  try {
    // Parse body
    const body = await request.json();
    const { code, fileName } = body as {
      code: string;
      fileName?: string;
    };

    // Validation
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Code Python requis", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    if (code.length > MAX_CODE_LENGTH) {
      return NextResponse.json(
        {
          error: `Code trop long (max ${MAX_CODE_LENGTH} caracteres)`,
          code: "CODE_TOO_LONG",
        },
        { status: 400 }
      );
    }

    // Calculate price
    const lineCount = code.split("\n").length;
    const priceInCents = getPayPerUsePrice(lineCount);

    // Store code temporarily in Firestore
    const db = getAdminDb();
    const pendingRef = db.collection("pending_conversions").doc();
    const pendingId = pendingRef.id;

    await pendingRef.set({
      code,
      fileName: fileName || null,
      lineCount,
      priceInCents,
      status: "pending_payment",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour TTL
    });

    // Create Stripe Checkout Session
    const stripe = getStripe();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Conversion Python → Notebook",
              description: `Fichier ${lineCount} lignes - Conversion unique`,
              images: [`${appUrl}/logo.png`], // Optionnel
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?canceled=true`,
      metadata: {
        pendingConversionId: pendingId,
        type: "pay_per_use_conversion",
      },
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      priceInCents,
      lineCount,
      pendingId,
    });
  } catch (error) {
    console.error("Pay-per-use checkout error:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la creation du paiement",
        code: "CHECKOUT_ERROR",
      },
      { status: 500 }
    );
  }
}
