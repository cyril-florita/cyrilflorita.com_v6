// Builds the Mustang campaign kit's HTML5 banners (GSAP) from 48 frames of the car turning.
//
//   node scripts/mustang/make-banners.mjs [framesDir]
//
// framesDir (default new-work/mustang/turn-frames, git-ignored) holds 00.png … 47.png: one full turn
// of the car alone on a transparent page, 7.5° apart, starting on the front three-quarter view,
// captured from /pitch/mustang/spot/?f=turn&layer=car at 1600×700 with window.__msSpotYaw (README:
// "Campaign kit"; the turn format hides the floor and the reflection, so only the car and its soft
// shadows are left). For each size in SIZES it writes public/pitch/mustang/kit/ads/<id>/: index.html
// (the ad), car.jpg + alpha.jpg (every other frame — 24, 15° apart — cropped to the car and stacked
// top to bottom: the colour, and the transparency as greyscale; ad networks don't take WebP and a
// transparent PNG would be several times the size, so the ad joins the two on a canvas when it loads,
// and the giant word shows behind the car) and gsap.min.js (a local copy, so the folder works on its
// own; ad servers usually host GSAP themselves, which doesn't count toward their size limit). The
// canvas crossfades neighbouring frames (additive, so the blend is exact), so 24 frames turn smoothly.
// The GIFs, JPG backups and zips are made from these pages by the capture script (README).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import zlib from "node:zlib";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const FRAMES = path.resolve(process.argv[2] || path.join(ROOT, "new-work/mustang/turn-frames"));
const OUT = path.join(ROOT, "public/pitch/mustang/kit/ads");
const BG = "#060a13";                  // the ads' background (and the colour under car.jpg's transparent pixels, which keeps the JPG clean)
const CROP = { left: 40, top: 96, width: 1520, height: 500 };   // the car and its shadow, at every angle, in the 1600×700 frames
const N = 24;                          // frames in each sprite (every other master frame)
const LINK = "https://cyrilflorita.com/pitch/mustang/";

// Every size's layout, in px. car: the sprite's box (its height follows CROP's ratio); word: the
// giant MUSTANG behind it; the copy pieces are absolutely placed; `title` and `cta` can be
// shortened per size. scale: the sprite's pixel density (1.5 keeps the files light on retina).
const SIZES = [
  { id: "300x250", w: 300, h: 250, scale: 1.6, car: [0, 52, 300], word: [0, 36, 300, 70], lock: [12, 11, 7],
    title: [0, 156, 300, 12.5, "center"], terms: [0, 175, 300, 10, "center"], cta: [0, 195, 27, 8.5, "center"], stamp: [0, 231, 300, 6.5, "center"] },
  { id: "300x600", w: 300, h: 600, scale: 1.6, car: [0, 196, 300], word: [0, 146, 300, 84], lock: [18, 18, 9],
    line: [0, 366, 300, 8.5, "center"], title: [24, 386, 252, 20, "center", "Yours from<br>$499 a month."],
    terms: [0, 444, 300, 11, "center"], cta: [0, 482, 38, 10, "center"], stamp: [0, 538, 300, 7.5, "center"] },
  { id: "160x600", w: 160, h: 600, scale: 2, car: [0, 236, 160], word: [0, 202, 160, 45], lock: [12, 18, 7.5],
    line: [0, 318, 160, 7, "center", "Turn it.<br>Look closer."], title: [8, 354, 144, 14, "center", "Yours<br>from $499<br>a month."],
    terms: [8, 420, 144, 9.5, "center", "36-month lease<br>$3,999 due at signing"], cta: [0, 472, 30, 8, "center", "Explore in 3D"], stamp: [0, 518, 160, 6.5, "center"] },
  { id: "728x90", w: 728, h: 90, scale: 2, car: [92, 13, 214], word: [96, 8, 206, 58], lock: [14, 26, 7],
    title: [322, 22, 250, 13, "left", "From $499 a month."], terms: [322, 42, 230, 9.5, "left"], stamp: [322, 61, 200, 6.5, "left"],
    cta: [-14, 30, 30, 8.5, "right"] },
  { id: "970x250", w: 970, h: 250, scale: 1.4, car: [466, 44, 484], word: [470, 26, 480, 128], lock: [40, 30, 8.5],
    line: [40, 84, 400, 8, "left"], title: [40, 102, 440, 19, "left"], terms: [40, 134, 400, 12, "left"],
    cta: [40, 164, 36, 9.5, "left"], stamp: [40, 212, 300, 7.5, "left"] },
  { id: "320x50", w: 320, h: 50, scale: 2, car: [0, 8, 112], word: [0, 5, 112, 30], lock: null,
    title: [116, 12, 112, 9, "left", "From $499/mo"], stamp: [116, 30, 112, 5.5, "left"], cta: [-7, 12, 26, 7, "right", "Explore"] },
  // the website hero: a 1920×600 design that scales to its container's width
  { id: "hero-1920x600", w: 1920, h: 600, scale: 1, hero: true, car: [770, 116, 1130], word: [768, 84, 1152, 269], lock: [120, 90, 13.5],
    line: [120, 222, 700, 13, "left"], title: [120, 256, 760, 33.5, "left"], terms: [120, 306, 700, 18, "left"],
    cta: [120, 362, 58, 13.5, "left"], stamp: [120, 440, 400, 11, "left"] },
];

const TITLE = "Yours from $499 a month.";
const TERMS = "36-month lease · $3,999 due at signing";
const LINE = "Turn it. Open it. Look closer.";

async function sprite(size) {
  const ratio = CROP.height / CROP.width;
  const fw = Math.round(size.car[2] * size.scale), fh = Math.round(fw * ratio);
  const files = fs.readdirSync(FRAMES).filter((f) => f.endsWith(".png")).sort();
  if (files.length !== 48) throw new Error(`expected 48 frames in ${FRAMES}, found ${files.length}`);
  const bg = [1, 3, 5].map((i) => parseInt(BG.slice(i, i + 2), 16));
  const color = Buffer.alloc(fw * fh * N * 3), alpha = Buffer.alloc(fw * fh * N);
  for (let i = 0; i < N; i++) {
    const { data } = await sharp(path.join(FRAMES, files[i * 2])).extract(CROP).resize(fw, fh, { kernel: "lanczos3" })
      .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let p = 0; p < fw * fh; p++) {
      const a = data[p * 4 + 3], o = (i * fw * fh + p);
      alpha[o] = a;
      // straight (unpremultiplied) colour where there's anything to see, the background where there isn't
      for (let c = 0; c < 3; c++) color[o * 3 + c] = a < 4 ? bg[c] : data[p * 4 + c];
    }
  }
  const dir = path.join(OUT, size.id);
  fs.mkdirSync(dir, { recursive: true });
  await sharp(color, { raw: { width: fw, height: fh * N, channels: 3 } }).jpeg({ quality: size.hero ? 76 : size.q || 66, mozjpeg: true }).toFile(path.join(dir, "car.jpg"));
  await sharp(alpha, { raw: { width: fw, height: fh * N, channels: 1 } }).jpeg({ quality: size.hero ? 80 : (size.q || 66) + 4, mozjpeg: true }).toFile(path.join(dir, "alpha.jpg"));
  return { fw, fh };
}

// a positioned text block: [x, y, width, font-size, align, text?]; a negative x anchors from the right
const at = (spec, extra = "") => {
  const [x, y, w, fs, align] = spec;
  const pos = align === "right" ? `right:${-x}px;` : align === "center" && x === 0 && w === undefined ? "left:0;right:0;" : `left:${x}px;`;
  return `${pos}top:${y}px;${w ? `width:${w}px;` : ""}font-size:${fs}px;text-align:${align};${extra}`;
};

function html(size, { fw, fh }) {
  const { w, h } = size;
  const [cx, cy, cw] = size.car, ch = Math.round(cw * (fh / fw));
  const [wx, wy, ww, wfs] = size.word;
  const ctaSpec = size.cta;
  const ctaStyle = ctaSpec[4] === "right"
    ? `right:${-ctaSpec[0]}px;top:${ctaSpec[1]}px;height:${ctaSpec[2]}px;font-size:${ctaSpec[3]}px;`
    : ctaSpec[4] === "center"
      ? `left:50%;translate:-50% 0;top:${ctaSpec[1]}px;height:${ctaSpec[2]}px;font-size:${ctaSpec[3]}px;`
      : `left:${ctaSpec[0]}px;top:${ctaSpec[1]}px;height:${ctaSpec[2]}px;font-size:${ctaSpec[3]}px;`;
  const block = (cls, spec, fallback) => spec ? `<p class="${cls}" style="${at([spec[0], spec[1], spec[2], spec[3], spec[4]])}">${spec[5] || fallback}</p>` : "";
  const lock = size.lock ? `<p class="lock" style="left:${size.lock[0]}px;top:${size.lock[1]}px;font-size:${size.lock[2]}px;"><span>S650</span><span>Mustang <i></i><i></i><i></i><i></i></span></p>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="ad.size" content="width=${w},height=${h}">
<meta name="viewport" content="width=${size.hero ? "device-width, initial-scale=1" : w}">
<meta name="robots" content="noindex">
<title>Mustang · ${size.hero ? "Website hero" : "Banner"} ${w}×${h}</title>
<!--
  Mustang campaign kit: ${size.hero ? "the website hero (HTML5, scales to its container's width)" : `the ${w}×${h} HTML5 banner`}.
  A design and dev pitch by Cyril Florita; unofficial, not affiliated with Ford; the offer is sample content.
  Made by scripts/mustang/make-banners.mjs — edit the script, not this file. Click-through: clickTag.
-->
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders:wght@800&family=Michroma&family=Exo+2:wght@400&display=block" rel="stylesheet">
<script>var clickTag = "${LINK}";</script>
<style>
  html, body { margin: 0; ${size.hero ? "background: #05080e;" : ""} }
  ${size.hero ? `.fit { width: 100%; aspect-ratio: ${w} / ${h}; overflow: hidden; container-type: inline-size; }
  .ad { transform-origin: 0 0; scale: calc(100cqw / ${w}px); }` : ""}
  .ad { position: relative; display: block; width: ${w}px; height: ${h}px; overflow: hidden; background: ${BG}; color: #eef3f9; text-decoration: none; cursor: pointer;
        font-family: "Exo 2", Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; ${size.hero ? "" : "box-sizing: border-box; border: 1px solid #1d2a3f;"} }
  .ad * { margin: 0; }
  .word { position: absolute; left: ${wx}px; top: ${wy}px; width: ${ww}px; text-align: center; font-family: "Big Shoulders", Impact, sans-serif; font-weight: 800; font-size: ${wfs}px;
          line-height: 0.92; padding-bottom: 0.08em; letter-spacing: -0.02em; text-indent: -0.02em; color: transparent;
          background: linear-gradient(180deg, rgba(150, 180, 220, 0.34), rgba(125, 155, 200, 0.27)); -webkit-background-clip: text; background-clip: text; }
  canvas { position: absolute; left: ${cx}px; top: ${cy}px; width: ${cw}px; height: ${ch}px; }
  /* the floor: a soft lit oval the car stands on (the frames carry only the car and its shadows) */
  .floor { position: absolute; left: ${Math.round(cx - cw * 0.12)}px; top: ${Math.round(cy + ch * 0.5)}px; width: ${Math.round(cw * 1.24)}px; height: ${Math.round(ch * 0.62)}px;
           background: radial-gradient(50% 50% at 50% 42%, rgba(74, 111, 158, 0.34), rgba(40, 64, 100, 0.12) 55%, transparent 100%); }
  .light { position: absolute; inset: 0; pointer-events: none;
           background: radial-gradient(55% 70% at ${Math.round(((cx + cw / 2) / w) * 100)}% 30%, rgba(70, 110, 170, 0.22), transparent 70%),
                       radial-gradient(130% 100% at 50% 40%, transparent 55%, rgba(0, 0, 0, 0.5) 100%); }
  .lock { position: absolute; display: grid; gap: 0.45em; font-family: Michroma, Arial, sans-serif; letter-spacing: 0.18em; text-transform: uppercase; line-height: 1; }
  .lock span:first-child { padding-bottom: 0.45em; border-bottom: 1px solid rgba(255, 255, 255, 0.28); justify-self: start; }
  .lock i { display: inline-block; width: 0.3em; height: 0.85em; margin-left: 0.2em; background: #a9b8cb; transform: skewX(-24deg); vertical-align: -0.1em; }
  .lock i:first-of-type { margin-left: 0.7em; }
  .line, .title, .terms, .stamp { position: absolute; line-height: 1.2; }
  .line { font-family: Michroma, Arial, sans-serif; letter-spacing: 0.2em; text-transform: uppercase; color: #7fb9ff; }
  .title { white-space: nowrap; font-family: Michroma, Arial, sans-serif; letter-spacing: 0.03em; text-transform: uppercase; line-height: 1.18; }
  .terms { color: #a9b8cb; letter-spacing: 0.04em; line-height: 1.35; }
  .stamp { letter-spacing: 0.16em; text-transform: uppercase; color: #7fb9ff; }
  .cta { position: absolute; display: inline-flex; align-items: center; padding: 0 1.6em; background: #eef3f9; color: #05080e; overflow: hidden;
         font-family: Michroma, Arial, sans-serif; letter-spacing: 0.18em; text-transform: uppercase; white-space: nowrap; }
  .cta::after { content: ""; position: absolute; inset: 0; translate: -120% 0; background: linear-gradient(100deg, transparent 30%, rgba(127, 185, 255, 0.55) 50%, transparent 70%); transition: translate 0.6s ease; }
  .ad:hover .cta::after, .ad:focus-visible .cta::after { translate: 120% 0; }
  .ad:focus-visible { outline: 2px solid #7fb9ff; outline-offset: -3px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
</head>
<body>
${size.hero ? '<div class="fit">' : ""}<a class="ad" id="ad" href="${LINK}" target="_blank" rel="noopener" onclick="window.open(window.clickTag); return false;">
  <span class="sr">The Mustang Dark Horse, ${TITLE} ${TERMS}. Sample offer. Explore it in 3D.</span>
  <p class="word" aria-hidden="true">MUSTANG</p>
  <div class="floor" aria-hidden="true"></div>
  <canvas id="car" width="${fw}" height="${fh}" aria-hidden="true"></canvas>
  <div class="light" aria-hidden="true"></div>
  <div aria-hidden="true">
    ${lock}
    ${block("line", size.line, LINE)}
    ${block("title", size.title, TITLE)}
    ${block("terms", size.terms, TERMS)}
    <p class="cta" style="${ctaStyle}">${ctaSpec[5] || "Explore it in 3D"}</p>
    ${block("stamp", size.stamp, "[ Sample offer ]")}
  </div>
</a>${size.hero ? "</div>" : ""}
<script src="gsap.min.js"></script>
<script>
(function () {
  var N = ${N}, FW = ${fw}, FH = ${fh};
  var cv = document.getElementById("car"), cx = cv.getContext("2d"), col = new Image(), alp = new Image(), frames = [];
  var car = { f: N / 2 };                         // frame N/2 is the tail; 0 (= N) the front three-quarter view
  // join the colour and the greyscale transparency into one canvas per frame, once
  function build() {
    var c = document.createElement("canvas"), g = c.getContext("2d");
    c.width = FW; c.height = FH * N;
    g.drawImage(alp, 0, 0); var a = g.getImageData(0, 0, FW, FH * N).data;
    g.drawImage(col, 0, 0); var im = g.getImageData(0, 0, FW, FH * N), d = im.data;
    for (var p = 3; p < d.length; p += 4) d[p] = a[p - 3];
    for (var i = 0; i < N; i++) {
      var fc = document.createElement("canvas"); fc.width = FW; fc.height = FH;
      fc.getContext("2d").putImageData(new ImageData(d.slice(i * FW * FH * 4, (i + 1) * FW * FH * 4), FW, FH), 0, 0);
      frames.push(fc);
    }
  }
  function draw() {
    var f = ((car.f % N) + N) % N;
    if (window.adSnap) f = Math.round(f) % N;     // whole frames only (the GIF recordings: a crossfade caught in one GIF frame reads as a double car)
    var i = Math.floor(f), t = f - i;
    cx.clearRect(0, 0, FW, FH);
    cx.globalCompositeOperation = "lighter";      // additive: (1 − t)·this frame + t·the next, exactly
    cx.globalAlpha = 1 - t; cx.drawImage(frames[i], 0, 0);
    if (t > 0.001) { cx.globalAlpha = t; cx.drawImage(frames[(i + 1) % N], 0, 0); }
  }
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var q = function (s) { return document.querySelectorAll(s); };
  function start() {
    if (reduce || !window.gsap) { car.f = N; draw(); window.adDone = true; return; }
    var tl = gsap.timeline({ onUpdate: draw, onComplete: function () { window.adDone = true; } });
    window.adTL = tl;
    tl.from(".light", { opacity: 0, duration: 1 }, 0)
      .from(".word", { opacity: 0, yPercent: 14, clipPath: "inset(0 0 100% 0)", duration: 1.4, ease: "expo.out" }, 0.1)
      .from("#car", { opacity: 0, scale: 1.08, duration: 1.2, ease: "power2.out" }, 0.2)
      .fromTo(car, { f: N / 2 }, { f: N, duration: 2.4, ease: "power3.out" }, 0.2)
      .from(q(".lock"), { opacity: 0, y: 4, duration: 0.6 }, 0.5)
      .from(q(".line, .title, .terms"), { opacity: 0, y: 8, duration: 0.7, stagger: 0.14, ease: "power3.out" }, 1.2)
      .from(".cta", { opacity: 0, y: 6, duration: 0.6, ease: "power3.out" }, 1.85)
      .from(q(".stamp"), { opacity: 0, duration: 0.5 }, 2.2)
      .to(car, { f: N * 2, duration: 7, ease: "sine.inOut" }, 3.6);   // one slow turn back to the front, then still (≈10.6s; ad networks stop motion at 30s)
    var spin = null;
    document.getElementById("ad").addEventListener("mouseenter", function () {
      if (!window.adDone || (spin && spin.isActive())) return;
      spin = gsap.to(car, { f: "+=" + N, duration: 2.6, ease: "power2.inOut", onUpdate: draw });
    });
  }
  var loaded = 0;
  col.onload = alp.onload = function () {
    if (++loaded < 2) return;
    build(); draw();
    var go = function () { if (!go.done) { go.done = true; start(); } };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
    setTimeout(go, 1500);
  };
  col.src = "car.jpg"; alp.src = "alpha.jpg";
})();
</script>
</body>
</html>
`;
}

// Display ads must zip to 150 KB or less (Google Ads' cap, GSAP included), so each size's sprite
// steps its pixel density down from its `scale` (to 1×), then its JPG quality (from 66 to 46), until
// the zip fits (JPGs barely compress; the rest is estimated with deflate). The hero, for the dealer's
// own site, keeps its density and quality.
const LIMIT = 148 * 1024;
const gsapSrc = fs.readFileSync(path.join(ROOT, "node_modules/gsap/dist/gsap.min.js"));
const gz = (b) => zlib.deflateRawSync(b, { level: 9 }).length;
for (const size of SIZES) {
  let dims, total;
  const steps = [];
  for (let sc = size.scale; sc > 1.001; sc = Math.round((sc - 0.1) * 10) / 10) steps.push([sc, 66]);
  for (let q = 66; q >= 46; q -= 4) steps.push([1, q]);
  for (const [scale, q] of size.hero ? [[size.scale, 0]] : steps) {
    dims = await sprite({ ...size, scale, q });
    const page = html(size, dims);
    const dir = path.join(OUT, size.id);
    total = fs.statSync(path.join(dir, "car.jpg")).size + fs.statSync(path.join(dir, "alpha.jpg")).size + gz(Buffer.from(page)) + gz(gsapSrc) + 600;
    size.used = `${scale}${q && q !== 66 ? ` q${q}` : ""}`;
    fs.writeFileSync(path.join(dir, "index.html"), page);
    if (size.hero || total <= LIMIT) break;
  }
  fs.writeFileSync(path.join(OUT, size.id, "gsap.min.js"), gsapSrc);
  const kb = (f) => Math.round(fs.statSync(path.join(OUT, size.id, f)).size / 1024);
  console.log(`${size.id.padEnd(14)} ×${size.used}  sprite ${dims.fw}×${dims.fh}×${N}  car.jpg ${kb("car.jpg")} KB  alpha.jpg ${kb("alpha.jpg")} KB  zip ≈ ${Math.round(total / 1024)} KB`);
}
