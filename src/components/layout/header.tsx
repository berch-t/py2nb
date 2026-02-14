"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "@/components/auth/auth-button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { Code2, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Convertir", href: "/" },
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">Py2Nb</span>
          <Badge variant="secondary" className="ml-1 text-[10px]">
            Beta
          </Badge>
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
                onClick={() => setMobileOpen(false)}
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
