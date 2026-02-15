import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_URL,
  SEO_KEYWORDS,
} from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — ${APP_DESCRIPTION}`,
    template: `%s | ${APP_NAME}`,
  },
  description: `${APP_DESCRIPTION}. Collez votre code Python, l'IA ajoute des explications structurées, et téléchargez un .ipynb prêt à l'emploi.`,
  keywords: SEO_KEYWORDS,
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  category: "developer tools",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_DESCRIPTION}`,
    description:
      "Collez votre script Python, l'IA génère un notebook Jupyter documenté et professionnel. Gratuit jusqu'à 3 conversions/mois.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — Convertisseur Python vers Jupyter Notebook`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_DESCRIPTION}`,
    description:
      "Collez votre script Python, l'IA génère un notebook Jupyter documenté et professionnel.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <AuthHydrator />
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: "#18181b",
              border: "1px solid #27272a",
              color: "#fafafa",
            },
          }}
        />
      </body>
    </html>
  );
}
