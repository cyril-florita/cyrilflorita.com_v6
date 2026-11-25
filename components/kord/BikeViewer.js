"use client";

import { useEffect, useRef, useState } from "react";
import { CENTER, loadThree, createBikeScene } from "@/components/kord/bikeScene";

// Find your bike's result and the builder's stage: the bike in its studio (bikeScene.js), in the matched bike's paint. It
// turns in from side-on to face you, can be dragged (with inertia) or turned with the arrow keys,
// and repaints (with a small turn) when the match changes. Renders on demand only. No WebGL, or the
// model fails -> the matched bike's range still (`still`).

const FACE_YAW = -0.5;        // three.js y rotation: front (+x) swung toward the camera
const SIDE_YAW = -1.45;       // where the turn-in starts
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t) => 1 - Math.pow(1 - t, 3);

// `place` (optional, desktop only, ≥900px): where the bike stands when the viewer is a whole section's
// backdrop (Find your bike's result) — `fit`, the share of the width it fills, and `x` / `y`, its center
// as a share of the width / height; otherwise it's centered and fills 86%.
// `spec` (the builder): { group, rim, size } — the groupset's finish, the wheels' rim depth (m) and the frame size on the bike.
export default function BikeViewer({ bike = "arc", paint, still, label, className = "", place = null, spec = null }) {
  const stageRef = useRef(null), canvasRef = useRef(null), viewRef = useRef(null), api = useRef(null);
  // the latest paint: the scene is built after three.js loads, by which time the page may have
  // changed it (the builder reads ?paint= after hydration), so it starts from this, not the first one
  const paintRef = useRef(paint), bikeRef = useRef(bike), placeRef = useRef(place), specRef = useRef(spec);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const canvas = canvasRef.current, viewEl = viewRef.current;
    let disposed = false, cleanup = () => {};
    (async () => {
      let T;
      try { T = await loadThree(); } catch { setState("fallback"); return; }
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wideMq = matchMedia("(min-width: 900px)");
      const S = createBikeScene(T, canvas, { paint: paintRef.current, onWake: (ms) => wake(ms) });
      if (!S) { setState("fallback"); return; }
      const { renderer, scene, camera, pivot } = S;


      let W = 1, H = 1, raf = 0, awakeUntil = 0, ready = false;
      let yaw = reduce ? FACE_YAW : SIDE_YAW, yawVel = 0, yawGoal = FACE_YAW, dragging = false, lastX = 0, lastT = 0;
      const size = () => {
        const r = canvas.getBoundingClientRect();
        W = Math.max(1, r.width); H = Math.max(1, r.height);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(W, H, false);
        wake(200);
      };
      const frame = () => {
        raf = 0;
        if (!dragging) {
          if (yawGoal !== null) yaw += (yawGoal - yaw) * (reduce ? 1 : 0.06);
          else { yaw += yawVel; yawVel *= 0.93; if (Math.abs(yawVel) < 0.0004) { yawVel = 0; yawGoal = null; } }
        }
        pivot.rotation.y = yaw;
        // frame the whole bike in the stage, a little above the floor (or where `place` puts it)
        camera.aspect = W / H;
        const at = placeRef.current && wideMq.matches ? placeRef.current : null;
        const fit = at ? at.fit : 0.86;
        const hf = 2 * Math.atan(Math.tan((camera.fov * Math.PI) / 360) * camera.aspect);
        const vf = (camera.fov * Math.PI) / 180;
        const dist = Math.max((1.8 / fit) / (2 * Math.tan(hf / 2)), (1.1 / 0.78) / (2 * Math.tan(vf / 2)));
        if (at) camera.setViewOffset(W, H, -(at.x - 0.5) * W, ((at.y ?? 0.5) - 0.5) * -H, W, H); else camera.clearViewOffset();
        const elev = 0.09;
        camera.position.set(CENTER[0], CENTER[1] + Math.sin(elev) * dist, Math.cos(elev) * dist);
        camera.lookAt(CENTER[0], CENTER[1] - 0.02, 0);
        camera.updateProjectionMatrix();
        const settle = S.stepPaint(reduce ? 1 : 0.1);
        renderer.render(scene, camera);
        const moving = dragging || Math.abs(yawVel) > 0.0004 || (yawGoal !== null && Math.abs(yawGoal - yaw) > 0.0005) || settle > 0.002;
        if (moving || performance.now() < awakeUntil) raf = requestAnimationFrame(frame);
      };
      const wake = (ms = 600) => { awakeUntil = Math.max(awakeUntil, performance.now() + ms); if (!raf) raf = requestAnimationFrame(frame); };

      const onDown = (e) => {
        if (e.button > 0) return;
        dragging = true; lastX = e.clientX; lastT = performance.now(); yawVel = 0; yawGoal = null;
        viewEl.setPointerCapture?.(e.pointerId); viewEl.classList.add("is-dragging"); wake(400);
      };
      const onMove = (e) => {
        if (!dragging) return;
        const now = performance.now(), dx = e.clientX - lastX, d = (dx / Math.max(320, W)) * 4.2;
        yaw += d; yawVel = d / Math.max(1, now - lastT) * 16; lastX = e.clientX; lastT = now; wake(400);
      };
      const onUp = () => { if (!dragging) return; dragging = false; viewEl.classList.remove("is-dragging"); if (reduce) { yawVel = 0; yawGoal = yaw; } wake(1500); };
      const onKey = (e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault(); yawGoal = (yawGoal ?? yaw) + (e.key === "ArrowLeft" ? -0.35 : 0.35); wake(1200);
      };
      viewEl.addEventListener("pointerdown", onDown); viewEl.addEventListener("keydown", onKey);
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onUp);
      const ro = new ResizeObserver(size); ro.observe(canvas); size();

      // a new match: repaint, and turn in again from a little further round
      const turnIn = () => { if (!reduce && ready) { yaw = FACE_YAW - 0.9; yawGoal = FACE_YAW; } wake(1600); };
      api.current = {
        paint: (p) => { S.setPaint(p); turnIn(); },
        spec: (sp) => S.setSpec(sp || {}),
        // another model: swap it in once it's loaded, then turn in again
        model: (id) => S.load(id).then(() => { if (!disposed) turnIn(); }, (err) => console.warn("Kord bike failed to load", err)),
      };

      if (specRef.current) S.setSpec(specRef.current);
      S.load(bikeRef.current).then(() => {
        if (disposed) return;
        ready = true; setState("ready"); wake(2600);
      }, (err) => { console.warn("Kord bike failed to load", err); setState("fallback"); });

      cleanup = () => {
        cancelAnimationFrame(raf); ro.disconnect();
        viewEl.removeEventListener("pointerdown", onDown); viewEl.removeEventListener("keydown", onKey);
        window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp);
        api.current = null; S.dispose();
      };
      if (disposed) cleanup();
    })();
    return () => { disposed = true; cleanup(); };
    // the scene is built once; paint changes go through api.current (below)
  }, []);

  useEffect(() => { paintRef.current = paint; api.current?.paint(paint); }, [paint]);
  const specKey = spec ? `${spec.group}|${spec.rim}|${spec.size}` : "";
  useEffect(() => { specRef.current = spec; api.current?.spec(spec); }, [specKey]); // eslint-disable-line react-hooks/exhaustive-deps
  // another bike chosen (the builder, a new Find your bike match): its own model
  useEffect(() => { if (bikeRef.current === bike) return; bikeRef.current = bike; api.current?.model(bike); }, [bike]);

  return (
    <div ref={stageRef} className={`cd-studio cd-viewer ${className}`} data-state={state}>
      <img className="cd-viewer-still" src={still} width="1200" height="720" alt="" />
      <canvas ref={canvasRef} className="cd-canvas" aria-hidden="true" />
      <div ref={viewRef} className="cd-view" tabIndex={0} role="group" aria-roledescription="3D viewer"
        aria-label={`${label} in 3D. Drag, or use the left and right arrow keys, to turn it.`} />
    </div>
  );
}
