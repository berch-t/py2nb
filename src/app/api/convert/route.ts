import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { convertWithClaude } from "@/lib/claude";
import { convertToNotebook } from "@/lib/jupytext";
import { FieldValue } from "firebase-admin/firestore";
import {
  MAX_CODE_LENGTH,
  PLAN_LINE_LIMITS,
  PLAN_CONVERSION_LIMITS,
  IP_FREE_LIMIT,
} from "@/lib/constants";

export const maxDuration = 60;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

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

    const lineCount = code.split("\n").length;

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
    const conversionsUsed = userData.conversionsUsed || 0;

    // Check line limit per plan
    const maxLines = PLAN_LINE_LIMITS[plan] ?? PLAN_LINE_LIMITS.free;
    if (lineCount > maxLines) {
      const upgradeMsg =
        plan === "free"
          ? "Passez au Pro pour convertir jusqu'a 5000 lignes !"
          : plan === "pro"
            ? "Passez au Premium pour des fichiers sans limite."
            : "";
      return NextResponse.json(
        {
          error: `Fichier trop long : ${lineCount} lignes (limite ${maxLines} pour le plan ${plan}). ${upgradeMsg}`,
          code: "LINE_LIMIT_EXCEEDED",
        },
        { status: 403 }
      );
    }

    // Check monthly conversion limit per plan
    const conversionLimit = PLAN_CONVERSION_LIMITS[plan] ?? PLAN_CONVERSION_LIMITS.free;
    if (conversionsUsed >= conversionLimit) {
      const upgradeMsg =
        plan === "free"
          ? "Passez au plan Pro pour 50 conversions/mois !"
          : "Limite de conversions atteinte pour ce mois.";
      return NextResponse.json(
        {
          error: `Limite de conversions atteinte (${conversionsUsed}/${conversionLimit}). ${upgradeMsg}`,
          code: "LIMIT_REACHED",
        },
        { status: 403 }
      );
    }

    // IP-based anti-abuse for free plan
    if (plan === "free") {
      const clientIp = getClientIp(request);
      const ipHash = hashIp(clientIp);
      const currentMonth = getCurrentMonth();
      const ipRef = db.collection("ip_limits").doc(ipHash);
      const ipSnap = await ipRef.get();

      if (ipSnap.exists) {
        const ipData = ipSnap.data()!;
        // Reset if new month
        if (ipData.month === currentMonth && (ipData.conversionsUsed || 0) >= IP_FREE_LIMIT) {
          return NextResponse.json(
            {
              error: `Limite de conversions gratuites atteinte pour cette adresse. Passez au Pro pour continuer !`,
              code: "IP_LIMIT_REACHED",
            },
            { status: 403 }
          );
        }
      }
    }

    // Create conversion record
    const conversionRef = db.collection("conversions").doc();

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

    // Update IP usage (for free plan anti-abuse)
    if ((userData.plan || "free") === "free") {
      const clientIp = getClientIp(request);
      const ipHash = hashIp(clientIp);
      const currentMonth = getCurrentMonth();
      const ipRef = db.collection("ip_limits").doc(ipHash);
      const ipSnap = await ipRef.get();

      if (ipSnap.exists && ipSnap.data()!.month === currentMonth) {
        await ipRef.update({
          conversionsUsed: FieldValue.increment(1),
          updatedAt: FieldValue.serverTimestamp(),
        });
      } else {
        await ipRef.set({
          month: currentMonth,
          conversionsUsed: 1,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

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
