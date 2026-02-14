"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

interface ConvertButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export function ConvertButton({
  onClick,
  loading,
  disabled,
}: ConvertButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        size="lg"
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full gap-2 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Conversion en cours...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Convertir en Notebook
          </>
        )}
      </Button>
    </motion.div>
  );
}
