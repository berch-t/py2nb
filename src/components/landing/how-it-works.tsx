"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Upload, Cpu, Download } from "lucide-react";

const stepKeys = [
  { key: "paste", icon: Upload },
  { key: "analyze", icon: Cpu },
  { key: "download", icon: Download },
] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="border-t border-zinc-200 py-24 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-zinc-900 sm:text-4xl dark:text-white">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-500 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {stepKeys.map((step, index) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {index < stepKeys.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-full translate-x-[65%] bg-gradient-to-r from-zinc-300 to-transparent md:block dark:from-zinc-700" />
              )}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-200/50 dark:bg-zinc-700/20 dark:ring-zinc-500/20">
                <step.icon className="h-7 w-7 text-indigo-600 dark:text-indigo-300" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                {t(`steps.${step.key}.title`)}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t(`steps.${step.key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
