import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase().trim();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

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

      // If the admin email logs in after already existing as "user", promote them.
      if (role === "admin") {
        await User.findOneAndUpdate({ email }, { $set: { role: "admin" } });
      }

      return true;
    },
    async jwt({ token, user }) {
      await connectDB();
      const email = (token.email ?? user?.email)?.toLowerCase().trim();
      if (email) {
        const dbUser = await User.findOne({ email }).lean<{ role: "admin" | "user" }>();
        token.role = dbUser?.role ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role ?? "user";
      }
      return session;
    },
  },
};
