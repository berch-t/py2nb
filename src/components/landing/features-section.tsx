"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Cpu,
  FileCode,
  Download,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const featureKeys = [
  { key: "ai", icon: Cpu },
  { key: "jupytext", icon: FileCode },
  { key: "speed", icon: Zap },
  { key: "export", icon: Download },
  { key: "docs", icon: BarChart3 },
  { key: "security", icon: Shield },
] as const;

export function FeaturesSection() {
  const t = useTranslations("features");

  return (
    <section className="py-24">
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
          <p className="mx-auto mt-4 max-w-2xl text-zinc-500 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map((feature, index) => {
            const Icon: LucideIcon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
              >
                <div className="mb-4 inline-flex rounded-lg bg-indigo-50 p-2.5 dark:bg-zinc-700/20">
                  <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">
                  {t(`items.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {t(`items.${feature.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
