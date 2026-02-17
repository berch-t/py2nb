"use client";

import { useTranslations } from "next-intl";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { motion } from "motion/react";

export default function PricingPage() {
  const t = useTranslations("pricing");

  return (
    <div className="py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-zinc-900 sm:text-5xl dark:text-white">
            {t("pageTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
            {t("pageSubtitle")}
          </p>
        </motion.div>

        <PricingCards />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/30"
        >
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {t("payPerUse.title")}
          </h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t("payPerUse.subtitle")}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-8 text-sm">
            <div>
              <span className="font-bold text-zinc-900 dark:text-white">0.20&euro;</span>
              <span className="text-zinc-400 dark:text-zinc-500"> {t("payPerUse.small")}</span>
            </div>
            <div>
              <span className="font-bold text-zinc-900 dark:text-white">0.50&euro;</span>
              <span className="text-zinc-400 dark:text-zinc-500"> {t("payPerUse.medium")}</span>
            </div>
            <div>
              <span className="font-bold text-zinc-900 dark:text-white">1.00&euro;</span>
              <span className="text-zinc-400 dark:text-zinc-500"> {t("payPerUse.large")}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
