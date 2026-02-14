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
      "3 conversions",
      "Fichiers < 500 lignes",
      "Export .ipynb",
    ],
  },
  pro: {
    name: "Pro",
    conversionsLimit: Infinity,
    price: 1900, // centimes
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Conversions illimitees",
      "Fichiers sans limite",
      "Streaming en temps reel",
      "Tous les formats d'export",
      "AI Prompt-to-Notebook",
    ],
  },
  premium: {
    name: "Premium",
    conversionsLimit: Infinity,
    price: 9900, // centimes
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Tout dans Pro",
      "Chat NLP interactif",
      "Batch processing",
      "Acces API REST",
      "Support prioritaire",
    ],
  },
} as const;

export type PlanType = keyof typeof PLANS;

// Pay-per-use pricing (centimes)
export function getPayPerUsePrice(lineCount: number): number {
  if (lineCount < 200) return 20;
  if (lineCount <= 1000) return 50;
  return 100;
}
