"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// The background shapes (.cyril-bg-item diamonds and their satellites, the hero's
// .cyril-bg-title-boxed rectangles) drawn as ASCII instead of a CSS dot grid: one canvas per
// shape, upright text on a 12px grid (mostly dots, some : + - *). Near the pointer the
// characters are pushed away and turn denser (+ * x # % @), springing back once it leaves.
// The canvases sit inside the shapes, so MotionEffects' parallax (`translate` on each shape)
// carries them. The diamonds are squares turned 45° in CSS, so their canvas is turned back
// (-45°) and sized to the diamond's bounding box; the shape clips it (overflow: hidden).
// Desktop only (the shapes are hidden at ≤1200px); still under reduced motion or without a
// mouse. Styles: "ASCII background shapes" in _components.scss.

const CELL = 12;              // grid step, px
const FONT = 11;              // px
const RADIUS = 188;           // the pointer's reach, px (the repulsion circle)
const PUSH = 28;              // the most a character is pushed, px
const RAMP = ["+", "*", "x", "#", "%", "@"];
const DPR_MAX = 1.5;          // the large diamonds are ~1000px canvases; this keeps memory down

const hash = (i) => { const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453; return x - Math.floor(x); };
const restChar = (i) => { const r = hash(i); return r < 0.6 ? "." : r < 0.8 ? ":" : r < 0.91 ? "+" : r < 0.97 ? "-" : "*"; };

export default function AsciiFields() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.innerWidth <= 1200) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const live = !reduce && fine;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
    const fields = [];
    const added = [];
    const ink = () => getComputedStyle(document.documentElement).getPropertyValue("--color-dark").trim() || "#101010";
    let color = ink();

    const draw = (f, x0 = 0, y0 = 0, x1 = f.w, y1 = f.h) => {
      const { ctx } = f;
      ctx.clearRect(x0, y0, x1 - x0, y1 - y0);
      const c0 = Math.max(0, Math.floor((x0 - f.ox) / CELL)), c1 = Math.min(f.cols - 1, Math.floor((x1 - f.ox) / CELL));
      const r0 = Math.max(0, Math.floor((y0 - f.oy) / CELL)), r1 = Math.min(f.rows - 1, Math.floor((y1 - f.oy) / CELL));
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
      ctx.fillStyle = color;
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const i = r * f.cols + c;
          if (f.active.has(i)) continue;
          ctx.fillText(restChar(i), f.ox + (c + 0.5) * CELL, f.oy + (r + 0.5) * CELL);
        }
      }
      ctx.restore();
    };
    // the displaced characters, over the redrawn region (they may reach a little past it)
    const drawActive = (f) => {
      const { ctx } = f;
      ctx.fillStyle = color;
      f.active.forEach((a, i) => {
        const c = i % f.cols, r = (i - c) / f.cols;
        const ch = a.v > 0.08 ? (a.v > 0.35 && Math.random() < 0.12 ? RAMP[(Math.random() * RAMP.length) | 0] : RAMP[Math.min(RAMP.length - 1, (a.v * RAMP.length) | 0)]) : restChar(i);
        ctx.fillText(ch, f.ox + (c + 0.5) * CELL + a.dx, f.oy + (r + 0.5) * CELL + a.dy);
      });
    };

    const size = (f) => {
      const s = f.host.offsetWidth, t = f.host.offsetHeight;
      if (!s || !t) return false;
      const box = f.diamond ? (s + t) / Math.SQRT2 : 0;
      f.w = Math.ceil(f.diamond ? box : s); f.h = Math.ceil(f.diamond ? box : t);
      f.canvas.style.width = `${f.w}px`; f.canvas.style.height = `${f.h}px`;
      f.canvas.width = Math.round(f.w * dpr); f.canvas.height = Math.round(f.h * dpr);
      f.cols = Math.ceil(f.w / CELL); f.rows = Math.ceil(f.h / CELL);
      f.ox = (f.w - f.cols * CELL) / 2; f.oy = (f.h - f.rows * CELL) / 2;
      const { ctx } = f;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FONT}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      f.active.clear(); f.dirty = null; f.sized = true;
      draw(f);
      return true;
    };
    const release = (f) => { f.canvas.width = 0; f.canvas.height = 0; f.sized = false; f.active.clear(); };

    const field = (host, diamond) => {
      const canvas = document.createElement("canvas");
      canvas.className = `cyril-ascii-canvas${diamond ? " is-diamond" : ""}`;
      canvas.setAttribute("aria-hidden", "true");
      host.appendChild(canvas);
      added.push(canvas);
      const f = { host, canvas, ctx: canvas.getContext("2d"), diamond, active: new Map(), visible: false, sized: false };
      fields.push(f);
    };

    for (const el of document.querySelectorAll(".cyril-bg-item, .cyril-bg-title-boxed")) {
      if (el.classList.contains("is-ascii")) continue;
      const diamond = el.classList.contains("cyril-bg-item");
      const hasSat = getComputedStyle(el, "::before").display !== "none";
      el.classList.add("is-ascii");
      const main = document.createElement("div");
      main.className = "cyril-ascii-field";
      el.appendChild(main); added.push(main);
      field(main, diamond);
      if (hasSat) {
        const sat = document.createElement("div");
        sat.className = "cyril-bg-sat";
        el.appendChild(sat); added.push(sat);
        field(sat, diamond);
      }
    }
    if (!fields.length) return;

    // only the shapes near the screen keep a canvas
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const f = fields.find((x) => x.host === e.target);
        if (!f) continue;
        f.visible = e.isIntersecting;
        if (f.visible && !f.sized) size(f); else if (!f.visible && f.sized) release(f);
      }
    }, { rootMargin: "50% 0px" });
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) { const f = fields.find((x) => x.host === e.target); if (f?.visible) size(f); }
    });
    fields.forEach((f) => { io.observe(f.host); ro.observe(f.host); });

    // theme switch: repaint in the new ink
    const mo = new MutationObserver(() => {
      const next = ink();
      if (next === color) return;
      color = next;
      fields.forEach((f) => { if (f.sized) { draw(f); drawActive(f); } });
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let px = null, py = null, raf = 0;
    const step = (f) => {
      const rect = f.canvas.getBoundingClientRect();
      const kx = f.w / rect.width, ky = f.h / rect.height;
      const lx = px === null ? null : (px - rect.left) * kx, ly = py === null ? null : (py - rect.top) * ky;
      const near = lx !== null && lx > -RADIUS && ly > -RADIUS && lx < f.w + RADIUS && ly < f.h + RADIUS;
      if (!near && !f.active.size) return false;
      if (near) {                                                     // cells in reach join the active set
        const c0 = Math.max(0, Math.floor((lx - RADIUS - f.ox) / CELL)), c1 = Math.min(f.cols - 1, Math.floor((lx + RADIUS - f.ox) / CELL));
        const r0 = Math.max(0, Math.floor((ly - RADIUS - f.oy) / CELL)), r1 = Math.min(f.rows - 1, Math.floor((ly + RADIUS - f.oy) / CELL));
        for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
          const i = r * f.cols + c;
          if (!f.active.has(i)) f.active.set(i, { dx: 0, dy: 0, vx: 0, vy: 0, v: 0 });
        }
      }
      let moving = false, x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      f.active.forEach((a, i) => {
        const c = i % f.cols, r = (i - c) / f.cols;
        const cx = f.ox + (c + 0.5) * CELL, cy = f.oy + (r + 0.5) * CELL;
        let tx = 0, ty = 0, tv = 0;
        if (near) {
          const ddx = cx - lx, ddy = cy - ly, d = Math.hypot(ddx, ddy);
          if (d < RADIUS) {
            const k = 1 - d / RADIUS, e = k * k * (3 - 2 * k);
            tv = e;
            if (d > 0.01) { tx = (ddx / d) * PUSH * e; ty = (ddy / d) * PUSH * e; }
          }
        }
        a.vx = (a.vx + (tx - a.dx) * 0.16) * 0.74; a.vy = (a.vy + (ty - a.dy) * 0.16) * 0.74;   // a light spring, so they wobble back
        a.dx += a.vx; a.dy += a.vy; a.v += (tv - a.v) * 0.2;
        const settled = Math.abs(tx - a.dx) < 0.05 && Math.abs(ty - a.dy) < 0.05 && Math.abs(a.vx) + Math.abs(a.vy) < 0.05 && Math.abs(tv - a.v) < 0.01;
        if (settled && !tv && !tx && !ty) { f.active.delete(i); } else if (!settled) moving = true;
        x0 = Math.min(x0, cx - CELL); x1 = Math.max(x1, cx + CELL); y0 = Math.min(y0, cy - CELL); y1 = Math.max(y1, cy + CELL);
      });
      // redraw the region the active cells cover now, joined with last frame's
      const pad = PUSH + CELL;
      let rx0 = x0 - pad, ry0 = y0 - pad, rx1 = x1 + pad, ry1 = y1 + pad;
      if (f.dirty) { rx0 = Math.min(rx0, f.dirty[0]); ry0 = Math.min(ry0, f.dirty[1]); rx1 = Math.max(rx1, f.dirty[2]); ry1 = Math.max(ry1, f.dirty[3]); }
      if (rx1 > rx0) { draw(f, Math.max(0, rx0), Math.max(0, ry0), Math.min(f.w, rx1), Math.min(f.h, ry1)); drawActive(f); }
      f.dirty = f.active.size ? [x0 - pad, y0 - pad, x1 + pad, y1 + pad] : null;
      return moving || f.active.size > 0 && near;
    };
    const frame = () => {
      raf = 0;
      let again = false;
      for (const f of fields) if (f.visible && f.sized && step(f)) again = true;
      if (again) raf = requestAnimationFrame(frame);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onMove = (e) => { px = e.clientX; py = e.clientY; wake(); };
    const onLeave = () => { px = py = null; wake(); };
    if (live) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", wake, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect();
      window.removeEventListener("pointermove", onMove); window.removeEventListener("scroll", wake);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      added.forEach((n) => n.remove());
      document.querySelectorAll(".is-ascii").forEach((el) => el.classList.remove("is-ascii"));
    };
  }, [pathname]);

  return null;
}
