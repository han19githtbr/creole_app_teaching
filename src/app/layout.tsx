import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider, themeInitScript } from "@/components/ThemeProvider";
import { PwaRegister } from "@/components/PwaRegister";


export const metadata: Metadata = {
  title: "Kreyòl Ayisyen — Plataforma de Ensino",
  description:
    "Aprenda Kreyòl Ayisyen (crioulo haitiano): gramática, vocabulário, diálogos, cultura e aulas ao vivo.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kreyòl Ayisyen",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b13" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Set theme class before paint to avoid a flash of the wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="antialiased flex min-h-screen flex-col bg-[var(--bg)]" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
          </AuthProvider>
        </ThemeProvider>
        <PwaRegister />
      </body>
    </html>
  );
}
