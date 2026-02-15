import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { PLAN_CONVERSION_LIMITS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Non authentifie", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await getAdminAuth().verifyIdToken(token);

    const db = getAdminDb();
    const userRef = db.collection("users").doc(decoded.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { error: "Utilisateur non trouve", code: "USER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const userData = userSnap.data()!;

    // Get recent conversions
    const conversionsSnap = await db
      .collection("conversions")
      .where("userId", "==", decoded.uid)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const conversions = conversionsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    return NextResponse.json({
      plan: userData.plan || "free",
      conversionsUsed: userData.conversionsUsed || 0,
      conversionsThisMonth: userData.conversionsThisMonth || 0,
      totalTokensUsed: userData.totalTokensUsed || 0,
      conversionsLimit:
        PLAN_CONVERSION_LIMITS[userData.plan || "free"] ?? PLAN_CONVERSION_LIMITS.free,
      conversions,
    });
  } catch (error) {
    console.error("Usage error:", error);
    return NextResponse.json(
      { error: "Erreur", code: "USAGE_ERROR" },
      { status: 500 }
    );
  }
}
