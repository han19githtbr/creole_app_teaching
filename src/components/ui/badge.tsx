import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "live" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--accent-soft)] text-[var(--accent)]",
  success: "bg-[#ecfdf5] text-[#047857] dark:bg-[#064e3b]/30 dark:text-[#34d399]",
  warning: "bg-[#fffbeb] text-[#b45309] dark:bg-[#78350f]/30 dark:text-[#fbbf24]",
  live: "bg-[#fef2f2] text-[#dc2626] dark:bg-[#7f1d1d]/30 dark:text-[#f87171] animate-pulse",
  outline: "border border-[var(--border-strong)] text-[var(--text-secondary)]",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
