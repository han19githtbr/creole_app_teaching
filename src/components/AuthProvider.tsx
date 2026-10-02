"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { GamificationSync } from "@/components/GamificationSync";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <GamificationSync />
      {children}
    </SessionProvider>
  );
}
