import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthHydrator } from "@/components/auth/auth-hydrator";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Py2Nb - Python to Notebook avec IA",
  description:
    "Transformez vos scripts Python en notebooks Jupyter professionnels, documentes et prets pour la presentation avec Claude AI.",
  keywords: [
    "python",
    "jupyter",
    "notebook",
    "converter",
    "ai",
    "claude",
    "jupytext",
    "data science",
  ],
  openGraph: {
    title: "Py2Nb - Python to Notebook avec IA",
    description:
      "Transformez vos scripts Python en notebooks Jupyter professionnels avec Claude AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
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
