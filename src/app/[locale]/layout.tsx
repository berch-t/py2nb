import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { routing } from "@/i18n/routing";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  APP_NAME,
  APP_URL,
  SEO_KEYWORDS,
} from "@/lib/constants";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: t("homeTitle"),
      template: `%s | ${APP_NAME}`,
    },
    description: t("homeDescription"),
    keywords: SEO_KEYWORDS,
    authors: [{ name: APP_NAME }],
    creator: APP_NAME,
    publisher: APP_NAME,
    category: "developer tools",
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      url: APP_URL,
      siteName: APP_NAME,
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${APP_NAME} — ${t("convertTitle")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
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
      canonical: `${APP_URL}/${locale}`,
      languages: {
        fr: `${APP_URL}/fr`,
        en: `${APP_URL}/en`,
      },
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <AuthHydrator />
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            className: "!bg-white !border-zinc-200 !text-zinc-900 dark:!bg-zinc-900 dark:!border-zinc-700 dark:!text-zinc-100",
          }}
        />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
