"use client";

import { motion } from "motion/react";
import {
  Cpu,
  FileCode,
  Download,
  Shield,
  Zap,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "IA Claude de pointe",
    description:
      "Claude Sonnet 4.5 analyse, documente et structure votre code avec une precision professionnelle.",
  },
  {
    icon: FileCode,
    title: "Format Jupytext natif",
    description:
      "Conversion via Jupytext pour des notebooks parfaitement formates et compatibles partout.",
  },
  {
    icon: Zap,
    title: "Rapide et instantane",
    description:
      "Collez votre code, cliquez, et obtenez un notebook professionnel en quelques secondes.",
  },
  {
    icon: Download,
    title: "Export .ipynb",
    description:
      "Telechargez directement au format Jupyter Notebook, pret pour JupyterLab ou Google Colab.",
  },
  {
    icon: BarChart3,
    title: "Documentation intelligente",
    description:
      "L'IA detecte le type de script et adapte les commentaires : ML, data analysis, API, etc.",
  },
  {
    icon: Shield,
    title: "Securise",
    description:
      "Votre code n'est jamais stocke au-dela de la conversion. Authentification Firebase securisee.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Tout ce qu&apos;il faut pour des notebooks parfaits
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Un pipeline complet de l&apos;analyse IA a l&apos;export Jupyter, sans
            compromis sur la qualite.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-indigo-600/10 p-2.5">
                <feature.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="mb-2 font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
