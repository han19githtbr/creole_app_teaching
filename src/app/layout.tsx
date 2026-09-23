import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Kreyòl Ayisyen — Plataforma de Ensino",
  description:
    "Aprenda Kreyòl Ayisyen (crioulo haitiano): gramática, vocabulário, diálogos, cultura e aulas ao vivo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased flex min-h-screen flex-col bg-[#fafaf9]">
        <AuthProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
