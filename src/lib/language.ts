// Leitura do idioma ativo no servidor (cookie → preferência do usuário → Crioulo).
// Para código de cliente, importe de "@/lib/languageShared".
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE,
  isAppLanguage,
  type AppLanguage,
} from "@/lib/languageShared";

export * from "@/lib/languageShared";

/** Idioma ativo no servidor: cookie → preferência do usuário → Crioulo. */
export async function getAppLanguage(): Promise<AppLanguage> {
  const store = await cookies();
  const fromCookie = store.get(LANGUAGE_COOKIE)?.value;
  if (isAppLanguage(fromCookie)) return fromCookie;
  const session = await getServerSession(authOptions);
  const preferred = session?.user?.preferredLanguage;
  return isAppLanguage(preferred) ? preferred : DEFAULT_LANGUAGE;
}
