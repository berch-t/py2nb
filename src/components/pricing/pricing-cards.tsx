"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import Cookies from "js-cookie";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "",
    description: "Pour decouvrir Py2Nb",
    icon: Zap,
    features: [
      "3 conversions",
      "Fichiers < 500 lignes",
      "Export .ipynb",
    ],
    cta: "Commencer gratuitement",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "19",
    period: "/mois",
    description: "Pour les developpeurs actifs",
    icon: Sparkles,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    features: [
      "Conversions illimitees",
      "Fichiers sans limite de taille",
      "Streaming en temps reel",
      "Tous les formats d'export",
      "AI Prompt-to-Notebook",
    ],
    cta: "Passer au Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Premium",
    price: "99",
    period: "/mois",
    description: "Pour les equipes et power users",
    icon: Crown,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Tout dans Pro",
      "Chat NLP interactif",
      "Batch processing",
      "Acces API REST",
      "Support prioritaire",
    ],
    cta: "Passer au Premium",
    variant: "secondary" as const,
    popular: false,
  },
];

export function PricingCards() {
  const { user, loginWithGoogle } = useAuthStore();

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
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan, index) => (
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
                <span className="text-4xl font-bold text-white">
                  {plan.price}&euro;
                </span>
                <span className="text-zinc-500">{plan.period}</span>
              </div>
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
                onClick={() => handleCheckout(plan.priceId)}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
