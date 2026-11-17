"use client";

import { useEffect, useRef } from "react";

// The backdrop's grit, after the poster: a tileable 512px texture of soft
// blotches, faint scuffs and fine grain, drawn once to a canvas and shown as a
// background image in an overlay blend over the stage's gradient (mustang.css,
// .ms-grit). It sits inside .ms-bg, so the smoke, the word, the car, the text
// and the windows are all above it. Without JS the plain gradient shows.
const SIZE = 512;

function paint() {
  const c = document.createElement("canvas"); c.width = c.height = SIZE;
  const g = c.getContext("2d");
  g.fillStyle = "rgb(128,128,128)"; g.fillRect(0, 0, SIZE, SIZE);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // blotches: big soft light and dark patches, drawn wrapped so the tile repeats
  const blob = (x, y, r, light, a) => {
    for (const dx of [-SIZE, 0, SIZE]) for (const dy of [-SIZE, 0, SIZE]) {
      const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
      const v = light ? 255 : 0;
      gr.addColorStop(0, `rgba(${v},${v},${v},${a})`); gr.addColorStop(1, `rgba(${v},${v},${v},0)`);
      g.fillStyle = gr; g.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
    }
  };
  for (let i = 0; i < 70; i++) blob(rnd() * SIZE, rnd() * SIZE, 20 + rnd() * 110, rnd() > 0.5, 0.05 + rnd() * 0.12);
  for (let i = 0; i < 160; i++) blob(rnd() * SIZE, rnd() * SIZE, 2 + rnd() * 10, rnd() > 0.6, 0.1 + rnd() * 0.2);
  // scuffs: short, faint, mostly level strokes
  g.lineCap = "round";
  for (let i = 0; i < 40; i++) {
    const x = rnd() * SIZE, y = rnd() * SIZE, len = 10 + rnd() * 60, ang = (rnd() - 0.5) * 0.6 + (rnd() > 0.8 ? 1.4 : 0);
    g.strokeStyle = rnd() > 0.5 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.14)"; g.lineWidth = 0.6 + rnd();
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len); g.stroke();
  }
  // grain, baked in
  const img = g.getImageData(0, 0, SIZE, SIZE), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 46;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  return c;
}

export default function Grit() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    let url = "", gone = false;
    paint().toBlob((b) => {
      if (gone || !b) return;
      url = URL.createObjectURL(b);
      el.style.backgroundImage = `url(${url})`;
      el.classList.add("is-on");
    }, "image/png");
    return () => { gone = true; if (url) URL.revokeObjectURL(url); };
  }, []);
  return <div className="ms-grit" ref={ref} />;
}
