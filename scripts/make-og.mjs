// Generates the social share images (Open Graph / Twitter cards) and the
// app icons — the source images are never touched.
//
//   npm run og
//
// - public/og/<slug>.jpg (1200×630) for every project page, from its CaseHero
//   `image` (or its first figure when the hero has none), placed on a solid
//   black canvas. `fit` is chosen per image: "cover" for wide photos/graphics
//   whose important content survives a light crop, "contain" for transparent
//   PNGs, logos, text-heavy graphics, portrait or very tall images so nothing
//   gets cut off.
// - public/og/default.jpg from the home hero photo (used by / and as the
//   fallback for every page).
// - public/apple-touch-icon.png (180×180) and public/icon-512.png (512×512):
//   the site's bold uppercase "C" mark (as in the preloader/header logo)
//   rendered from an SVG, white with the mark's soft offset shadow, on black.
//
// Re-run (and commit the output) after changing a project's hero image.
// The metadata that references these files lives in app/layout.js and each
// route's app/<slug>/layout.js.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const PUB = path.join(ROOT, "public");
const OUT_DIR = path.join(PUB, "og");
const W = 1200;
const H = 630;
const BLACK = { r: 0, g: 0, b: 0, alpha: 1 };

// slug → [source image (under public/), fit, optional sharp position]
const IMAGES = {
  default: ["/img/cyril-florita-profile.png", "contain"],
  gty_v9: ["/img/portfolio/main_gty9.png", "contain"],
  gty_v8: ["/img/portfolio/main_gty8.png", "contain"],
  "the-study-bible-app": ["/img/portfolio/main_the-study-bible-app.jpg", "cover"],
  // Very tall full-page screenshot: show its top, like the page's framed preview.
  "gty-app-landing": ["/img/portfolio/gty-app-landing-screenshot.jpg", "cover", "top"],
  "gty-dashboard": ["/img/portfolio/gty-dashboard-1b.jpg", "contain"],
  "grace-stream": ["/img/portfolio/main_grace-stream.jpg", "cover"],
  "truth-matters": ["/img/portfolio/main_truth-matters-podcast.jpg", "cover"],
  "the-study-bible-app-logo": ["/img/portfolio/main_the-study-bible-app-logo.jpg", "cover"],
  "patricia-macarthur-pastoral-care-fund": ["/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-light.jpg", "contain"],
  "gty-blog-graphics": ["/img/portfolio/gty-blog_the-Bible-is-timeless-truth.jpg", "contain"],
  "gty-resources": ["/img/portfolio/gty-resource_Divine-Design.jpg", "contain"],
  "gty-social-media-graphics": ["/img/portfolio/gty-social_black-frame---None-Good-Enough,-None-So-Evil.jpg", "contain"],
  "he-took-my-place": ["/img/portfolio/main_he-took-my-place.jpg", "contain"],
  sekihmentis: ["/img/portfolio/main_sekihmentis.jpg", "contain"],
  "hunger-action-month": ["/img/portfolio/chf-hunger-action-month_main.jpg", "cover", "left"],
  "35-day-generosity-challenge": ["/img/portfolio/chf-35-day-generosity_main.jpg", "cover", "top"],
  "giving-tuesday": ["/img/portfolio/chf-giving-tuesday_main.jpg", "cover", "top"],
  "volunteer-leadership-team": ["/img/portfolio/chf-volunteer-leadership_main.jpg", "cover", "top"],
};

await mkdir(OUT_DIR, { recursive: true });

for (const [slug, [src, fit, position = "centre"]] of Object.entries(IMAGES)) {
  await sharp(path.join(PUB, src))
    .resize(W, H, { fit, position, background: BLACK })
    .flatten({ background: BLACK })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT_DIR, `${slug}.jpg`));
  console.log(`og/${slug}.jpg  <-  ${src} (${fit})`);
}

// Brand mark icon. Atkinson Hyperlegible (the site font) isn't installed as a
// system font, so the SVG falls back to a bold system sans for the "C".
const markSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#000"/>
  <g font-family="Atkinson Hyperlegible, Helvetica Neue, Helvetica, Arial, sans-serif"
     font-weight="700" font-size="72" text-anchor="middle">
    <text x="53" y="77" fill="#fff" fill-opacity="0.18">C</text>
    <text x="50" y="74" fill="#fff">C</text>
  </g>
</svg>`;

for (const [file, size] of [["apple-touch-icon.png", 180], ["icon-512.png", 512]]) {
  await sharp(Buffer.from(markSvg(size))).png().toFile(path.join(PUB, file));
  console.log(`${file}  (${size}x${size})`);
}
