// Optimise tes vraies photos pour le web.
// Usage :
//   1. Dépose tes images originales (jpg, png, heic, tiff…) dans  images-src/<slug>/
//      ex. images-src/cap-au-large/cover.jpg, images-src/cap-au-large/1.jpg
//   2. Lance :  npm run images
//   3. Tu obtiens dans public/projects/<slug>/ :  cover.webp (1600 px) + cover-800.webp (800 px)
//   4. Dans src/data/projects.ts, référence "/projects/<slug>/cover.webp"
//      (le composant <Img> ajoute tout seul la version 800 px pour les mobiles).
// Le dossier images-src/ est ignoré par git : seules les versions optimisées sont publiées.
import { readdirSync, statSync, mkdirSync } from "node:fs";
import { join, parse, relative } from "node:path";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const SRC = join(ROOT, "images-src");
const OUT = join(ROOT, "public", "projects");
const EXT = /\.(jpe?g|png|webp|tiff?|heic|avif)$/i;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (EXT.test(name)) yield p;
  }
}

let count = 0;
try {
  statSync(SRC);
} catch {
  console.log("Crée d'abord un dossier images-src/<slug>/ avec tes photos.");
  process.exit(0);
}

for (const file of walk(SRC)) {
  const { dir, name } = parse(relative(SRC, file));
  const outDir = join(OUT, dir);
  mkdirSync(outDir, { recursive: true });
  for (const [width, suffix] of [[1600, ""], [800, "-800"]]) {
    await sharp(file)
      .rotate() // respecte l'orientation EXIF des photos de téléphone
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(join(outDir, `${name}${suffix}.webp`));
  }
  count++;
  console.log("✓", relative(ROOT, file));
}
console.log(`${count} image(s) optimisée(s) dans public/projects/`);
