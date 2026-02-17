"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-indigo-400/10 blur-[128px] dark:bg-zinc-600/20" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-400/10 blur-[128px] dark:bg-violet-600/15" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/8 blur-[100px] dark:bg-blue-600/10" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Image
            src="/logo_solo2.png"
            alt="Py2Nb"
            width={80}
            height={80}
            className="mx-auto h-30 w-auto"
            priority
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl font-mono dark:text-white"
        >
          {t("title")}
          <span className="inline-block bg-gradient-to-b from-indigo-500 to-indigo-700 bg-clip-text pb-[4px] font-mono text-transparent dark:from-zinc-200 dark:to-indigo-400">
            {t("titleHighlight")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500 sm:text-xl dark:text-zinc-400"
        >
          {t("subtitle")} <br />
          {t("subtitleLine2")}<br /> {t("subtitleLine3")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button size="lg" asChild className="gap-2 text-base">
            <Link href="/convert">
              {t("cta")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">{t("ctaSecondary")}</Link>
          </Button>
        </motion.div>

        {/* Demo preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 mb-16 overflow-hidden rounded-xl border border-zinc-200 bg-white/50 shadow-2xl shadow-indigo-300/10 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-zinc-500/5"
        >
          {/* Title bar */}
          <div className="flex items-center gap-1.5 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-600">
              {t("demoFile")}
            </span>
          </div>

          <div className="divide-y divide-zinc-200/50 text-left dark:divide-zinc-800/50">
            {/* Markdown cell */}
            <div className="px-6 py-5">
              <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                Markdown
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {t("demoTitle")}
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t("demoDescription")}
              </p>
            </div>

            {/* Code cell */}
            <div className="px-6 py-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                  Code
                </span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                  [1]
                </span>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 font-mono text-sm dark:bg-zinc-950/80">
                <div>
                  <span className="text-violet-600 dark:text-violet-400">import</span>{" "}
                  <span className="text-zinc-700 dark:text-zinc-300">pandas</span>{" "}
                  <span className="text-violet-600 dark:text-violet-400">as</span>{" "}
                  <span className="text-zinc-700 dark:text-zinc-300">pd</span>
                </div>
                <div>
                  <span className="text-violet-600 dark:text-violet-400">import</span>{" "}
                  <span className="text-zinc-700 dark:text-zinc-300">matplotlib.pyplot</span>{" "}
                  <span className="text-violet-600 dark:text-violet-400">as</span>{" "}
                  <span className="text-zinc-700 dark:text-zinc-300">plt</span>
                </div>
                <div className="mt-2">
                  <span className="text-zinc-700 dark:text-zinc-300">df</span>{" "}
                  <span className="text-zinc-400 dark:text-zinc-500">=</span>{" "}
                  <span className="text-zinc-700 dark:text-zinc-300">pd</span>
                  <span className="text-zinc-400 dark:text-zinc-500">.</span>
                  <span className="text-blue-600 dark:text-blue-400">read_csv</span>
                  <span className="text-zinc-400 dark:text-zinc-500">(</span>
                  <span className="text-emerald-600 dark:text-emerald-400">&quot;clients.csv&quot;</span>
                  <span className="text-zinc-400 dark:text-zinc-500">)</span>
                </div>
                <div>
                  <span className="text-zinc-700 dark:text-zinc-300">df</span>
                  <span className="text-zinc-400 dark:text-zinc-500">.</span>
                  <span className="text-blue-600 dark:text-blue-400">head</span>
                  <span className="text-zinc-400 dark:text-zinc-500">()</span>
                </div>
              </div>
            </div>

            {/* Output cell */}
            <div className="px-6 py-5">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                  Output
                </span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                  [1]
                </span>
              </div>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2">nom</th>
                      <th className="px-3 py-2">age</th>
                      <th className="px-3 py-2">achats</th>
                      <th className="px-3 py-2">segment</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-700 dark:text-zinc-300">
                    <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50">
                      <td className="px-3 py-1.5 text-zinc-400 dark:text-zinc-500">0</td>
                      <td className="px-3 py-1.5">Alice</td>
                      <td className="px-3 py-1.5">34</td>
                      <td className="px-3 py-1.5">12</td>
                      <td className="px-3 py-1.5">Premium</td>
                    </tr>
                    <tr className="border-b border-zinc-200/50 dark:border-zinc-800/50">
                      <td className="px-3 py-1.5 text-zinc-400 dark:text-zinc-500">1</td>
                      <td className="px-3 py-1.5">Bob</td>
                      <td className="px-3 py-1.5">28</td>
                      <td className="px-3 py-1.5">5</td>
                      <td className="px-3 py-1.5">Standard</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 text-zinc-400 dark:text-zinc-500">2</td>
                      <td className="px-3 py-1.5">Clara</td>
                      <td className="px-3 py-1.5">45</td>
                      <td className="px-3 py-1.5">23</td>
                      <td className="px-3 py-1.5">Premium</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Markdown cell 2 */}
            <div className="px-6 py-5">
              <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
                Markdown
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {t("demoTitle2")}
              </h4>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {t("demoDescription2")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
