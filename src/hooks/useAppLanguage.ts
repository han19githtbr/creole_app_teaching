"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  isAppLanguage,
  type AppLanguage,
} from "@/lib/languageShared";

export function readLanguageCookie(): AppLanguage | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LANGUAGE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return isAppLanguage(value) ? value : null;
}

/** Salva o idioma (cookie + usuário). Funciona também antes do login. */
export async function saveAppLanguage(language: AppLanguage): Promise<boolean> {
  try {
    const res = await fetch("/api/user/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Idioma ativo no cliente (cookie → preferência do usuário → Crioulo). */
const noopSubscribe = () => () => {};

export function useAppLanguage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [, bump] = useState(0);
  const fromCookie = useSyncExternalStore(noopSubscribe, readLanguageCookie, () => null);
  const preferred = session?.user?.preferredLanguage;
  const language: AppLanguage =
    fromCookie ?? (isAppLanguage(preferred) ? preferred : DEFAULT_LANGUAGE);

  /** Troca de idioma: grava e recarrega para o painel do outro idioma. */
  const switchLanguage = useCallback(
    async (next: AppLanguage, redirectTo: string = "/dashboard") => {
      if (next === language) return;
      await saveAppLanguage(next);
      bump((v) => v + 1);
      router.replace(redirectTo);
      router.refresh();
    },
    [language, router]
  );

  return { language, switchLanguage };
}
