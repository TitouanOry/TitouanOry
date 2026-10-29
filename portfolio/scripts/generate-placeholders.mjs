// Génère des images "placeholder" en SVG (pochettes + galeries) pour les projets fictifs.
// Usage : npm run placeholders
// À supprimer quand tu auras mis tes vraies images dans public/projects/.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(import.meta.dirname, "..", "public", "projects");

// slug → [fond, couleur principale, couleur secondaire, motif]
const PROJECTS = {
  "cap-au-large": ["#EDE6D6", "#1B4D89", "#7FB3D5", "waves"],
  "grand-prix-voile": ["#0E1B2C", "#FF5A1F", "#F3EDE2", "sail"],
  "riders-du-pertuis": ["#E9F0E1", "#F2C230", "#2F6B4F", "rings"],
  "maree-haute": ["#F4EFE4", "#2BA9A0", "#0F4C4A", "stripes"],
  "run-the-coast": ["#F3F1EC", "#D7322B", "#1A1A1A", "diagonals"],
  "atlantic-paddle-series": ["#2A1B3D", "#F28FAD", "#F6C177", "sunset"],
  "nautic-live": ["#0B1E3A", "#FFFFFF", "#4DA3FF", "dots"],
  "regatta-kit": ["#F7F5EF", "#1F3FBF", "#F2C230", "flags"],
};

// Petit générateur pseudo-aléatoire déterministe (même résultat à chaque exécution)
function rng(seed) {
  let s = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

function motif(kind, w, h, [bg, c1, c2], r) {
  const m = Math.min(w, h);
  switch (kind) {
    case "waves": {
      let out = "";
      for (let i = 0; i < 9; i++) {
        const y = h * 0.3 + i * (h * 0.075);
        const amp = 18 + r() * 22;
        const len = w / (2 + Math.floor(r() * 3));
        let d = `M0 ${y}`;
        for (let x = 0; x <= w + len; x += len) d += ` q ${len / 4} ${-amp} ${len / 2} 0 t ${len / 2} 0`;
        out += `<path d="${d}" fill="none" stroke="${i % 2 ? c2 : c1}" stroke-width="${10 + r() * 14}" stroke-linecap="round"/>`;
      }
      return out;
    }
    case "sail":
      return `<path d="M${w * 0.52} ${h * 0.12} L${w * 0.52} ${h * 0.78} L${w * 0.18} ${h * 0.78} Z" fill="${c1}"/>
        <path d="M${w * 0.56} ${h * 0.2} L${w * 0.56} ${h * 0.78} L${w * 0.8} ${h * 0.78} Z" fill="${c2}"/>
        <rect x="0" y="${h * 0.84}" width="${w}" height="${h * 0.16}" fill="${c1}" opacity=".25"/>`;
    case "rings": {
      let out = "";
      const cx = w * (0.4 + r() * 0.2), cy = h * (0.4 + r() * 0.2);
      for (let i = 9; i > 0; i--) out += `<circle cx="${cx}" cy="${cy}" r="${(m / 2) * (i / 9) * 1.1}" fill="${i % 2 ? c1 : c2}"/>`;
      return out;
    }
    case "stripes": {
      let out = "";
      const n = 7;
      for (let i = 0; i < n; i++) out += `<rect x="0" y="${(h / n) * i}" width="${w}" height="${(h / n) * (0.35 + r() * 0.4)}" fill="${i % 3 ? c1 : c2}"/>`;
      return out;
    }
    case "diagonals": {
      let out = "";
      for (let i = -h; i < w + h; i += m * 0.09) out += `<line x1="${i}" y1="${h}" x2="${i + h}" y2="0" stroke="${r() > 0.75 ? c2 : c1}" stroke-width="${m * 0.025}"/>`;
      return out;
    }
    case "sunset": {
      let out = `<circle cx="${w / 2}" cy="${h * 0.58}" r="${m * 0.3}" fill="${c2}"/>`;
      for (let i = 0; i < 6; i++) out += `<rect x="0" y="${h * 0.58 + i * m * 0.05}" width="${w}" height="${m * 0.018 + i * 3}" fill="${bg}"/>`;
      return out + `<rect x="0" y="${h * 0.86}" width="${w}" height="${h * 0.14}" fill="${c1}"/>`;
    }
    case "dots": {
      let out = "";
      const step = m / 14;
      for (let x = step; x < w; x += step)
        for (let y = step; y < h; y += step) {
          const big = r() > 0.93;
          out += `<circle cx="${x}" cy="${y}" r="${big ? step * 0.32 : step * 0.09}" fill="${big ? c2 : c1}"/>`;
        }
      return out;
    }
    case "flags": {
      let out = "";
      const cols = 3, rows = 3, cw = w / cols, ch = h / rows;
      const pal = [c1, c2, "#D7322B", "#111111", "#FFFFFF"];
      for (let i = 0; i < cols; i++)
        for (let j = 0; j < rows; j++) {
          const x = i * cw + cw * 0.12, y = j * ch + ch * 0.12, fw = cw * 0.76, fh = ch * 0.76;
          const a = pal[Math.floor(r() * pal.length)], b = pal[Math.floor(r() * pal.length)];
          const t = Math.floor(r() * 3);
          out += `<rect x="${x}" y="${y}" width="${fw}" height="${fh}" fill="${a}"/>`;
          if (t === 0) out += `<rect x="${x + fw / 2}" y="${y}" width="${fw / 2}" height="${fh}" fill="${b}"/>`;
          if (t === 1) out += `<path d="M${x} ${y} L${x + fw} ${y + fh} L${x} ${y + fh} Z" fill="${b}"/>`;
          if (t === 2) out += `<rect x="${x + fw * 0.3}" y="${y + fh * 0.3}" width="${fw * 0.4}" height="${fh * 0.4}" fill="${b}"/>`;
        }
      return out;
    }
  }
  return "";
}

function svg(slug, w, h, variant) {
  const [bg, c1, c2, kind] = PROJECTS[slug];
  const r = rng(slug + variant);
  const label = slug.replace(/-/g, " ").toUpperCase();
  const fs = Math.round(Math.min(w, h) * 0.028);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<rect width="${w}" height="${h}" fill="${bg}"/>
${motif(kind, w, h, [bg, c1, c2], r)}
<text x="${fs * 1.6}" y="${h - fs * 1.6}" font-family="Helvetica, Arial, sans-serif" font-size="${fs}" font-weight="700" letter-spacing="${fs * 0.12}" fill="${kind === "dots" || kind === "sunset" || kind === "sail" ? "#fff" : "#111"}" opacity=".85">${label}${variant === "cover" ? "" : " — " + variant}</text>
</svg>`;
}

for (const slug of Object.keys(PROJECTS)) {
  const dir = join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "cover.svg"), svg(slug, 1200, 1200, "cover"));
  writeFileSync(join(dir, "1.svg"), svg(slug, 1600, 1000, "01"));
  writeFileSync(join(dir, "2.svg"), svg(slug, 1200, 1500, "02"));
  writeFileSync(join(dir, "3.svg"), svg(slug, 1600, 1000, "03"));
}
console.log(`Placeholders générés dans ${OUT}`);
