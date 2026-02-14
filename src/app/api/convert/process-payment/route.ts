import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { getStripe } from "@/lib/stripe";
import { convertWithClaude } from "@/lib/claude";
import { convertToNotebook } from "@/lib/jupytext";

export const maxDuration = 60;

/**
 * Endpoint de callback après paiement Stripe (pay-per-use)
 *
 * Flow :
 * 1. Vérifie le paiement Stripe avec session_id
 * 2. Récupère le code depuis Firestore
 * 3. Lance la conversion (Claude + Jupytext)
 * 4. Retourne le notebook en JSON (pour téléchargement direct)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

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
        { error: "Conversion expirée ou introuvable", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const pendingData = pendingSnap.data()!;

    // Check if already processed
    if (pendingData.status === "completed") {
      // Return cached result
      return NextResponse.json({
        notebook: JSON.parse(pendingData.outputNotebook),
        fileName: pendingData.fileName || "notebook.ipynb",
        alreadyProcessed: true,
      });
    }

    // Update status to processing
    await pendingRef.update({ status: "processing" });

    // Convert with Claude
    const claudeResult = await convertWithClaude(pendingData.code);

    // Convert to .ipynb with Jupytext
    const notebookJson = await convertToNotebook(claudeResult.content);

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
      userId: null, // anonymous
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

    // Return notebook as downloadable JSON
    const notebook = JSON.parse(notebookJson);
    const fileName = pendingData.fileName
      ? pendingData.fileName.replace(/\.py$/, ".ipynb")
      : "notebook.ipynb";

    // Return HTML with auto-download
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Téléchargement du notebook</title>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: #0a0a0a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .container {
          text-align: center;
          max-width: 600px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 16px;
        }
        p {
          color: #a1a1aa;
          margin-bottom: 24px;
        }
        .btn {
          display: inline-block;
          background: #6366f1;
          color: #fff;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
        }
        .btn:hover {
          background: #4f46e5;
        }
        .stats {
          margin-top: 32px;
          padding: 16px;
          background: #18181b;
          border-radius: 8px;
          font-size: 14px;
          color: #a1a1aa;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✅ Conversion réussie !</h1>
        <p>Votre notebook est prêt. Le téléchargement va commencer automatiquement...</p>
        <a href="/" class="btn">Retour à l'accueil</a>
        <div class="stats">
          ${claudeResult.inputTokens + claudeResult.outputTokens} tokens • ${(processingTimeMs / 1000).toFixed(1)}s
        </div>
      </div>
      <script>
        const notebook = ${JSON.stringify(notebook)};
        const fileName = ${JSON.stringify(fileName)};

        // Auto-download
        const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      </script>
    </body>
    </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
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
