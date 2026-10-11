// Viteo's 3D pill models (three.js), shared by the live hero scene
// (ProductScene.js) and the pill image renderer (scripts/render-pills.mjs,
// which bakes them into public/img/viteo/pills/<id>.png for every other
// pill on the site). Plain ESM with THREE passed in, so the renderer can load
// it straight in a browser without bundling.
//
// Sizes are in "CSS px at scale 1" (the CSS pill sizes: capsule 46×18,
// softgel 40×22, tablet 26 across, oblong tablet 42×19) times `unit`. Each model lies flat facing
// the camera (+z): capsules and softgels along x, tablets face-on.
// `spinAxis` is the inner group's axis for an in-place spin: capsules turn end
// over end, softgels in the picture plane, tablets about their face's own
// centre.

const arc = (cx, cy, r, a0, a1, n = 12) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  });

export function buildPill(THREE, product, unit, keep = (o) => o) {
  const lathe = (pts, seg = 48) =>
    keep(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg));
  const color = new THREE.Color(product.color);
  const color2 = new THREE.Color(product.color2 || "#fffaf0");
  const inner = new THREE.Group();

  if (product.form === "capsule") {
    const r = 9 * unit, len = 46 * unit;
    // Half a capsule, from its rounded tip to the middle, around the y axis.
    const half = (rad, l, flip) => {
      const pts = [[0, -l / 2], ...arc(0, -l / 2 + rad, rad, -Math.PI / 2, 0).slice(1), [rad, 0]];
      return lathe(flip ? pts.map(([x, y]) => [x, -y]).reverse() : pts);
    };
    const shell = (c) => keep(new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.2 }));
    const body = new THREE.Mesh(half(r, len, false), shell(color));
    const cap = new THREE.Mesh(half(r * 1.045, len * 1.02, true), shell(color2));
    cap.position.y = -len * 0.06; // the cap overlaps the body
    inner.add(body, cap);
    inner.rotation.z = Math.PI / 2; // lie along x
    return { inner, spinAxis: "y" };
  }

  if (product.form === "softgel") {
    const mat = keep(new THREE.MeshPhysicalMaterial({
      color, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08,
      sheen: 0.4, sheenColor: new THREE.Color("#ffffff"), emissive: color, emissiveIntensity: 0.08,
    }));
    const m = new THREE.Mesh(keep(new THREE.SphereGeometry(1, 48, 32)), mat);
    m.scale.set(20 * unit, 11 * unit, 11 * unit);
    inner.add(m);
    return { inner, spinAxis: "z" };
  }

  // Tablets are extruded shapes facing the camera (+z), with rounded,
  // bevelled edges: round tablets carry a score line, oblong caplets
  // (product.shape === "oblong") are plain and domed. The score is part of the
  // face itself (a colour texture plus a bump map on the caps, mapped in the
  // shape's own coordinates), so it can't drift off the tablet at any angle.
  const oblong = product.shape === "oblong";
  const W = (oblong ? 42 : 26) * unit, H = (oblong ? 19 : 26) * unit;
  const bevSize = (oblong ? 5.5 : 3) * unit, bevThick = (oblong ? 4.6 : 3) * unit;
  const thick = (oblong ? 11 : 9) * unit;
  const iw = W - 2 * bevSize, ih = H - 2 * bevSize, r = Math.min(iw, ih) / 2;
  const shape = new THREE.Shape();
  if (oblong) {
    shape.moveTo(-iw / 2 + r, -r);
    shape.lineTo(iw / 2 - r, -r);
    shape.absarc(iw / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2, false);
    shape.lineTo(-iw / 2 + r, r);
    shape.absarc(-iw / 2 + r, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false);
  } else {
    shape.absarc(0, 0, r, 0, Math.PI * 2, false);
  }
  const depth = Math.max(thick - 2 * bevThick, 0.01 * unit);
  const geo = keep(new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevThick, bevelSize: bevSize, bevelSegments: 16, curveSegments: 48,
  }));
  geo.translate(0, 0, -depth / 2);
  const side = keep(new THREE.MeshPhysicalMaterial({ color, roughness: 0.62, clearcoat: 0.15 }));
  let face = side;
  if (!oblong && typeof document !== "undefined") {
    // Face art in the cap's own (x, y) coordinates: base colour with a
    // slightly darker groove, and a bump map that sinks the groove in.
    const px = 256;
    const draw = (fill, groove, lip) => {
      const c = document.createElement("canvas");
      c.width = c.height = px;
      const g = c.getContext("2d");
      g.fillStyle = fill;
      g.fillRect(0, 0, px, px);
      g.fillStyle = groove;
      g.fillRect(px * 0.465, px * 0.16, px * 0.07, px * 0.68);
      if (lip) { g.fillStyle = lip; g.fillRect(px * 0.535, px * 0.16, px * 0.02, px * 0.68); }
      return keep(new THREE.CanvasTexture(c));
    };
    const tex = (t) => { t.repeat.set(1 / W, 1 / H); t.offset.set(0.5, 0.5); t.anisotropy = 8; return t; };
    const map = tex(draw(`#${color.getHexString()}`, `#${color.clone().multiplyScalar(0.8).getHexString()}`, `#${color.clone().lerp(new THREE.Color("#ffffff"), 0.25).getHexString()}`));
    map.colorSpace = THREE.SRGBColorSpace;
    const bump = tex(draw("#808080", "#000000"));
    face = keep(new THREE.MeshPhysicalMaterial({ color: 0xffffff, map, bumpMap: bump, bumpScale: 6 * unit, roughness: 0.62, clearcoat: 0.15 }));
  }
  inner.add(new THREE.Mesh(geo, [face, side])); // groups: 0 = caps, 1 = sides
  return { inner, spinAxis: "z" };
}
