"use client";

import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Zap, CreditCard } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { PLAN_CONVERSION_LIMITS } from "@/lib/constants";

interface ConversionCounterProps {
  conversionsUsed: number;
  plan: string;
}

export function ConversionCounter({
  conversionsUsed,
  plan,
}: ConversionCounterProps) {
  const { user } = useAuthStore();

  // Non-connected users: pay-per-use, no counter
  if (!user) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <CreditCard className="h-3 w-3" />
        Paiement a l&apos;usage
      </Badge>
    );
  }

  if (plan === "premium") {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Zap className="h-3 w-3" />
        Premium - Illimite
      </Badge>
    );
  }

  const limit = PLAN_CONVERSION_LIMITS[plan] ?? PLAN_CONVERSION_LIMITS.free;
  const remaining = Math.max(0, limit - conversionsUsed);

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
          {conversionsUsed}/{limit} conversions
        </Badge>
      </motion.div>
    </AnimatePresence>
  );
}
