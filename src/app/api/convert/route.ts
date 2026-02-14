import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { convertWithClaude } from "@/lib/claude";
import { convertToNotebook } from "@/lib/jupytext";
import { FieldValue } from "firebase-admin/firestore";
import { MAX_CODE_LENGTH } from "@/lib/constants";

export const maxDuration = 60;

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = await getAdminAuth().verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Auth
    const decoded = await verifyAuth(request);
    if (!decoded) {
      return NextResponse.json(
        { error: "Non authentifie", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    // Parse body
    const body = await request.json();
    const { code, fileName } = body as {
      code: string;
      fileName?: string;
    };

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

    // Check usage limits
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
    const plan = userData.plan || "free";

    if (plan === "free" && userData.conversionsUsed >= 3) {
      return NextResponse.json(
        {
          error: "Limite de conversions atteinte. Passez au plan Pro !",
          code: "LIMIT_REACHED",
        },
        { status: 403 }
      );
    }

    // Create conversion record
    const conversionRef = db.collection("conversions").doc();
    const lineCount = code.split("\n").length;

    await conversionRef.set({
      userId: decoded.uid,
      inputCode: code,
      inputFileName: fileName || null,
      inputLineCount: lineCount,
      outputNotebook: "",
      claudeModel: "claude-sonnet-4-5-20250929",
      claudeInputTokens: 0,
      claudeOutputTokens: 0,
      status: "processing",
      errorMessage: null,
      processingTimeMs: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Claude AI conversion
    const claudeResult = await convertWithClaude(code);

    // Jupytext conversion to .ipynb
    const notebookJson = await convertToNotebook(claudeResult.content);

    const processingTimeMs = Date.now() - startTime;

    // Update conversion record
    await conversionRef.update({
      outputNotebook: notebookJson,
      claudeInputTokens: claudeResult.inputTokens,
      claudeOutputTokens: claudeResult.outputTokens,
      status: "completed",
      processingTimeMs,
    });

    // Update user usage
    await userRef.update({
      conversionsUsed: FieldValue.increment(1),
      conversionsThisMonth: FieldValue.increment(1),
      totalTokensUsed: FieldValue.increment(
        claudeResult.inputTokens + claudeResult.outputTokens
      ),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      notebook: JSON.parse(notebookJson),
      conversionId: conversionRef.id,
      inputTokens: claudeResult.inputTokens,
      outputTokens: claudeResult.outputTokens,
      processingTimeMs,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la conversion",
        code: "CONVERSION_ERROR",
      },
      { status: 500 }
    );
  }
}
