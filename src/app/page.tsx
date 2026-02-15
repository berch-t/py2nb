"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { CodeInput } from "@/components/converter/code-input";
import { ConvertButton } from "@/components/converter/convert-button";
import { NotebookPreview } from "@/components/converter/notebook-preview";
import { ConversionCounter } from "@/components/converter/conversion-counter";
import { DownloadButton } from "@/components/shared/download-button";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { useAuthStore } from "@/stores/auth-store";
import { motion } from "motion/react";

interface ConvertResult {
  notebook: Record<string, unknown>;
  fileName?: string;
  inputTokens: number;
  outputTokens: number;
  processingTimeMs: number;
}

function HomeContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [conversionsUsed, setConversionsUsed] = useState(0);

  // Auto-download notebook
  const triggerDownload = useCallback(
    (notebook: Record<string, unknown>, name: string) => {
      const blob = new Blob([JSON.stringify(notebook, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    },
    []
  );

  // Handle Stripe return: ?session_id=xxx
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    if (canceled) {
      toast.error("Paiement annule");
      // Clean URL
      window.history.replaceState({}, "", "/");
      return;
    }

    if (!sessionId) return;

    // Clean URL immediately to prevent double processing on refresh
    window.history.replaceState({}, "", "/");

    const processPayment = async () => {
      setLoading(true);
      setLoadingMessage("Paiement verifie. Conversion en cours...");

      try {
        setLoadingMessage("Analyse de votre code par Claude AI...");

        const res = await fetch("/api/convert/process-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur de conversion");
        }

        setLoadingMessage("Generation du notebook...");

        const data = await res.json();

        setResult({
          notebook: data.notebook,
          fileName: data.fileName,
          inputTokens: data.inputTokens,
          outputTokens: data.outputTokens,
          processingTimeMs: data.processingTimeMs,
        });

        // Auto-download
        triggerDownload(data.notebook, data.fileName || "notebook.ipynb");

        toast.success(
          `Notebook genere en ${(data.processingTimeMs / 1000).toFixed(1)}s !`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur de conversion";
        toast.error(message);
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
    };

    processPayment();
  }, [searchParams, triggerDownload]);

  const handleConvert = async () => {
    if (!code.trim()) {
      toast.error("Veuillez coller du code Python");
      return;
    }

    // Flow 1: User connecte
    if (user) {
      setLoading(true);
      setLoadingMessage("Conversion en cours...");
      setResult(null);

      try {
        const token = Cookies.get("firebase-auth-token");

        setLoadingMessage("Analyse de votre code par Claude AI...");

        const res = await fetch("/api/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code, fileName }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erreur de conversion");
        }

        setLoadingMessage("Generation du notebook...");

        const data: ConvertResult = await res.json();
        setResult(data);
        setConversionsUsed((prev) => prev + 1);
        toast.success(
          `Notebook genere en ${(data.processingTimeMs / 1000).toFixed(1)}s !`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur de conversion";
        toast.error(message);
      } finally {
        setLoading(false);
        setLoadingMessage("");
      }
      return;
    }

    // Flow 2: User NON connecte → Pay-per-use
    const lineCount = code.split("\n").length;
    let price: number;
    if (lineCount < 200) price = 0.99;
    else if (lineCount <= 1000) price = 1.99;
    else price = 3.99;

    const confirmed = confirm(
      `Cette conversion coûte ${price.toFixed(2)}€ (${lineCount} lignes).\n\nVous serez redirigé vers Stripe pour le paiement sécurisé.\n\nContinuer ?`
    );

    if (!confirmed) return;

    setLoading(true);
    setLoadingMessage("Preparation du paiement...");

    try {
      const res = await fetch("/api/convert/pay-per-use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, fileName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur de paiement");
      }

      const data = await res.json();

      setLoadingMessage("Redirection vers Stripe...");

      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur de paiement";
      toast.error(message);
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <>
      <HeroSection />

      {/* Converter */}
      <section
        id="converter"
        className="border-t border-zinc-800 bg-zinc-950 py-24"
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Convertir votre code
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Collez votre script Python ou uploadez un fichier .py
              </p>
            </div>
            <ConversionCounter conversionsUsed={conversionsUsed} plan="free" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <CodeInput
                value={code}
                onChange={(c, f) => {
                  setCode(c);
                  setFileName(f);
                }}
                disabled={loading}
              />
              <ConvertButton
                onClick={handleConvert}
                loading={loading}
                disabled={!code.trim()}
              />
              {/* Loading message */}
              {loading && loadingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                  <p className="text-sm text-zinc-300">{loadingMessage}</p>
                </motion.div>
              )}
              {/* Pay-per-use price indicator */}
              {!user && !loading && code.trim() && (
                <p className="text-center text-sm text-zinc-400">
                  Paiement a l&apos;usage :{" "}
                  {code.split("\n").length < 200 && "0.99€"}
                  {code.split("\n").length >= 200 &&
                    code.split("\n").length <= 1000 &&
                    "1.99€"}
                  {code.split("\n").length > 1000 && "3.99€"}
                  {" "}&bull; Ou{" "}
                  <a href="/login" className="text-indigo-400 hover:underline">
                    connectez-vous
                  </a>
                  {" "}pour 3 conversions gratuites
                </p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {result && (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    {result.inputTokens + result.outputTokens} tokens |{" "}
                    {(result.processingTimeMs / 1000).toFixed(1)}s
                  </div>
                  <DownloadButton
                    notebook={result.notebook}
                    fileName={result.fileName || fileName}
                  />
                </div>
              )}
              <NotebookPreview
                notebook={
                  result?.notebook as Parameters<
                    typeof NotebookPreview
                  >[0]["notebook"]
                }
              />
            </motion.div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <FeaturesSection />

      {/* Pricing */}
      <section className="border-t border-zinc-800 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Tarifs simples et transparents
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Commencez gratuitement. Passez au Pro quand vous etes pret.
            </p>
          </div>
          <PricingCards />
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
