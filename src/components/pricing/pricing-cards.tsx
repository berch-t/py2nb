"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Cookies from "js-cookie";

type BillingInterval = "monthly" | "yearly";

const planConfigs = [
  {
    key: "free" as const,
    priceMonthly: "0",
    priceYearly: "0",
    icon: Zap,
    variant: "outline" as const,
    popular: false,
    priceIdMonthly: undefined,
    priceIdYearly: undefined,
  },
  {
    key: "pro" as const,
    priceMonthly: "9.99",
    priceYearly: "99.99",
    icon: Sparkles,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_MONTHLY,
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_YEARLY,
    variant: "default" as const,
    popular: true,
  },
  {
    key: "premium" as const,
    priceMonthly: "29.99",
    priceYearly: "299.99",
    icon: Crown,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID_MONTHLY,
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID_YEARLY,
    variant: "secondary" as const,
    popular: false,
  },
];

export function PricingCards() {
  const { user } = useAuthStore();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const t = useTranslations("pricing");

  const handleCheckout = async (priceId: string | undefined) => {
    if (!user) {
      const redirect = priceId ? "/pricing" : "/convert";
      window.location.href = `/login?redirect=${redirect}`;
      return;
    }

    if (!priceId) {
      window.location.href = "/convert";
      return;
    }

    const token = Cookies.get("firebase-auth-token");
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="space-y-8">
      {/* Billing toggle */}
      <div className="relative flex items-center justify-center">
        <div className="flex items-center gap-4">
          <span
            className={`text-sm font-medium transition-colors ${
              billingInterval === "monthly" ? "text-indigo-600 dark:text-indigo-200" : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {t("monthly")}
          </span>
          <button
            onClick={() =>
              setBillingInterval(billingInterval === "monthly" ? "yearly" : "monthly")
            }
            className={`relative h-7 w-14 shrink-0 rounded-full transition-colors ${
              billingInterval === "yearly" ? "bg-indigo-500 dark:bg-indigo-200" : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                billingInterval === "yearly" ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${
              billingInterval === "yearly" ? "text-indigo-600 dark:text-indigo-200" : "text-zinc-400 dark:text-zinc-500"
            }`}
          >
            {t("yearly")}
          </span>
        </div>
        <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2">
          <Badge
            variant="secondary"
            className={`whitespace-nowrap transition-opacity duration-200 ${
              billingInterval === "yearly" ? "opacity-100" : "opacity-0"
            }`}
          >
            {t("freeMonths")}
          </Badge>
        </div>
      </div>
      <div className="h-4" />

      {/* Pricing cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {planConfigs.map((plan, index) => {
          const price = billingInterval === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const priceId =
            billingInterval === "monthly" ? plan.priceIdMonthly : plan.priceIdYearly;
          const period = billingInterval === "monthly" ? t("perMonth") : t("perYear");
          const features = t.raw(`plans.${plan.key}.features`) as string[];

          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className={`relative flex h-full flex-col ${
                  plan.popular
                    ? "border-indigo-400 shadow-lg shadow-indigo-300/10 dark:border-indigo-200 dark:shadow-zinc-400/10"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>{t("mostPopular")}</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2">
                    <plan.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-300" />
                    <CardTitle>{t(`plans.${plan.key}.name`)}</CardTitle>
                  </div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-200">{t(`plans.${plan.key}.description`)}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-white">{price}&euro;</span>
                    <span className="text-zinc-400 dark:text-zinc-500">{plan.key === "free" ? "" : period}</span>
                  </div>
                  {billingInterval === "yearly" && plan.key !== "free" && (
                    <>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {t("perMonthEquiv", { price: (parseFloat(price) / 12).toFixed(2) + "€" })}
                      </p>
                      <Badge className="mt-2 w-38 border-transparent bg-emerald-400 text-zinc-800">
                        {t("discount")}
                      </Badge>
                    </>
                  )}
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <ul className="flex-1 space-y-3">
                    {features.map((feature: string) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.variant}
                    className="mt-6 w-full"
                    size="lg"
                    onClick={() => handleCheckout(priceId)}
                  >
                    {t(`plans.${plan.key}.cta`)}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
