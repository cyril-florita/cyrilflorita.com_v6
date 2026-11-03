// The side mark in 3D (desktop with a mouse; SideMark in client.js loads this
// on demand), in two layers. Behind, a big glow: one canvas fixed behind the
// whole page, with one wide, soft oval of warm light sunk below the bottom
// edge, so only its top 40% rises into view. It sits still until the pointer
// moves: then it leans away from it and springs back, and quick movement makes
// it swell. In front, in its own transparent canvas inside the CSS mark's box
// (.hs-sidemark, the host), the logo's leaf in polished metal (silver in light
// mode, gunmetal in dark), its edges and the H cut through it rounded smooth,
// standing turned away and tipped back, nudged a little by the pointer while a
// warm light follows the pointer over it. The leaf is out of focus while the
// pointer is far from it and sharpens as the pointer comes near (a CSS blur on
// its canvas, --hs-leaf-blur, eased in hearthside.css), and the glow brightens
// as the pointer comes near it too. Both draw only while
// something is settling after the pointer, never at rest, at device pixel ratio
// 1 for the glow (a soft background) and up to 1.5 for the leaf.

const H = [[12.5, 11], [16.9, 11], [16.9, 17.9], [23.1, 17.9], [23.1, 11], [27.5, 11], [27.5, 29], [23.1, 29], [23.1, 21.9], [16.9, 21.9], [16.9, 29], [12.5, 29]];

// The leaf (SVG coordinates, y down), the H as a hole, with a deep, round
// bevel in many steps, so every edge (and the H's) reads as one smooth curve;
// the bevel stays under half the H's 4.4-unit stems. Centred; rotate it half
// a turn about x to stand it right way up without mirroring it. Shared with
// the preloader (PreloaderMark.js).
export function leafGeometry(THREE) {
  const shape = new THREE.Shape();
  shape.moveTo(3.5, 0);
  shape.lineTo(25, 0);
  shape.absarc(25, 15, 15, -Math.PI / 2, 0, false);
  shape.lineTo(40, 36.5);
  shape.absarc(36.5, 36.5, 3.5, 0, Math.PI / 2, false);
  shape.lineTo(15, 40);
  shape.absarc(15, 25, 15, Math.PI / 2, Math.PI, false);
  shape.lineTo(0, 3.5);
  shape.absarc(3.5, 3.5, 3.5, Math.PI, Math.PI * 1.5, false);
  shape.holes.push(new THREE.Path(H.map(([x, y]) => new THREE.Vector2(x, y))));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 3, bevelEnabled: true, bevelThickness: 2.4, bevelSize: 1.6, bevelSegments: 24, curveSegments: 48 });
  geo.center();
  return geo;
}
const FOV = 26;
const ROOM = 1.3; // the leaf's canvas is 1.3× the host's box, so a tipped corner never clips

const QUAD_VERT = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.9999, 1.0); }
`;
// Screen space, y up, in units of the screen's height: the page colour and
// one big soft oval of light (position and strength from the script).
// Colours arrive in sRGB and leave untouched (no colour-space chunk).
const GLOW_FRAG = /* glsl */ `
uniform vec2 uRes, uA;
uniform vec3 uPage, uHotA;
uniform float uAmt, uAdd;
// A broad oval of light, its half-width and half-height in screen heights.
float pool(vec2 p, vec2 c, vec2 r) { float d = length((p - c) / r); return exp(-d * d); }
void main() {
  vec2 p = gl_FragCoord.xy / uRes.y;
  // Centred below the screen, so only its top 40% shows (drift()).
  float a = pool(p, uA, vec2(1.0, 0.336)) * uAmt;
  // Dark mode adds light (a mix toward amber on navy read as brown); light
  // mode tints the cream toward the glow.
  vec3 col = mix(mix(uPage, uHotA, a), uPage + uHotA * a, uAdd);
  // A pixel of dither, so the very gentle gradient doesn't band into steps.
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

export async function startGlassMark(host) {
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
  const hs = host.closest(".hs");
  const glowCanvas = document.createElement("canvas");
  glowCanvas.className = "hs-sidemark-3d";
  const leafCanvas = document.createElement("canvas");
  leafCanvas.className = "hs-sidemark-leaf";
  let gr, lr;
  try {
    gr = new THREE.WebGLRenderer({ canvas: glowCanvas, antialias: false, alpha: false, powerPreference: "low-power" });
    lr = new THREE.WebGLRenderer({ canvas: leafCanvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    gr?.dispose();
    window.dispatchEvent(new Event("hs:3d-ready")); // nothing to wait for
    return () => {};
  }
  lr.outputColorSpace = THREE.SRGBColorSpace;
  lr.toneMapping = THREE.NeutralToneMapping;
  lr.setClearColor(0x000000, 0);

  // The glow: a full-screen quad.
  const glowScene = new THREE.Scene();
  const glowCam = new THREE.Camera();
  const glow = new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    fragmentShader: GLOW_FRAG,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) }, uA: { value: new THREE.Vector2() },
      uPage: { value: new THREE.Vector3() }, uHotA: { value: new THREE.Vector3() },
      uAmt: { value: 1 }, uAdd: { value: 0 },
    },
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), glow);
  quad.frustumCulled = false;
  glowScene.add(quad);

  // The leaf: its own scene, lit by a room environment.
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(lr);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.8;
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 1000);

  const geo = leafGeometry(THREE);
  // Polished metal, its colour and finish set per mode in paint().
  const metal = new THREE.MeshPhysicalMaterial({ metalness: 1, clearcoat: 0.5, clearcoatRoughness: 0.12, envMapIntensity: 1.1 });
  const leaf = new THREE.Mesh(geo, metal);
  leaf.rotation.x = Math.PI;
  // Never face-on: turned 35° toward the page and tipped back, a little off
  // balance, as if about to fall; the pointer only nudges it from there.
  const BASE = { x: -0.38, y: 0.61, z: 0.12 };
  const pivot = new THREE.Group();
  pivot.rotation.order = "YXZ";
  pivot.rotation.set(BASE.x, BASE.y, BASE.z);
  pivot.add(leaf);
  scene.add(pivot);
  // The leaf's 40 units span ~0.81 of the host's box; the camera frames the
  // canvas (ROOM × the box) at z = 0.
  const viewH = (40 / 0.81) * ROOM;
  camera.position.set(0, 0, viewH / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)));

  // A warm key light that follows the pointer, kept soft: its flare sits
  // behind the hero's lede on first load, and a strong one drowned the text.
  const key = new THREE.PointLight(0xffd2a0, 450, 0, 2);
  scene.add(key);

  // Colours from the page's tokens, as sRGB triples (a 2D context normalises
  // any CSS colour to #rrggbb).
  const probe = document.createElement("canvas").getContext("2d");
  const rgb = (css, out) => {
    probe.fillStyle = "#000";
    probe.fillStyle = css;
    const n = parseInt(probe.fillStyle.slice(1), 16);
    return out.set(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
  };
  const u = glow.uniforms;
  let peak = 0.4;
  const paint = () => {
    const cs = getComputedStyle(hs);
    const v = (name) => cs.getPropertyValue(name).trim();
    const dark = hs.getAttribute("data-hs-mode") === "dark";
    rgb(v("--hs-page"), u.uPage.value);
    // Dark: a lift of warm white light. Light: the amber glow tinting the
    // cream.
    const amber = rgb(v("--hs-glow"), new THREE.Vector3());
    if (dark) rgb(v("--hs-ink"), u.uHotA.value).lerp(amber, 0.3).multiplyScalar(0.26);
    else u.uHotA.value.copy(amber);
    u.uAdd.value = dark ? 1 : 0;
    peak = dark ? 0.5 : 0.2; // half as bright as first tuned (1 / 0.4)
    // Light: bright, slightly cool silver. Dark: gunmetal, a dark blue-grey
    // whose edges and flare still catch the light.
    metal.color.set(dark ? 0x535b64 : 0xe9ecf1);
    metal.roughness = dark ? 0.24 : 0.16;
    key.intensity = dark ? 300 : 450; // the flare stands out most against the navy
    // The room's bright panels mirrored in the metal read as a glare on the
    // navy, right behind the hero's lede: dimmer reflections in dark mode.
    scene.environmentIntensity = dark ? 0.4 : 0.8;
    key.color.set(dark ? 0xfff1e0 : v("--hs-glow"));
  };

  let W = 1, Hh = 1;
  const size = () => {
    W = innerWidth; Hh = innerHeight;
    gr.setPixelRatio(1);
    gr.setSize(W, Hh, false);
    u.uRes.value.set(W, Hh);
    const b = leafCanvas.clientWidth || 1;
    lr.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    lr.setSize(b, b, false);
  };

  hs.querySelector(".hs-shell")?.prepend(glowCanvas);
  host.append(leafCanvas);
  size();
  paint();
  await lr.compileAsync(scene, camera);

  let rx = 0, ry = 0, trx = 0, try_ = 0, lx = 20, ly = 20, tlx = 20, tly = 20;
  // The push from the pointer (a spring, so it leans away and settles back)
  // and the swell from its speed.
  const push = new THREE.Vector2(), pushV = new THREE.Vector2(), pushT = new THREE.Vector2();
  const ptr = new THREE.Vector2(-9, -9), tmp = new THREE.Vector2();
  // near: how close the pointer is to the leaf (0 far, 1 beside it), eased;
  // the glow brightens with it.
  let swell = 0, lastMove = 0, near = 0, tNear = 0;
  const drift = () => {
    // Centred horizontally and sunk below the bottom edge, so only the top
    // 40% of its height (0.67 of the screen's) shows; the pointer pushes it.
    u.uA.value.set((W / Hh) * 0.5, -0.067).add(push);
    u.uAmt.value = peak * (1 + 0.45 * swell) * (1 + 0.8 * near);
  };
  const pose = () => {
    pivot.rotation.set(BASE.x + rx, BASE.y + ry, BASE.z);
    key.position.set(lx, ly, 55);
  };
  // Out of focus while the pointer is far from the leaf, sharp when it's near
  // (in units of the host's box, from its centre).
  const focus = (x, y) => {
    const r = host.getBoundingClientRect();
    const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) / r.width;
    const k = THREE.MathUtils.smoothstep(d, 0.35, 1.1);
    tNear = 1 - k;
    host.style.setProperty("--hs-leaf-blur", `${(k * 6).toFixed(1)}px`);
  };
  let raf = 0, last = 0;
  const frame = (now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    rx += (trx - rx) * 0.12; ry += (try_ - ry) * 0.12;
    lx += (tlx - lx) * 0.15; ly += (tly - ly) * 0.15;
    // Spring the push toward its target, and let the target relax to zero.
    pushV.add(tmp.copy(pushT).sub(push).multiplyScalar(18 * dt)).multiplyScalar(Math.exp(-5 * dt));
    push.addScaledVector(pushV, dt * 6);
    pushT.multiplyScalar(Math.exp(-1.2 * dt));
    swell *= Math.exp(-1.5 * dt);
    near += (tNear - near) * (1 - Math.exp(-4 * dt));
    drift();
    pose();
    gr.render(glowScene, glowCam);
    lr.render(scene, camera);
    // Keep drawing only while something is still settling.
    const moving = Math.abs(trx - rx) + Math.abs(try_ - ry) > 0.0005 || Math.abs(tlx - lx) + Math.abs(tly - ly) > 0.05
      || push.lengthSq() + pushT.lengthSq() + pushV.lengthSq() > 1e-8 || swell > 0.002 || Math.abs(tNear - near) > 0.002;
    raf = moving ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  };
  const run = () => { if (!raf) raf = requestAnimationFrame(frame); };
  const halt = () => { cancelAnimationFrame(raf); raf = 0; last = 0; };
  const move = (e) => {
    const r = host.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
    const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
    try_ = THREE.MathUtils.clamp(dx, -1, 1) * 0.18;
    trx = THREE.MathUtils.clamp(dy, -1, 1) * 0.1;
    tlx = THREE.MathUtils.clamp(dx * 140, -45, 45);
    tly = THREE.MathUtils.clamp(-dy * 140, -45, 45);
    focus(e.clientX, e.clientY);
    // The glow leans away from the pointer, and fast movement makes it
    // swell; it never follows it.
    const p = tmp.set(e.clientX / Hh, 1 - e.clientY / Hh);
    const now = performance.now();
    if (ptr.x > -9) {
      const speed = (p.distanceTo(ptr) / Math.max(16, now - lastMove)) * 1000; // screen heights a second
      swell = Math.min(1, swell + speed * 0.04);
      const away = new THREE.Vector2().subVectors(u.uA.value, p).normalize();
      pushT.addScaledVector(away, 0.012 * Math.min(1, speed)).clampLength(0, 0.09);
    }
    ptr.copy(p); lastMove = now;
    run();
  };
  const leave = () => { host.style.setProperty("--hs-leaf-blur", "6px"); tNear = 0; run(); };
  const mo = new MutationObserver(() => { paint(); run(); });
  mo.observe(hs, { attributes: true, attributeFilter: ["data-hs-mode", "data-hs-theme"] });
  const resize = () => { size(); run(); };
  window.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  window.addEventListener("resize", resize);
  leave();
  drift();
  pose();
  gr.render(glowScene, glowCam);
  lr.render(scene, camera);
  host.classList.add("is-3d");
  window.dispatchEvent(new Event("hs:3d-ready")); // the preloader waits for this first draw

  return () => {
    halt();
    mo.disconnect();
    window.removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", leave);
    window.removeEventListener("resize", resize);
    host.classList.remove("is-3d");
    host.style.removeProperty("--hs-leaf-blur");
    glowCanvas.remove(); leafCanvas.remove();
    geo.dispose(); glow.dispose(); metal.dispose(); pmrem.dispose();
    gr.dispose(); lr.dispose();
  };
}
