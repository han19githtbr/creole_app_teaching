import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role?: "admin" | "user";
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
