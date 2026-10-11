"use client";
import { useEffect, useRef } from "react";
import { PRODUCTS } from "./data";
import { buildPill } from "./pillModels";

// Landing hero product shot in real 3D (three.js, WebGL): the Viteo carton
// with its artwork printed on the faces, and the nine pills as lit geometry
// (two-part capsules, glossy softgels, bevelled tablets with a score line),
// placed where the CSS version puts them (BURST in app/lab/viteo/page.js).
// It follows the same pointer parallax (--px/--py from HeroParallax.js), and
// while the hero is hovered every piece spins slowly. Desktop with a mouse
// only: on touch, under reduced motion or without WebGL the CSS box and
// pills stay (they're hidden only once the 3D frame is drawn). three.js is
// loaded on demand, so phones never download it.
//
// Units: the .dl-product square is 10 world units wide; the canvas overhangs
// it by OVER on every side so pills and the box top aren't clipped (its
// bottom edge is cut back in CSS so it never overlaps the cards below).

const OVER = 0.15; // canvas overhang, as a fraction of the container
const WORLD = 10; // container width in world units
const REF = 56; // CSS px per world unit at the reference 560px container
const FOV = 22;
const PILL_BOOST = 1.3; // 3D pills a size up from the BURST scales

const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
};
const rgbToHex = (rgb) => {
  const m = rgb.match(/\d+(\.\d+)?/g);
  return m ? `#${m.slice(0, 3).map((v) => Math.round(+v).toString(16).padStart(2, "0")).join("")}` : "#a6e0e8";
};

export default function ProductScene({ burst }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const product = canvas?.closest(".dl-product");
    const hero = canvas?.closest(".dl-bento-hero");
    if (!canvas || !product || !hero) return;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)");
    if (!desktop.matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
      await document.fonts?.ready;
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: keep the CSS version
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      // Neutral tone mapping keeps the brand and pill colors true (ACES washed them out).
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 1;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.5;
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(-4, 6, 8);
      scene.add(key, new THREE.AmbientLight(0xffffff, 0.15));

      const span = WORLD * (1 + 2 * OVER);
      const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 200);
      camera.position.set(0, 0, span / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
      camera.lookAt(0, 0, 0);

      const toWorld = (xPct, yPct) => [(xPct / 100 - 0.5) * WORLD, (0.5 - yPct / 100) * WORLD];
      const disposables = [];
      const keep = (o) => (disposables.push(o), o);

      // ---------- the carton ----------
      // Same footprint as the CSS box: left 15%, top -7%, 47% × 86%, depth 15%.
      const BOX = { w: 4.7, h: 8.6, d: 1.5 };
      const [bx, by] = toWorld(15 + 47 / 2, -7 + 86 / 2);
      const boxPivot = new THREE.Group();
      boxPivot.position.set(bx, by, 0);
      scene.add(boxPivot);
      const boxGeo = keep(new RoundedBoxGeometry(BOX.w, BOX.h, BOX.d, 4, 0.06));
      const boxMats = Array.from({ length: 6 }, () => keep(new THREE.MeshPhysicalMaterial({ roughness: 0.72, clearcoat: 0.18, clearcoatRoughness: 0.5 })));
      const box = new THREE.Mesh(boxGeo, boxMats);
      box.rotation.order = "YXZ";
      boxPivot.add(box);
      const BASE_ROT = { x: THREE.MathUtils.degToRad(7), y: THREE.MathUtils.degToRad(-26), z: THREE.MathUtils.degToRad(5) };

      // Face artwork, drawn from the page's own fonts and theme colors.
      const paintBox = () => {
        const front = product.querySelector(".dl-box-front");
        const panel = rgbToHex(getComputedStyle(front).backgroundColor);
        const ink = rgbToHex(getComputedStyle(front).color);
        const display = getComputedStyle(product.querySelector(".dl-box-name")).fontFamily;
        const body = getComputedStyle(product.querySelector(".dl-box-meta")).fontFamily;
        const sideCol = mix(panel, "#000000", 0.36);
        const PX = 220; // texture px per world unit

        const tex = (w, h, draw) => {
          const c = document.createElement("canvas");
          c.width = Math.round(w * PX);
          c.height = Math.round(h * PX);
          draw(c.getContext("2d"), c.width, c.height);
          const t = new THREE.CanvasTexture(c);
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 8;
          return keep(t);
        };
        const frontTex = tex(BOX.w, BOX.h, (g, w, h) => {
          g.fillStyle = panel;
          g.fillRect(0, 0, w, h);
          const sheen = g.createLinearGradient(0, 0, w, h * 0.55);
          sheen.addColorStop(0, "rgba(255,255,255,0.42)");
          sheen.addColorStop(0.4, "rgba(255,255,255,0)");
          sheen.addColorStop(1, "rgba(0,0,0,0.08)");
          g.fillStyle = sheen;
          g.fillRect(0, 0, w, h);
          const u = w / BOX.w; // px per world unit
          g.fillStyle = ink;
          // VITEO, set vertically and reading upward (like writing-mode + 180°).
          g.save();
          g.translate(0.6 * u, 0.6 * u);
          g.rotate(-Math.PI / 2);
          g.font = `800 ${1.9 * u * 0.98}px ${display}`;
          g.textBaseline = "top";
          const word = "VITEO";
          const tw = g.measureText(word).width;
          g.letterSpacing = "-0.04em";
          g.fillText(word, -tw - 0.02 * u, 0);
          g.restore();
          g.font = `700 ${0.56 * u}px ${display}`;
          g.textBaseline = "alphabetic";
          g.fillText(product.querySelector(".dl-box-name").textContent, 0.55 * u, h - 0.95 * u);
          g.globalAlpha = 0.7;
          g.font = `600 ${0.26 * u}px ${body}`;
          g.letterSpacing = "0.08em";
          g.fillText(product.querySelector(".dl-box-meta").textContent.toUpperCase(), 0.57 * u, h - 0.55 * u);
          g.globalAlpha = 1;
        });
        const sideTex = tex(BOX.d, BOX.h, (g, w, h) => {
          const grad = g.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, mix(panel, "#000000", 0.3));
          grad.addColorStop(1, mix(panel, "#000000", 0.42));
          g.fillStyle = grad;
          g.fillRect(0, 0, w, h);
          g.save();
          g.translate(w / 2, h / 2);
          g.rotate(Math.PI / 2);
          g.fillStyle = mix(panel, "#ffffff", 0.65);
          g.font = `700 ${0.24 * (w / BOX.d)}px ${body}`;
          g.letterSpacing = "0.16em";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText("PERSONALIZED DAILY VITAMINS", 0, 0);
          g.restore();
        });
        const plain = (col) => tex(1, 1, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); });
        // BoxGeometry face order: +x, -x, +y, -y, +z, -z.
        const maps = [sideTex, plain(sideCol), plain(mix(panel, "#ffffff", 0.32)), plain(mix(panel, "#000000", 0.5)), frontTex, plain(sideCol)];
        boxMats.forEach((m, i) => {
          m.map?.dispose();
          m.map = maps[i];
          m.needsUpdate = true;
        });
      };
      paintBox();

      // ---------- the pills ----------
      const pills = [];
      burst.forEach(([id, xPct, yPct, scale, tilt], i) => {
        const p = PRODUCTS[id];
        if (!p) return;
        const g = new THREE.Group();
        // Shared model (pillModels.js); CSS px at this scale → world units.
        const { inner, spinAxis } = buildPill(THREE, p, (scale * PILL_BOOST) / REF, keep);
        g.add(inner);
        const [x, y] = toWorld(xPct, yPct);
        g.position.set(x, y, 1.6 + (scale - 1.3) * 1.2); // bigger pills sit nearer
        g.rotation.z = THREE.MathUtils.degToRad(-tilt);
        // A little 3D attitude so each reads as an object, not a sticker.
        g.rotation.x = THREE.MathUtils.degToRad(((i * 37) % 50) - 25);
        g.rotation.y = THREE.MathUtils.degToRad(((i * 53) % 40) - 20);
        scene.add(g);
        pills.push({ g, inner, spinAxis, base: { x, y, rx: g.rotation.x, ry: g.rotation.y }, s: scale, form: p.form, phase: i * 0.7, rate: 0.35 + ((i * 29) % 10) / 30 });
      });

      // ---------- size, loop, state ----------
      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      let hovered = false, spin = 0, visible = true, frame = 0, last = performance.now(), time = 0, shown = false;
      // Render on demand: frames only while hovered, while the spin eases out,
      // or while the parallax is still settling. At rest nothing redraws, so
      // the glass cards below aren't re-blurred every frame (that flickered).
      let lastPx = 0, lastPy = 0;
      const onEnter = () => { hovered = true; start(); };
      const onLeave = () => { hovered = false; start(); };
      const onMove = () => start();
      hero.addEventListener("pointerenter", onEnter);
      hero.addEventListener("pointerleave", onLeave);
      hero.addEventListener("pointermove", onMove);

      const loop = (now) => {
        frame = 0;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        time += dt;
        spin += ((hovered ? 1 : 0) - spin) * Math.min(1, dt * 2.5); // ease the spin in and out
        const px = parseFloat(product.style.getPropertyValue("--px")) || 0;
        const py = parseFloat(product.style.getPropertyValue("--py")) || 0;

        // Carton: parallax shift, turn toward the pointer, slow sway while hovered.
        boxPivot.position.set(bx + px * 0.14, by - py * 0.14, 0);
        box.rotation.set(
          BASE_ROT.x + py * THREE.MathUtils.degToRad(6) + spin * Math.sin(time * 0.5) * 0.05,
          BASE_ROT.y + px * THREE.MathUtils.degToRad(9) + spin * Math.sin(time * 0.35) * 0.16,
          BASE_ROT.z,
        );

        pills.forEach((pl) => {
          pl.g.position.x = pl.base.x + px * pl.s * 0.26;
          pl.g.position.y = pl.base.y - py * pl.s * 0.26;
          // Hovered: each pill turns slowly about its own axis, with a gentle tumble.
          const r = pl.rate * spin * dt;
          pl.inner.rotation[pl.spinAxis] += r * (pl.form === "capsule" ? 1.6 : pl.form === "tablet" ? 1.4 : 1.2);
          pl.g.rotation.x = pl.base.rx + spin * Math.sin(time * 0.6 + pl.phase) * 0.18;
          pl.g.rotation.y = pl.base.ry + spin * Math.cos(time * 0.5 + pl.phase) * 0.22;
        });

        renderer.render(scene, camera);
        if (!shown) {
          shown = true;
          product.classList.add("is-3d"); // hide the CSS box/pills only once the 3D frame exists
        }
        const moving = Math.abs(px - lastPx) > 0.0005 || Math.abs(py - lastPy) > 0.0005;
        lastPx = px;
        lastPy = py;
        const busy = hovered || spin > 0.002 || moving;
        if (busy && visible && !document.hidden) frame = requestAnimationFrame(loop);
      };
      const start = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(loop); } };
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
      io.observe(canvas);
      const onVis = () => !document.hidden && visible && start();
      document.addEventListener("visibilitychange", onVis);

      // Re-print the carton when the theme or mode changes.
      const root = canvas.closest(".dl");
      const mo = new MutationObserver(() => requestAnimationFrame(paintBox));
      if (root) mo.observe(root, { attributes: true, attributeFilter: ["data-dl-theme", "data-dl-mode"] });

      start();
      cleanup = () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        io.disconnect();
        mo.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        hero.removeEventListener("pointerenter", onEnter);
        hero.removeEventListener("pointerleave", onLeave);
        hero.removeEventListener("pointermove", onMove);
        product.classList.remove("is-3d");
        disposables.forEach((d) => d.dispose?.());
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [burst]);

  return <canvas ref={canvasRef} className="dl-product-3d" aria-hidden="true" />;
}
