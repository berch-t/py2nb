import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs — Plans Free, Pro et Premium",
  description:
    "Commencez gratuitement avec 3 conversions/mois. Plan Pro à 9,99€/mois pour 50 conversions. Plan Premium à 29,99€/mois pour un usage illimité avec API REST et support prioritaire.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
