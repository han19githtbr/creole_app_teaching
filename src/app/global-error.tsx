"use client";

/** Último recurso: erro no layout raiz. Precisa trazer o seu próprio <html>/<body>. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", maxWidth: 360, padding: 24 }}>
          <h1 style={{ fontSize: 20 }}>Não foi possível carregar a página</h1>
          <p style={{ fontSize: 14, opacity: 0.7 }}>Tente novamente em instantes.</p>
          <button type="button" onClick={() => reset()} style={{ padding: "8px 16px", borderRadius: 8, border: 0, background: "#2a2cf5", color: "#fff", fontWeight: 700 }}>
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
