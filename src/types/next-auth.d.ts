import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "admin" | "user";
      /** true só para a conta de ADMIN_EMAIL (única que gerencia administradores). */
      isPrimaryAdmin?: boolean;
      preferredLanguage?: "kreyol" | "francais";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "user";
    preferredLanguage?: "kreyol" | "francais";
  }
}
