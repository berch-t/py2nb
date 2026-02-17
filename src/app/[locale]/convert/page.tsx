"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { CodeInput } from "@/components/converter/code-input";
import { ConvertButton } from "@/components/converter/convert-button";
import { NotebookPreview } from "@/components/converter/notebook-preview";
import { ConversionCounter } from "@/components/converter/conversion-counter";
import { DownloadButton } from "@/components/shared/download-button";
import { useAuthStore } from "@/stores/auth-store";
import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";

interface ConvertResult {
  notebook: Record<string, unknown>;
  fileName?: string;
  inputTokens: number;
  outputTokens: number;
  processingTimeMs: number;
}

function ConvertContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const t = useTranslations("convert");
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [conversionsUsed, setConversionsUsed] = useState(0);
  const [userPlan, setUserPlan] = useState<string>("free");

  useEffect(() => {
    if (!user) {
      setConversionsUsed(0);
      setUserPlan("free");
      return;
    }

    const fetchUsage = async () => {
      try {
        const token = Cookies.get("firebase-auth-token");
        const res = await fetch("/api/usage", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setConversionsUsed(data.conversionsUsed || 0);
          setUserPlan(data.plan || "free");
        }
      } catch {
        // Silent fail
      }
    };

    fetchUsage();
  }, [user]);

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

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const canceled = searchParams.get("canceled");

    if (canceled) {
      toast.error(t("errors.paymentCanceled"));
      window.history.replaceState({}, "", window.location.pathname);
      return;
    }

    if (!sessionId) return;

    window.history.replaceState({}, "", window.location.pathname);

    const processPayment = async () => {
      setLoading(true);
      setLoadingProgress(10);
      setLoadingMessage(t("loading.verifyingPayment"));

      try {
        setLoadingProgress(20);
        setLoadingMessage(t("loading.paymentConfirmed"));

        const progressInterval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 85) return prev;
            return prev + Math.random() * 8;
          });
        }, 800);

        setLoadingProgress(30);
        setLoadingMessage(t("loading.analyzing"));

        const res = await fetch("/api/convert/process-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || t("errors.conversionError"));
        }

        setLoadingProgress(90);
        setLoadingMessage(t("loading.generating"));

        const data = await res.json();

        setLoadingProgress(100);
        setLoadingMessage(t("loading.done"));

        setResult({
          notebook: data.notebook,
          fileName: data.fileName,
          inputTokens: data.inputTokens,
          outputTokens: data.outputTokens,
          processingTimeMs: data.processingTimeMs,
        });

        triggerDownload(data.notebook, data.fileName || "notebook.ipynb");

        toast.success(
          t("success", { time: (data.processingTimeMs / 1000).toFixed(1) })
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t("errors.conversionError");
        toast.error(message);
      } finally {
        setLoading(false);
        setLoadingMessage("");
        setLoadingProgress(0);
      }
    };

    processPayment();
  }, [searchParams, triggerDownload, t]);

  const handleConvert = async () => {
    if (!code.trim()) {
      toast.error(t("errors.emptyCode"));
      return;
    }

    if (user) {
      setLoading(true);
      setLoadingProgress(10);
      setLoadingMessage(t("loading.sending"));
      setResult(null);

      try {
        const token = Cookies.get("firebase-auth-token");

        setLoadingProgress(20);
        setLoadingMessage(t("loading.analyzing"));

        const progressInterval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 85) return prev;
            return prev + Math.random() * 8;
          });
        }, 800);

        const res = await fetch("/api/convert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code, fileName }),
        });

        clearInterval(progressInterval);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || t("errors.conversionError"));
        }

        setLoadingProgress(90);
        setLoadingMessage(t("loading.generating"));

        const data: ConvertResult = await res.json();

        setLoadingProgress(100);

        setResult(data);
        setConversionsUsed((prev) => prev + 1);
        toast.success(
          t("success", { time: (data.processingTimeMs / 1000).toFixed(1) })
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t("errors.conversionError");
        toast.error(message);
      } finally {
        setLoading(false);
        setLoadingMessage("");
        setLoadingProgress(0);
      }
      return;
    }

    // Pay-per-use flow
    const lineCount = code.split("\n").length;
    let price: number;
    if (lineCount < 200) price = 0.99;
    else if (lineCount <= 1000) price = 1.99;
    else price = 3.99;

    const confirmed = confirm(
      t("payPerUse.confirm", { price: price.toFixed(2) + "€", lines: lineCount })
    );

    if (!confirmed) return;

    setLoading(true);
    setLoadingProgress(10);
    setLoadingMessage(t("loading.preparingPayment"));

    try {
      setLoadingProgress(30);

      const res = await fetch("/api/convert/pay-per-use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, fileName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || t("errors.paymentError"));
      }

      const data = await res.json();

      setLoadingProgress(60);
      setLoadingMessage(t("loading.redirectStripe"));

      window.location.href = data.checkoutUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t("errors.paymentError");
      toast.error(message);
      setLoading(false);
      setLoadingMessage("");
      setLoadingProgress(0);
    }
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {t("subtitle")}
            </p>
          </div>
          <ConversionCounter conversionsUsed={conversionsUsed} plan={userPlan} />
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
            {loading && loadingMessage && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{loadingMessage}</p>
                  <span className="text-sm font-mono text-zinc-600 dark:text-zinc-300">
                    {Math.round(loadingProgress)}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 dark:from-zinc-500 dark:to-zinc-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )}
            {!user && !loading && code.trim() && (
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                {t("payPerUse.label")}{" "}
                {code.split("\n").length < 200 && "0.99€"}
                {code.split("\n").length >= 200 &&
                  code.split("\n").length <= 1000 &&
                  "1.99€"}
                {code.split("\n").length > 1000 && "3.99€"}
                {" "}&bull; {t("payPerUse.orLogin")}{" "}
                <Link href="/login" className="text-zinc-700 hover:underline dark:text-zinc-300">
                  {t("payPerUse.loginLink")}
                </Link>
                {" "}{t("payPerUse.freeConversions")}
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
                <div className="text-xs text-zinc-400 dark:text-zinc-500">
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
  );
}

export default function ConvertPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
        </div>
      }
    >
      <ConvertContent />
    </Suspense>
  );
}
