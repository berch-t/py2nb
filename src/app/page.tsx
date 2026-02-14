"use client";

import { useState } from "react";
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
  conversionId: string;
  inputTokens: number;
  outputTokens: number;
  processingTimeMs: number;
}

export default function HomePage() {
  const { user } = useAuthStore();
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [conversionsUsed, setConversionsUsed] = useState(0);

  const handleConvert = async () => {
    if (!code.trim()) {
      toast.error("Veuillez coller du code Python");
      return;
    }

    if (!user) {
      toast.error("Connectez-vous pour convertir votre code");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const token = Cookies.get("firebase-auth-token");

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
                disabled={!code.trim() || !user}
              />
              {!user && (
                <p className="text-center text-sm text-zinc-500">
                  Connectez-vous avec Google pour commencer
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
                    fileName={fileName}
                  />
                </div>
              )}
              <NotebookPreview
                notebook={result?.notebook as Parameters<typeof NotebookPreview>[0]["notebook"]}
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
