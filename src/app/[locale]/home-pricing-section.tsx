"use client";

import { useTranslations } from "next-intl";
import { PricingCards } from "@/components/pricing/pricing-cards";

export function HomePricingSection() {
  const t = useTranslations("pricing");

  return (
    <section className="border-t border-zinc-200 bg-zinc-50/50 py-24 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-white">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>
        <PricingCards />
      </div>
    </section>
  );
}
