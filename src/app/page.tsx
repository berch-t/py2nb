import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingCards } from "@/components/pricing/pricing-cards";

export default function HomePage() {
  return (
    <>
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
