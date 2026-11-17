// Tiles the preview renders from build_car.py into one contact sheet:
//   node scripts/mustang/sheet.mjs <dir with preview_*.png> [out.jpg]
import sharp from "sharp";
const dir = process.argv[2];
const out = process.argv[3] || `${dir}/sheet.jpg`;
const names = ["front34", "rear34", "side", "front", "interior", "top34"];
const W = 960, H = 540;
await sharp({ create: { width: W * 2, height: H * 3, channels: 3, background: "#000" } })
  .composite(names.map((n, i) => ({ input: `${dir}/preview_${n}.png`, left: (i % 2) * W, top: Math.floor(i / 2) * H })))
  .jpeg({ quality: 82 }).toFile(out);
console.log("wrote", out);
