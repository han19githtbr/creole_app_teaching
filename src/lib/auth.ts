import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase().trim();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60, // 24 horas
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        await connectDB();
        const email = user.email.toLowerCase().trim();
        const role = ADMIN_EMAIL && email === ADMIN_EMAIL ? "admin" : "user";

        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              name: user.name ?? email,
              image: user.image ?? undefined,
            },
            $setOnInsert: { role },
          },
          { upsert: true, new: true }
        );

        // Se a conta de admin já existia como "user", garante a promoção a admin.
        if (role === "admin") {
          await User.findOneAndUpdate({ email }, { $set: { role: "admin" } });
        }
      } catch (err) {
        console.error("[auth] Erro ao sincronizar usuário no banco durante signIn:", err);
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      const email = (user?.email ?? token.email)?.toLowerCase().trim();
      const isAdminByEmail = Boolean(ADMIN_EMAIL && email === ADMIN_EMAIL);

      // Na primeira autenticação (login inicial):
      if (user) {
        token.email = email;
        token.name = user.name ?? token.name;
        token.picture = user.image ?? token.picture;
        token.role = isAdminByEmail ? "admin" : "user";
        token.preferredLanguage = "kreyol";
      }

      if (isAdminByEmail) {
        token.role = "admin";
      }

      // Se o cliente solicitar atualização da sessão
      if (trigger === "update" && session) {
        if (session.preferredLanguage) {
          token.preferredLanguage = session.preferredLanguage;
        }
        if (session.role && !isAdminByEmail) {
          token.role = session.role;
        }
      }

      // Só consulta o banco no login inicial ou quando dados essenciais estiverem ausentes
      const needsLookup = !token.role || !token.preferredLanguage || trigger === "update";
      if (email && needsLookup) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email })
            .select("role preferredLanguage")
            .lean<{ role?: "admin" | "user"; preferredLanguage?: "kreyol" | "francais" }>();

          if (dbUser) {
            token.role = isAdminByEmail ? "admin" : (dbUser.role ?? "user");
            if (dbUser.preferredLanguage) {
              token.preferredLanguage = dbUser.preferredLanguage;
            }
          }
        } catch (err) {
          console.warn("[auth] Falha temporária ao consultar banco no callback jwt:", err);
          // IMPORTANTE: Nunca lança exceção aqui para evitar que o NextAuth apague o cookie de sessão!
        }
      }

      if (!token.role) {
        token.role = isAdminByEmail ? "admin" : "user";
      }
      if (!token.preferredLanguage) {
        token.preferredLanguage = "kreyol";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const email = session.user.email?.toLowerCase().trim();
        const isAdminByEmail = Boolean(ADMIN_EMAIL && email === ADMIN_EMAIL);
        session.user.role = isAdminByEmail ? "admin" : (token.role ?? "user");
        session.user.preferredLanguage = token.preferredLanguage ?? "kreyol";
      }
      return session;
    },
  },
};
