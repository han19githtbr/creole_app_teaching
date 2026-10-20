import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getAdminLevel, isPrimaryAdminEmail } from "@/lib/adminAccess";

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
        const level = await getAdminLevel(email);
        const role = level ? "admin" : "user";
        const isPrimary = level === "primary";

        const now = new Date();
        const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

        await User.findOneAndUpdate(
          { email },
          {
            $set: {
              name: user.name ?? email,
              image: user.image ?? undefined,
            },
            $setOnInsert: {
              role,
              trialStartedAt: now,
              trialExpiresAt: threeDaysLater,
              trialStoriesUsed: 0,
              trialGamesUsed: 0,
              availableMinutes: 0,
              bonusStoriesBalance: 0,
              bonusGamesBalance: 0,
              totalStoriesTimeSeconds: 0,
              totalCquoiTimeSeconds: 0,
              totalStoriesWatched: 0,
              totalCquoiGamesPlayed: 0,
              isExemptFromBilling: isPrimary,
            },
          },
          { upsert: true, new: true }
        );

        // Se a conta já existia, alinha o papel com a lista de administradores
        // (principal ou adicionado pelo principal; quem foi removido volta a "user").
        // Só o principal ganha isenção de cobrança por este caminho.
        await User.findOneAndUpdate(
          { email },
          { $set: isPrimary ? { role: "admin", isExemptFromBilling: true } : { role } }
        );
      } catch (err) {
        console.error("[auth] Erro ao sincronizar usuário no banco durante signIn:", err);
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      const email = (user?.email ?? token.email)?.toLowerCase().trim();
      const isAdminByEmail = isPrimaryAdminEmail(email);

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

      // Se o cliente solicitar atualização da sessão. O papel NUNCA vem do
      // cliente: o acesso de administrador é recalculado no servidor a cada
      // requisição (callback session), então só a preferência de idioma é aceita.
      if (trigger === "update" && session) {
        if (session.preferredLanguage) {
          token.preferredLanguage = session.preferredLanguage;
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
        // Acesso de administrador conferido ao vivo (e não pelo token de 30
        // dias): quem for adicionado ganha acesso sem novo login e quem for
        // removido perde o acesso imediatamente.
        const level = await getAdminLevel(session.user.email);
        session.user.role = level ? "admin" : "user";
        session.user.isPrimaryAdmin = level === "primary";
        session.user.preferredLanguage = token.preferredLanguage ?? "kreyol";
      }
      return session;
    },
  },
};
