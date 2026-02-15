"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Cookies from "js-cookie";

type BillingInterval = "monthly" | "yearly";

const plans = [
  {
    name: "Free",
    priceMonthly: "0",
    priceYearly: "0",
    description: "Pour decouvrir Py2Nb",
    icon: Zap,
    features: [
      "3 conversions/mois",
      "Fichiers < 500 lignes",
      "Export .ipynb",
    ],
    cta: "Commencer gratuitement",
    variant: "outline" as const,
    popular: false,
    priceIdMonthly: undefined,
    priceIdYearly: undefined,
  },
  {
    name: "Pro",
    priceMonthly: "9.99",
    priceYearly: "99.99",
    description: "Pour les developpeurs actifs",
    icon: Sparkles,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_MONTHLY,
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID_YEARLY,
    features: [
      "50 conversions/mois",
      "Fichiers jusqu'a 5000 lignes",
      "Export .ipynb",
      "Historique des conversions",
      "Priorite de traitement",
    ],
    cta: "Passer au Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Premium",
    priceMonthly: "29.99",
    priceYearly: "299.99",
    description: "Pour les equipes et power users",
    icon: Crown,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID_MONTHLY,
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID_YEARLY,
    features: [
      "Conversions illimitees",
      "Fichiers sans limite de taille",
      "Export multi-formats",
      "API REST privee",
      "Support prioritaire 24/7",
    ],
    cta: "Passer au Premium",
    variant: "secondary" as const,
    popular: false,
  },
];

export function PricingCards() {
  const { user, loginWithGoogle } = useAuthStore();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");

  const handleCheckout = async (priceId: string | undefined) => {
    if (!user) {
      await loginWithGoogle();
      return;
    }

    if (!priceId) return;

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
      <div className="flex items-center justify-center gap-4">
        <span
          className={`text-sm font-medium ${
            billingInterval === "monthly" ? "text-white" : "text-zinc-500"
          }`}
        >
          Mensuel
        </span>
        <button
          onClick={() =>
            setBillingInterval(billingInterval === "monthly" ? "yearly" : "monthly")
          }
          className={`relative h-7 w-14 rounded-full transition-colors ${
            billingInterval === "yearly" ? "bg-indigo-600" : "bg-zinc-700"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
              billingInterval === "yearly" ? "translate-x-7" : "translate-x-0.5"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${
            billingInterval === "yearly" ? "text-white" : "text-zinc-500"
          }`}
        >
          Annuel
        </span>
        {billingInterval === "yearly" && (
          <Badge variant="secondary" className="ml-2">
            2 mois gratuits
          </Badge>
        )}
      </div>

      {/* Pricing cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const price = billingInterval === "monthly" ? plan.priceMonthly : plan.priceYearly;
          const priceId =
            billingInterval === "monthly" ? plan.priceIdMonthly : plan.priceIdYearly;
          const period = billingInterval === "monthly" ? "/mois" : "/an";

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card
                className={`relative flex h-full flex-col ${
                  plan.popular
                    ? "border-indigo-500 shadow-lg shadow-indigo-500/10"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Le plus populaire</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2">
                    <plan.icon className="h-5 w-5 text-indigo-400" />
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <p className="text-sm text-zinc-500">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{price}&euro;</span>
                    <span className="text-zinc-500">{plan.name === "Free" ? "" : period}</span>
                  </div>
                  {billingInterval === "yearly" && plan.name !== "Free" && (
                    <p className="text-xs text-zinc-400 mt-1">
                      Soit {(parseFloat(price) / 12).toFixed(2)}€/mois
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex flex-1 flex-col">
                  <ul className="flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-zinc-300"
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
                    {plan.cta}
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
