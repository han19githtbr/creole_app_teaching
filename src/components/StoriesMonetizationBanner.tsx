"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import type { UserMonetizationStatus } from "@/lib/monetization";
import { MonetizationBar } from "@/components/MonetizationBar";

export function StoriesMonetizationBanner() {
  const { status: authStatus } = useSession();
  const [monetizationStatus, setMonetizationStatus] = useState<UserMonetizationStatus | null>(null);

  const fetchStatus = useCallback(async () => {
    if (authStatus !== "authenticated") return;
    try {
      const res = await fetch("/api/user/monetization/status", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMonetizationStatus(data);
      }
    } catch (err) {
      console.warn("Falha ao carregar status na listagem:", err);
    }
  }, [authStatus]);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      if (authStatus !== "authenticated") return;
      try {
        const res = await fetch("/api/user/monetization/status", { cache: "no-store" });
        if (res.ok && isMounted) {
          const data = await res.json();
          setMonetizationStatus(data);
        }
      } catch (err) {
        console.warn("Falha ao carregar status na listagem:", err);
      }
    };

    void run();
    return () => {
      isMounted = false;
    };
  }, [authStatus]);

  if (!monetizationStatus) return null;

  return (
    <MonetizationBar
      status={monetizationStatus}
      feature="stories"
      isActive={false}
      onRefresh={fetchStatus}
    />
  );
}
