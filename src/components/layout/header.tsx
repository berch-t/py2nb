"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "@/components/auth/auth-button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Convertir", href: "/#converter" },
  { label: "Tarifs", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard", auth: true },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
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
            className="text-3xl font-bold bg-gradient-to-b from-zinc-500 to-indigo-300 text-transparent bg-clip-text"
          >
            Py2Nb
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks
            .filter((link) => !link.auth || user)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#") && pathname === "/") {
                    e.preventDefault();
                    document
                      .getElementById(link.href.slice(2))
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href || (link.href === "/#converter" && pathname === "/")
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          <AuthButton />
        </div>

        <button
          className="text-zinc-400 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 space-y-3 md:hidden">
          {navLinks
            .filter((link) => !link.auth || user)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setMobileOpen(false);
                  if (link.href.startsWith("/#") && pathname === "/") {
                    e.preventDefault();
                    document
                      .getElementById(link.href.slice(2))
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="block py-2 text-sm text-zinc-300"
              >
                {link.label}
              </Link>
            ))}
          <div className="pt-2">
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
}
