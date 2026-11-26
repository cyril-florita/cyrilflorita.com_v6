"use client";

import { useEffect, useRef } from "react";
import InlineScript from "@/components/InlineScript";
import { WORDMARK } from "@/components/kord/wordmark";

// Kord's cover (after Mustang's), on every page since 2026-11-25 (the user's call; it was the landing's only): Kord's
// mark, large and centered, its chartreuse arc turning like a pedal stroke, the stretched KORD rising out of a mask,
// and a thin bar filling while the page gets ready. The page's 3D — the landing's story or a page's BikeViewer
// (`data-state` leaving `loading`) — and the fonts: then the bar fills, the lockup lifts, the cover fades,
// `kd:pre-done` fires (BikeStory turns the bike in) and the page's entrance, held while the cover is up (kord.css),
// plays. A page with no 3D waits only for the fonts. The 3D gets GRACE ms; past that the cover lifts as soon as the
// fonts and the bike's still are in, and the 3D crossfades in over the still when it's ready (2026-11-25: on a
// throttled phone the cover held the page for the 3D, and Lighthouse's speed index read 5.8s). At least 1.2s on the
// landing (0.7s elsewhere) so it reads, at most 8s; a CSS timer lifts it after 9s without JS. Skipped (before first
// paint, by the inline script) on links into a section (a hash, e.g. a shared Find your bike result) and under
// reduced motion.
// Between pages: a click on a link to another Kord page fades the cover in (0.38s) before the browser leaves, so
// leaving and arriving read as one move; Back from the next page (the back/forward cache) clears it.
const MIN_HOME = 1200, MIN_PAGE = 700, GRACE = 2200, MAX = 8000, LEAVE = 380;
// (2026-11-25 to -26 an app page's content also stayed invisible under the cover until the fonts were in, to stop
// a font-swap layout shift on Compare — CLS 0.107 — at the cost of a later largest paint; the shift itself was then
// fixed in compare.css, every Kord page measured with no movement at all on the swap, and the hiding was removed.)
const SKIP = `if(location.hash||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("cd-pre-skip")`;

export default function Preloader() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const done = (fast) => {
      el.classList.add("is-done"); window.__kdPreDone = true;
      window.dispatchEvent(new Event("kd:pre-done"));
      return setTimeout(() => el.classList.add("is-gone"), fast ? 0 : 800);
    };
    // leaving for another Kord page: the cover fades in, then the browser goes
    let leaveT = 0;
    const reduceMq = matchMedia("(prefers-reduced-motion: reduce)");
    const onClick = (e) => {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduceMq.matches) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.closest("[data-open-find]")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith("/builds/kord/")) return;
      if (url.hash === "#find") return;                                                        // Help me choose's dialog
      if (url.pathname === location.pathname && url.search === location.search) return;       // a section on this page
      e.preventDefault();
      el.classList.remove("is-done", "is-gone"); el.style.setProperty("--p", "0");
      el.classList.add("is-leaving");
      clearTimeout(leaveT); leaveT = setTimeout(() => { location.href = url.href; }, LEAVE);
    };
    const onShow = (e) => { if (!e.persisted) return; clearTimeout(leaveT); el.classList.remove("is-leaving"); el.classList.add("is-done", "is-gone"); };
    document.addEventListener("click", onClick);
    window.addEventListener("pageshow", onShow);
    const unlisten = () => { clearTimeout(leaveT); document.removeEventListener("click", onClick); window.removeEventListener("pageshow", onShow); };

    if (document.documentElement.classList.contains("cd-pre-skip")) { const t = done(true); return () => { clearTimeout(t); unlisten(); }; }

    const story = document.querySelector(".cd-story");
    const target = story || document.querySelector(".cd-viewer");     // the page's 3D, if it has one
    const MIN = story ? MIN_HOME : MIN_PAGE;
    const start = performance.now();
    let finished = false, raf = 0, t1 = 0, t2 = 0, t3 = 0, cap = 0, mo = null, p = 0, floor = 0;
    const poster = story ? story.querySelector(".cd-poster") : target?.querySelector(".cd-viewer-still");
    const posterIn = !poster || poster.complete ? Promise.resolve()
      : new Promise((r) => { poster.addEventListener("load", r, { once: true }); poster.addEventListener("error", r, { once: true }); });
    // the page holds still under the cover but keeps its scrollbar (as on Mustang, Viteo and Hearthside)
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
    // the bar: creeps toward 90% while loading (fonts in: at least 30%), fills on ready
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      p = Math.max(floor, 0.9 * (1 - Math.exp(-t / 1.6)));
      el.style.setProperty("--p", p.toFixed(3));
      if (!finished) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    document.fonts?.ready.then(() => { floor = Math.max(floor, 0.3); });
    const finish = () => {
      if (finished) return; finished = true;
      mo?.disconnect(); clearTimeout(cap); cancelAnimationFrame(raf);
      el.style.setProperty("--p", "1");
      t1 = setTimeout(() => { release(); t2 = done(false); }, Math.max(350, MIN - (performance.now() - start)));
    };
    const isReady = () => !target || (target.dataset.state && target.dataset.state !== "loading");
    const check = () => { if (isReady()) (document.fonts?.ready ?? Promise.resolve()).then(finish); };
    if (target) { mo = new MutationObserver(check); mo.observe(target, { attributes: true, attributeFilter: ["data-state"] }); }
    check();
    t3 = setTimeout(() => Promise.all([document.fonts?.ready, posterIn]).then(finish), GRACE);   // the 3D is slow: go with the still
    cap = setTimeout(finish, MAX);
    return () => { release(); unlisten(); mo?.disconnect(); cancelAnimationFrame(raf); [t1, t2, t3, cap].forEach(clearTimeout); };
  }, []);

  return (
    <>
      <InlineScript html={SKIP} />
      <div className="cd-pre" ref={ref} aria-hidden="true">
        <div className="cd-pre-lockup">
          <svg className="cd-pre-mark" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.28" />
            <path className="cd-pre-arc" d="M16 3.5 A12.5 12.5 0 1 1 3.5 16" fill="none" stroke="var(--cd-accent)" strokeWidth="3" strokeLinecap="round" />
            <circle cx="16" cy="16" r="3.2" fill="currentColor" />
          </svg>
          <span className="cd-pre-row">
            <svg className="cd-pre-word" viewBox={WORDMARK.viewBox} style={{ aspectRatio: WORDMARK.ratio }} aria-hidden="true" focusable="false"><path d={WORDMARK.d} fill="currentColor" /></svg>
            <span className="cd-reg">®</span>
          </span>
          <i className="cd-pre-bar"><b /></i>
        </div>
      </div>
    </>
  );
}
