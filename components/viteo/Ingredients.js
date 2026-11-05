"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { BASE, PRODUCTS, money } from "./data";
import { buildPill } from "./pillModels";
import { Arrow, Logo, Pill, Button } from "./ui";

// The landing page's Ingredients grid and its close-up. Each card opens a
// dialog: the card's pill morphs (View Transitions API) into a large pill
// on a dark stage, which then turns slowly in real 3D (three.js, desktop with
// a mouse; elsewhere the baked image stays), beside its dose, form, price,
// the answers that add it, and what it's often packed with. The cards
// keep their data-story-pill docks for the scroll story (ProductStory.js).

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The morphs (card → close-up, pill glide) are for desktop with a mouse: on
// phones and tablets a view transition crossfaded snapshots of the whole page
// (and the card's pill and blur), which showed as blocks of colour before the
// close-up appeared. There the close-up just opens (phones: the sheet slides
// up; tablets: a short fade-in, .is-plain in viteo.css).
// The card's parts that travel to their twins in the close-up during the
// morph (the dialog's side is named by .dl-ing-dialog.is-morphing in viteo.css).
const CARD_PARTS = [
  [".dl-ingredient-open", "dl-ing-title"],
  [".dl-ing-meta", "dl-ing-meta"],
  [".dl-ing-blurb", "dl-ing-blurb"],
  [".dl-ing-plus", "dl-ing-btn"],
  [".dl-ing-glow", "dl-ing-glow"],
];
const nameCardParts = (card, on) => {
  for (const [sel, name] of CARD_PARTS) {
    const el = card.querySelector(sel);
    if (el) el.style.viewTransitionName = on ? name : "";
  }
};

const canMorph = () => window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)").matches;

// Runs update inside a view transition where there is one (and the screen
// gets the morphs); returns a promise that settles when it's done.
const withTransition = (update) => {
  if (!document.startViewTransition || reducedMotion() || !canMorph()) {
    update();
    return Promise.resolve();
  }
  return document.startViewTransition(() => flushSync(update)).finished.catch(() => {});
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
      <span className="dl-ing-stage-logo" aria-hidden="true"><Logo /></span>
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

  // On desktop the whole card morphs into the close-up and back (one
  // view-transition name, dl-ing-card, handed between the card and the
  // dialog), with the pill gliding on top under its own name.
  const morphCard = canMorph;
  const open = (id, from) => {
    openerRef.current = from;
    const card = from.closest(".dl-ingredient");
    const pill = card?.querySelector(".dl-ingredient-pill");
    const d = dialogRef.current;
    const morph = morphCard() && card && d;
    d?.classList.toggle("is-plain", !morph); // no morph: the dialog animates itself in
    if (pill) pill.style.viewTransitionName = "dl-ing-pill";
    if (morph) {
      // The close-up's name and description get the card's widths in em, so
      // at their larger sizes they wrap in exactly the same places and can
      // grow from one into the other.
      const em = (el, width) => width / parseFloat(getComputedStyle(el).fontSize);
      const title = card.querySelector("h3");
      const blurb = card.querySelector(".dl-ing-blurb");
      if (title) {
        const cs = getComputedStyle(title);
        d.style.setProperty("--dl-title-em", em(title, title.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)).toFixed(3));
      }
      if (blurb) d.style.setProperty("--dl-blurb-em", em(blurb, blurb.clientWidth).toFixed(3));
      card.style.viewTransitionName = "dl-ing-card";
      nameCardParts(card, true);
      card.classList.add("is-morphing");
      d.classList.add("is-morphing");
      document.documentElement.setAttribute("data-dl-morph", "open"); // which way the corners grow
    }
    withTransition(() => {
      if (pill) pill.style.viewTransitionName = "";
      if (morph) {
        card.style.viewTransitionName = "";
        nameCardParts(card, false);
        d.style.viewTransitionName = "dl-ing-card";
        // The pill side's tint fades in once the dialog has mostly grown.
        d.classList.add("is-entering");
        setTimeout(() => d.classList.remove("is-entering"), 260);
      }
      setOpenId(id);
    }).then(() => {
      document.documentElement.removeAttribute("data-dl-morph");
      if (!d) return;
      d.style.viewTransitionName = "";
      card?.classList.remove("is-morphing");
      d.classList.remove("is-morphing");
    });
  };
  // Closing on desktop is two beats: the close-up's content with no twin on
  // the card fades out first (.is-leaving), then it morphs back into the card.
  const leavingRef = useRef(false);
  const close = () => {
    const id = openId;
    const card = document.querySelector(`.dl-ingredient[data-id="${id}"]`);
    const d = dialogRef.current;
    const morph = morphCard() && !reducedMotion() && document.startViewTransition && card && d;
    if (!morph) return morphBack(false);
    if (leavingRef.current) return;
    leavingRef.current = true;
    d.classList.add("is-leaving");
    setTimeout(() => {
      leavingRef.current = false;
      morphBack(true);
    }, 160);
  };
  const morphBack = (morph) => {
    const id = openId;
    const card = document.querySelector(`.dl-ingredient[data-id="${id}"]`);
    const pill = card?.querySelector(".dl-ingredient-pill");
    const d = dialogRef.current;
    if (morph) {
      d.style.viewTransitionName = "dl-ing-card";
      d.classList.add("is-morphing");
      card.classList.add("is-morphing");
      document.documentElement.setAttribute("data-dl-morph", "close");
    }
    // The stage swaps its live 3D pill back for the pill image, which is the
    // one that glides home (otherwise a second pill rides the shrinking dialog).
    d?.classList.add("is-closing");
    withTransition(() => {
      setOpenId(null);
      d?.close();
      d?.classList.remove("is-closing", "is-leaving");
      if (morph) {
        d.style.viewTransitionName = "";
        card.style.viewTransitionName = "dl-ing-card";
        nameCardParts(card, true);
      }
      if (pill) pill.style.viewTransitionName = "dl-ing-pill";
    }).then(() => {
      // Clear the names once the transition is over.
      document.documentElement.removeAttribute("data-dl-morph");
      if (card) {
        card.style.viewTransitionName = "";
        nameCardParts(card, false);
        card.classList.remove("is-morphing");
      }
      d?.classList.remove("is-morphing");
      if (pill) pill.style.viewTransitionName = "";
    });
    openerRef.current?.focus({ preventScroll: true });
  };
  const swap = (id) => withTransition(() => setOpenId(id));

  // Phones: the close-up is a bottom sheet; dragging its top (the handle and
  // pill stage) down past a threshold closes it, otherwise it springs back.
  const drag = useRef(null);
  const onDragStart = (e) => {
    if (!window.matchMedia("(max-width: 760px)").matches || e.pointerType === "mouse") return;
    drag.current = { y: e.clientY, dy: 0 };
    dialogRef.current?.classList.add("is-dragging");
  };
  const onDragMove = (e) => {
    if (!drag.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    dialogRef.current.style.translate = `0 ${drag.current.dy}px`;
  };
  const onDragEnd = () => {
    if (!drag.current) return;
    const far = drag.current.dy > 110;
    drag.current = null;
    const d = dialogRef.current;
    d.classList.remove("is-dragging");
    d.style.translate = "";
    if (far) close();
  };

  const p = openId && PRODUCTS[openId];

  return (
    <>
      <ul className="dl-ingredients">
        {Object.values(PRODUCTS).map((item) => (
          <li key={item.id} data-id={item.id} className={`dl-card dl-glass dl-ingredient${item.id === openId ? " is-open" : ""}`} style={{ "--glow": item.color }}>
            <span className="dl-ing-glow" aria-hidden="true" />
            {/* Visible on every screen (touch has no hover): the card opens. */}
            <span className="dl-ing-plus" aria-hidden="true">
              {/* "Expand": opens a larger view (distinct from the ↗ "go to" corners). */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path className="dl-ing-plus-a" d="M14 4h6v6M20 4l-6.5 6.5" />
                <path className="dl-ing-plus-b" d="M10 20H4v-6M4 20l6.5-6.5" />
              </svg>
            </span>
            <span className="dl-ingredient-pill" data-story-pill={item.id} data-story-scale="2">
              <Pill id={item.id} size="lg" tilt={-20} />
            </span>
            <div>
              <h3 className="dl-h2">
                <button type="button" className="dl-ingredient-open" onClick={(e) => open(item.id, e.currentTarget)} aria-haspopup="dialog" aria-label={`${item.name}: details`}>
                  {item.name}
                </button>
              </h3>
              <p className="dl-meta dl-ing-meta">
                {item.dose} · {item.form} · {money(item.price)}/mo
              </p>
              <p className="dl-ing-blurb">{item.blurb}</p>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="dl-ing-dialog dl-glass"
        style={p ? { "--glow": p.color } : undefined}
        aria-labelledby="dl-ing-title"
        onClose={() => openId && setOpenId(null)}
        onCancel={(e) => { e.preventDefault(); close(); }}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {p && <span className="dl-ing-glow" aria-hidden="true" />}
        {p && (
          <div className="dl-ing-sheet">
            <div className="dl-ing-grab" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd}>
              <span className="dl-ing-handle" aria-hidden="true" />
              <PillStage key={p.id} id={p.id} />
            </div>
            <div className="dl-ing-body">
              {/* Focus lands on the title when the dialog opens (not on the first chip). */}
              <h2 id="dl-ing-title" className="dl-h2" tabIndex={-1} autoFocus>{p.name}</h2>
              {/* The same line as the card's, so it travels as one piece. */}
              <p className="dl-meta">{p.dose} · {p.form} · {money(p.price)}/mo</p>
              <p className="dl-lede">{p.blurb}</p>
              {/* The rest has no twin on the card: it fades in/out on its own during the morph. */}
              <div className="dl-ing-more">
              <h3 className="dl-h4">When your answers add it</h3>
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
                <Button href={`${BASE}/personalize/`}>Personalize your pack <Arrow /></Button>
              </div>
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
