import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Token requis", code: "MISSING_TOKEN" },
        { status: 400 }
      );
    }

    const decoded = await getAdminAuth().verifyIdToken(idToken);

    return NextResponse.json({
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch {
    return NextResponse.json(
      { error: "Token invalide", code: "INVALID_TOKEN" },
      { status: 401 }
    );
  }
}
