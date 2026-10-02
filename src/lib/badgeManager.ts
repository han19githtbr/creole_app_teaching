/**
 * Gerenciador de Badge do Aplicativo (App Icon Badge / Badging API)
 *
 * Suporta:
 * 1. Badging API nativa da Web/PWA no Android e Desktop (navigator.setAppBadge).
 * 2. Service Worker Badging (self.registration.setAppBadge).
 * 3. Dynamic Favicon Badge (desenha círculo vermelho com número no ícone para navegadores móveis/desktop).
 * 4. Título dinâmico da página com prefixo (N).
 */

let originalTitle = "";
let originalFaviconHref = "/favicon.ico";

function getBaseTitle(): string {
  if (typeof document === "undefined") return "";
  if (!originalTitle) {
    originalTitle = document.title.replace(/^\(\d+\+?\)\s*/, "").trim() || "Kreyòl Ayisyen";
  }
  return originalTitle;
}

/**
 * Atualiza o favicon com um badge vermelho no canto superior direito.
 */
function updateFaviconBadge(count: number) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  try {
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    } else if (originalFaviconHref === "/favicon.ico" && link.href) {
      originalFaviconHref = link.href;
    }

    if (count <= 0) {
      if (originalFaviconHref) {
        link.href = originalFaviconHref;
      }
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = originalFaviconHref || "/favicon.ico";

    img.onload = () => {
      ctx.clearRect(0, 0, 32, 32);
      ctx.drawImage(img, 0, 0, 32, 32);

      // Círculo vermelho de notificação (badge)
      const badgeText = count > 9 ? "9+" : String(count);
      const radius = 10;
      const centerX = 23;
      const centerY = 9;

      // Sombra
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 3;

      // Fundo vermelho vibrante
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Borda branca nítida
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Texto do número em branco
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(badgeText, centerX, centerY + 0.5);

      link.href = canvas.toDataURL("image/png");
    };

    img.onerror = () => {
      // Fallback: desenha o badge diretamente caso não consiga carregar o favicon base
      ctx.clearRect(0, 0, 32, 32);
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(count > 9 ? "9+" : String(count), 16, 16);
      link.href = canvas.toDataURL("image/png");
    };
  } catch {
    // Ignora erros de canvas em navegadores restritivos
  }
}

/**
 * Define o número vermelho no ícone do aplicativo (Badging API para Android / celular e desktop).
 */
export async function setAppBadge(count: number): Promise<void> {
  if (typeof window === "undefined") return;

  const validCount = Math.max(0, Math.floor(count));

  // 1. Badging API nativa (PWA instalada no Android, Chrome, Edge)
  if (typeof navigator.setAppBadge === "function") {
    try {
      if (validCount > 0) {
        await (navigator as unknown as { setAppBadge: (c: number) => Promise<void> }).setAppBadge(validCount);
      } else if (typeof navigator.clearAppBadge === "function") {
        await navigator.clearAppBadge();
      }
    } catch {
      // Navegador pode recusar se não estiver instalado como PWA ou sem permissão
    }
  }

  // 2. Notifica Service Worker para atualizar o badge em segundo plano
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    try {
      navigator.serviceWorker.controller.postMessage({
        type: validCount > 0 ? "SET_BADGE" : "CLEAR_BADGE",
        count: validCount,
      });
    } catch {
      // Falha silenciosa se SW não estiver ativo
    }
  }

  // 3. Atualiza o título do documento com (N)
  try {
    const base = getBaseTitle();
    if (validCount > 0) {
      const prefix = validCount > 9 ? "(9+)" : `(${validCount})`;
      document.title = `${prefix} ${base}`;
    } else {
      document.title = base;
    }
  } catch {
    // document inacessível
  }

  // 4. Favicon dinâmico com badge vermelho
  updateFaviconBadge(validCount);
}

/**
 * Remove o badge do ícone do aplicativo.
 */
export async function clearAppBadge(): Promise<void> {
  return setAppBadge(0);
}
