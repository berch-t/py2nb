import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe";
import { convertWithClaude } from "@/lib/claude";
import { convertToNotebook } from "@/lib/jupytext";

export const maxDuration = 60;

/**
 * POST /api/convert/process-payment
 *
 * Appelé par le frontend après redirection Stripe.
 * Vérifie le paiement, lance la conversion Claude + Jupytext TS, retourne le notebook.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { sessionId } = body as { sessionId: string };

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id manquant", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    // Verify Stripe session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Paiement non complete", code: "PAYMENT_NOT_COMPLETED" },
        { status: 402 }
      );
    }

    const pendingConversionId = session.metadata?.pendingConversionId;
    if (!pendingConversionId) {
      return NextResponse.json(
        { error: "Conversion ID manquant", code: "MISSING_CONVERSION_ID" },
        { status: 400 }
      );
    }

    // Get pending conversion from Firestore
    const db = getAdminDb();
    const pendingRef = db
      .collection("pending_conversions")
      .doc(pendingConversionId);
    const pendingSnap = await pendingRef.get();

    if (!pendingSnap.exists) {
      return NextResponse.json(
        { error: "Conversion expiree ou introuvable", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const pendingData = pendingSnap.data()!;

    // Check if already processed (idempotent)
    if (pendingData.status === "completed" && pendingData.outputNotebook) {
      const notebook = JSON.parse(pendingData.outputNotebook);
      return NextResponse.json({
        notebook,
        fileName: pendingData.fileName
          ? pendingData.fileName.replace(/\.py$/, ".ipynb")
          : "notebook.ipynb",
        inputTokens: pendingData.claudeInputTokens || 0,
        outputTokens: pendingData.claudeOutputTokens || 0,
        processingTimeMs: pendingData.processingTimeMs || 0,
        alreadyProcessed: true,
      });
    }

    // Update status to processing
    await pendingRef.update({ status: "processing" });

    // Step 1: Call Claude API
    const claudeResult = await convertWithClaude(pendingData.code);

    // Step 2: Convert percent-format to .ipynb JSON (pure TypeScript)
    const notebookJson = convertToNotebook(claudeResult.content);

    const processingTimeMs = Date.now() - startTime;

    // Store result and mark as completed
    await pendingRef.update({
      outputNotebook: notebookJson,
      claudeInputTokens: claudeResult.inputTokens,
      claudeOutputTokens: claudeResult.outputTokens,
      status: "completed",
      processingTimeMs,
      completedAt: new Date(),
    });

    // Create anonymous conversion record for analytics
    const conversionRef = db.collection("conversions").doc();
    await conversionRef.set({
      userId: null,
      inputCode: pendingData.code,
      inputFileName: pendingData.fileName || null,
      inputLineCount: pendingData.lineCount,
      outputNotebook: notebookJson,
      claudeModel: "claude-sonnet-4-5-20250929",
      claudeInputTokens: claudeResult.inputTokens,
      claudeOutputTokens: claudeResult.outputTokens,
      status: "completed",
      errorMessage: null,
      processingTimeMs,
      paymentType: "pay_per_use",
      priceInCents: pendingData.priceInCents,
      stripeSessionId: sessionId,
      createdAt: new Date(),
    });

    // Return notebook JSON to frontend
    const notebook = JSON.parse(notebookJson);
    const fileName = pendingData.fileName
      ? pendingData.fileName.replace(/\.py$/, ".ipynb")
      : "notebook.ipynb";

    return NextResponse.json({
      notebook,
      fileName,
      inputTokens: claudeResult.inputTokens,
      outputTokens: claudeResult.outputTokens,
      processingTimeMs,
    });
  } catch (error) {
    console.error("Process payment error:", error);
    return NextResponse.json(
      {
        error: "Erreur lors du traitement de la conversion",
        code: "PROCESSING_ERROR",
      },
      { status: 500 }
    );
  }
}
