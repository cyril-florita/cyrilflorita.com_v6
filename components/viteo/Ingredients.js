"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { BASE, PRODUCTS, money } from "./data";
import { buildPill } from "./pillModels";
import { Arrow, Pill } from "./ui";

// The landing page's Ingredients grid and its close-up. Each card opens a
// dialog: the card's pill morphs (View Transitions API) into a large pill
// on a dark stage, which then turns slowly in real 3D (three.js, desktop with
// a mouse; elsewhere the baked image stays), beside its dose, form, price,
// the quiz answers that add it, and what it's often packed with. The cards
// keep their data-story-pill docks for the scroll story (ProductStory.js).

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Runs a DOM update inside a view transition when the browser supports it.
const withTransition = (update) => {
  if (!document.startViewTransition || reducedMotion()) return update();
  document.startViewTransition(() => flushSync(update));
};

// The close-up's 3D pill: starts in the baked image's pose (so it takes
// over seamlessly), then turns slowly and leans toward the pointer.
function PillStage({ id }) {
  const canvasRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)").matches;
    if (!canvas || !ok || reducedMotion()) return;
    let disposed = false, cleanup = () => {};
    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = env;
      scene.environmentIntensity = 0.5;
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(-4, 6, 8);
      scene.add(key, new THREE.AmbientLight(0xffffff, 0.15));
      const owned = [];
      const p = PRODUCTS[id];
      const { inner, spinAxis } = buildPill(THREE, p, 1, (o) => (owned.push(o), o));
      const pose = new THREE.Group();
      pose.add(inner);
      const kind = p.shape === "oblong" ? "oblong" : p.form;
      const POSE = { capsule: [-0.32, 0.22], softgel: [-0.38, 0.18], tablet: [-0.35, 0.15], oblong: [-0.4, 0.2] }[kind];
      pose.rotation.set(POSE[0], POSE[1], 0);
      const tilt = new THREE.Group();
      tilt.rotation.z = (20 * Math.PI) / 180; // the card pill's -20° tilt
      tilt.add(pose);
      scene.add(tilt);
      // Frame: the pill's CSS box (×1.35 lg image scale is matched by the stage size).
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
      camera.position.set(0, 0, 200);
      const fit = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        const span = 64; // world units shown across the stage's width
        camera.left = -span / 2; camera.right = span / 2;
        camera.top = (span * h) / w / 2; camera.bottom = -(span * h) / w / 2;
        camera.updateProjectionMatrix();
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(canvas);
      let px = 0, py = 0, tx = 0, ty = 0, frame = 0, last = performance.now(), first = true;
      const onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width) * 2 - 1;
        ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      };
      canvas.parentElement.addEventListener("pointermove", onMove);
      const loop = (now) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        px += (tx - px) * Math.min(1, dt * 4);
        py += (ty - py) * Math.min(1, dt * 4);
        inner.rotation[spinAxis] += dt * 0.6;
        pose.rotation.set(POSE[0] + py * 0.35, POSE[1] + px * 0.45, 0);
        renderer.render(scene, camera);
        if (first) { first = false; setLive(true); }
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
      cleanup = () => {
        cancelAnimationFrame(frame);
        ro.disconnect();
        canvas.parentElement?.removeEventListener("pointermove", onMove);
        owned.forEach((o) => o.dispose?.());
        env.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    })();
    return () => { disposed = true; cleanup(); };
  }, [id]);

  return (
    <div className={`dl-ing-stage ${live ? "is-live" : ""}`}>
      <span className="dl-ing-stage-pill" style={{ viewTransitionName: "dl-ing-pill" }}>
        <Pill id={id} size="lg" tilt={-20} />
      </span>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

export default function Ingredients() {
  const [openId, setOpenId] = useState(null);
  const dialogRef = useRef(null);
  const openerRef = useRef(null);

  // Keep the native dialog in step with state, in the same commit, so the
  // view transition's "after" snapshot already shows it.
  useLayoutEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (openId && !d.open) d.showModal();
    if (!openId && d.open) d.close();
  }, [openId]);

  const open = (id, from) => {
    openerRef.current = from;
    const pill = from.closest(".dl-ingredient")?.querySelector(".dl-ingredient-pill");
    if (pill) pill.style.viewTransitionName = "dl-ing-pill";
    withTransition(() => {
      if (pill) pill.style.viewTransitionName = "";
      setOpenId(id);
    });
  };
  const close = () => {
    const id = openId;
    const pill = document.querySelector(`.dl-ingredient-pill[data-story-pill="${id}"]`);
    withTransition(() => {
      setOpenId(null);
      dialogRef.current?.close();
      if (pill) pill.style.viewTransitionName = "dl-ing-pill";
    });
    // Clear the name once the transition has captured it, and return focus.
    setTimeout(() => { if (pill) pill.style.viewTransitionName = ""; }, 700);
    openerRef.current?.focus({ preventScroll: true });
  };
  const swap = (id) => withTransition(() => setOpenId(id));

  const p = openId && PRODUCTS[openId];

  return (
    <>
      <ul className="dl-ingredients">
        {Object.values(PRODUCTS).map((item) => (
          <li key={item.id} className="dl-card dl-glass dl-ingredient">
            {/* Visible on every screen (touch has no hover): the card opens. */}
            <span className="dl-ing-plus" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            <span className="dl-ingredient-pill" data-story-pill={item.id} data-story-scale="2">
              <Pill id={item.id} size="lg" tilt={-20} />
            </span>
            <div>
              <h3>
                <button type="button" className="dl-ingredient-open" onClick={(e) => open(item.id, e.currentTarget)} aria-haspopup="dialog" aria-label={`${item.name}: details`}>
                  {item.name}
                </button>
              </h3>
              <p className="dl-meta">
                {item.dose} · {item.form} · {money(item.price)}/mo
              </p>
              <p>{item.blurb}</p>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="dl-ing-dialog"
        aria-labelledby="dl-ing-title"
        onClose={() => openId && setOpenId(null)}
        onCancel={(e) => { e.preventDefault(); close(); }}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {p && (
          <div className="dl-ing-sheet">
            <PillStage key={p.id} id={p.id} />
            <div className="dl-ing-body">
              <p className="dl-eyebrow">{p.form}</p>
              <h2 id="dl-ing-title" className="dl-h2">{p.name}</h2>
              <p className="dl-meta">{p.dose} · {money(p.price)}/mo</p>
              <p className="dl-lede">{p.blurb}</p>
              <h3 className="dl-h4">When the quiz adds it</h3>
              <ul className="dl-ing-reasons">
                {p.reasons.map((r) => <li key={r}>{r}</li>)}
              </ul>
              {p.pairs.length > 0 && (
                <>
                  <h3 className="dl-h4">Often packed with</h3>
                  <ul className="dl-ing-pairs">
                    {p.pairs.map((pid) => (
                      <li key={pid}>
                        <button type="button" className="dl-chip" onClick={() => swap(pid)}>
                          <Pill id={pid} size="sm" tilt={-20} /> {PRODUCTS[pid].name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="dl-meta dl-ing-note">Not medical advice. Check with a healthcare professional before starting any supplement.</p>
              <div className="dl-ing-actions">
                <Link className="dl-btn dl-btn-primary" href={`${BASE}/quiz/`}>Find your pack <Arrow /></Link>
                <button type="button" className="dl-btn dl-btn-ghost" onClick={close}>Close</button>
              </div>
            </div>
            <button type="button" className="dl-ing-close" onClick={close} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
