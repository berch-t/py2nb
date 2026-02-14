"use client";

import { motion } from "motion/react";
import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "1. Collez votre code",
    description:
      "Collez votre script Python ou glissez-deposez un fichier .py dans la zone de saisie.",
  },
  {
    icon: Cpu,
    title: "2. L'IA analyse et documente",
    description:
      "Claude AI analyse votre code, ajoute des explications et le structure en cellules Jupyter.",
  },
  {
    icon: Download,
    title: "3. Telechargez le notebook",
    description:
      "Recuperez votre notebook .ipynb professionnel, pret pour JupyterLab ou Google Colab.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-zinc-800 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Comment ca marche
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Trois etapes simples pour transformer votre code en notebook professionnel.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-12 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-zinc-700 to-transparent md:block" />
              )}
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/10 ring-1 ring-indigo-500/20">
                <step.icon className="h-7 w-7 text-indigo-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm text-zinc-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
