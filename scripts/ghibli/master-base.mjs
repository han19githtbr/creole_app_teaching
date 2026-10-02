import fs from "node:fs";
import path from "node:path";

// Master Studio Ghibli SVG Generator
// Produces 14 beautifully painted, cinematic, highly detailed illustrations
// with unmistakable, easily identifiable elements matching the Haitian Creole vocabulary quizzes.

const OUT_DIR = path.resolve("./public/ghibli");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Global SVG definition helpers
function getGhibliDefs(palette) {
  return `
  <defs>
    <!-- Paper watercolor texture filter -->
    <filter id="ghibliPaper" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" seed="42"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.035 0" in="noise" result="coloredNoise"/>
      <feComposite operator="in" in2="SourceGraphic"/>
    </filter>

    <!-- Soft diffuse drop shadow -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="3" dy="6" stdDeviation="6" flood-color="#141e28" flood-opacity="0.28"/>
    </filter>

    <!-- Sky Gradients -->
    <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#236ca7"/>
      <stop offset="35%" stop-color="#5fa3d6"/>
      <stop offset="70%" stop-color="#b8e1f2"/>
      <stop offset="100%" stop-color="#fdf3dc"/>
    </linearGradient>

    <linearGradient id="skySunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#31396b"/>
      <stop offset="35%" stop-color="#73507b"/>
      <stop offset="65%" stop-color="#cb6b5c"/>
      <stop offset="85%" stop-color="#f29e5a"/>
      <stop offset="100%" stop-color="#fedaa2"/>
    </linearGradient>

    <linearGradient id="skyDusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#121832"/>
      <stop offset="40%" stop-color="#262f56"/>
      <stop offset="70%" stop-color="#4e3d64"/>
      <stop offset="90%" stop-color="#915264"/>
      <stop offset="100%" stop-color="#d6846c"/>
    </linearGradient>

    <!-- Cloud Gradients -->
    <linearGradient id="cloudBodyDay" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="45%" stop-color="#fcf8f0"/>
      <stop offset="80%" stop-color="#d9e4ec"/>
      <stop offset="100%" stop-color="#b6c8d7"/>
    </linearGradient>

    <linearGradient id="cloudBodySunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff5e6"/>
      <stop offset="40%" stop-color="#fbd0a5"/>
      <stop offset="75%" stop-color="#cf8ca0"/>
      <stop offset="100%" stop-color="#7e607c"/>
    </linearGradient>

    <!-- Sun / Glow Gradients -->
    <radialGradient id="sunGlowDay" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fffced" stop-opacity="1"/>
      <stop offset="35%" stop-color="#ffebaa" stop-opacity="0.85"/>
      <stop offset="70%" stop-color="#ffd573" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffd573" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="sunGlowSunset" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff8db" stop-opacity="1"/>
      <stop offset="30%" stop-color="#ffb753" stop-opacity="0.9"/>
      <stop offset="65%" stop-color="#f46e45" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#e04a43" stop-opacity="0"/>
    </radialGradient>

    <!-- Hills / Mountains Gradients -->
    <linearGradient id="hillDistant" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6e94a8"/>
      <stop offset="100%" stop-color="#93b9c7"/>
    </linearGradient>

    <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#4a7c4f"/>
      <stop offset="50%" stop-color="#3c6a40"/>
      <stop offset="100%" stop-color="#2d5231"/>
    </linearGradient>

    <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#699e4c"/>
      <stop offset="60%" stop-color="#4c7e33"/>
      <stop offset="100%" stop-color="#2f5720"/>
    </linearGradient>

    <!-- Materials: Wood, Brass, Stone, Water -->
    <linearGradient id="woodTone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#9c6d48"/>
      <stop offset="50%" stop-color="#784f30"/>
      <stop offset="100%" stop-color="#55341c"/>
    </linearGradient>

    <linearGradient id="brassTone" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffe699"/>
      <stop offset="35%" stop-color="#d9a536"/>
      <stop offset="70%" stop-color="#996c14"/>
      <stop offset="100%" stop-color="#5e4007"/>
    </linearGradient>

    <linearGradient id="stoneTone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c5beb3"/>
      <stop offset="60%" stop-color="#999184"/>
      <stop offset="100%" stop-color="#6c6458"/>
    </linearGradient>

    <linearGradient id="waterTone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#47a5be"/>
      <stop offset="50%" stop-color="#2a7796"/>
      <stop offset="100%" stop-color="#144d6a"/>
    </linearGradient>
  </defs>`;
}

// Generate Ghibli billowing clouds
function drawGhibliCloud(cx, cy, scale = 1, isSunset = false) {
  const fill = isSunset ? "url(#cloudBodySunset)" : "url(#cloudBodyDay)";
  return `
  <g transform="translate(${cx}, ${cy}) scale(${scale})" opacity="0.95">
    <!-- Cloud puff cluster with painterly soft overlapping ellipses -->
    <path d="M-180,40 
      C-200,10 -180,-30 -140,-40 
      C-150,-80 -100,-110 -50,-100 
      C-30,-150 40,-160 80,-130 
      C120,-160 180,-140 200,-90 
      C240,-80 260,-40 240,10 
      C270,40 250,90 200,95 
      L-150,95 
      C-190,90 -210,60 -180,40 Z" 
      fill="${fill}" filter="url(#dropShadow)" />
    <!-- Bright inner highlights (Ghibli fluff) -->
    <ellipse cx="60" cy="-110" rx="45" ry="32" fill="#ffffff" opacity="0.55" />
    <ellipse cx="-20" cy="-80" rx="55" ry="38" fill="#ffffff" opacity="0.45" />
    <ellipse cx="150" cy="-70" rx="40" ry="28" fill="#ffffff" opacity="0.5" />
    <ellipse cx="-110" cy="-25" rx="35" ry="22" fill="#ffffff" opacity="0.35" />
  </g>`;
}

// Ghibli sun with warm god rays
function drawGhibliSun(x, y, r, isSunset = false) {
  const glow = isSunset ? "url(#sunGlowSunset)" : "url(#sunGlowDay)";
  const sunColor = isSunset ? "#ffdf99" : "#fffded";
  return `
  <g>
    <circle cx="${x}" cy="${y}" r="${r * 3.5}" fill="${glow}" />
    <circle cx="${x}" cy="${y}" r="${r}" fill="${sunColor}" />
    <!-- Subtle sun rays -->
    <polygon points="${x},${y} ${x - 300},800 ${x - 120},800" fill="#fffbe6" opacity="0.08" />
    <polygon points="${x},${y} ${x + 50},800 ${x + 240},800" fill="#fffbe6" opacity="0.08" />
    <polygon points="${x},${y} ${x + 360},800 ${x + 560},800" fill="#fffbe6" opacity="0.06" />
  </g>`;
}

export { OUT_DIR, getGhibliDefs, drawGhibliCloud, drawGhibliSun };

