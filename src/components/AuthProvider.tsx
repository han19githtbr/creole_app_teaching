"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { GamificationSync } from "@/components/GamificationSync";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <GamificationSync />
      {children}
    </SessionProvider>
  );
}
