"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-600/15 blur-[128px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-sm text-zinc-400 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Powered by Claude AI + Jupytext
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Python &rarr;{" "}
          <span className="inline-block bg-gradient-to-b from-indigo-400 to-violet-400 bg-clip-text pb-[4px] text-transparent">
            Notebook
          </span>
          <br />
          en un clic
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400 sm:text-xl"
        >
          Transformez vos scripts Python en notebooks Jupyter professionnels,
          documentes et prets pour la presentation. L&apos;IA analyse, commente et
          structure votre code automatiquement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button size="lg" asChild className="gap-2 text-base">
            <Link href="#converter">
              Essayer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">Voir les tarifs</Link>
          </Button>
        </motion.div>

        {/* Demo preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-2xl shadow-indigo-500/5"
        >
          <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
            <div className="h-3 w-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-zinc-600">
              notebook_output.ipynb
            </span>
          </div>
          <div className="p-6 text-left">
            <div className="space-y-3 font-mono text-sm">
              <div className="text-blue-400">
                <span className="text-zinc-600">[1]</span>{" "}
                <span className="text-zinc-500"># %% [markdown]</span>
              </div>
              <div className="text-zinc-300">
                <span className="text-zinc-500"># </span>
                <span className="font-bold"># Analyse de Donnees Clients</span>
              </div>
              <div className="text-zinc-500">
                # Pipeline d&apos;analyse exploratoire...
              </div>
              <div className="mt-2 text-emerald-400">
                <span className="text-zinc-600">[2]</span>{" "}
                <span className="text-zinc-500"># %%</span>
              </div>
              <div>
                <span className="text-violet-400">import</span>{" "}
                <span className="text-zinc-300">pandas</span>{" "}
                <span className="text-violet-400">as</span>{" "}
                <span className="text-zinc-300">pd</span>
              </div>
              <div>
                <span className="text-violet-400">import</span>{" "}
                <span className="text-zinc-300">numpy</span>{" "}
                <span className="text-violet-400">as</span>{" "}
                <span className="text-zinc-300">np</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
