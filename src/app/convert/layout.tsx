import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convertir Python en Notebook Jupyter",
  description:
    "Collez votre script Python ou glissez-déposez un fichier .py. L'IA analyse votre code, ajoute de la documentation structurée, et génère un notebook Jupyter (.ipynb) professionnel en quelques secondes.",
  alternates: {
    canonical: "/convert",
  },
};

export default function ConvertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
