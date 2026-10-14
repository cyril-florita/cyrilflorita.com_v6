"use client";
import { useEffect, useRef } from "react";
import { PRODUCTS } from "./data";
import { buildPill } from "./pillModels";
import { introState } from "./introFall";

// The landing page's product story, in real 3D (three.js, WebGL), on one
// transparent canvas fixed over the viewport (pointer-events: none):
//
// 1. Hero: the Viteo carton (artwork printed on its faces) with the nine
//    pills around it, at the CSS layout's positions (BURST in page.js). It
//    follows the pointer (--px/--py from HeroParallax.js) and, while the hero
//    is hovered, every piece spins slowly.
// 2. Scroll: the carton turns and its lid opens; each pill lifts off and
//    flies, following the page, into its "dock": a slot in a How it works
//    step (three of them stop there first), then its Ingredients card. Each
//    leg's progress comes from where its dock sits in the viewport, so the
//    story runs forwards and backwards with the scroll.
// 3. Hand-off: once a pill reaches a dock, the 3D pill hides and the dock's
//    own <Pill> image (baked from the same model and pose) shows in its
//    place — so docked pills cost nothing and their CSS hover effects work.
//
// World units are CSS px on the z = 0 plane (origin at the viewport centre,
// y up), so DOM rects map straight into the scene. Desktop with a mouse
// only; on touch, under reduced motion or without WebGL the page keeps its
// CSS hero and the docks keep their images. Renders on demand (scroll,
// pointer, hover spin), never at rest. three.js is loaded on demand.

const FOV = 14; // low, for a gentle perspective close to the flat images
const PILL_BOOST = 1.3; // hero pills a size up from the BURST scales
const LG = 1.35; // .dl-pill-lg scale: the docked pill images' size
// The baked images' pose (scripts/render-pills.html), so 3D and image match.
const POSE = { capsule: [-0.32, 0.22], softgel: [-0.38, 0.18], tablet: [-0.35, 0.15], oblong: [-0.4, 0.2] };
// Carton footprint in the .dl-product square (as the CSS box).
const BOX = { left: 0.15, top: -0.07, w: 0.47, h: 0.86, d: 0.15 };

const mix = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
};
const rgbToHex = (rgb) => {
  const m = rgb.match(/\d+(\.\d+)?/g);
  return m ? `#${m.slice(0, 3).map((v) => Math.round(+v).toString(16).padStart(2, "0")).join("")}` : "#7de2df";
};
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

export default function ProductStory({ burst }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const product = document.querySelector(".dl-bento-hero .dl-product");
    const hero = product?.closest(".dl-bento-hero");
    const root = canvas?.closest(".dl");
    if (!canvas || !product || !hero || !root) return;
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
        // No WebGL: keep the CSS version (and don't keep the preloader waiting).
        window.__dl3dReady = true;
        window.dispatchEvent(new Event("dl:3d-ready"));
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5)); // full-viewport canvas: keep it light
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping; // keeps brand colours true

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      scene.environmentIntensity = 0.5;
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(-4, 6, 8);
      // A soft rim light opposite the key: as the pointer swings the key
      // across, the far edges catch light, which sells the depth.
      const rim = new THREE.DirectionalLight(0xdff4ff, 0.35);
      rim.position.set(5, -3, 3);
      scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));
      const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 100000);

      const disposables = [];
      const keep = (o) => (disposables.push(o), o);
      const rad = THREE.MathUtils.degToRad;

      // ---------- the carton: body + a hinged lid (unit size, scaled per frame) ----------
      const carton = new THREE.Group();
      carton.rotation.order = "YXZ";
      scene.add(carton);
      const lidT = 0.012;
      // Carton paper: more of the studio reflection and a faint glow of its own
      // printed colour (emissiveMap = map), so faces turned from the light stay
      // true instead of going near-black. Box only, so the pills still match
      // their baked images.
      const cartonMat = () => keep(new THREE.MeshPhysicalMaterial({ roughness: 0.68, clearcoat: 0.18, clearcoatRoughness: 0.5, envMapIntensity: 1.8, emissive: 0xffffff, emissiveIntensity: 0.24 }));
      const bodyMats = Array.from({ length: 6 }, () => cartonMat());
      const body = new THREE.Mesh(keep(new RoundedBoxGeometry(BOX.w, BOX.h, BOX.d, 4, 0.006)), bodyMats);
      carton.add(body);
      const hinge = new THREE.Group(); // along the top back edge
      hinge.position.set(0, BOX.h / 2, -BOX.d / 2);
      carton.add(hinge);
      const lidMats = Array.from({ length: 6 }, () => cartonMat());
      const lid = new THREE.Mesh(keep(new RoundedBoxGeometry(BOX.w, lidT, BOX.d, 2, 0.004)), lidMats);
      lid.position.set(0, lidT / 2, BOX.d / 2);
      hinge.add(lid);
      const BASE_ROT = { x: rad(7), y: rad(-26), z: rad(5) };

      // Face artwork, drawn from the page's own fonts and theme colours.
      const paintBox = () => {
        const front = product.querySelector(".dl-box-front");
        const panel = rgbToHex(getComputedStyle(front).backgroundColor);
        const ink = rgbToHex(getComputedStyle(front).color);
        const display = getComputedStyle(product.querySelector(".dl-box-name")).fontFamily;
        const bodyFont = getComputedStyle(product.querySelector(".dl-box-meta")).fontFamily;
        const sideCol = mix(panel, "#000000", 0.1); // lighting does the shading
        const PX = 1400; // texture px per carton unit (crisp at the carton's largest on-screen size, light to upload)
        const tex = (w, h, draw) => {
          const c = document.createElement("canvas");
          c.width = Math.round(w * PX);
          c.height = Math.round(h * PX);
          draw(c.getContext("2d"), c.width, c.height);
          const t = new THREE.CanvasTexture(c);
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = 4;
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
          const u = w / (BOX.w * 10); // px per old world unit (a tenth of the square)
          g.fillStyle = ink;
          g.save();
          g.translate(0.6 * u, 0.6 * u);
          g.rotate(-Math.PI / 2);
          g.font = `800 ${1.9 * u * 0.98}px ${display}`;
          g.textBaseline = "top";
          const tw = g.measureText("viteo").width;
          g.letterSpacing = "-0.04em";
          g.fillText("viteo", -tw - 0.02 * u, 0);
          g.restore();
          // The capsule-"V" mark in the top corner (as on the CSS box).
          const cs = getComputedStyle(front);
          const c1 = cs.getPropertyValue("--dl-logo-1").trim() || "#4FC3D2";
          const c2 = cs.getPropertyValue("--dl-logo-2").trim() || "#1F7F8E";
          const k = (0.9 * u) / 44; // the mark is 0.9 units across
          g.save();
          g.translate(w - 0.45 * u - 44 * k, 0.5 * u);
          g.scale(k, k);
          const cap = (deg, px, fill) => {
            g.save(); g.translate(px, 39); g.rotate((deg * Math.PI) / 180); g.translate(-px, -39);
            g.beginPath(); g.roundRect(px - 6, 1, 12, 38, 6); g.fillStyle = fill; g.fill(); g.restore();
          };
          const grad = g.createLinearGradient(0, 0, 44, 44);
          grad.addColorStop(0, c1); grad.addColorStop(1, c2);
          cap(-24, 21, grad);
          cap(24, 23, ink);
          g.restore();
          g.font = `700 ${0.56 * u}px ${display}`;
          g.textBaseline = "alphabetic";
          g.fillText(product.querySelector(".dl-box-name").textContent, 0.55 * u, h - 0.95 * u);
          g.globalAlpha = 0.7;
          g.font = `600 ${0.26 * u}px ${bodyFont}`;
          g.letterSpacing = "0.08em";
          g.fillText(product.querySelector(".dl-box-meta").textContent.toUpperCase(), 0.57 * u, h - 0.55 * u);
          g.globalAlpha = 1;
        });
        const sideTex = tex(BOX.d, BOX.h, (g, w, h) => {
          const grad = g.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, mix(panel, "#000000", 0.06));
          grad.addColorStop(1, mix(panel, "#000000", 0.14));
          g.fillStyle = grad;
          g.fillRect(0, 0, w, h);
          g.save();
          g.translate(w / 2, h / 2);
          g.rotate(Math.PI / 2);
          g.fillStyle = mix(panel, "#ffffff", 0.65);
          g.font = `700 ${0.24 * (w / (BOX.d * 10))}px ${bodyFont}`;
          g.letterSpacing = "0.16em";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText("PERSONALIZED DAILY VITAMINS", 0, 0);
          g.restore();
        });
        const plain = (col) => tex(0.01, 0.01, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); });
        const top = mix(panel, "#ffffff", 0.32);
        const inside = mix(panel, "#000000", 0.38); // seen once the lid opens
        // Box face order: +x, -x, +y, -y, +z, -z.
        const set = (mats, maps) => mats.forEach((m, i) => { m.map = maps[i]; m.emissiveMap = maps[i]; m.needsUpdate = true; });
        set(bodyMats, [sideTex, plain(sideCol), plain(inside), plain(mix(panel, "#000000", 0.16)), frontTex, plain(sideCol)]);
        set(lidMats, [plain(sideCol), plain(sideCol), plain(top), plain(inside), plain(mix(panel, "#000000", 0.06)), plain(sideCol)]);
        need();
      };

      // ---------- the pills ----------
      // Docks: three pills stop in a How it works step first, then all nine
      // settle into their Ingredients cards.
      const dockEls = (id) => [...document.querySelectorAll(`[data-story-pill="${id}"]`)];
      const pills = [];
      burst.forEach(([id, xPct, yPct, scale, tilt], i) => {
        const p = PRODUCTS[id];
        if (!p) return;
        const outer = new THREE.Group(); // position, screen-plane tilt, scale
        const pose = new THREE.Group(); // 3D attitude
        const { inner, spinAxis } = buildPill(THREE, p, 1, keep);
        pose.add(inner);
        outer.add(pose);
        scene.add(outer);
        const kind = p.shape === "oblong" ? "oblong" : p.form;
        pills.push({
          id, outer, pose, inner, spinAxis, form: p.form,
          baseSpin: inner.rotation[spinAxis], spinAngle: 0,
          hero: { x: xPct / 100, y: yPct / 100, scale: scale * PILL_BOOST, tilt: rad(-tilt), rx: rad(((i * 37) % 50) - 25), ry: rad(((i * 53) % 40) - 20), z: (scale - 1.2) * 90 },
          dockPose: POSE[kind],
          docks: dockEls(id),
          phase: i * 0.7, rate: 0.35 + ((i * 29) % 10) / 30, col: i % 3,
          // Parallax depth around the box (the BURST scale: 1.45 ≈ the box's
          // plane): near pills travel with the pointer, far ones against it,
          // and near ones react faster, so the scene ripples when it stops.
          depth: scale - 1.45, lag: { x: 0, y: 0 }, lagRate: Math.max(3.5, 8 + (scale - 1.45) * 30),
        });
      });

      // ---------- frame ----------
      let vw = 0, vh = 0;
      const resize = () => {
        vw = document.documentElement.clientWidth;
        vh = window.innerHeight;
        renderer.setSize(vw, vh, false);
        canvas.style.width = `${vw}px`;
        canvas.style.height = `${vh}px`;
        camera.aspect = vw / vh;
        camera.position.set(0, 0, vh / 2 / Math.tan(rad(FOV / 2)));
        camera.near = camera.position.z / 20;
        camera.far = camera.position.z * 3;
        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);
        need();
      };
      const toWorld = (cx, cy) => [cx - vw / 2, vh / 2 - cy];
      // A dock's pose: its <Pill>'s centre, the image's size and tilt.
      const dockPose = (el) => {
        const pill = el.querySelector(".dl-pill");
        const r = pill.getBoundingClientRect();
        const tilt = parseFloat(pill.style.getPropertyValue("--tilt")) || 0;
        const [x, y] = toWorld(r.left + r.width / 2, r.top + r.height / 2);
        // Its grid column (for a left-to-right stagger).
        const li = el.closest("li");
        const idx = li ? [...li.parentElement.children].indexOf(li) : 0;
        const col = idx % 3;
        // Ingredients docks key off the section heading instead, so every pill
        // has landed by the time "Ingredients" reaches the top of the screen.
        let t;
        if (el.closest("#ingredients")) {
          const head = (ingHead ||= document.querySelector("#ingredients .dl-bigword-head"));
          const g = clamp01((vh * 0.95 - head.getBoundingClientRect().top) / (vh * 0.95));
          t = smooth(clamp01((g - idx * 0.045) / 0.58));
        }
        return { x, y, z: 0, scale: LG * (parseFloat(el.dataset.storyScale) || 1), tilt: rad(-tilt), cy: r.top + r.height / 2, col, t };
      };
      let ingHead = null;
      // A leg's progress: 0 while its dock is below the fold, 1 once the dock
      // has risen to about mid-screen; grid columns stagger a little.
      const legT = (cy, col) => smooth(clamp01((vh * 1.02 - cy - col * vh * 0.05) / (vh * 0.48)));

      const cartonLag = { x: 0, y: 0 };
      // Eases a lag toward the pointer; returns whether it's still catching up.
      const follow = (o, px, py, rate, dt) => {
        const k = Math.min(1, dt * rate);
        o.x += (px - o.x) * k;
        o.y += (py - o.y) * k;
        return Math.abs(px - o.x) > 0.001 || Math.abs(py - o.y) > 0.001;
      };
      let lagging = false;
      let hovered = false, spin = 0, frame = 0, last = performance.now(), time = 0, shown = false, settleUntil = 0;
      // The intro (IntroMoment.js, a GSAP timeline) writes each object's fall
      // into introState: p = progress (0 before it starts), drop = remaining
      // fall (fraction of the product width), turn = remaining spin (degrees).
      const NO_FALL = { p: 1, drop: 0, turn: 0 };
      const introFall = (s) => (introState.active && s ? { p: s.p, drop: s.drop, turn: rad(s.turn) } : NO_FALL);
      const need = () => { if (!frame && !disposed) { last = performance.now(); frame = requestAnimationFrame(loop); } };
      const loop = (now) => {
        frame = 0;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        time += dt;
        spin += ((hovered ? 1 : 0) - spin) * Math.min(1, dt * 2.5);
        const px = parseFloat(product.style.getPropertyValue("--px")) || 0;
        const py = parseFloat(product.style.getPropertyValue("--py")) || 0;
        // The key light follows the pointer, the same "desk lamp" as the
        // hero's CSS light, so highlights and shading agree.
        key.position.set(-4 + px * 14, 6 - py * 10, 8);
        rim.position.set(5 - px * 10, -3 + py * 6, 3);
        lagging = follow(cartonLag, px, py, 9, dt);
        const pr = product.getBoundingClientRect();
        const S = pr.width;
        const hr = hero.getBoundingClientRect();
        // How far the hero has scrolled away: drives the lid and the turn.
        const away = clamp01(-hr.top / (hr.height * 0.55));
        const heroOn = pr.bottom > -S * 0.3 && pr.top < vh + S * 0.3;
        const cFall = introFall(introState.carton);

        // Carton
        carton.visible = heroOn && cFall.p > 0;
        if (heroOn) {
          const [cx, cy] = toWorld(pr.left + (BOX.left + BOX.w / 2) * S, pr.top + (BOX.top + BOX.h / 2) * S);
          // While it tips and opens, the carton lags behind the scroll (up to
          // half its height) so its top, and the open lid, stay in view.
          const lag = Math.min(-hr.top, S * 0.5) * (1 - smooth(clamp01((away - 0.75) * 4)));
          const cpx = cartonLag.x, cpy = cartonLag.y;
          carton.position.set(cx + cpx * 0.02 * S, cy - cpy * 0.02 * S - Math.max(0, lag) + cFall.drop * S, 0);
          carton.scale.setScalar(S);
          const tilt = smooth(clamp01(away * 2.2)); // fully tipped after a short scroll
          carton.rotation.set(
            // Scrolling away tips the top toward the viewer (about 45°) so you
            // look down into the carton as its lid opens; it squares up a bit too.
            BASE_ROT.x + cpy * rad(14) + spin * Math.sin(time * 0.5) * 0.05 + tilt * rad(45),
            BASE_ROT.y + cpx * rad(22) + spin * Math.sin(time * 0.35) * 0.16 + tilt * rad(14),
            // …and leans about 45° sideways, toward the pills, as if pouring.
            BASE_ROT.z - tilt * rad(45),
          );
          hinge.rotation.x = -smooth(clamp01((away - 0.12) * 2.4)) * 1.95; // opens just behind the tilt
        }

        // Pills
        pills.forEach((pl, i) => {
          const h = pl.hero;
          const fall = introFall(introState.pills[i]);
          if (follow(pl.lag, px, py, pl.lagRate, dt)) lagging = true;
          const travel = (0.02 + pl.depth * 0.22) * S; // with the box, plus depth either way
          const heroPose = {
            x: toWorld(pr.left + h.x * S, 0)[0] + pl.lag.x * travel,
            y: toWorld(0, pr.top + h.y * S)[1] - pl.lag.y * travel + smooth(clamp01(away * 1.6)) * 40 + fall.drop * S,
            // Lifted forward as the carton tips toward the viewer, so they stay in front of it.
            z: h.z * (S / 560) + smooth(clamp01(away * 2.2)) * S * 0.6,
            scale: h.scale * (S / 560),
            tilt: h.tilt - fall.turn,
            // …and each turns toward the pointer, like the box.
            rx: h.rx + pl.lag.y * 0.35 + spin * Math.sin(time * 0.6 + pl.phase) * 0.18,
            ry: h.ry + pl.lag.x * 0.5 + spin * Math.cos(time * 0.5 + pl.phase) * 0.22,
          };
          const poses = [heroPose, ...pl.docks.map((d) => ({ ...dockPose(d), rx: pl.dockPose[0], ry: pl.dockPose[1] }))];
          // Find the current leg: the last dock it has started towards.
          let leg = 0, t = 0;
          for (let k = 1; k < poses.length; k++) {
            const tk = poses[k].t ?? legT(poses[k].cy, poses[k].col);
            if (tk > 0) { leg = k; t = tk; } else break;
          }
          const docked = leg > 0 && t >= 1;
          pl.docks.forEach((d, k) => d.classList.toggle("is-docked", docked && k === leg - 1));
          // Hover spin only at home; it unwinds as the pill leaves.
          if (leg === 0) pl.spinAngle += pl.rate * spin * dt * (pl.form === "capsule" ? 1.6 : pl.form === "tablet" ? 1.4 : 1.2);
          const home = leg === 0 ? 1 : leg === 1 ? 1 - t : 0;
          pl.inner.rotation[pl.spinAxis] = pl.baseSpin + pl.spinAngle * home;
          if (leg > 0 && t >= 1) pl.spinAngle = 0;

          const b = leg === 0 ? poses[0] : poses[leg];
          let a = leg === 0 ? poses[0] : poses[leg - 1];
          // A start far above the screen (the hero, long scrolled away) is
          // pulled down to just above the top edge, so the pill drops in.
          if (leg > 0 && a.y > vh / 2 + 90) a = { ...a, y: vh / 2 + 90 };
          const tt = leg === 0 ? 0 : t;
          const arc = Math.sin(Math.PI * tt);
          pl.outer.visible = !docked && (leg > 0 || (heroOn && fall.p > 0));
          const sway = (b.col ?? pl.col) - 1;
          pl.outer.position.set(lerp(a.x, b.x, tt) + arc * sway * 60, lerp(a.y, b.y, tt) + arc * 40, lerp(a.z, b.z, tt) + arc * 260);
          pl.outer.scale.setScalar(lerp(a.scale, b.scale, tt) * (1 + arc * 0.25));
          pl.outer.rotation.z = lerp(a.tilt, b.tilt, tt) + arc * sway * 0.6;
          pl.pose.rotation.set(lerp(a.rx, b.rx, tt) + arc * 1.2, lerp(a.ry, b.ry, tt) + arc * 0.8, 0);
        });

        const anything = carton.visible || pills.some((p) => p.outer.visible);
        canvas.style.visibility = anything ? "visible" : "hidden";
        if (anything) renderer.render(scene, camera);
        if (!shown) {
          shown = true;
          product.classList.add("is-3d"); // the CSS hero steps aside only now
          root.classList.add("is-story"); // docks hide their images until a pill lands
        }
        // Positions only change with scroll, pointer or hover, so idle = no frames.
        const busy = hovered || spin > 0.002 || lagging || now < settleUntil || introState.active;
        if (busy && !document.hidden) frame = requestAnimationFrame(loop);
      };

      // Wake-ups: scroll (and a short tail, for smooth scrolling and the
      // cards' reveal animation), pointer and hover, resize, theme changes.
      const wake = (ms = 900) => { settleUntil = performance.now() + ms; need(); };
      const onScroll = () => wake();
      const onWake = (e) => wake(e.detail?.ms ?? 900); // e.g. the intro (IntroMoment.js)
      window.addEventListener("dl:wake", onWake);
      const onEnter = () => { hovered = true; wake(); };
      const onLeave = () => { hovered = false; wake(1500); };
      const onMove = () => wake(600);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", resize);
      hero.addEventListener("pointerenter", onEnter);
      hero.addEventListener("pointerleave", onLeave);
      hero.addEventListener("pointermove", onMove);
      const onVis = () => !document.hidden && wake();
      document.addEventListener("visibilitychange", onVis);
      const mo = new MutationObserver(() => requestAnimationFrame(paintBox));
      mo.observe(root, { attributes: true, attributeFilter: ["data-dl-theme", "data-dl-mode"] });

      resize();
      paintBox();
      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("dl:wake", onWake);
        window.removeEventListener("resize", resize);
        hero.removeEventListener("pointerenter", onEnter);
        hero.removeEventListener("pointerleave", onLeave);
        hero.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        mo.disconnect();
        product.classList.remove("is-3d");
        root.classList.remove("is-story");
        document.querySelectorAll("[data-story-pill].is-docked").forEach((d) => d.classList.remove("is-docked"));
        disposables.forEach((d) => d.dispose?.());
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        window.__dl3dReady = false;
      };

      // Warm up before anything animates: compile every shader and upload
      // every texture now, under the landing preloader, so the intro's first
      // frames don't stall on them. Then tell the preloader (IntroMoment.js).
      try { await renderer.compileAsync(scene, camera); } catch { /* compiles on first render instead */ }
      if (disposed) return;
      scene.traverse((o) => {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
          ["map", "emissiveMap", "bumpMap"].forEach((k) => m?.[k] && renderer.initTexture(m[k]));
        });
      });
      window.__dl3dReady = true;
      window.dispatchEvent(new Event("dl:3d-ready"));
      wake(1200); // first frames only now, with everything already on the GPU
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [burst]);

  return <canvas ref={canvasRef} className="dl-story-canvas" aria-hidden="true" />;
}
