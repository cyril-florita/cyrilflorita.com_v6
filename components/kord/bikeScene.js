// The Kord bike in its studio, shared by the landing's story (BikeStory) and Find your bike's
// result (BikeViewer): the renderer, the studio it reflects, the lights, the materials (with the
// baked ambient occlusion and the rubber grain added in the shader), the floor, the baked shadow,
// and loading the model. The caller owns the camera's framing, the animation loop and the DOM.
// Each model's bike is built in Blender (scripts/kord/build_bike.py --bike <id>) and loaded from
// public/builds/kord/models/<id>.glb (<id>-lite.glb, decimated, on phones: modelUrl below)
// (Draco; decoder in /builds/kord/draco/). See app/builds/kord/README.md.

import { PAINTS, BIKES, SIZE_GEO } from "@/components/kord/data";

export const CENTER = [0.09, 0.5, 0];  // the bike's middle (model space)
const ENV_YAW = 0;                     // turns the studio HDRI around the bike
const SHADOW_W = 2.4, SHADOW_D = 1.2;  // the baked shadow's area (m): = SHADOW_W/_D in build_bike.py
const FLOOR_SIZE = 4.4;                // the lit floor's diameter (m): lit around the bike only
const ENV_GAIN = 1.5;                  // the dark studio (walls cut to 15%) needs a little more

// each model's own build; phones (≤899px) get its lighter one (--lite in build_bike.py)
// each model's own rim depth (m), from its `wheels` in data.js ("50 mm carbon")
const RIM_M = Object.fromEntries(BIKES.map((b) => [b.id, parseInt(b.wheels, 10) / 1000]));

export const modelUrl = (id = "arc") => {
  const lite = typeof window !== "undefined" && window.matchMedia("(max-width: 899px)").matches;
  return `/builds/kord/models/${id}${lite ? "-lite" : ""}.glb`;
};

export async function loadThree() {
  // after the first paint (two frames): the poster carries that paint, and three.js (~720 KB of
  // chunks) requested before it made Lighthouse's throttled estimate charge the largest paint for it
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const THREE = await import("three");
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
  const { HDRLoader } = await import("three/examples/jsm/loaders/HDRLoader.js");
  return { THREE, GLTFLoader, DRACOLoader, HDRLoader };
}

// The studio's texture, shared by the floor and the wall behind the bike: soft, blurred pale blobs
// (three sizes) laid over whatever is already drawn (source-atop), then a film-like grain — in
// brightness and in opacity, so it shows over the dark page too (`grain`: its strength, 0–255).
export function mottle(g, w, h, grain = 40, alphaGrain = true) {
  const m = document.createElement("canvas"); m.width = w; m.height = h;
  const mg = m.getContext("2d"), sc = w / 512, k = (w * h) / (512 * 512);
  for (const [n, r, a] of [[60, 70, 0.05], [140, 30, 0.05], [300, 12, 0.04]])
    for (let i = 0; i < n * k; i++) {
      mg.fillStyle = `rgba(150,156,168,${a})`; mg.beginPath();
      mg.arc(Math.random() * w, Math.random() * h, r * sc * (0.5 + Math.random()), 0, 7); mg.fill();
    }
  g.save(); g.filter = `blur(${10 * sc}px)`; g.globalCompositeOperation = "source-atop"; g.drawImage(m, 0, 0); g.restore();
  const img = g.getImageData(0, 0, w, h), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = Math.random() - 0.5;
    d[i] += n * grain; d[i + 1] += n * grain; d[i + 2] += n * grain;
    if (alphaGrain && d[i + 3]) d[i + 3] = Math.max(0, Math.min(255, d[i + 3] + n * grain * 0.9));
  }
  g.putImageData(img, 0, 0);
}

// The wall behind the bike is CSS only (kord.css, `.cd-studio` / `.cd-sticky`): its mottled wash
// (public/builds/kord/wall.webp, drawn once by mottle() above, saved at 720×450) and its grain tile
// (public/builds/kord/grain.png, 48px of random grey in 16 levels, one grain per device pixel through
// resolution media queries). Both were drawn here at runtime until 2026-11-24, which set them after
// three.js loaded, so each became the phone's largest paint (~16 s, then ~8 s, on a throttled phone).
// The wall is kept under 0.05 bits per pixel, so Chrome never counts it as the largest paint; see kord.css.

// Shader additions (onBeforeCompile), for realism:
// - ambient occlusion baked in Blender (per vertex, shipped as the `uv` channel and copied to an
//   `ao` attribute on load), applied to reflected and ambient light as real occlusion is, and half
//   as much to direct light; `fx.ao` fades it (the story fades it as the bike comes apart)
// - a fine grain on the rubber, generated from the part's own coordinates (no textures), faded out
//   wherever it would be smaller than about a pixel, so it never shimmers
//   (a carbon weave on the raw carbon was tried and removed: the user didn't like it)
const SURFACE_GLSL = `
  uniform float uAo; varying float vAo; varying vec3 vPosL; varying vec3 vNrmL;
  float cdFade(vec3 q) { return 1.0 - smoothstep(0.3, 0.8, length(fwidth(q))); }
  float cdHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
  float cdNoise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(cdHash(i), cdHash(i + vec3(1,0,0)), f.x), mix(cdHash(i + vec3(0,1,0)), cdHash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(cdHash(i + vec3(0,0,1)), cdHash(i + vec3(1,0,1)), f.x), mix(cdHash(i + vec3(0,1,1)), cdHash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float cdGrain(vec3 pos) { vec3 q = pos * 900.0; return (cdNoise(q) - 0.5) * cdFade(q); }
`;
const AO_GLSL = `
  float ambientOcclusion = mix(1.0, clamp(vAo, 0.0, 1.0), uAo);
  reflectedLight.indirectDiffuse *= ambientOcclusion;
  #if defined( USE_CLEARCOAT )
    clearcoatSpecularIndirect *= ambientOcclusion;
  #endif
  #if defined( USE_ENVMAP ) && defined( STANDARD )
    float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
    reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
  #endif
  reflectedLight.directDiffuse *= mix(1.0, ambientOcclusion, 0.5);
  reflectedLight.directSpecular *= mix(1.0, ambientOcclusion, 0.5);
`;
const SURFACE = {
  rubber: ["float cdS = cdGrain(vPosL); diffuseColor.rgb *= 1.0 + 0.5 * cdS;", "roughnessFactor = clamp(roughnessFactor + 0.2 * cdS, 0.04, 1.0);"],
};

// opts: { paint (a PAINTS entry), onWake() — called when something async lands and wants a frame }
// returns null if WebGL is unavailable
export function createBikeScene(T, canvas, { paint = PAINTS[0], onWake = () => {} } = {}) {
  const { THREE, GLTFLoader, DRACOLoader, HDRLoader } = T;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }); }
  catch { return null; }
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.setClearColor(0x000000, 0);
  let disposed = false;

  const scene = new THREE.Scene();
  // The studio it reflects is a real one (studio.hdr, below); until that arrives, or if it fails,
  // this stand-in: a long softbox overhead, strips either side, a cool rim behind. Big, soft and
  // not too bright, and blurred, so reflections read as broad sheens rather than hard white streaks.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new THREE.Scene();
  room.background = new THREE.Color(0x060708);
  const panel = (w, h, pos, color, power) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(power), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0.5, 0); room.add(m);
  };
  panel(7, 2.4, [0, 5, 0], 0xffffff, 4.2);
  panel(1.6, 4, [4, 1.6, 2.5], 0xffffff, 2.2);
  panel(1.6, 4, [-4, 1.6, 2.5], 0xe8f0ff, 1.7);
  panel(5, 1.2, [0, 1.2, 5], 0xffffff, 1.2);
  panel(5, 2, [0, 1.5, -5], 0xd8ffa0, 1.4);          // a faint chartreuse bounce behind
  panel(10, 10, [0, -2, 0], 0x15171a, 1);
  const envTarget = pmrem.fromScene(room, 0.04);   // (above 0.04 three clips the blur and warns)
  scene.environment = envTarget.texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(1.5, 4, 3); scene.add(key);
  const rim = new THREE.DirectionalLight(0xe6ffb0, 1.6); rim.position.set(-3, 2.5, -2.5); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.7); fill.position.set(-2, 1, 3); scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xdfe6f0, 0x0a0b0d, 0.5));

  const P0 = paint;
  const mats = {
    Paint: new THREE.MeshPhysicalMaterial({ color: P0.hex, metalness: P0.metal, roughness: P0.rough, clearcoat: P0.coat, clearcoatRoughness: P0.coatRough, specularIntensity: 0.75 }),
    // raw carbon (frame edges, rims, bar, post): satin, no clear coat
    Carbon: new THREE.MeshPhysicalMaterial({ color: 0x0e0e10, metalness: 0, roughness: 0.66, specularIntensity: 0.65 }),
    Decal: new THREE.MeshStandardMaterial({ color: P0.decal, roughness: 0.5, metalness: 0 }),
    Badge: new THREE.MeshStandardMaterial({ color: P0.badge, roughness: 0.5, metalness: 0 }),   // the head badge, contrasting with the paint
    // rubber, tape, hoods, saddle: matte, and reflecting about half what a hard plastic would
    Tire: new THREE.MeshPhysicalMaterial({ color: 0x111113, roughness: 0.92, metalness: 0, specularIntensity: 0.45 }),
    TireWall: new THREE.MeshPhysicalMaterial({ color: 0x1a1918, roughness: 0.88, metalness: 0, specularIntensity: 0.45 }),
    Metal: new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.6, metalness: 0.55 }),   // anodised black alloy
    Group: new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.6, metalness: 0.55 }),   // the groupset (cranks, derailleurs, brakes): finish per groupset (setSpec)
    Silver: new THREE.MeshStandardMaterial({ color: 0x9a9da1, roughness: 0.45, metalness: 1 }),
    Rotor: new THREE.MeshStandardMaterial({ color: 0x86898d, roughness: 0.58, metalness: 1 }),
    Tape: new THREE.MeshPhysicalMaterial({ color: 0x141416, roughness: 0.9, metalness: 0, specularIntensity: 0.4 }),
    Hood: new THREE.MeshPhysicalMaterial({ color: 0x0d0d0e, roughness: 0.78, metalness: 0, specularIntensity: 0.5 }),
    Saddle: new THREE.MeshPhysicalMaterial({ color: 0x131315, roughness: 0.75, metalness: 0, specularIntensity: 0.5 }),
    Rubber: new THREE.MeshPhysicalMaterial({ color: 0x0b0b0c, roughness: 0.92, metalness: 0, specularIntensity: 0.45 }),
    Pedal: new THREE.MeshPhysicalMaterial({ color: 0x2b2c2e, roughness: 0.88, metalness: 0, specularIntensity: 0.5 }),
    Reflector: new THREE.MeshStandardMaterial({ color: 0xe8821a, roughness: 0.4, metalness: 0 }),
    Gumwall: new THREE.MeshPhysicalMaterial({ color: 0x7a5434, roughness: 0.92, metalness: 0, specularIntensity: 0.45 }),   // a muted tan, as rubber is
  };
  const fx = { ao: { value: 1 } };
  const enhance = (m, kind) => {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uAo = fx.ao;
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nattribute float ao; varying float vAo; varying vec3 vPosL; varying vec3 vNrmL;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvAo = ao; vPosL = position; vNrmL = normal;");
      let f = sh.fragmentShader
        .replace("#include <common>", "#include <common>\n" + SURFACE_GLSL)
        .replace("#include <aomap_fragment>", AO_GLSL);
      if (SURFACE[kind]) f = f
        .replace("#include <color_fragment>", "#include <color_fragment>\n" + SURFACE[kind][0])
        .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n" + SURFACE[kind][1]);
      sh.fragmentShader = f;
    };
    m.customProgramCacheKey = () => "cd-" + (kind || "plain");
  };
  for (const [n, m] of Object.entries(mats)) enhance(m, ["Tire", "TireWall", "Gumwall"].includes(n) ? "rubber" : null);

  const bike = new THREE.Group();
  const pivot = new THREE.Group();          // turns around the bike's middle
  pivot.add(bike); bike.position.set(-CENTER[0], 0, -CENTER[2]); pivot.position.set(CENTER[0], 0, CENTER[2]);
  scene.add(pivot);

  // the floor shadow, baked in Blender (build_bike.py --shadow: Cycles, a shadow-catcher floor under
  // a big overhead softbox, seen from straight above over SHADOW_W x SHADOW_D m, its edges faded to
  // nothing): dark where the tires touch, soft behind. On a plane under the bike, so it turns with it.
  let shadowTex = new THREE.TextureLoader().load("/builds/kord/shadows/arc.webp", () => onWake(300));   // each model's own (load)
  shadowTex.colorSpace = THREE.SRGBColorSpace; shadowTex.anisotropy = 4;
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(SHADOW_W, SHADOW_D), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0.09, 0.001, 0); bike.add(shadow);

  // the studio floor (after the user's reference): dark, lit only around the bike — a pool of light
  // just behind it, mottled (mottle()), fading to nothing toward the viewer, the back and the sides.
  // Unlit and in the scene (not the bike), so it stays put while the bike turns; drawn before the shadow.
  const fc = document.createElement("canvas"); fc.width = fc.height = 512;
  { const g = fc.getContext("2d"), gr = g.createRadialGradient(256, 256, 0, 256, 256, 256);
    gr.addColorStop(0, "rgba(52, 56, 63, 0.92)"); gr.addColorStop(0.25, "rgba(38, 41, 47, 0.7)");   // darkened twice (2026-11-23)
    gr.addColorStop(0.55, "rgba(21, 23, 26, 0.32)"); gr.addColorStop(1, "rgba(11, 12, 14, 0)");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    mottle(g, 512, 512, 10, false); }   // the floor as the user liked it: a faint grain in brightness only
  const floorTex = new THREE.CanvasTexture(fc); floorTex.colorSpace = THREE.SRGBColorSpace; floorTex.anisotropy = 8;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR_SIZE, FLOOR_SIZE), new THREE.MeshBasicMaterial({ map: floorTex, transparent: true, depthWrite: false, toneMapped: false }));
  floor.rotation.x = -Math.PI / 2; floor.scale.set(1.35, 1, 1); floor.position.set(CENTER[0], 0, -0.45); floor.renderOrder = -1; scene.add(floor);   // wider, centred just behind the bike

  const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 50);

  // paint: setPaint() sets the goal; stepPaint() eases toward it each frame and returns how far off it is
  const paintGoal = new THREE.Color(P0.hex), decalGoal = new THREE.Color(P0.decal), badgeGoal = new THREE.Color(P0.badge);
  let goal = { metal: P0.metal, rough: P0.rough, coat: P0.coat, coatRough: P0.coatRough };
  const setPaint = (p) => { paintGoal.set(p.hex); decalGoal.set(p.decal); badgeGoal.set(p.badge); goal = { metal: p.metal, rough: p.rough, coat: p.coat, coatRough: p.coatRough }; onWake(1200); };
  const stepPaint = (k = 0.12) => {
    const pc = mats.Paint.color, settle = pc.distanceTo?.(paintGoal) ?? 0;
    pc.lerp(paintGoal, k); mats.Decal.color.lerp(decalGoal, k); mats.Badge.color.lerp(badgeGoal, k);
    mats.Paint.metalness += (goal.metal - mats.Paint.metalness) * k;
    mats.Paint.roughness += (goal.rough - mats.Paint.roughness) * k;
    mats.Paint.clearcoat += (goal.coat - mats.Paint.clearcoat) * k;
    mats.Paint.clearcoatRoughness += (goal.coatRough - mats.Paint.clearcoatRoughness) * k;
    return Math.max(settle, stepSpec(k));
  };

  // the builder's specs, shown on the bike (2026-11-24): the groupset's finish on the cranks, derailleurs
  // and brakes (the Group material), and the wheels' rim depth — the rims and the spokes' rim ends
  // remapped from the model's own depth to the chosen one, about the rim's outer edge. Eased like the paint.
  const FINISH = {
    sport: { color: 0x2a2c30, metal: 0.55, rough: 0.6 },   // anodised black
    race: { color: 0x5d636b, metal: 0.85, rough: 0.3 },    // gunmetal, polished
    pro: { color: 0xc6cad0, metal: 1, rough: 0.22 },       // titanium silver
  };
  const R_OUT = 0.3108;                                    // the rim's outer edge (build_bike.py)
  const groupGoal = new THREE.Color(FINISH.sport.color);
  let fin = { metal: FINISH.sport.metal, rough: FINISH.sport.rough };
  let rimBase = 0.05, rimNow = 0.05, rimGoal = null, rimSets = [];
  const applyRim = (depth) => {
    const f = depth / rimBase;
    for (const { attr, orig } of rimSets) {
      const a = attr.array;
      for (let i = 0; i < a.length; i += 3) {
        const x = orig[i], y = orig[i + 1], r = Math.hypot(x, y);
        if (r < 0.2) { a[i] = x; a[i + 1] = y; continue; }   // hubs, cassette: untouched
        const k = (R_OUT - (R_OUT - r) * f) / r;
        a[i] = x * k; a[i + 1] = y * k;
      }
      attr.needsUpdate = true;
    }
    rimNow = depth;
  };
  // the frame size: three displacement fields, linear in each amount (so straight tubes stay straight),
  // the same ones build_bike.py uses for the models' taller front ends and compact rear triangles, in its
  // coordinates (X along the bike, Y across, Z up; the model's are X, Z, -Y): the front end up the head
  // tube's axis (fading in from mid top tube and over the head tube's lower part, so the fork's crown and
  // the down tube stay), the seat cluster along the seat tube (fading in up the seat stays and back from
  // the head tube), and the cockpit, seatpost and saddle moved whole. Each vertex keeps its three
  // weights, so a step is a sum. Wheels, cranks, chain, derailleurs and brakes don't change.
  const UP = [-Math.cos((73 * Math.PI) / 180), Math.sin((73 * Math.PI) / 180)];   // up the head tube (x, z)
  const ST = [-Math.cos((73.5 * Math.PI) / 180), Math.sin((73.5 * Math.PI) / 180)]; // up the seat tube
  const cl = (t) => Math.min(1, Math.max(0, t));
  const SIZE_SKIP = new Set(["Wheel_F", "Wheel_R", "Crankset", "Chain", "RearDerailleur", "FrontDerailleur", "Brake_F", "Brake_R"]);
  const geoNow = { stack: 0, seat: 0, saddle: 0 };
  let geoGoal = { stack: 0, seat: 0, saddle: 0 }, sizeSets = [];
  const applySize = () => {
    // the three displacements, in the model's coordinates (metres)
    const L = geoNow.stack / 1000 / UP[1], S = geoNow.seat / 1000 / ST[1], D = geoNow.saddle / 1000;
    const vec = [[UP[0] * L, UP[1] * L, 0], [ST[0] * S, ST[1] * S, 0], [ST[0] * D, ST[1] * D, 0]];
    for (const s of sizeSets) {
      const a = s.attr.array, o = s.orig, w = s.w;
      const loc = vec.map(([x, y, z]) => new THREE.Vector3(x, y, z).applyMatrix3(s.inv));   // into the mesh's own space
      for (let i = 0, j = 0; i < a.length; i += 3, j += 3) {
        const f = w[j], r = w[j + 1], q = w[j + 2];
        a[i] = o[i] + f * loc[0].x + r * loc[1].x + q * loc[2].x;
        a[i + 1] = o[i + 1] + f * loc[0].y + r * loc[1].y + q * loc[2].y;
        a[i + 2] = o[i + 2] + f * loc[0].z + r * loc[1].z + q * loc[2].z;
      }
      s.attr.needsUpdate = true;
    }
  };
  const collectSize = (root) => {
    sizeSets = [];
    root.updateMatrixWorld(true);
    const rootInv = root.matrixWorld.clone().invert(), p = new THREE.Vector3();
    for (const part of root.children) {
      if (SIZE_SKIP.has(part.name)) continue;
      const rigid = part.name === "Cockpit" ? 0 : part.name === "Seatpost" || part.name === "Saddle" ? 2 : -1;
      part.traverse((o) => {
        if (!o.isMesh) return;
        const M = rootInv.clone().multiply(o.matrixWorld);
        const attr = o.geometry.getAttribute("position"), orig = attr.array.slice(), n = attr.count;
        const w = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          if (rigid >= 0) { w[i * 3 + rigid] = 1; continue; }
          p.fromArray(orig, i * 3).applyMatrix4(M);          // the model's space: x along, y up, z = -across
          const x = p.x, z = p.y;
          w[i * 3] = cl((z - 0.70) / 0.10) * cl((x + 0.10) / 0.40);       // front end
          w[i * 3 + 1] = cl((z - 0.42) / 0.32) * cl((0.32 - x) / 0.44);   // seat cluster
        }
        sizeSets.push({ attr, orig, w, inv: new THREE.Matrix3().setFromMatrix4(M).invert() });
      });
    }
    applySize();
  };
  const setSpec = ({ group = "sport", rim = null, size = null } = {}) => {
    const F = FINISH[group] || FINISH.sport;
    groupGoal.set(F.color); fin = { metal: F.metal, rough: F.rough };
    rimGoal = rim; geoGoal = SIZE_GEO[size] || SIZE_GEO["56"]; onWake(1200);
  };
  function stepSpec(k) {
    const g = mats.Group, off = g.color.distanceTo?.(groupGoal) ?? 0;
    g.color.lerp(groupGoal, k); g.metalness += (fin.metal - g.metalness) * k; g.roughness += (fin.rough - g.roughness) * k;
    let rimOff = 0;
    if (rimSets.length) {
      const goalD = rimGoal ?? rimBase;
      rimOff = Math.abs(goalD - rimNow);
      if (rimOff > 0.0002) applyRim(rimNow + (goalD - rimNow) * Math.min(1, k * 1.4));
      else if (rimOff > 0) applyRim(goalD);
    }
    let geoOff = 0;
    if (sizeSets.length) {
      for (const key of ["stack", "seat", "saddle"]) geoOff = Math.max(geoOff, Math.abs(geoGoal[key] - geoNow[key]));
      if (geoOff > 0) {
        const t = geoOff > 0.2 ? Math.min(1, k * 1.2) : 1;
        for (const key of ["stack", "seat", "saddle"]) geoNow[key] += (geoGoal[key] - geoNow[key]) * t;
        applySize();
      }
    }
    return Math.max(off, rimOff * 40, geoOff / 100);
  }

  // the studio: "Studio Small 09" from Poly Haven (CC0), darkened (its white walls cut to 15%, the
  // softboxes kept: scripts/kord/dark_studio.py) and cut to 256x128 — a bright room made every
  // surface sheen; this way the bike only reflects the softboxes
  let studioTarget = null;
  const studio = new Promise((resolve) => {
    new HDRLoader().load("/builds/kord/studio.hdr", (tex) => {
      if (disposed) { tex.dispose(); return resolve(); }
      tex.mapping = THREE.EquirectangularReflectionMapping;
      studioTarget = pmrem.fromEquirectangular(tex); tex.dispose();
      scene.environment = studioTarget.texture;
      scene.environmentIntensity = ENV_GAIN;
      scene.environmentRotation.set(0, ENV_YAW, 0);
      resolve();
    }, undefined, () => resolve());
  });

  // load(id): this model's bike (modelUrl: its own build, the lighter one on phones); resolves with
  // the named parts (each with userData.home) once it's in, the studio is ready and the shaders are
  // compiled. Loading another model replaces the one shown (the builder and Find your bike switch).
  const draco = new DRACOLoader().setDecoderPath("/builds/kord/draco/");
  const parts = {};
  let current = null, loadSeq = 0;
  const load = (id = "arc") => new Promise((resolve, reject) => {
    const seq = ++loadSeq;
    new GLTFLoader().setDRACOLoader(draco).load(modelUrl(id), async (gltf) => {
      await studio;
      if (disposed || seq !== loadSeq) { gltf.scene.traverse((o) => o.geometry?.dispose?.()); return; }
      gltf.scene.traverse((o) => {
        if (o.isMesh) {
          const g = o.geometry, uv = g.getAttribute("uv"), n0 = g.getAttribute("position").count;
          const ao = new Float32Array(n0).fill(1);
          if (uv) for (let i = 0; i < n0; i++) ao[i] = uv.getX(i);
          g.setAttribute("ao", new THREE.BufferAttribute(ao, 1)); g.deleteAttribute("uv");
          const n = o.material?.name;
          if (mats[n]) o.material = mats[n];
          else if (Array.isArray(o.material)) o.material = o.material.map((m) => mats[m.name] || m);
        }
      });
      if (current) { bike.remove(current); current.traverse((o) => o.geometry?.dispose?.()); }
      for (const k of Object.keys(parts)) delete parts[k];
      // the named parts are the scene's top-level children (a multi-material mesh exports as a group)
      for (const o of [...gltf.scene.children]) { o.userData.home = o.position.clone(); parts[o.name] = o; }
      current = gltf.scene; bike.add(gltf.scene);
      // this model's floor shadow, and its wheels' rims and spokes for setSpec's rim depth
      const tex = new THREE.TextureLoader().load(`/builds/kord/shadows/${id}.webp`, () => onWake(300));
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
      shadow.material.map = tex; shadow.material.needsUpdate = true; shadowTex.dispose(); shadowTex = tex;
      rimBase = RIM_M[id] ?? 0.05; rimSets = [];
      for (const w of [parts.Wheel_F, parts.Wheel_R]) w?.traverse((o) => {
        if (o.isMesh && (o.material === mats.Carbon || o.material === mats.Silver)) {
          const attr = o.geometry.getAttribute("position");
          rimSets.push({ attr, orig: attr.array.slice() });
        }
      });
      rimNow = rimBase; if (rimGoal != null) applyRim(rimGoal);
      collectSize(gltf.scene);   // the frame size (setSpec): weights from this model's shapes, then the current size
      await renderer.compileAsync(scene, camera);
      if (!disposed) resolve(parts);
    }, undefined, reject);
  });

  const dispose = () => {
    disposed = true;
    scene.traverse((o) => o.geometry?.dispose?.());
    Object.values(mats).forEach((m) => m.dispose());
    shadowTex.dispose(); shadow.material.dispose(); floorTex.dispose(); floor.material.dispose();
    room.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
    envTarget.dispose(); studioTarget?.dispose(); pmrem.dispose(); draco.dispose();
    renderer.forceContextLoss(); renderer.dispose();
  };

  return { renderer, scene, camera, bike, pivot, mats, fx, shadow, floor, parts, setPaint, stepPaint, setSpec, load, dispose };
}
