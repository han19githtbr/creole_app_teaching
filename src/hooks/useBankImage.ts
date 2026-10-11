"use client";

import { useEffect, useState } from "react";
import { getBankImage, type BankImage } from "@/lib/imageBank";

/**
 * Resolve uma imagem do banco: primeiro o banco estático (síncrono) e, para imagens geradas
 * por IA (/gen/...), busca elementos e posições dos rótulos na API.
 */
export function useBankImage(src: string | null | undefined): BankImage | undefined {
  const fromBank = getBankImage(src);
  const [remote, setRemote] = useState<{ src: string; image?: BankImage } | null>(null);

  useEffect(() => {
    if (!src || fromBank || !src.startsWith("/gen/")) return;
    let cancelled = false;
    fetch(`/api/generated-images?src=${encodeURIComponent(src)}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { image?: BankImage } | null) => {
        if (!cancelled) setRemote({ src, image: data?.image });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [src, fromBank]);

  if (fromBank) return fromBank;
  return remote && remote.src === src ? remote.image : undefined;
}
