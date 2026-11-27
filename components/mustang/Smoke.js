"use client";

import { useEffect, useRef } from "react";
import softwareGL from "./softwareGL";

// Background smoke, after the poster's billowing fog, behind the giant word and
// kept off the floor.
// - Desktop with a mouse: a WebGL2 shader (domain-warped fractal noise) on its
//   own small canvas, drawn at 0.4x resolution and ~30fps, always drifting.
//   While the pointer is over the car (CarStage's "ms:car-hover") it stirs:
//   time runs ~3x faster, the fog swirls round the pointer and brightens, then
//   eases back. It pauses while the tab is hidden or the stage is off screen.
// - Phones, tablets, no WebGL or no GPU (softwareGL.js): three CSS layers of a generated noise texture
//   drift past each other (screen blend); the hover speeds their playback up.
// - Reduced motion, or no GPU: one still frame (or still layers).

const VERT = `#version 300 es
in vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uPtr; uniform float uStir;
out vec4 o;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;                       // 0..1, y up
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y) * 1.45;               // broad billows, like the poster
  vec2 ptr = vec2(uPtr.x * asp, uPtr.y) * 1.45;
  vec2 d = p - ptr;                                       // stir: a swirl round the pointer
  float sw = uStir * 1.6 * exp(-dot(d, d) * 0.9);
  p = ptr + mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * d;
  float t = uTime;
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.05)), fbm(p + vec2(5.2, 1.3) - vec2(t * 0.04, 0.0)));
  vec2 r = vec2(fbm(p + 2.2 * q + vec2(1.7, 9.2) + t * 0.07), fbm(p + 2.2 * q + vec2(8.3, 2.8) - t * 0.06));
  float f = fbm(p + 1.8 * r + vec2(t * 0.03, 0.0));
  float dens = smoothstep(0.24, 0.86, f);
  float band = smoothstep(0.47, 0.70, uv.y);              // nothing on the floor (its band is the lower 46%)
  float cx = exp(-pow((uv.x - 0.5) * 1.6, 2.0));          // lit from above the centre, like the poster
  float top = 0.75 + 0.25 * smoothstep(0.6, 1.0, uv.y);
  float a = dens * band * (0.4 + 0.6 * cx) * top * (0.95 + 0.22 * uStir);
  vec3 col = mix(vec3(0.15, 0.22, 0.33), vec3(0.66, 0.76, 0.9), dens);
  o = vec4(col * a, a);
}`;

function makeTexture(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const img = g.createImageData(size, size);
  let seed = 90210;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const octaves = [[4, 0.5], [8, 0.27], [16, 0.15], [32, 0.08]];
  const lattice = octaves.map(([n]) => Array.from({ length: n * n }, rnd));
  const fade = (t) => t * t * (3 - 2 * t);
  const sample = (k, x, y) => {
    const n = octaves[k][0], L = lattice[k];
    const fx = (x / size) * n, fy = (y / size) * n;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fade(fx - x0), ty = fade(fy - y0);
    const at = (i, j) => L[(((j % n) + n) % n) * n + (((i % n) + n) % n)];
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx;
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
    return a + (b - a) * ty;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      for (let k = 0; k < octaves.length; k++) v += sample(k, x, y) * octaves[k][1];
      const a = Math.pow(Math.max(0, (v - 0.34) / 0.66), 1.7);
      const i = (y * size + x) * 4;
      img.data[i] = 150; img.data[i + 1] = 178; img.data[i + 2] = 215;
      img.data[i + 3] = Math.min(255, a * 520);
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

function startShader(el, canvas, stage, reduce) {
  const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  const uRes = U("uRes"), uTime = U("uTime"), uPtr = U("uPtr"), uStir = U("uStir");

  let w = 0, h = 0, time = 20, speed = 1, stir = 0, stirGoal = 0, ptr = [0.5, 0.55], ptrGoal = [0.5, 0.55];
  let raf = 0, last = 0, lastDraw = 0, visible = true, onScreen = true;
  const size = () => {
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width * 0.4)); h = Math.max(1, Math.round(r.height * 0.4));
    canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
    if (reduce) draw();
  };
  const draw = () => {
    gl.uniform2f(uRes, w, h); gl.uniform1f(uTime, time); gl.uniform2f(uPtr, ptr[0], ptr[1]); gl.uniform1f(uStir, stir);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const frame = (now) => {
    raf = 0;
    if (!visible || !onScreen) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const k = 1 - Math.exp(-dt * (stirGoal > stir ? 2.4 : 1.2));
    stir += (stirGoal - stir) * k;
    speed = 1 + stir * 2.2;
    time += dt * 0.55 * speed;
    ptr[0] += (ptrGoal[0] - ptr[0]) * (1 - Math.exp(-dt * 4)); ptr[1] += (ptrGoal[1] - ptr[1]) * (1 - Math.exp(-dt * 4));
    if (now - lastDraw < 32) return;                       // ~30fps is plenty for fog
    lastDraw = now; draw();
  };
  const run = () => { if (!reduce && !raf && visible && onScreen) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  const ro = new ResizeObserver(size); ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; run(); }); io.observe(stage);
  const onVis = () => { visible = document.visibilityState === "visible"; run(); };
  const onHover = (e) => { stirGoal = e.detail ? 1 : 0; };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    ptrGoal = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
  };
  document.addEventListener("visibilitychange", onVis);
  stage.addEventListener("ms:car-hover", onHover);
  stage.addEventListener("pointermove", onMove);
  const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; delete el.dataset.gl; };   // the CSS layers take over
  canvas.addEventListener("webglcontextlost", onLost);
  size(); draw(); run();
  el.dataset.gl = "true";
  return () => {
    canvas.removeEventListener("webglcontextlost", onLost);
    cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    stage.removeEventListener("ms:car-hover", onHover); stage.removeEventListener("pointermove", onMove);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

export default function Smoke() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current, stage = el?.closest(".ms-stage");
    if (!el || !stage) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // No GPU (softwareGL.js): the CSS layers hold still too — three drifting, blurred,
    // screen-blended layers cost ~50ms a frame to composite in software, and everything
    // that waits on the compositor (canvas reads, the 3D check) queued behind them.
    const soft = softwareGL();
    if (soft) el.dataset.still = "";

    // The CSS layers' texture is always prepared, so they can stand in at once
    // if WebGL is missing or its context is lost.
    let url = "", gone = false;
    try {
      makeTexture().toBlob((blob) => {
        if (gone || !blob) return;
        url = URL.createObjectURL(blob);
        el.style.setProperty("--smoke", `url(${url})`);
        el.dataset.ready = "true";
      });
    } catch { /* no canvas: no smoke */ }

    // The shader gets a fresh canvas each run (React runs effects twice in
    // development, and a canvas whose context was released can't get it back).
    let stopShader = null, canvas = null;
    if (fine && !soft) {
      canvas = document.createElement("canvas");
      canvas.className = "ms-smoke-gl";
      el.prepend(canvas);
      try { stopShader = startShader(el, canvas, stage, reduce); } catch { stopShader = null; }
      if (stopShader) el.dataset.ready = "true";
      else { canvas.remove(); canvas = null; }
    }

    // the CSS layers' stir
    let rate = 1, goal = 1, raf = 0, last = 0;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      rate += (goal - rate) * (1 - Math.exp(-dt * (goal > rate ? 2.2 : 1.1)));
      if (Math.abs(goal - rate) < 0.02) rate = goal;
      el.querySelectorAll("i").forEach((i) => i.getAnimations().forEach((a) => { a.playbackRate = rate; }));
      raf = rate === goal ? 0 : requestAnimationFrame(tick);
    };
    const onHover = (e) => { goal = e.detail ? 4 : 1; if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    stage.addEventListener("ms:car-hover", onHover);
    return () => {
      gone = true; if (url) URL.revokeObjectURL(url);
      stage.removeEventListener("ms:car-hover", onHover); cancelAnimationFrame(raf);
      stopShader?.(); canvas?.remove();
      delete el.dataset.gl; delete el.dataset.ready;
    };
  }, []);
  return (
    <div className="ms-smoke" ref={ref} aria-hidden="true">
      <i /><i /><i />
    </div>
  );
}
