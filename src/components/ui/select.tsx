import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-lg border border-[#d6d3d1] bg-white px-3 text-sm text-[#1c1917] focus:outline-none focus:ring-2 focus:ring-[#3730a3]/40 focus:border-[#3730a3]",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
