import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  const { language } = await req.json();
  if (language !== "kreyol" && language !== "francais") {
    return NextResponse.json({ error: "Idioma inválido. Escolha 'kreyol' ou 'francais'." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    await connectDB();
    await User.findOneAndUpdate(
      { email: session.user.email.toLowerCase().trim() },
      { $set: { preferredLanguage: language } }
    );
  }

  const response = NextResponse.json({ success: true, language });
  response.cookies.set("app_language", language, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
  return response;
}

export async function GET(req: NextRequest) {
  const cookieLang = req.cookies.get("app_language")?.value;
  if (cookieLang === "kreyol" || cookieLang === "francais") {
    return NextResponse.json({ language: cookieLang });
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    await connectDB();
    const user = await User.findOne({ email: session.user.email.toLowerCase().trim() }).select("preferredLanguage").lean<{ preferredLanguage?: "kreyol" | "francais" }>();
    if (user?.preferredLanguage) {
      return NextResponse.json({ language: user.preferredLanguage });
    }
  }

  return NextResponse.json({ language: "kreyol" });
}
