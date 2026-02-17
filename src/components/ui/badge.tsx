import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-indigo-500 text-white dark:bg-indigo-200 dark:text-zinc-950",
        secondary: "border-transparent bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
        destructive: "border-transparent bg-red-600 text-white",
        outline: "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300",
        success: "border-transparent bg-emerald-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
