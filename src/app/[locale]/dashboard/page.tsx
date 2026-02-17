"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/stores/auth-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileCode,
  Zap,
  Hash,
  BarChart3,
  Loader2,
} from "lucide-react";
import Cookies from "js-cookie";
import { Link } from "@/i18n/navigation";

interface ConversionItem {
  id: string;
  inputFileName: string | null;
  inputLineCount: number;
  claudeInputTokens: number;
  claudeOutputTokens: number;
  status: string;
  processingTimeMs: number;
  createdAt: string | null;
  outputNotebook: string;
}

interface UsageData {
  plan: string;
  conversionsUsed: number;
  conversionsThisMonth: number;
  totalTokensUsed: number;
  conversionsLimit: number;
  conversions: ConversionItem[];
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthStore();
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!user) return;

    const fetchUsage = async () => {
      try {
        const token = Cookies.get("firebase-auth-token");
        const res = await fetch("/api/usage", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400 dark:text-zinc-600" />
      </div>
    );
  }

  if (!user || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-zinc-500">{t("history.loading")}</p>
      </div>
    );
  }

  const stats = [
    {
      label: t("stats.currentPlan"),
      value: data.plan.charAt(0).toUpperCase() + data.plan.slice(1),
      icon: Zap,
    },
    {
      label: t("stats.totalConversions"),
      value: String(data.conversionsUsed),
      icon: FileCode,
    },
    {
      label: t("stats.thisMonth"),
      value: String(data.conversionsThisMonth),
      icon: BarChart3,
    },
    {
      label: t("stats.tokensUsed"),
      value: data.totalTokensUsed.toLocaleString(),
      icon: Hash,
    },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t("title")}</h1>
            <p className="text-sm text-zinc-500">
              {t("welcome", { name: user.displayName || user.email || "" })}
            </p>
          </div>
          {data.plan === "free" && (
            <Button asChild>
              <Link href="/pricing">{t("upgradePro")}</Link>
            </Button>
          )}
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-lg bg-indigo-50 p-2.5 dark:bg-zinc-700/20">
                    <stat.icon className="h-5 w-5 text-indigo-600 dark:text-zinc-300" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">{stat.label}</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCode className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
              {t("history.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.conversions.length === 0 ? (
              <div className="py-12 text-center">
                <FileCode className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                <p className="mt-4 text-zinc-500">
                  {t("history.empty")}
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/convert">{t("history.makeConversion")}</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {data.conversions.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <FileCode className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-600" />
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                          {conv.inputFileName || t("history.pastedCode")}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-600">
                          {conv.inputLineCount} {t("history.lines")} |{" "}
                          {conv.claudeInputTokens + conv.claudeOutputTokens}{" "}
                          {t("history.tokens")} |{" "}
                          {(conv.processingTimeMs / 1000).toFixed(1)}s
                          {conv.createdAt &&
                            ` | ${new Date(conv.createdAt).toLocaleDateString("fr-FR")}`}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        conv.status === "completed" ? "success" : "secondary"
                      }
                    >
                      {conv.status === "completed" ? t("history.completed") : conv.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
