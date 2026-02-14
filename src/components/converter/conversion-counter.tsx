"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

interface ConversionCounterProps {
  conversionsUsed: number;
  plan: string;
}

export function ConversionCounter({
  conversionsUsed,
  plan,
}: ConversionCounterProps) {
  const { user } = useAuthStore();
  const [remaining, setRemaining] = useState(3);

  useEffect(() => {
    if (plan === "free") {
      setRemaining(Math.max(0, 3 - conversionsUsed));
    }
  }, [conversionsUsed, plan]);

  if (!user) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <Zap className="h-3 w-3" />3 essais gratuits
      </Badge>
    );
  }

  if (plan !== "free") {
    return (
      <Badge variant="success" className="gap-1.5">
        <Zap className="h-3 w-3" />
        {plan === "premium" ? "Premium" : "Pro"} - Illimite
      </Badge>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={remaining}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Badge
          variant={remaining > 0 ? "outline" : "destructive"}
          className="gap-1.5"
        >
          <Zap className="h-3 w-3" />
          {remaining}/3 conversions
        </Badge>
      </motion.div>
    </AnimatePresence>
  );
}

// Lightweight counter for unauthenticated users using local storage
export function useLocalConversions() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("py2nb_conversions");
    if (stored) setCount(parseInt(stored, 10));
  }, []);

  const increment = () => {
    const next = count + 1;
    setCount(next);
    localStorage.setItem("py2nb_conversions", String(next));
  };

  return { count, increment, remaining: Math.max(0, 3 - count) };
}
