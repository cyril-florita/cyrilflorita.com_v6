"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// The pitch's interactive stage: one WebGL canvas (three.js, loaded on demand)
// behind the page's text. The car (public/pitch/mustang/car.glb, built by
// scripts/mustang/build_car.py in Blender) turns a full 360 degrees when
// dragged, leans a little toward the pointer, and is drawn four times a frame:
// the main view plus three "windows" (the tiles), each a fixed camera riding
// on the car — the rear, the cockpit and the headlights. Choosing a window
// flies the main camera to that feature. It renders only while something is
// moving. Without WebGL the stage keeps its still image.

export const FEATURES = [
  { id: "rear", kicker: "01", ar: 1.3, slant: 7, label: "Tri-bar taillights", say: "Rear view: the tri-bar taillights." },
  { id: "cockpit", kicker: "02", ar: 1.3, slant: 7, label: "Driver's cockpit", say: "Inside: the driver's cockpit." },
  { id: "lights", kicker: "03", ar: 1.3, slant: 7, label: "LED headlights", say: "Front view: the tri-bar LED headlights." },
];

export const PAINTS = [
  { id: "storm", name: "Storm Blue", hex: "#2b3d56" },
  { id: "signal", name: "Signal Red", hex: "#8f1010" },
  { id: "arctic", name: "Arctic White", hex: "#d9dde2" },
  { id: "carbon", name: "Carbon Black", hex: "#0b0c0e" },
  { id: "volt", name: "Volt Yellow", hex: "#d6a500" },
];

// Camera set-ups in the car's own space (x forward, y up, z toward the right side).
const POSES = {
  rear: { pos: [-4.5, 1.2, 2.0], look: [-2.15, 0.84, 0.1], fov: 30, yaw: 2.45 },
  cockpit: { pos: [-0.27, 1.13, -0.36], look: [0.7, 0.96, -0.2], fov: 72, yaw: -0.6 },
  lights: { pos: [4.0, 0.86, 1.75], look: [2.3, 0.68, 0.5], fov: 28, yaw: -1.0 },
};
const FULL = { pos: [0, 1.55, 9.6], look: [0, 0.56, 0], fov: 31 };
const FULL_TILE = { ar: 2.4, slant: 7, fov: 17 };   // the "Full view" window shown under the others while a feature is open
const START_YAW = -0.62;

// One window: the slot the 3D view is drawn into, its outline and hover glow
// (SVG at the window's real pixel size), and its label.
// Phones: the paint choice as a dropdown at the top right — a glass pill with
// the current swatch and name, opening a listbox of the five paints (arrow
// keys, Home/End, Enter/Space; Esc or a tap outside closes it).
function PaintMenu({ paint, onPick }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null), btn = useRef(null), list = useRef(null);
  const cur = PAINTS.find((p) => p.id === paint);
  useEffect(() => {
    if (!open) return;
    list.current?.querySelector('[aria-selected="true"]')?.focus();
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const choose = (p) => { onPick(p); setOpen(false); btn.current?.focus(); };
  const onListKey = (e) => {
    const items = [...list.current.querySelectorAll('[role="option"]')], i = items.indexOf(document.activeElement), n = items.length;
    const j = { ArrowDown: (i + 1) % n, ArrowUp: (i + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (j !== undefined) { e.preventDefault(); items[j].focus(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); items[i]?.click(); }
    else if (e.key === "Tab") setOpen(false);
  };
  return (
    <div className="ms-paint-menu" ref={wrap} data-open={open || undefined}>
      <button ref={btn} type="button" className="ms-paint-menu-btn" aria-haspopup="listbox" aria-expanded={open}
        aria-label={`Paint color: ${cur.name}`} onClick={() => setOpen((o) => !o)}>
        <span className="ms-paint-dot" style={{ "--swatch": cur.hex }} />
        <span className="ms-paint-menu-name">{cur.name}</span>
        <span className="ms-chev" aria-hidden="true" />
      </button>
      <ul ref={list} className="ms-paint-menu-list" role="listbox" aria-label="Paint color" onKeyDown={onListKey}>
        {PAINTS.map((p, i) => (
          <li key={p.id} role="option" aria-selected={p.id === paint} tabIndex={-1} style={{ "--i": i }} onClick={() => choose(p)}>
            <span className="ms-paint-dot" style={{ "--swatch": p.hex }} />{p.name}<span className="ms-check" aria-hidden="true" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tile({ id, ar, slant, kicker, label, pressed, aria, size, onClick, onHover, onWindow }) {
  const [w, h] = size || [100, 100 / ar];
  const pts = `${((w * slant) / 100).toFixed(1)},0.5 ${w - 0.5},0.5 ${w - 0.5},${h - 0.5} 0.5,${h - 0.5}`;
  return (
    <button type="button" className={`ms-tile${id === "full" ? " ms-tile-full" : ""}`} aria-pressed={pressed} aria-label={aria} onClick={onClick}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") onHover(id); }}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(id)} onBlur={() => onHover(null)}
      style={{ "--ar": ar, "--slant": `${slant}%` }}>
      <span className="ms-tile-window" data-id={id} ref={(el) => onWindow(id, el)} aria-hidden="true" />
      <svg className="ms-tile-frame" viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
        <polygon className="ms-frame-line" points={pts} />
        <polygon className="ms-glow ms-glow-wide" points={pts} pathLength="100" />
        <polygon className="ms-glow ms-glow-tail" points={pts} pathLength="100" />
        <polygon className="ms-glow ms-glow-core" points={pts} pathLength="100" />
      </svg>
      {id !== "full" && (
        <span className="ms-tile-open" aria-hidden="true">
          {/* "opens larger": two arrows to opposite corners (phones and tablets; mustang.css) */}
          <svg viewBox="0 0 16 16" focusable="false"><path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" /></svg>
        </span>
      )}
      <span className="ms-tile-label"><span className="ms-tile-kicker" aria-hidden="true">{kicker}</span>{label}</span>
    </button>
  );
}

export default function CarStage({ children }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const viewRef = useRef(null);
  const tileRefs = useRef({});
  const api = useRef(null);
  const [view, setView] = useState("full");
  const [paint, setPaint] = useState(PAINTS[0].id);
  const [state, setState] = useState("loading"); // loading | ready | fallback
  const [said, setSaid] = useState("");
  const tilesRef = useRef(null);
  // Once the car is in and the windows are well in view, a light runs one lap round each window
  // in turn (the hover glow, mustang.css .is-sweep), once per visit; the class comes off after,
  // so the desktop hover glow works again.
  useEffect(() => {
    const ul = tilesRef.current;
    if (state !== "ready" || !ul) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // wait for the preloader to lift and the windows' entrance (≤1.9s after it) to finish
    let t = 0, liftedAt = 0, seen = false, mo = null;
    const pre = document.querySelector(".ms-pre");
    const go = () => {
      if (!seen || (pre && !liftedAt)) return;
      clearTimeout(t);
      t = setTimeout(() => {
        ul.classList.add("is-sweep");
        t = setTimeout(() => ul.classList.remove("is-sweep"), 2700);      // three 1.5s laps, 0.45s apart
      }, Math.max(400, liftedAt + 1900 - performance.now()));
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { seen = true; io.disconnect(); go(); } }, { threshold: 0.6 });
    io.observe(ul);
    if (pre) {
      const check = () => { if (!liftedAt && pre.classList.contains("is-done")) { liftedAt = performance.now(); mo?.disconnect(); go(); } };
      mo = new MutationObserver(check); mo.observe(pre, { attributes: true, attributeFilter: ["class"] }); check();
    }
    return () => { io.disconnect(); mo?.disconnect(); clearTimeout(t); };
  }, [state]);

  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current, viewEl = viewRef.current;
    let disposed = false, cleanup = () => {};
    (async () => {
      let THREE, GLTFLoader, DRACOLoader;
      try {
        THREE = await import("three");
        ({ GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js"));
        ({ DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js"));
      } catch { setState("fallback"); return; }
      if (disposed) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch { setState("fallback"); return; }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      renderer.toneMapping = THREE.NeutralToneMapping;             // keeps the paint's colour (AgX greyed it, ACES clipped highlights)
      renderer.toneMappingExposure = 1.2;
      renderer.autoClear = false;

      const scene = new THREE.Scene();
      // A studio to reflect: a dark room under a soft gradient dome, with long
      // overhead light bars and side softboxes, so the paint picks up showroom lines.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new THREE.Scene();
      room.background = new THREE.Color(0x05080e);
      const strip = (w, h, pos, color, power) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide }));
        m.position.set(...pos); m.lookAt(0, 0.6, 0); room.add(m);
      };
      strip(11, 2.4, [0, 7.5, 0], 0xcfe2ff, 7);
      strip(10, 0.8, [0, 3.4, 8], 0xffffff, 6);
      strip(10, 0.8, [0, 3.0, -8], 0x86b4ff, 5);
      strip(0.8, 5, [9, 2.6, 0], 0xffffff, 4);
      strip(0.8, 5, [-9, 2.6, 0], 0x9cc4ff, 4);
      strip(14, 14, [0, -3, 0], 0x0a1424, 1);
      for (const x of [-2.4, 0, 2.4]) strip(0.35, 9, [x, 6.4, 0], 0xffffff, 9);      // overhead bars
      strip(3.5, 2.2, [6, 2.2, 5], 0xffffff, 5); strip(3.5, 2.2, [-6, 2.2, -5], 0xb8d4ff, 4);   // softboxes
      const dome = new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: "varying vec3 vP; void main(){ float h = clamp(vP.y * 0.5 + 0.5, 0.0, 1.0); gl_FragColor = vec4(mix(vec3(0.006, 0.009, 0.016), vec3(0.16, 0.2, 0.27), pow(h, 2.6)), 1.0); }",
      }));
      room.add(dome);
      const envTarget = pmrem.fromScene(room, 0.03);
      scene.environment = envTarget.texture;
      const key = new THREE.DirectionalLight(0xdfeaff, 1.7);
      key.position.set(3, 6, 5); scene.add(key);
      const rim = new THREE.DirectionalLight(0x8fb8ff, 1.1);
      rim.position.set(-5, 3, -6); scene.add(rim);
      scene.add(new THREE.HemisphereLight(0x9db8e0, 0x0a0f18, 0.55));

      const car = new THREE.Group();
      scene.add(car);
      car.rotation.y = START_YAW;

      // The cockpit display: drawn once to a canvas.
      const sc = document.createElement("canvas"); sc.width = 1024; sc.height = 160;
      const g = sc.getContext("2d");
      const grad = g.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, "#04101f"); grad.addColorStop(0.5, "#082a4a"); grad.addColorStop(1, "#04101f");
      g.fillStyle = grad; g.fillRect(0, 0, 1024, 160);
      g.strokeStyle = "#7fd0ff"; g.lineWidth = 5;
      [150, 380].forEach((cx, i) => {
        g.beginPath(); g.arc(cx, 96, 58, Math.PI * 0.85, Math.PI * (i ? 1.75 : 2.05)); g.stroke();
        g.globalAlpha = 0.25; g.beginPath(); g.arc(cx, 96, 58, Math.PI * 0.85, Math.PI * 2.15); g.stroke(); g.globalAlpha = 1;
      });
      g.fillStyle = "#e8f6ff"; g.font = "600 44px sans-serif"; g.textAlign = "center";
      g.fillText("0", 150, 110); g.fillText("N", 380, 110);
      g.font = "500 15px sans-serif"; g.fillStyle = "#8fc6ee"; g.fillText("MPH", 150, 134); g.fillText("GEAR", 380, 134);
      g.fillStyle = "#0c3a66"; g.fillRect(560, 26, 420, 108);
      g.strokeStyle = "#49a6e8"; g.lineWidth = 3; g.beginPath();
      g.moveTo(580, 110); g.lineTo(690, 70); g.lineTo(780, 92); g.lineTo(960, 44); g.stroke();
      g.fillStyle = "#e8f6ff"; g.font = "600 18px sans-serif"; g.textAlign = "left"; g.fillText("TRACK APPS", 580, 52);
      const screenTex = new THREE.CanvasTexture(sc);
      screenTex.colorSpace = THREE.SRGBColorSpace; screenTex.flipY = false;

      // Metallic flakes for the paint: a tiny random normal map under the clear coat.
      const flakeCanvas = document.createElement("canvas"); flakeCanvas.width = flakeCanvas.height = 256;
      { const g = flakeCanvas.getContext("2d"), img = g.createImageData(256, 256);
        for (let i = 0; i < img.data.length; i += 4) {
          img.data[i] = 128 + (Math.random() - 0.5) * 120; img.data[i + 1] = 128 + (Math.random() - 0.5) * 120; img.data[i + 2] = 255; img.data[i + 3] = 255;
        }
        g.putImageData(img, 0, 0); }
      const flakes = new THREE.CanvasTexture(flakeCanvas);
      flakes.wrapS = flakes.wrapT = THREE.RepeatWrapping; flakes.anisotropy = renderer.capabilities.getMaxAnisotropy();
      // Painted parts get box-projected texture coordinates (metres × 9) for the flake, replacing the
      // model's own, which are laid out for a texture atlas, not for a tiny repeating flake.
      const boxUV = (geo, force) => {
        if ((geo.attributes.uv && !force) || !geo.attributes.normal) return;
        const p = geo.attributes.position, n = geo.attributes.normal, uv = new Float32Array(p.count * 2);
        for (let i = 0; i < p.count; i++) {
          const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
          const [u, v] = ax >= ay && ax >= az ? [p.getZ(i), p.getY(i)] : ay >= az ? [p.getX(i), p.getZ(i)] : [p.getX(i), p.getY(i)];
          uv[i * 2] = u * 9; uv[i * 2 + 1] = v * 9;
        }
        geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      };

      // Honeycomb for the grille (box-projected like the paint's flakes).
      const hexCanvas = document.createElement("canvas"); hexCanvas.width = 96; hexCanvas.height = 166;
      { const g = hexCanvas.getContext("2d"); g.fillStyle = "#0b0c0f"; g.fillRect(0, 0, 96, 166);
        g.strokeStyle = "#3a3f47"; g.lineWidth = 7;
        const hex = (cx, cy, r) => { g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + (i * Math.PI) / 3; g.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); } g.closePath(); g.stroke(); };
        for (const [cx, cy] of [[0, 0], [96, 0], [48, 83], [0, 166], [96, 166]]) hex(cx, cy, 52); }
      const honeycomb = new THREE.CanvasTexture(hexCanvas);
      honeycomb.wrapS = honeycomb.wrapT = THREE.RepeatWrapping; honeycomb.repeat.set(2.4, 1.4); honeycomb.colorSpace = THREE.SRGBColorSpace;

      const mats = {
        Paint: new THREE.MeshPhysicalMaterial({
          color: PAINTS[0].hex, metalness: 0.68, roughness: 0.28, normalMap: flakes, normalScale: new THREE.Vector2(0.14, 0.14),
          clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.45,
        }),
        Glass: new THREE.MeshPhysicalMaterial({ color: 0x0a0e14, metalness: 0.1, roughness: 0.02, clearcoat: 1, clearcoatRoughness: 0, transparent: true, opacity: 0.78, envMapIntensity: 2.2 }),
        Trim: new THREE.MeshStandardMaterial({ color: 0x0a0b0e, roughness: 0.36, metalness: 0.15 }),
        Tire: new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.9, metalness: 0 }),
        Rim: new THREE.MeshStandardMaterial({ color: 0x3c4148, roughness: 0.22, metalness: 1 }),
        Disc: new THREE.MeshStandardMaterial({ color: 0x8a8d92, roughness: 0.4, metalness: 1 }),
        Caliper: new THREE.MeshStandardMaterial({ color: 0x1f4fd6, roughness: 0.4, metalness: 0.2 }),
        Grille: new THREE.MeshStandardMaterial({ map: honeycomb, roughness: 0.45, metalness: 0.35 }),
        Mesh: new THREE.MeshStandardMaterial({ color: 0x6a727c, roughness: 0.42, metalness: 0.45 }),
        Chrome: new THREE.MeshStandardMaterial({ color: 0xdfe3e8, roughness: 0.1, metalness: 1 }),
        Interior: new THREE.MeshStandardMaterial({ color: 0x101217, roughness: 0.75, side: THREE.DoubleSide }),
        LightWhite: new THREE.MeshBasicMaterial({ color: new THREE.Color(0xdcefff).multiplyScalar(2.2), toneMapped: false }),
        LightRed: new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff1a0c).multiplyScalar(1.6), toneMapped: false }),
        Screen: new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }),
      };

      // Soft glows by the lights, and the car's shadow on the floor.
      const blob = (stops, w = 128, h = 128) => {
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const x = c.getContext("2d"), r = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        stops.forEach(([o, col]) => r.addColorStop(o, col));
        x.fillStyle = r; x.fillRect(0, 0, w, h);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
      };
      const glowTex = blob([[0, "rgba(255,255,255,0.9)"], [0.25, "rgba(255,255,255,0.28)"], [1, "rgba(255,255,255,0)"]]);
      const glow = (color, pos, size) => {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 }));
        s.position.set(...pos); s.scale.setScalar(size); car.add(s);
      };
      // (Halos at the lamps were for the earlier hand-built car; the Dark Horse's own lamps read on their own.)
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 3.6),
        new THREE.MeshBasicMaterial({ map: blob([[0, "rgba(0,0,0,0.92)"], [0.55, "rgba(0,0,0,0.6)"], [1, "rgba(0,0,0,0)"]]), transparent: true, depthWrite: false }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.004; car.add(shadow);
      // a tighter, darker contact shadow right under the body, so the car sits on the concrete
      const contact = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 2.4),
        new THREE.MeshBasicMaterial({ map: blob([[0, "rgba(0,0,0,0.85)"], [0.6, "rgba(0,0,0,0.5)"], [1, "rgba(0,0,0,0)"]]), transparent: true, depthWrite: false }));
      contact.rotation.x = -Math.PI / 2; contact.position.y = 0.006; car.add(contact);
      // The floor: dark, grungy concrete after the poster, partly clear by the car
      // so a faint reflection shows (the mirrored car, added on load) beside the two
      // shadows; it turns solid away from the car and fades out before the horizon,
      // with a soft sheen behind the car.
      const floorMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: true,
        uniforms: { uColor: { value: new THREE.Color(0x060a12) }, uSheen: { value: new THREE.Color(0x4a6f9e) } },
        vertexShader: "varying vec2 vP; void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `varying vec2 vP; uniform vec3 uColor; uniform vec3 uSheen;
          float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
          float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
            return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
          float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * vn(p); p = p * 2.03 + 7.1; a *= 0.5; } return v; }
          void main() {
            float r = length(vP * vec2(0.55, 1.0));
            float a = mix(0.72, 0.95, smoothstep(0.4, 2.8, r)) * (1.0 - smoothstep(3.6, 6.2, r));
            float sheen = exp(-pow(length((vP - vec2(0.0, 1.9)) * vec2(0.24, 1.1)), 2.0)) * 0.55
                        + exp(-pow(length(vP * vec2(0.3, 0.6)), 2.0)) * 0.12;
            // grungy wet concrete, after the poster: puddles keep the reflection
            // sharp (clearer), the dry concrete between them is matte, mottled and
            // grainy, with hairline cracks and a few darker stains
            float wet = smoothstep(0.47, 0.6, fbm(vP * 0.55 + 3.0));
            float mott = fbm(vP * 2.2);
            float stain = smoothstep(0.58, 0.75, fbm(vP * 0.9 - 11.0));
            float crack = 1.0 - smoothstep(0.0, 0.018, abs(fbm(vP * 1.3 + 20.0) - 0.5));
            crack *= smoothstep(0.35, 0.65, vn(vP * 0.7 + 40.0)) * (1.0 - wet);
            float grain = h21(floor(gl_FragCoord.xy)) - 0.5;
            vec3 dry = uColor * (0.6 + 1.3 * mott) + vec3(0.03, 0.034, 0.042) * (mott - 0.35);
            vec3 col = mix(dry, uColor * 0.7, wet);
            col *= 1.0 - 0.45 * stain * (1.0 - wet) - 0.6 * crack;
            col += grain * mix(0.026, 0.008, wet);
            col += uSheen * sheen * mix(0.75, 1.25, wet);   // the sheen catches on the wet patches
            a = clamp(a * mix(1.0, 0.86, wet) + (1.0 - wet) * 0.1 * (1.0 - smoothstep(3.6, 6.2, r)), 0.0, 1.0);
            gl_FragColor = vec4(col, a);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      });
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), floorMat);
      floor.rotation.x = -Math.PI / 2; floor.renderOrder = -1; scene.add(floor);
      const cabinLight = new THREE.PointLight(0xb8d4ff, 2.0, 3.4, 1.4);
      cabinLight.position.set(0.1, 1.18, 0); car.add(cabinLight);

      // Cameras: the main one, and one per window riding on the car.
      const main = new THREE.PerspectiveCamera(FULL.fov, 1, 0.05, 80);
      const V = (a) => new THREE.Vector3(...a);
      const tileCams = {};
      for (const [id, p] of Object.entries(POSES)) {
        const c = new THREE.PerspectiveCamera(p.fov, 1, 0.05, 80);
        // Set while the car is unrotated, so the pose is in the car's space.
        const yaw = car.rotation.y; car.rotation.y = 0; car.updateMatrixWorld(true);
        c.position.copy(V(p.pos)); car.add(c); c.lookAt(V(p.look)); car.rotation.y = yaw;
        tileCams[id] = c;
      }

      // The windows are not rectangles: their left edge leans. After a window is
      // drawn, a triangle over the cut corner is cleared back to transparent
      // (zero-blend), so the page shows through exactly like the frame outline.
      const eraseCam = new THREE.OrthographicCamera(0, 1, 1, 0, -1, 1);
      const eraseGeo = new THREE.BufferGeometry();
      eraseGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([0, 1, 0, 1, 1, 0, 0, 0, 0]), 3));
      const eraseMat = new THREE.MeshBasicMaterial({
        transparent: true, depthTest: false, depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
        blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
        blendSrc: THREE.ZeroFactor, blendDst: THREE.ZeroFactor, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.ZeroFactor,
      });
      const eraseMesh = new THREE.Mesh(eraseGeo, eraseMat);
      eraseMesh.frustumCulled = false;
      const eraseScene = new THREE.Scene(); eraseScene.add(eraseMesh);
      // the window's own shape (the square minus that corner), written only to depth
      const maskGeos = {};
      const maskGeo = (k) => maskGeos[k] || (maskGeos[k] = new THREE.BufferGeometry().setAttribute("position",
        new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, k, 1, 0]), 3)));
      const maskMat = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, depthTest: true, depthFunc: THREE.AlwaysDepth, side: THREE.DoubleSide });
      const maskMesh = new THREE.Mesh(maskGeo(0.07), maskMat);
      maskMesh.position.z = 0.99; maskMesh.frustumCulled = false;      // depth ~0 in the erase camera
      const maskScene = new THREE.Scene(); maskScene.add(maskMesh);

      const fullCam = new THREE.PerspectiveCamera(FULL_TILE.fov, 2.4, 0.05, 80);
      fullCam.position.set(...FULL.pos); fullCam.lookAt(...FULL.look);

      // State.
      let yaw = START_YAW, yawVel = 0, yawGoal = null, hoverYaw = 0, lookYaw = 0, lookGoal = 0;
      let mode = "full", px = 0, py = 0, dragging = false, lastX = 0, ready = false, raf = 0, dirtyUntil = 0, last = 0;
      const camPos = V(FULL.pos), camLook = V(FULL.look), goalPos = V(FULL.pos), goalLook = V(FULL.look);
      const reflMats = {};
      const reflect = (m) => {
        const c = m.clone();
        c.onBeforeCompile = (sh) => {
          sh.vertexShader = "varying vec3 vReflP;\n" + sh.vertexShader.replace("#include <project_vertex>",
            "#include <project_vertex>\nvReflP = (modelMatrix * vec4(transformed, 1.0)).xyz;");
          sh.fragmentShader = "varying vec3 vReflP;\n" + sh.fragmentShader.replace("#include <dithering_fragment>",
            "#include <dithering_fragment>\ngl_FragColor.rgb *= 0.42 * smoothstep(-0.42, -0.02, vReflP.y) * (1.0 - smoothstep(0.6, 1.9, vReflP.z));");
        };
        c.customProgramCacheKey = () => "refl";
        return c;
      };
      let fov = FULL.fov, shift = 1, paintGoal = new THREE.Color(PAINTS[0].hex);
      let introUntil = 0, hoverTile = null, modalOpen = false, modalT = 0;
      const tileH = Object.fromEntries(FEATURES.map((f) => [f.id, 0]));
      const lookW = new THREE.Vector3();
      const Y = new THREE.Vector3(0, 1, 0);

      const wake = (ms = 900) => { dirtyUntil = performance.now() + ms; if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

      const size = () => {
        const r = stage.getBoundingClientRect();
        let dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
        while (r.width * r.height * dpr * dpr > 5.5e6 && dpr > 1) dpr -= 0.25;
        renderer.setPixelRatio(dpr);
        renderer.setSize(Math.round(r.width), Math.round(r.height), false);
        wake(200);
      };

      const draw = () => {
        const full = canvas.getBoundingClientRect();
        if (full.bottom < 0 || full.top > window.innerHeight) return;
        renderer.setScissorTest(false); renderer.setClearColor(0x000000, 0); renderer.clear();   // whole canvas, so hidden windows leave nothing behind
        renderer.setScissorTest(true);
        const port = (el) => {
          const r = el.getBoundingClientRect();
          const x = r.left - full.left, y = full.bottom - r.bottom;
          renderer.setViewport(x, y, r.width, r.height); renderer.setScissor(x, y, r.width, r.height);
          return r;
        };
        // The windows first. Each one's slanted corner is erased (zero blend), then
        // its depth is cleared and the window's own shape written at depth ~0, so
        // the main view, drawn last, can't paint over the window but does fill the
        // cut corner with exactly what surrounds it (a bare hole showed the CSS
        // floor behind the canvas: a dark wedge on the low window).
        const finishTile = (k) => {
          eraseMesh.scale.x = k; renderer.render(eraseScene, eraseCam);
          renderer.clearDepth();
          maskMesh.geometry = maskGeo(k); renderer.render(maskScene, eraseCam);
        };
        if (!modalOpen) {                                                // the offer modal shows the car alone
          for (const f of FEATURES) {
            const el = tileRefs.current[f.id];
            if (!el) continue;
            const tr = port(el);
            if (tr.width < 4) continue;
            renderer.setClearColor(0x05080e, 1); renderer.clear();
            const c = tileCams[f.id], p = POSES[f.id], h = tileH[f.id];
            const look = V(p.look), off = V(p.pos).sub(look).applyAxisAngle(Y, h * 0.32).multiplyScalar(1 - h * 0.2);
            c.position.copy(look).add(off);
            c.lookAt(lookW.copy(look).applyMatrix4(car.matrixWorld));
            c.aspect = tr.width / tr.height; c.updateProjectionMatrix();
            renderer.render(scene, c);
            finishTile(f.slant / 100);
          }
          // the full-view window, while a feature is open
          const fel = tileRefs.current.full;
          if (fel && fel.isConnected) {
            const tr = port(fel);
            if (tr.width >= 4) {
              renderer.setClearColor(0x05080e, 1); renderer.clear();
              fullCam.aspect = tr.width / tr.height; fullCam.updateProjectionMatrix();
              renderer.render(scene, fullCam);
              finishTile(FULL_TILE.slant / 100);
            }
          }
        }
        // main view, last, with no clear of its own (the whole canvas was cleared above)
        const r = port(viewEl);
        const narrow = Math.min(1, (r.width / r.height) / 1.55);
        // offer modal open (desktop): the car glides into the left half, whole, and steps back a little (the modal sits on the right)
        const desk = r.width > 999, mm = desk ? modalT : 0, mp = desk ? 0 : modalT;   // phones: the car rises so the sheet can grow
        // with the modal open on desktop, the car centres in the space left of it (the dialog sits
        // max(48px, 6vw) from the right, min(520px, 100vw − 32px) wide) and is sized to fill that
        // space with ~56px to spare each side: at rest it spans ~46.5% of the stage's width
        const freeW = r.width - Math.max(48, r.width * 0.06) - Math.min(520, r.width - 32);
        const fit = Math.min(1.05, Math.max(0.6, (freeW - 112) / (0.465 * r.width)));
        main.aspect = r.width / r.height; main.fov = (fov / Math.max(narrow, 0.55) ** 0.9) * (1 + (1 / fit - 1) * mm);
        const wide = r.width > 900 ? shift : 0;
        main.setViewOffset(r.width, r.height, (r.width - freeW) / 2 * mm, r.height * (0.02 * wide + 0.04 * mm + 0.3 * mp), r.width, r.height);   // centered in the stage
        main.position.copy(camPos); main.lookAt(camLook); main.updateProjectionMatrix();
        renderer.render(scene, main);
      };

      const frame = (now) => {
        raf = 0;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const k = reduce ? 1 : 1 - Math.exp(-dt * (now < introUntil ? 1.9 : 5.5));
        let moving = false;
        const mGoal = modalOpen ? 1 : 0;
        if (Math.abs(mGoal - modalT) > 0.001) { modalT += (mGoal - modalT) * (reduce ? 1 : 1 - Math.exp(-dt * 4)); moving = true; } else modalT = mGoal;
        // windows: a hovered one pushes in and swings a little round its feature
        for (const f of FEATURES) {
          const g = hoverTile === f.id && !reduce ? 1 : 0;
          if (Math.abs(g - tileH[f.id]) > 0.002) { tileH[f.id] += (g - tileH[f.id]) * (1 - Math.exp(-dt * 3.2)); moving = true; }
          else tileH[f.id] = g;
        }
        // the car's turn: drag, its glide afterwards, or a turn to a feature
        if (yawGoal !== null) {
          let d = ((yawGoal - yaw + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
          yaw += d * k; if (Math.abs(d) < 0.002) { yaw = yawGoal; yawGoal = null; } else moving = true;
        } else if (!dragging && Math.abs(yawVel) > 0.0004) {
          yaw += yawVel * dt * 60; yawVel *= Math.pow(0.92, dt * 60); moving = true;
        }
        const hGoal = mode === "full" && !dragging && !reduce ? px * 0.10 : 0;
        if (Math.abs(hGoal - hoverYaw) > 0.0005) { hoverYaw += (hGoal - hoverYaw) * k; moving = true; }
        car.rotation.y = yaw + hoverYaw;
        car.updateMatrixWorld(true);
        // where the main camera wants to be
        if (mode === "full") {
          goalPos.set(FULL.pos[0] + (reduce ? 0 : px * 0.55), FULL.pos[1] - (reduce ? 0 : py * 0.22), FULL.pos[2]);
          goalLook.copy(V(FULL.look));
        } else {
          const p = POSES[mode], q = new THREE.Quaternion().setFromAxisAngle(Y, mode === "cockpit" ? yaw : p.yaw);
          goalPos.copy(V(p.pos)).applyQuaternion(q);
          const dir = V(p.look).sub(V(p.pos));
          if (mode === "cockpit") { lookYaw += (lookGoal - lookYaw) * k; dir.applyAxisAngle(Y, lookYaw); if (Math.abs(lookGoal - lookYaw) > 0.001) moving = true; }
          goalLook.copy(V(p.pos)).add(dir).applyQuaternion(q);
        }
        const phone = viewEl.clientWidth <= 999;                        // phones: a tighter full view, so the car spans the screen
        const goalFov = mode === "full" ? FULL.fov * (phone ? 0.74 : 1) : POSES[mode].fov;
        const goalShift = mode === "full" ? 1 : mode === "cockpit" ? 0 : 0.6;
        if (camPos.distanceTo(goalPos) > 0.002 || camLook.distanceTo(goalLook) > 0.002 || Math.abs(fov - goalFov) > 0.02 || Math.abs(shift - goalShift) > 0.002) moving = true;
        camPos.lerp(goalPos, k); camLook.lerp(goalLook, k); fov += (goalFov - fov) * k; shift += (goalShift - shift) * k;
        if (!mats.Paint.color.equals(paintGoal)) { mats.Paint.color.lerp(paintGoal, reduce ? 1 : Math.min(1, dt * 6)); reflMats.Paint?.color.copy(mats.Paint.color); moving = true; }
        // the shadow and glows belong outside; hide the shadow from inside the cabin
        if (ready) draw();
        if (moving || dragging || now < dirtyUntil) raf = requestAnimationFrame(frame);
      };

      // Input.
      const onDown = (e) => {
        if (e.button) return;
        stage.dataset.engaged = "true";                          // phones fold the hero text away once the car is touched
        dragging = true; lastX = e.clientX; yawVel = 0; yawGoal = null;
        viewEl.setPointerCapture?.(e.pointerId); viewEl.classList.add("is-dragging"); wake();
      };
      // Is the pointer over the car? Its bounding box, projected through the main
      // camera, gives a screen rectangle (trimmed, since a turned box is loose).
      // The smoke listens (Smoke.js) and stirs while it's true.
      let carBox = null, overCar = false;
      const corner = new THREE.Vector3();
      const hitCar = (x, y) => {
        if (!carBox || mode !== "full" || dragging) return false;
        const vr = viewEl.getBoundingClientRect();
        let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
        for (let i = 0; i < 8; i++) {
          corner.set(i & 1 ? carBox.max.x : carBox.min.x, i & 2 ? carBox.max.y : carBox.min.y, i & 4 ? carBox.max.z : carBox.min.z)
            .applyMatrix4(car.matrixWorld).project(main);
          const sx = vr.left + (corner.x + 1) / 2 * vr.width, sy = vr.top + (1 - corner.y) / 2 * vr.height;
          x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
        }
        const ix = (x1 - x0) * 0.1, iy = (y1 - y0) * 0.14;
        return x > x0 + ix && x < x1 - ix && y > y0 + iy && y < y1 - iy;
      };
      const setOverCar = (on) => {
        if (on === overCar) return;
        overCar = on;
        if (on) stage.dataset.carHover = "true"; else delete stage.dataset.carHover;
        stage.dispatchEvent(new CustomEvent("ms:car-hover", { detail: on }));
      };
      const onMove = (e) => {
        const r = stage.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * 2 - 1; py = ((e.clientY - r.top) / r.height) * 2 - 1;
        if (e.pointerType === "mouse") setOverCar(hitCar(e.clientX, e.clientY));
        if (dragging) {
          const dx = e.clientX - lastX; lastX = e.clientX;
          if (mode === "cockpit") lookGoal = Math.max(-0.9, Math.min(0.9, lookGoal + dx * 0.004));
          else { yaw += dx * 0.0085; yawVel = dx * 0.0085; }
        }
        wake();
      };
      const onUp = (e) => { if (!dragging) return; dragging = false; viewEl.releasePointerCapture?.(e.pointerId); viewEl.classList.remove("is-dragging"); wake(); };
      const onKey = (e) => {
        const step = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
        if (!step) return;
        e.preventDefault();
        if (mode === "cockpit") lookGoal = Math.max(-0.9, Math.min(0.9, lookGoal + step * 0.25));
        else { yawGoal = null; yawVel = step * 0.045; }
        wake();
      };
      viewEl.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      viewEl.addEventListener("keydown", onKey);
      const onLeave = () => setOverCar(false);
      document.documentElement.addEventListener("mouseleave", onLeave);
      const onScroll = () => wake(100);
      const onModal = (e) => { modalOpen = !!e.detail; wake(1600); };
      window.addEventListener("ms:modal", onModal);
      window.addEventListener("scroll", onScroll, { passive: true });
      const ro = new ResizeObserver(size); ro.observe(stage);

      api.current = {
        view(id) {
          mode = id; lookGoal = 0; lookYaw = 0; yawVel = 0;
          yawGoal = id === "full" ? null : id === "cockpit" ? null : POSES[id].yaw;
          wake(1500);
        },
        paint(hex) { paintGoal = new THREE.Color(hex); wake(900); },
        hoverTile(id) { hoverTile = id; wake(1600); },
      };

      // The car: "[FREE] 2024 Ford Mustang Dark Horse" by livanovbog (CC BY 4.0), prepared by
      // scripts/mustang/prep_dark_horse.py; Draco-compressed, so it needs the decoder in /pitch/mustang/draco/.
      const draco = new DRACOLoader().setDecoderPath("/pitch/mustang/draco/");
      const gltfLoader = new GLTFLoader().setDRACOLoader(draco);
      gltfLoader.load("/pitch/mustang/car.glb", (gltf) => {
        if (disposed) return;
        gltf.scene.traverse((o) => {
          if (!o.isMesh || !mats[o.material?.name]) return;
          if (o.material.name === "Paint" || o.material.name === "Grille") boxUV(o.geometry, o.material.name === "Paint");
          o.material = mats[o.material.name];
        });
        car.add(gltf.scene);
        // The reflection: a mirrored copy under the floor, drawn with dimmed copies
        // of the materials that fade out with depth below the floor and toward the
        // camera (world z), so only a short band by the tires shows, faintly, and it
        // never reaches the offer under the car, even where the floor thins out
        // toward the camera (a full-strength copy read as glass there).
        const mirror = new THREE.Group(); mirror.scale.y = -1; mirror.add(gltf.scene.clone()); car.add(mirror);
        mirror.traverse((o) => {
          if (!o.isMesh) return;                                        // every part, the model's own materials too
          const key = Object.keys(mats).find((k) => mats[k] === o.material) || o.material.uuid;
          o.material = reflMats[key] || (reflMats[key] = reflect(o.material));
        });
        const turn = car.rotation.y; car.rotation.y = 0; car.updateMatrixWorld(true);
        carBox = new THREE.Box3().setFromObject(gltf.scene, true);       // in the car's own space
        car.rotation.y = turn; car.updateMatrixWorld(true);
        size();
        renderer.compileAsync(scene, main).then(() => {
          if (disposed) return;
          ready = true; setState("ready");
          if (!reduce) {                                                   // the car glides in, turning into place
            camPos.set(FULL.pos[0] - 3.2, FULL.pos[1] + 1.1, FULL.pos[2] + 6); fov = FULL.fov + 6;
            yaw = START_YAW + 1.15; yawGoal = START_YAW; introUntil = performance.now() + 2600;
          }
          wake(2800);
        });
      }, undefined, (err) => { console.warn("Mustang model failed to load", err); setState("fallback"); });

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect(); setOverCar(false);
        viewEl.removeEventListener("pointerdown", onDown); viewEl.removeEventListener("keydown", onKey);
        window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp); window.removeEventListener("scroll", onScroll); window.removeEventListener("ms:modal", onModal);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        api.current = null;
        scene.traverse((o) => { o.geometry?.dispose?.(); });
        Object.values(mats).forEach((m) => { m.map?.dispose?.(); m.dispose(); }); Object.values(reflMats).forEach((m) => m.dispose()); flakes.dispose(); honeycomb.dispose(); dome.geometry.dispose(); dome.material.dispose();
        envTarget.dispose(); pmrem.dispose(); eraseGeo.dispose(); eraseMat.dispose(); Object.values(maskGeos).forEach((g) => g.dispose()); maskMat.dispose();
        floor.geometry.dispose(); floorMat.dispose(); draco.dispose();
        for (const m of [shadow, contact]) { m.geometry.dispose(); m.material.map.dispose(); m.material.dispose(); }
        renderer.forceContextLoss(); renderer.dispose();
      };
      if (disposed) cleanup();
    })();
    return () => { disposed = true; cleanup(); };
  }, []);

  const offerFrom = useRef(null);
  const choose = (id) => {
    const next = view === id ? "full" : id;
    offerFrom.current = stageRef.current?.querySelector(".ms-offer")?.getBoundingClientRect().top ?? null;
    setView(next);
    api.current?.view(next);
    setSaid(next === "full" ? "Full view of the car." : FEATURES.find((f) => f.id === next).say);
  };
  // Phones: the Full view window appears under the three (or goes) and moves the offer; the
  // offer glides from where it was instead of jumping (a FLIP: measured before and after).
  useLayoutEffect(() => {
    const from = offerFrom.current; offerFrom.current = null;
    const offer = stageRef.current?.querySelector(".ms-offer");
    if (from === null || !offer || !matchMedia("(max-width: 999px)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dy = from - offer.getBoundingClientRect().top;
    if (Math.abs(dy) < 1) return;
    offer.animate([{ translate: `0 ${dy}px` }, { translate: "0 0" }], { duration: 550, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  }, [view]);
  const paintKey = (e, p) => {
    const i = PAINTS.indexOf(p), n = PAINTS.length;
    const j = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i + n - 1) % n, ArrowUp: (i + n - 1) % n, Home: 0, End: n - 1 }[e.key];
    if (j === undefined) return;
    e.preventDefault(); pick(PAINTS[j]);
    e.currentTarget.parentElement.querySelectorAll(".ms-paint")[j]?.focus();
  };
  const pick = (p) => { setPaint(p.id); api.current?.paint(p.hex); setSaid(`Paint: ${p.name}.`); };

  // Phones: the giant word sits behind the car, so it follows the view's top
  // (the hero text above it folds away once the car is touched).
  useEffect(() => {
    const stage = stageRef.current, viewEl = viewRef.current;
    if (!stage || !viewEl) return;
    const set = () => stage.style.setProperty("--view-top", `${viewEl.offsetTop}px`);
    const ro = new ResizeObserver(set); ro.observe(stage); set();
    return () => ro.disconnect();
  }, []);

  // Esc closes a feature view.
  useEffect(() => {
    if (view === "full") return;
    const onKey = (e) => { if (e.key === "Escape") { setView("full"); api.current?.view("full"); setSaid("Full view of the car."); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  // The windows' outlines are drawn in their real pixel size, so the hover
  // glow (a dash travelling round the border, pathLength 100) keeps an even
  // speed and thickness whatever the window's shape.
  const [sizes, setSizes] = useState({});
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const next = {};
      stage.querySelectorAll(".ms-tile-window").forEach((el) => { next[el.dataset.id] = [el.offsetWidth, el.offsetHeight]; });
      setSizes((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    const ro = new ResizeObserver(measure);
    stage.querySelectorAll(".ms-tile-window").forEach((el) => ro.observe(el));
    measure();
    return () => ro.disconnect();
  }, [view]);

  const hoverTile = (id) => api.current?.hoverTile(id);
  const setTileWindow = (id, el) => { tileRefs.current[id] = el; };

  return (
    <div className="ms-stage" ref={stageRef} data-view={view} data-state={state}>
      <canvas ref={canvasRef} className="ms-canvas" aria-hidden="true" />
      {children}
      <div
        ref={viewRef}
        className="ms-view"
        role="img"
        tabIndex={0}
        aria-label={view === "cockpit"
          ? "Inside the Mustang. Drag, or use the left and right arrow keys, to look around."
          : "A 3D Ford Mustang. Drag, or use the left and right arrow keys, to turn it all the way around."}
      />
      <ul className="ms-tiles" aria-label="Look closer" ref={tilesRef}>
        {FEATURES.map((f) => (
          <li key={f.id}>
            <Tile id={f.id} ar={f.ar} slant={f.slant} kicker={f.kicker} label={f.label} pressed={view === f.id} size={sizes[f.id]}
              onClick={() => choose(f.id)} onHover={hoverTile} onWindow={setTileWindow} />
          </li>
        ))}
        {view !== "full" && (
          <li className="ms-tile-full-li">
            <Tile id="full" ar={FULL_TILE.ar} slant={FULL_TILE.slant} kicker="↩" label="Full view" aria="Back to the full view" size={sizes.full}
              onClick={() => choose(view)} onHover={hoverTile} onWindow={setTileWindow} />
          </li>
        )}
      </ul>
      <PaintMenu paint={paint} onPick={pick} />
      <p className="ms-hint ms-hint-view" aria-hidden="true">Drag to turn · 360°</p>
      {/* desktop: the paint choice as a slim rail on the far-left edge, names on hover */}
      <div className="ms-paint-rail">
        <span className="ms-paint-rail-label" aria-hidden="true">Paint</span>
        <div className="ms-paints" role="radiogroup" aria-label="Paint color">
          {PAINTS.map((p) => (
            <button key={p.id} type="button" role="radio" aria-checked={paint === p.id} aria-label={p.name} data-name={p.name}
              className="ms-paint" style={{ "--swatch": p.hex }} tabIndex={paint === p.id ? 0 : -1}
              onClick={() => pick(p)} onKeyDown={(e) => paintKey(e, p)} />
          ))}
        </div>
      </div>
      <div className="ms-controls">
        <p className="ms-hint ms-hint-desk" aria-hidden="true">
          {view === "full" ? "Drag to turn · 360°" : view === "cockpit" ? "Drag to look around" : "Drag to turn · Esc for the full view"}
        </p>
      </div>
      <p className="ms-loading" aria-hidden={state !== "loading"}>Loading the 3D model…</p>
      <p className="ms-sr" role="status" aria-live="polite">{said}</p>
    </div>
  );
}
