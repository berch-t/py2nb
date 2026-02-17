import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";

const webApplicationSchema = {
  "@type": "WebApplication",
  name: APP_NAME,
  url: APP_URL,
  description: APP_DESCRIPTION,
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "EUR",
      description: "3 conversions/mois, fichiers < 500 lignes",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "9.99",
      priceCurrency: "EUR",
      description: "50 conversions/mois, fichiers jusqu'à 5000 lignes",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
    },
    {
      "@type": "Offer",
      name: "Premium",
      price: "29.99",
      priceCurrency: "EUR",
      description:
        "Conversions illimitées, fichiers sans limite, API REST, support 24/7",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        billingDuration: "P1M",
      },
    },
  ],
  featureList: [
    "Conversion Python vers Jupyter Notebook",
    "Documentation automatique par IA Claude",
    "Export .ipynb",
    "Drag & drop de fichiers .py",
    "Prévisualisation du notebook",
    "Historique des conversions",
  ],
};

const organizationSchema = {
  "@type": "Organization",
  name: APP_NAME,
  url: APP_URL,
  logo: `${APP_URL}/logo.png`,
};

const faqByLocale: Record<string, Array<{ q: string; a: string }>> = {
  fr: [
    {
      q: "Comment convertir un script Python en notebook Jupyter ?",
      a: "Collez votre code Python dans l'éditeur Py2Nb ou glissez-déposez votre fichier .py. L'IA analyse votre code, ajoute des explications structurées en markdown, puis le convertit automatiquement en fichier .ipynb que vous pouvez télécharger.",
    },
    {
      q: "Py2Nb est-il gratuit ?",
      a: "Oui, Py2Nb offre un plan gratuit avec 3 conversions par mois pour les fichiers de moins de 500 lignes. Des plans Pro (9,99€/mois) et Premium (29,99€/mois) sont disponibles pour un usage plus intensif.",
    },
    {
      q: "Quelle IA est utilisée pour documenter le code ?",
      a: "Py2Nb utilise Claude d'Anthropic, un modèle d'IA de pointe, pour analyser votre code Python et générer des explications claires et structurées en français dans le notebook.",
    },
    {
      q: "Mon code est-il sécurisé ?",
      a: "Votre code est traité de manière sécurisée. Il est envoyé à l'API Claude pour analyse, puis les fichiers temporaires sont supprimés immédiatement après la conversion. Aucun code n'est stocké sur nos serveurs au-delà de la conversion.",
    },
    {
      q: "Quels formats de sortie sont supportés ?",
      a: "Py2Nb génère des fichiers .ipynb (Jupyter Notebook) compatibles avec JupyterLab, Google Colab, VS Code et tous les environnements Jupyter standard.",
    },
  ],
  en: [
    {
      q: "How do I convert a Python script to a Jupyter notebook?",
      a: "Paste your Python code into the Py2Nb editor or drag and drop your .py file. The AI analyzes your code, adds structured markdown explanations, then automatically converts it into a downloadable .ipynb file.",
    },
    {
      q: "Is Py2Nb free?",
      a: "Yes, Py2Nb offers a free plan with 3 conversions per month for files under 500 lines. Pro (€9.99/month) and Premium (€29.99/month) plans are available for heavier usage.",
    },
    {
      q: "Which AI is used to document the code?",
      a: "Py2Nb uses Claude by Anthropic, a state-of-the-art AI model, to analyze your Python code and generate clear, structured explanations in the notebook.",
    },
    {
      q: "Is my code secure?",
      a: "Your code is processed securely. It is sent to the Claude API for analysis, then temporary files are deleted immediately after conversion. No code is stored on our servers beyond the conversion.",
    },
    {
      q: "What output formats are supported?",
      a: "Py2Nb generates .ipynb (Jupyter Notebook) files compatible with JupyterLab, Google Colab, VS Code, and all standard Jupyter environments.",
    },
  ],
};

function buildFaqSchema(locale: string) {
  const faqs = faqByLocale[locale] || faqByLocale.fr;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

export function JsonLd({ locale = "fr" }: { locale?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [webApplicationSchema, organizationSchema, buildFaqSchema(locale)],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
