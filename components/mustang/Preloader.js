"use client";

import { useEffect, useRef } from "react";

// The opening: the page's S650 / MUSTANG lockup, large and centred, its hairline
// drawing across, the words rising out of their masks and the four slashes
// lighting one after another while the car loads. When the stage is ready (or
// has fallen back to the image) and the fonts are in, the slashes all light,
// the lockup lifts and the cover fades, and the page's own entrance (held
// while the cover is up, mustang.css) plays. At least 1.4s so it reads, at most
// 8s; without JS a CSS timer fades it out.
// The car gets GRACE ms (2026-11-26): past that the cover lifts as soon as the fonts and the car's still
// (car-fallback.webp, shown in the stage until the 3D car is ready — mustang.css) are in, and the 3D car
// glides in over the still when it's ready. Waiting for the 2.4 MB model held a throttled phone under the
// cover for ~7s, and Lighthouse read 56-59 (as Kord, whose preloader does the same).
const MIN = 1400, GRACE = 2200, MAX = 8000;
const STILL = "/builds/mustang/car-fallback.webp";

export default function Preloader() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const stage = document.querySelector(".ms-stage");
    const start = performance.now();
    let done = false, t1 = 0, t2 = 0, cap = 0, mo = null;
    // The page holds still under the cover, but keeps its scrollbar (as on Viteo and Hearthside;
    // hiding the overflow took the scrollbar away and the layout shifted when it came back):
    // wheel, touch drags and scroll keys do nothing, and a dragged scrollbar snaps back.
    const y0 = window.scrollY;
    const KEYS = new Set([" ", "PageDown", "PageUp", "End", "Home", "ArrowDown", "ArrowUp"]);
    const stop = (e) => { if (e.type !== "keydown" || KEYS.has(e.key)) e.preventDefault(); };
    const hold = () => { if (window.scrollY !== y0) window.scrollTo({ top: y0, behavior: "instant" }); };
    const opts = { passive: false };
    window.addEventListener("wheel", stop, opts); window.addEventListener("touchmove", stop, opts);
    window.addEventListener("keydown", stop); window.addEventListener("scroll", hold);
    const release = () => {
      window.removeEventListener("wheel", stop, opts); window.removeEventListener("touchmove", stop, opts);
      window.removeEventListener("keydown", stop); window.removeEventListener("scroll", hold);
    };
    const finish = () => {
      if (done) return; done = true;
      mo?.disconnect(); clearTimeout(cap);
      t1 = setTimeout(() => {
        release();
        el.classList.add("is-done");                                     // slashes all lit, lockup lifts, cover fades
        t2 = setTimeout(() => el.classList.add("is-gone"), 900);
      }, Math.max(0, MIN - (performance.now() - start)));
    };
    const isReady = () => stage && stage.dataset.state && stage.dataset.state !== "loading";
    const check = () => { if (isReady()) document.fonts.ready.then(finish); };
    if (stage) { mo = new MutationObserver(check); mo.observe(stage, { attributes: true, attributeFilter: ["data-state"] }); }
    check();
    // the car is slow: go with the still
    const still = new Image(); still.src = STILL;
    const stillIn = still.decode ? still.decode().catch(() => {}) : Promise.resolve();
    const grace = setTimeout(() => Promise.all([document.fonts.ready, stillIn]).then(finish), GRACE);
    cap = setTimeout(finish, MAX);
    return () => { release(); mo?.disconnect(); clearTimeout(cap); clearTimeout(grace); clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div className="ms-pre" ref={ref} aria-hidden="true">
      <div className="ms-pre-lockup">
        <span className="ms-pre-row"><span className="ms-pre-word">S650</span></span>
        <i className="ms-pre-rule" />
        <span className="ms-pre-row">
          <span className="ms-pre-word">Mustang</span>
          <span className="ms-pre-slashes"><i /><i /><i /><i /><b /></span>
        </span>
      </div>
    </div>
  );
}
