"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import Image from "next/image";

export function AuthButton() {
  const { user, loading, loginWithGoogle, logout } = useAuthStore();

  if (loading) {
    return (
      <div className="h-10 w-24 animate-pulse rounded-lg bg-zinc-800" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || ""}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
        <span className="hidden text-sm text-zinc-300 sm:inline">
          {user.displayName || user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={loginWithGoogle} size="sm">
      <LogIn className="h-4 w-4" />
      Connexion Google
    </Button>
  );
}
