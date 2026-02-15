import "server-only";

import Stripe from "stripe";

// Lazy init to avoid crash when STRIPE_SECRET_KEY is not set at build time
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    conversionsLimit: 3,
    price: 0,
    features: [
      "3 conversions/mois",
      "Fichiers < 500 lignes",
      "Export .ipynb",
    ],
  },
  pro: {
    name: "Pro",
    conversionsLimit: 50,
    price: 999, // centimes/mois
    priceMonthly: 999,
    priceYearly: 9999, // 99.99€/an (2 mois gratuits)
    priceIdMonthly: process.env.STRIPE_PRO_PRICE_ID_MONTHLY,
    priceIdYearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY,
    features: [
      "50 conversions/mois",
      "Fichiers jusqu'a 5000 lignes",
      "Export .ipynb",
      "Historique des conversions",
      "Priorite de traitement",
    ],
  },
  premium: {
    name: "Premium",
    conversionsLimit: Infinity,
    price: 2999, // centimes/mois
    priceMonthly: 2999,
    priceYearly: 29999, // 299.99€/an (2 mois gratuits)
    priceIdMonthly: process.env.STRIPE_PREMIUM_PRICE_ID_MONTHLY,
    priceIdYearly: process.env.STRIPE_PREMIUM_PRICE_ID_YEARLY,
    features: [
      "Conversions illimitees",
      "Fichiers sans limite de taille",
      "Export multi-formats",
      "API REST privee",
      "Support prioritaire 24/7",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

// Pay-per-use pricing (centimes)
// Prix ajustés pour couvrir les frais Stripe (1.5% + 0.25€)
export function getPayPerUsePrice(lineCount: number): number {
  if (lineCount < 200) return 99;   // 0.99€ (net: ~0.72€)
  if (lineCount <= 1000) return 199; // 1.99€ (net: ~1.71€)
  return 399;                        // 3.99€ (net: ~3.69€)
}
