"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AuthButton } from "@/components/auth/auth-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { useAuthStore } from "@/stores/auth-store";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavLink {
  labelKey: "convert" | "pricing" | "dashboard";
  href: string;
  auth?: boolean;
  highlight?: boolean;
}

const navLinks: NavLink[] = [
  { labelKey: "convert", href: "/convert", highlight: true },
  { labelKey: "pricing", href: "/pricing" },
  { labelKey: "dashboard", href: "/dashboard", auth: true },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const t = useTranslations("nav");

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo_solo2.png"
            alt="Py2Nb"
            width={120}
            height={40}
            className="h-12 w-auto"
            priority
          />
          <span
            className="text-3xl font-bold bg-gradient-to-b from-zinc-600 to-zinc-600 dark:from-zinc-300 dark:to-zinc-300 font-mono text-transparent bg-clip-text"
          >
            /py2nb
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks
            .filter((link) => !link.auth || user)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-zinc-900 dark:text-white"
                    : link.highlight
                      ? "text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
                      : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <AuthButton />
        </div>

        <button
          className="text-zinc-500 dark:text-zinc-400 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 space-y-3 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          {navLinks
            .filter((link) => !link.auth || user)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm ${link.highlight ? "text-indigo-600 dark:text-indigo-300" : "text-zinc-600 dark:text-zinc-300"}`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          <div className="flex items-center gap-2 pt-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="pt-2">
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
