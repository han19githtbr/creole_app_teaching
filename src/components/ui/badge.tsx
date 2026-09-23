import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "live" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#eef2ff] text-[#3730a3]",
  success: "bg-[#ecfdf5] text-[#047857]",
  warning: "bg-[#fffbeb] text-[#b45309]",
  live: "bg-[#fef2f2] text-[#dc2626] animate-pulse",
  outline: "border border-[#d6d3d1] text-[#57534e]",
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
