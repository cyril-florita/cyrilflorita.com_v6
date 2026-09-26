// Generates small WebP versions of the portfolio images for grids and
// in-page figures, plus a size manifest — the originals are never touched.
//
//   npm run thumbs
//
// - public/img/portfolio/<name>.(jpg|png) → public/img/thumbs/portfolio/
//   <name>.webp (800w) and, for originals wider than that, <name>@1600.webp
//   (1600w, or the original width if smaller) for large/retina displays
// - components/data/imageSizes.json maps each original's URL to its [w, h]
//   so pages can reserve space and build srcset; the WebP paths follow from
//   the naming above (see components/imageProps.js). The zoom viewer still
//   opens the originals.
// Re-run after adding or replacing images; unchanged images are skipped.
import sharp from "sharp";
import { readdir, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC_DIR = path.join(ROOT, "public/img/portfolio");
const OUT_DIR = path.join(ROOT, "public/img/thumbs/portfolio");
const MANIFEST = path.join(ROOT, "components/data/imageSizes.json");
const WIDTHS = [800, 1600];
const QUALITY = 78;
const WEBP_MAX = 16383;

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const manifest = {};
let made = 0;

for (const file of files) {
  const src = path.join(SRC_DIR, file);
  const base = file.replace(/\.(jpe?g|png)$/i, "");
  const { width, height } = await sharp(src).metadata();
  const srcTime = (await stat(src)).mtimeMs;

  for (const target of WIDTHS) {
    // Only make the large size when the original is wider than the small one.
    if (target > WIDTHS[0] && width <= WIDTHS[0]) continue;
    const outName = target === WIDTHS[0] ? `${base}.webp` : `${base}@${target}.webp`;
    const out = path.join(OUT_DIR, outName);
    const outTime = await stat(out).then((s) => s.mtimeMs, () => 0);
    if (outTime < srcTime) {
      // WebP can't exceed 16383px on either side — very tall full-page
      // screenshots are scaled down to fit (aspect ratio kept).
      await sharp(src)
        .resize({ width: Math.min(target, width), height: WEBP_MAX, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(out);
      made++;
    }
  }

  manifest[`/img/portfolio/${file}`] = [width, height];
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 0) + "\n");
console.log(`${files.length} images, ${made} WebP files (re)generated → ${path.relative(ROOT, OUT_DIR)}`);
