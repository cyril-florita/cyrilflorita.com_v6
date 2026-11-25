// Tiles the preview renders from build_bike.py into one contact sheet:
//   node scripts/kord/sheet.mjs <dir with preview_*.png> [out.jpg]
import sharp from "sharp";
const dir = process.argv[2];
const out = process.argv[3] || `${dir}/sheet.jpg`;
const names = ["side", "front34", "rear34", "nds", "drive", "cockpit"];
const W = 800, H = 450;
const inputs = await Promise.all(names.map(async (n, i) => ({ input: await sharp(`${dir}/preview_${n}.png`).resize(W, H).toBuffer(), left: (i % 2) * W, top: Math.floor(i / 2) * H })));
await sharp({ create: { width: W * 2, height: H * 3, channels: 3, background: "#000" } }).composite(inputs).jpeg({ quality: 82 }).toFile(out);
console.log("wrote", out);
