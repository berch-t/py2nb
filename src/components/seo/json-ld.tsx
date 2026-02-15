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

const faqSchema = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Comment convertir un script Python en notebook Jupyter ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Collez votre code Python dans l'éditeur Py2Nb ou glissez-déposez votre fichier .py. L'IA analyse votre code, ajoute des explications structurées en markdown, puis le convertit automatiquement en fichier .ipynb que vous pouvez télécharger.",
      },
    },
    {
      "@type": "Question",
      name: "Py2Nb est-il gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, Py2Nb offre un plan gratuit avec 3 conversions par mois pour les fichiers de moins de 500 lignes. Des plans Pro (9,99€/mois) et Premium (29,99€/mois) sont disponibles pour un usage plus intensif.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle IA est utilisée pour documenter le code ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Py2Nb utilise Claude d'Anthropic, un modèle d'IA de pointe, pour analyser votre code Python et générer des explications claires et structurées en français dans le notebook.",
      },
    },
    {
      "@type": "Question",
      name: "Mon code est-il sécurisé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Votre code est traité de manière sécurisée. Il est envoyé à l'API Claude pour analyse, puis les fichiers temporaires sont supprimés immédiatement après la conversion. Aucun code n'est stocké sur nos serveurs au-delà de la conversion.",
      },
    },
    {
      "@type": "Question",
      name: "Quels formats de sortie sont supportés ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Py2Nb génère des fichiers .ipynb (Jupyter Notebook) compatibles avec JupyterLab, Google Colab, VS Code et tous les environnements Jupyter standard.",
      },
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [webApplicationSchema, organizationSchema, faqSchema],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
