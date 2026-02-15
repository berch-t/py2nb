import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title:
    "Py2Nb — Convertissez vos scripts Python en notebooks Jupyter avec l'IA",
  description:
    "Collez votre code Python, l'IA ajoute des explications structurées en markdown, et téléchargez un notebook Jupyter (.ipynb) professionnel. Gratuit jusqu'à 3 conversions/mois.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />

      {/* Pricing */}
      <section className="border-t border-zinc-800 bg-zinc-900/50 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Tarifs simples et transparents
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Commencez gratuitement. Passez au Pro quand vous etes pret.
            </p>
          </div>
          <PricingCards />
        </div>
      </section>
    </>
  );
}
