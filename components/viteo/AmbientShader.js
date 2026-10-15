"use client";
import { useEffect, useRef } from "react";

// The landing's moving background: a silk ribbon of light in the theme's
// colours, drawn by a shader behind everything, so the glass cards
// frost something alive. It replaces the static ambient gradients (which
// stay as the fallback: they're .dl-frame's background until this is ready).
//
// three.js WebGPURenderer with a TSL shader: WebGPU where the browser has
// it, otherwise the same shader on WebGL2. Desktop with a mouse only, never
// under reduced motion. Kept cheap on purpose: drawn at a low resolution
// (the glass blurs it anyway), capped at ~30fps, paused while the tab is
// hidden, and on its own canvas under the page, apart from the 3D product
// scene (ProductStory.js), whose canvas only draws when something moves.

const FPS = 30;
const SPEED = 2.5; // drift speed (1 = the original, slower drift)
const RES = 0.35; // drawing-buffer scale against CSS pixels

// Any CSS colour (incl. color-mix / rgba) → [r, g, b] 0–1, composited over
// the page colour, so translucent tokens come out as the colour you see.
const resolve = (css, under) => {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const g = c.getContext("2d");
  if (under) { g.fillStyle = under; g.fillRect(0, 0, 1, 1); }
  g.fillStyle = css;
  g.fillRect(0, 0, 1, 1);
  const [r, gg, b] = g.getImageData(0, 0, 1, 1).data;
  return [r / 255, gg / 255, b / 255];
};

export default function AmbientShader() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const root = canvas?.closest(".dl");
    if (!canvas || !root) return;
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)").matches;
    if (!ok || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three/webgpu");
      const { Fn, uniform, screenUV, vec2, vec3, float, sin, exp, mix, smoothstep, min, dot, mx_noise_float } = await import("three/tsl");
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGPURenderer({ canvas, antialias: false, alpha: false, powerPreference: "low-power" });
        await renderer.init();
      } catch {
        return; // no WebGPU and no WebGL2: the static gradients stay
      }
      if (disposed) { renderer.dispose(); return; }
      renderer.setPixelRatio(RES);

      // Uniforms: time, aspect, the pointer (eased), the palette and the
      // strength of each layer (set per theme and mode in palette()).
      const uTime = uniform(0);
      const uAspect = uniform(1);
      const uPointer = uniform(new THREE.Vector2(0.5, 0.5));
      const uBase = uniform(new THREE.Color());
      const uA = uniform(new THREE.Color()); // the ribbon's main light
      const uB = uniform(new THREE.Color()); // the lit band under the edge
      const uC = uniform(new THREE.Color()); // the iridescent shift
      const uRimTint = uniform(0); // how far the edge whitens (dark mode)
      const uSBody = uniform(0.3), uSGlow = uniform(0.3), uSRim = uniform(0.5);
      const uSSpread = uniform(0.4); // the bright sheet fanning out toward the bottom
      const uSheen = uniform(new THREE.Color()); // its pale, iridescent centre
      const uSheenAll = uniform(0); // 1: the whole spread is sheen (light mode)
      const uCap = uniform(1); // brightest luminance the spread may add (dark mode: keeps text AA)
      const uCeil = uniform(1); // brightest luminance anywhere (dark mode: text sits everywhere)

      // A silk ribbon of light (after a flowing-silk reference): a curved
      // edge sweeping from bottom left to top right, swaying slowly, with a
      // soft lit edge (no hard rim lines: those read as a glossy tube), a
      // glow and a lit band beneath it, which spreads into a bright sheet
      // toward the bottom of the screen. It pulses from dim to full and back.
      const shader = Fn(() => {
        const t = uTime;
        const aspect = uAspect;
        const p = vec2(screenUV.x.mul(aspect), screenUV.y); // y runs down
        const u = screenUV.x;
        const lean = uPointer.x.sub(0.5).mul(0.05).add(uPointer.y.sub(0.5).mul(0.03));
        // The edge: an S-curve, swaying and slowly warped by noise.
        const sway = sin(u.mul(3.4).sub(0.6).add(t.mul(0.16))).mul(0.15)
          .add(sin(u.mul(7.0).add(t.mul(0.23))).mul(0.025));
        const warp = mx_noise_float(vec3(p.mul(1.1), t.mul(0.06))).mul(0.05);
        const edge = float(1.08).sub(u.mul(1.18)).add(sway).add(warp).add(lean);
        const d = p.y.sub(edge); // > 0 below the edge, the lit side
        const gauss = (x, w) => exp(x.div(w).mul(x.div(w)).negate());
        const rim = gauss(d.sub(0.012), float(0.028));
        const glow = gauss(d, float(0.07));
        const body = smoothstep(0.0, 0.05, d).mul(gauss(d.sub(0.17), float(0.17)));
        // The spread: under the edge, a sheet of light that widens and
        // brightens toward the bottom of the screen, centred a little right
        // of the middle and fading out to either side.
        const low = smoothstep(0.2, 1.0, screenUV.y);
        const spread = smoothstep(0.0, 0.03, d)
          .mul(exp(d.div(low.mul(0.55).add(0.03)).negate()))
          .mul(gauss(u.sub(0.4).sub(sin(t.mul(0.11)).mul(0.05)), float(0.34)))
          .mul(low);
        // Iridescence: the colour shifts along the ribbon and over time.
        const k = sin(u.mul(5.0).add(t.mul(0.3))).mul(0.5).add(0.5);
        const hue = mix(vec3(uA), vec3(uC), k);
        const rimCol = mix(hue, vec3(1.0, 1.0, 1.0), uRimTint);
        const bodyCol = mix(vec3(uB), hue, smoothstep(0.0, 0.3, d));
        // The pulse: dim to full strength and back, about every 4.5s (t runs
        // SPEED× real time). Full strength is what the contrast audit passed.
        const pulse = sin(t.mul(0.56)).mul(0.5).add(0.5).mul(0.6).add(0.4);
        // Its colour: a pale sheen at the core, the theme hue at its edges.
        const sheenCol = mix(hue, vec3(uSheen), smoothstep(0.15, 0.7, spread).max(uSheenAll));
        let col = mix(vec3(uBase), bodyCol, body.mul(uSBody).mul(pulse));
        // Dark mode's ceiling on the spread: it may brighten a pixel only up
        // to uCap (linear luminance, as WCAG measures it), so text over its
        // brightest spot still meets AA; the ribbon itself is untouched.
        const lumOf = (c) => dot(c, vec3(0.2126, 0.7152, 0.0722));
        const before = lumOf(col);
        const spreadCol = mix(col, sheenCol, spread.mul(uSSpread).mul(pulse));
        const room = uCap.max(before).div(lumOf(spreadCol).max(0.0001));
        col = spreadCol.mul(min(float(1.0), room));
        col = mix(col, hue, glow.mul(uSGlow).mul(pulse));
        col = mix(col, rimCol, rim.mul(uSRim).mul(pulse));
        // And a ceiling on the whole ribbon in dark mode: on every page, text
        // (the footer, ledes, labels) can sit right on its brightest edge.
        return col.mul(min(float(1.0), uCeil.div(lumOf(col).max(0.0001))));
      });

      const material = new THREE.MeshBasicNodeMaterial();
      material.colorNode = shader();
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      const scene = new THREE.Scene();
      scene.add(mesh);
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      // Each theme's ribbon: its main light, the lit band, and the colour the
      // edge shifts toward (Aqua stays in its blues: Laguna to cold blue, no
      // violet; Grove toward teal; Peach toward its periwinkle).
      const RIBBON = {
        aqua: null, // Aqua: the "2 min" tile's cyan (--dl-panel-2), read in palette()
        grove: ["#3E9E68", "#8BE0AE", "#62BFB4"],
        peach: ["#F29A70", "#FFD6C2", "#B7BCFB"],
      };
      const palette = () => {
        const cs = getComputedStyle(root);
        const base = cs.getPropertyValue("--dl-cream").trim();
        const light = root.dataset.dlMode === "light";
        const theme = root.dataset.dlTheme in RIBBON ? root.dataset.dlTheme : "aqua";
        // Aqua's wave is the cyan of its bento tiles, its lit band a paler tint of it.
        const tile = cs.getPropertyValue("--dl-panel-2").trim() || "#3ECBDD";
        const [a, b, c] = RIBBON[theme] || [tile, `color-mix(in srgb, ${tile} 70%, #FFFFFF)`, tile];
        const set = (u, css) => u.value.setRGB(...resolve(css, base), THREE.SRGBColorSpace);
        set(uBase, base); set(uA, a); set(uB, b); set(uC, c);
        set(uSheen, light ? b : `color-mix(in srgb, ${b} 70%, #FFFFFF)`);
        // Dark mode: a quieter ribbon with a whitened edge (it reads as light);
        // light mode: stronger colour, no whitening (it would vanish on white).
        uRimTint.value = light ? 0 : 0.15;
        uSBody.value = light ? 0.5 : 0.2;
        uSGlow.value = light ? 0.4 : 0.18;
        uSRim.value = light ? 0.8 : 0.42;
        uSSpread.value = light ? 0.8 : 0.6;
        uSheenAll.value = light ? 1 : 0;
        uCap.value = light ? 1 : 0.05;
        uCeil.value = light ? 1 : 0.085;
      };

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        uAspect.value = window.innerWidth / window.innerHeight;
      };

      let tx = 0.5, ty = 0.5;
      const onMove = (e) => { tx = e.clientX / window.innerWidth; ty = e.clientY / window.innerHeight; };

      let frame = 0, last = 0, clock = 0, prev = performance.now();
      const loop = (now) => {
        frame = requestAnimationFrame(loop);
        if (document.hidden || now - last < 1000 / FPS - 2) return;
        const dt = Math.min((now - prev) / 1000, 0.1);
        prev = now; last = now;
        clock += dt * SPEED;
        uTime.value = clock;
        uPointer.value.x += (tx - uPointer.value.x) * Math.min(1, dt * 1.5);
        uPointer.value.y += (ty - uPointer.value.y) * Math.min(1, dt * 1.5);
        renderer.render(scene, camera);
      };

      palette();
      resize();
      renderer.render(scene, camera); // first frame before the static background steps aside
      root.classList.add("has-ambient");
      root.dataset.ambient = renderer.backend?.isWebGPUBackend ? "webgpu" : "webgl2"; // which backend is drawing
      frame = requestAnimationFrame(loop);

      const mo = new MutationObserver(() => requestAnimationFrame(palette));
      mo.observe(root, { attributes: true, attributeFilter: ["data-dl-theme", "data-dl-mode"] });
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", onMove, { passive: true });

      cleanup = () => {
        cancelAnimationFrame(frame);
        mo.disconnect();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
        root.classList.remove("has-ambient");
        delete root.dataset.ambient;
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, []);

  return <canvas ref={ref} className="dl-ambient-canvas" aria-hidden="true" />;
}
