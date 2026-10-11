import type { NextConfig } from "next";

// Imagens fora do projeto: as pastas public/ghibli, public/c-quoi e as imagens geradas por IA (/gen)
// ficam no Cloudflare R2. O app continua usando os mesmos caminhos (/ghibli/..., /c-quoi/..., /gen/...)
// e o Next repassa a requisição ao bucket — assim nada muda para o navegador (nem para o canvas).
// Sem ASSETS_BASE_URL nada é reescrito e o app usa os arquivos locais de public/ (modo de transição).
const ASSETS_BASE_URL = (process.env.ASSETS_BASE_URL ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!ASSETS_BASE_URL) return [];
    // Array simples: o Next consulta primeiro public/ e só então o bucket.
    return [
      { source: "/ghibli/:path*", destination: `${ASSETS_BASE_URL}/ghibli/:path*` },
      { source: "/c-quoi/:path*", destination: `${ASSETS_BASE_URL}/c-quoi/:path*` },
      { source: "/gen/:path*", destination: `${ASSETS_BASE_URL}/gen/:path*` },
    ];
  },
  async headers() {
    return [
      {
        // Imagens geradas são servidas na mesma origem do app: sandbox impede qualquer script dentro de um SVG.
        source: "/gen/:path*",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
