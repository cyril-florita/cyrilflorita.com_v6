"use client";

import { useEffect, useRef, useState } from "react";
import { PAINTS, HOTSPOTS, EXPLODE, CALLOUTS, SPECS, money, BIKES, plain } from "@/components/kord/data";
import { Words } from "@/components/kord/ui";
import { CENTER, loadThree, createBikeScene } from "@/components/kord/bikeScene";

// The landing's 3D story: one sticky canvas inside a tall section. At the top it's the hero —
// the Arc, draggable (with inertia; arrow keys too), four hotspots and the paint swatches.
// Scrolling turns it side-on and pulls it apart into its parts, with numbered callouts, then
// the page carries on. The bike, its studio, materials, floor and shadow come from bikeScene.js
// (shared with Find your bike's result). Renders on demand only (scroll, drag, paint, hover),
// never at rest. No WebGL -> a still.

const ARC = BIKES[0];
const HERO_YAW = -0.5;          // three.js y rotation: front (+x) swung toward the camera
const STORY_YAW = -0.22;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t) => t * t * (3 - 2 * t);
const span = (p, a, b) => ease(clamp((p - a) / (b - a)));

export default function BikeStory() {
  const sectionRef = useRef(null), canvasRef = useRef(null), viewRef = useRef(null);
  const hotRefs = useRef({}), calloutRefs = useRef({});
  const api = useRef(null);
  const [state, setState] = useState("loading");
  const [paint, setPaint] = useState(PAINTS[0].id);
  const [open, setOpen] = useState(null);
  const hoverT = useRef(0);                 // hotspots open on hover (mouse); a short grace to reach the card

  useEffect(() => {
    const section = sectionRef.current, canvas = canvasRef.current, viewEl = viewRef.current;
    let disposed = false, cleanup = () => {};
    (async () => {
      let T;
      try { T = await loadThree(); } catch { setState("fallback"); return; }
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const S = createBikeScene(T, canvas, { paint: PAINTS[0], onWake: (ms) => wake(ms) });
      if (!S) { setState("fallback"); return; }
      const { renderer, scene, camera, bike, pivot, fx, shadow } = S;

      let W = 1, H = 1, mobile = false;
      const size = () => {
        const r = canvas.getBoundingClientRect();
        W = Math.max(1, r.width); H = Math.max(1, r.height);
        mobile = W < 900;
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        renderer.setSize(W, H, false);
        wake(200);
      };

      // state
      let yaw = HERO_YAW, yawVel = 0, yawGoal = HERO_YAW, dragging = false, lastX = 0, lastT = 0, userTurned = 0;
      let px = 0, py = 0, sx = 0, sy = 0;        // pointer parallax (springs)
      let progress = 0, ready = false, raf = 0, awakeUntil = 0, introT0 = 0, introHold = false;
      let parts = {};
      const v = new T.THREE.Vector3();

      const project = (x, y, z, out) => {
        v.set(x, y, z); bike.localToWorld(v); v.project(camera);
        out.x = (v.x * 0.5 + 0.5) * W; out.y = (-v.y * 0.5 + 0.5) * H; out.z = v.z;
        return out;
      };
      const pt = { x: 0, y: 0, z: 0 };

      const frame = (t) => {
        raf = 0;
        const now = performance.now();
        const r = section.getBoundingClientRect();
        const travel = Math.max(1, r.height - innerHeight);
        progress = clamp(-r.top / travel);
        const p = progress;
        const turn = span(p, 0.06, 0.32), boom = span(p, 0.3, 0.72);
        fx.ao.value = 1 - boom * 0.7;               // baked assembled: fades as it comes apart

        // yaw: the visitor's turn in the hero, easing to the story angle as it scrolls
        if (!dragging) {
          if (yawGoal !== null) yaw += (yawGoal - yaw) * 0.08;
          else { yaw += yawVel; yawVel *= 0.93; if (Math.abs(yawVel) < 0.0004) { yawVel = 0; yawGoal = null; } }
        }
        sx += (px - sx) * 0.08; sy += (py - sy) * 0.08;
        const intro = introHold ? 0 : introT0 ? ease(clamp((now - introT0) / 1800)) : 1;
        const shownYaw = yaw + (STORY_YAW - yaw) * turn + (1 - intro) * 0.9;
        pivot.rotation.y = shownYaw + sx * 0.06 * (1 - turn);

        // wheels and cranks roll as the page scrolls (as if riding into the story)
        const roll = p * 26;
        if (parts.Wheel_F) parts.Wheel_F.rotation.z = -roll;
        if (parts.Wheel_R) parts.Wheel_R.rotation.z = -roll;
        if (parts.Crankset) parts.Crankset.rotation.z = -roll * 0.42;

        // explode
        const kx = mobile ? 0.55 : 1;                           // phones: parts spread less sideways
        for (const name in parts) {
          const o = parts[name], off = EXPLODE[name] || [0, 0, 0];
          o.position.set(o.userData.home.x + off[0] * boom * kx, o.userData.home.y + off[1] * boom, o.userData.home.z + off[2] * boom);
        }
        shadow.material.opacity = 1 - boom * 0.9;   // baked assembled: gone as it comes apart

        // camera: framing the bike to the right of the copy (desktop) or above it (phones),
        // then centred and a touch higher for the story
        const aspect = W / H;
        camera.aspect = aspect;
        const bikeW = 1.75 + boom * (mobile ? 0.58 : 1.05);                       // the exploded bike is wider
        const frac = mobile ? 0.92 : lerp(0.58, 0.8, turn);
        const hf = 2 * Math.atan(Math.tan((camera.fov * Math.PI) / 360) * aspect);
        let dist = (bikeW / frac) / (2 * Math.tan(hf / 2));
        if (mobile) dist = Math.max(dist, 1.9 / (2 * Math.tan((camera.fov * Math.PI) / 360)) * (1 + boom * 0.2));
        // desktop: wide, short screens (16:9 and wider) would frame it by width alone and push the
        // exploded saddle into the heading, so keep its height within a share of the screen too
        else dist = Math.max(dist, ((1.05 + boom * 0.2) / lerp(0.62, 0.57, boom)) / (2 * Math.tan((camera.fov * Math.PI) / 360)));
        dist *= 1 + (1 - intro) * 0.35;
        const elev = 0.06 + turn * 0.1 + sy * 0.04 * (1 - turn);
        camera.position.set(CENTER[0], CENTER[1] + Math.sin(elev) * dist + boom * 0.04, Math.cos(elev) * dist);
        camera.lookAt(CENTER[0], CENTER[1] + boom * 0.04, 0);
        const shiftX = mobile ? 0 : lerp(0.165, 0, turn) * W;   // (0.2 until the paint rail moved to the right edge)
        // desktop: the exploded bike drops a little, so the saddle and its label clear the heading
        // phones: the hero's bike stands LIFT px higher (the user's call, 2026-11-24), easing out as it turns;
        // the wall light and the giant word follow (--cd-lift in kord.css, same value)
        const LIFT = 56;
        const shiftY = mobile ? lerp(0.13, 0.06, turn) * H + LIFT * (1 - turn) : -0.09 * boom * H;
        camera.setViewOffset(W, H, -shiftX, shiftY, W, H);
        camera.updateProjectionMatrix();

        const settle = S.stepPaint();   // paint eases toward the chosen one

        renderer.render(scene, camera);

        // DOM overlays: hotspots (hero only) and callouts (exploded)
        const heroAlpha = 1 - span(p, 0.02, 0.12);
        for (const h of HOTSPOTS) {
          const el = hotRefs.current[h.id]; if (!el) continue;
          project(h.at[0], h.at[1], h.at[2], pt);
          el.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
          el.classList.toggle("is-left", pt.x > W - 300);      // near the right edge: the card opens to the left
          el.style.opacity = ready ? heroAlpha * intro : 0;
          el.style.visibility = heroAlpha < 0.02 ? "hidden" : "visible";
        }
        CALLOUTS.forEach((c, i) => {
          const el = calloutRefs.current[c.n]; if (!el) return;
          const off = EXPLODE[c.part] || [0, 0, 0];
          project(c.at[0] + off[0] * boom * kx, c.at[1] + off[1] * boom, c.at[2] + off[2] * boom, pt);
          const a = span(p, 0.42 + i * 0.05, 0.5 + i * 0.05) * (1 - span(p, 0.94, 1));
          el.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
          el.style.opacity = a;
          el.style.visibility = a < 0.02 ? "hidden" : "visible";
        });
        // "Drag to turn 360°" sits just under the bike: below the nearest edge of its footprint on the floor
        // (a 0.45 m circle round its middle, so it doesn't bob as the bike turns), centred under its middle
        v.set(CENTER[0], 0, 0.45).project(camera);
        section.style.setProperty("--cd-hint-y", `${((-v.y * 0.5 + 0.5) * H).toFixed(1)}px`);
        v.set(CENTER[0], 0, 0).project(camera);
        section.style.setProperty("--cd-hint-x", `${((v.x * 0.5 + 0.5) * W).toFixed(1)}px`);
        section.style.setProperty("--p", p.toFixed(4));
        section.style.setProperty("--hero", heroAlpha.toFixed(3));
        // the wall light follows the mouse (the same springs as the bike's parallax), sliding over
        // the wall's texture, which stays put; not under reduced motion (touch never moves px/py)
        section.style.setProperty("--cd-lx", `${(reduce ? 0 : sx * 15).toFixed(2)}%`);
        section.style.setProperty("--cd-ly", `${(reduce ? 0 : sy * 11).toFixed(2)}%`);
        const heroOn = heroAlpha > 0.02 ? "on" : "off";
        if (section.dataset.hero !== heroOn) section.dataset.hero = heroOn;

        const moving = dragging || Math.abs(yawVel) > 0.0004 || (yawGoal !== null && Math.abs(yawGoal - yaw) > 0.0005)
          || Math.abs(px - sx) + Math.abs(py - sy) > 0.001 || settle > 0.002 || intro < 1;
        if (moving || now < awakeUntil) raf = requestAnimationFrame(frame);
      };
      const lerp = (a, b, t) => a + (b - a) * t;
      const wake = (ms = 600) => { awakeUntil = Math.max(awakeUntil, performance.now() + ms); if (!raf) raf = requestAnimationFrame(frame); };

      // drag to turn (hero), with inertia; vertical moves scroll the page (touch-action: pan-y)
      const onDown = (e) => {
        if (progress > 0.1 || e.button > 0) return;
        dragging = true; lastX = e.clientX; lastT = performance.now(); yawVel = 0; yawGoal = null;
        viewEl.setPointerCapture?.(e.pointerId); viewEl.classList.add("is-dragging"); wake(400);
      };
      const onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        if (e.pointerType === "mouse") { px = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1); py = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1); wake(900); }
        if (!dragging) return;
        const now = performance.now(), dx = e.clientX - lastX;
        const d = (dx / Math.max(320, r.width)) * 4.2;
        yaw += d; yawVel = d / Math.max(1, now - lastT) * 16; lastX = e.clientX; lastT = now;
        if (Math.abs(dx) > 2) userTurned++;
        wake(400);
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false; viewEl.classList.remove("is-dragging");
        if (reduce) { yawVel = 0; yawGoal = yaw; }
        wake(1500);
      };
      const onKey = (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault(); yawGoal = (yawGoal ?? yaw) + (e.key === "ArrowLeft" ? -0.35 : 0.35); wake(1200);
      };
      const onScroll = () => wake(300);
      viewEl.addEventListener("pointerdown", onDown);
      viewEl.addEventListener("keydown", onKey);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      window.addEventListener("scroll", onScroll, { passive: true });
      const onLeave = () => { px = py = 0; wake(900); };
      document.documentElement.addEventListener("mouseleave", onLeave);
      const ro = new ResizeObserver(size); ro.observe(canvas);
      size();

      api.current = { paint: (p) => S.setPaint(p), wake };

      S.load(ARC.id).then((p) => {
        if (disposed) return;
        parts = p;
        ready = true; setState("ready");
        // the turn-in waits for the preloader (Preloader.js) to lift, so it plays with the entrance
        if (!reduce) {
          if (document.querySelector(".cd-pre:not(.is-done)") && !document.documentElement.classList.contains("cd-pre-skip")) {
            introHold = true;
            const go = () => { introHold = false; introT0 = performance.now(); wake(2200); };
            window.addEventListener("kd:pre-done", go, { once: true });
          } else introT0 = performance.now();
        }
        wake(2200);
      }, (err) => { console.warn("Kord bike failed to load", err); setState("fallback"); });

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect();
        viewEl.removeEventListener("pointerdown", onDown); viewEl.removeEventListener("keydown", onKey);
        window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp); window.removeEventListener("scroll", onScroll);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        api.current = null;
        S.dispose();
      };
      if (disposed) cleanup();
    })();
    return () => { disposed = true; cleanup(); };
  }, []);

  const choose = (p) => { setPaint(p.id); api.current?.paint(p); };
  const onSwatchKey = (e, i) => {
    const k = e.key;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(k)) return;
    e.preventDefault();
    const n = PAINTS.length;
    const j = k === "Home" ? 0 : k === "End" ? n - 1 : (i + (k === "ArrowRight" || k === "ArrowDown" ? 1 : -1) + n) % n;
    choose(PAINTS[j]);
    e.currentTarget.parentElement.children[j]?.focus();
  };
  const cur = PAINTS.find((p) => p.id === paint);

  return (
    <section ref={sectionRef} className="cd-story" data-state={state} aria-label="The Kord Arc">
      <div className="cd-sticky">
        <p className="cd-word" aria-hidden="true">{plain(ARC.name).toUpperCase()}</p>
        <img className="cd-poster" src="/pitch/kord/bike-fallback.webp" width="1600" height="900" alt="" fetchPriority="high" />
        <canvas ref={canvasRef} className="cd-canvas" aria-hidden="true" />
        <div ref={viewRef} className="cd-view" tabIndex={0} role="group" aria-roledescription="3D viewer"
          aria-label="The Kord Arc in 3D. Drag, or use the left and right arrow keys, to turn it." />

        <div className="cd-hero-copy">
          {/* two lines: the first sentence ("Refined speed.") 25% bigger (the user's call, 2026-11-24), a
              break, then the rest; each word in its own mask for the entrance (Words) */}
          <h1 className="cd-h1">{(() => {
            const m = ARC.line.match(/^(.*?[.—])\s*(.+)$/);
            if (!m) return <Words text={ARC.line} />;
            return <><span className="cd-h1-lead"><Words text={m[1]} /></span><Words text={m[2]} start={m[1].split(" ").length} /></>;
          })()}</h1>
          <p className="cd-subhead">Kord® {ARC.name} · {ARC.type} road</p>
          <p className="cd-lede">A 7.4 kg aero bike with 50 mm carbon wheels and wireless 2×12 shifting. Built to order, shipped ride-ready.</p>
          <div className="cd-hero-row">
            <a className="cd-btn cd-btn-primary" href={`/pitch/kord/build/?bike=${ARC.id}`}>Build your {ARC.name}<span className="cd-arrow" aria-hidden="true">→</span></a>
            <span className="cd-price">From <strong>{money(ARC.from)}</strong></span>
          </div>
        </div>

        {/* a hint under the bike (the user's call, 2026-11-24), placed from the 3D view (--cd-hint-x/-y);
            the view's own label says it to screen readers */}
        <p className="cd-drag-hint" aria-hidden="true">Drag to turn 360°</p>

        {/* desktop: a slim rail on the right edge (after the Mustang ad's), a vertical label and the
            swatches in a column on a hairline, each name in a pill on hover or focus; phones: a row */}
        <div className="cd-paints" role="radiogroup" aria-label="Paint">
          <span className="cd-paints-label" aria-hidden="true">Paint · <strong>{cur.name}</strong></span>
          <span className="cd-paints-rail-label" aria-hidden="true">Paint</span>
          <div className="cd-paints-row">
            {PAINTS.map((p, i) => (
              <button key={p.id} type="button" role="radio" aria-checked={p.id === paint} tabIndex={p.id === paint ? 0 : -1}
                aria-label={p.name} data-name={p.name} className="cd-swatch" style={{ "--swatch": p.hex }}
                onClick={() => choose(p)} onKeyDown={(e) => onSwatchKey(e, i)} />
            ))}
          </div>
        </div>

        <ul className="cd-hotspots">
          {HOTSPOTS.map((h, hi) => (
            <li key={h.id} ref={(el) => { hotRefs.current[h.id] = el; }} className={`cd-hot${open === h.id ? " is-open" : ""}`} style={{ "--hi": hi }}
              onPointerEnter={(e) => { if (e.pointerType !== "mouse") return; clearTimeout(hoverT.current); setOpen(h.id); }}
              onPointerLeave={(e) => { if (e.pointerType !== "mouse") return; hoverT.current = setTimeout(() => setOpen((o) => (o === h.id ? null : o)), 180); }}>
              <button type="button" className="cd-hot-btn" aria-expanded={open === h.id} aria-controls={`hot-${h.id}`}
                onClick={() => setOpen(open === h.id ? null : h.id)}>
                <span className="cd-sr">{h.title}</span>
              </button>
              <div id={`hot-${h.id}`} className="cd-hot-card" hidden={open !== h.id}>
                <strong>{h.title}</strong>
                <span>{h.line}</span>
              </div>
            </li>
          ))}
        </ul>

        <ol className="cd-callouts" aria-label="Inside the Arc">
          {CALLOUTS.map((c) => (
            <li key={c.n} ref={(el) => { calloutRefs.current[c.n] = el; }} className={`cd-callout${c.side === "left" ? " is-left" : ""}`}>
              <span className="cd-callout-dot" aria-hidden="true" />
              <span className="cd-callout-body">
                <span className="cd-callout-n">{c.n}</span>
                <strong>{c.title}</strong>
                <span>{c.line}</span>
              </span>
            </li>
          ))}
        </ol>

        <ol className="cd-legend" aria-hidden="true">
          {CALLOUTS.map((c) => <li key={c.n}><span className="cd-callout-n">{c.n}</span><strong>{c.title}</strong> {c.line}</li>)}
        </ol>

        <div className="cd-story-head">
          <h2 className="cd-h2">Inside the {ARC.name}</h2>
          <p>Every part chosen for the bike, not the spec sheet.</p>
        </div>
        <p className="cd-scroll-cue" aria-hidden="true">Scroll to take it apart</p>
        <ul className="cd-specs" aria-label="Arc at a glance">
          {SPECS.map((s) => (
            <li key={s.label}><span className="cd-spec-v">{s.value}<small>{s.unit}</small></span><span className="cd-spec-l">{s.label}</span></li>
          ))}
        </ul>
      </div>

    </section>
  );
}
