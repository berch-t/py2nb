"use client";

import { PricingCards } from "@/components/pricing/pricing-cards";
import { motion } from "motion/react";

export default function PricingPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Tarifs
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
            Choisissez le plan qui vous convient. Commencez gratuitement,
            passez au Pro quand vous etes pret.
          </p>
        </motion.div>

        <PricingCards />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center"
        >
          <h3 className="text-lg font-semibold text-white">
            Pay-per-use aussi disponible
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Pas d&apos;abonnement ? Payez a l&apos;utilisation :
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-8 text-sm">
            <div>
              <span className="font-bold text-white">0.20&euro;</span>
              <span className="text-zinc-500"> / &lt;200 lignes</span>
            </div>
            <div>
              <span className="font-bold text-white">0.50&euro;</span>
              <span className="text-zinc-500"> / 200-1000 lignes</span>
            </div>
            <div>
              <span className="font-bold text-white">1.00&euro;</span>
              <span className="text-zinc-500"> / &gt;1000 lignes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
