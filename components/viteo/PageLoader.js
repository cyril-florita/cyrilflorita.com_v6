"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BASE } from "./data";
import { LogoMark } from "./ui";

// Before a page shows (a full load of any page but the landing, which has its
// own intro preloader): the pre-paint script in layout.js puts .is-loading on
// the root, so the loader covers the very first paint; it lifts once fonts
// are in (and, on desktop, the moving background has drawn), after at least
// FIRST ms. A CSS failsafe lifts it after 5s if this never runs.
// Between pages, in order: a click on a link to another Viteo page is held;
// the preloader (the logo's capsules spinning over the page colour, as on the
// landing's first load) slides down from the top over the page, like a
// curtain; only once it covers the screen does the navigation run, behind it;
// once the new page is in (and at least MIN ms have passed) it slides back up. The overlay has its own
// view-transition-name, so the route change's view transition (which the
// browser draws above the whole page) keeps it on top instead of showing the
// pages swapping. Entrance animations wait for it via afterPreloader().
// Going to the landing, it hands over to the landing's own intro preloader
// (identical) without moving. Programmatic
// hand-offs (the quiz finale, checkout) don't go through links, so their pack
// morph stays visible. Off under reduced motion. Renders one overlay.
// Every preloader plays its animation for at least 2s, even on a fast connection,
// rather than flashing up and straight off.
const MIN = 2000, MAX = 5000, FIRST = 2000, COVER = 500, LEAVE = 540; // its slide in / out, in viteo.css

// Runs `cb` once no preloader covers the page and its fade-out has finished
// (first-load .is-loading, the landing's .is-intro-pending, or the between-
// pages overlay) — for entrance animations that should play in view, like the
// account's chart drawing in. Runs at once if nothing covers it. Returns a
// cancel function.
export function afterPreloader(cb) {
  const root = document.querySelector(".dl");
  const loader = document.querySelector(".dl-pageloader");
  const covered = () =>
    !!root && (root.classList.contains("is-loading") || root.classList.contains("is-intro-pending") ||
      !!loader && (loader.classList.contains("is-on") || loader.classList.contains("is-leaving")));
  if (!covered()) { cb(); return () => {}; }
  let t = 0;
  const mo = new MutationObserver(() => {
    if (covered()) return;
    mo.disconnect();
    t = setTimeout(cb, 0); // .is-leaving is only dropped once the slide-out has finished
  });
  mo.observe(root, { attributes: true, attributeFilter: ["class"] });
  if (loader) mo.observe(loader, { attributes: true, attributeFilter: ["class"] });
  return () => { mo.disconnect(); clearTimeout(t); };
}

export default function PageLoader() {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState("off"); // off | on | leaving | instant-off (handed over to the landing's preloader)
  const started = useRef(0);
  const target = useRef(null);
  const on = state === "on";

  // First load (a page other than the landing): covered from the first paint
  // by .is-loading; slid up once fonts and, on desktop, the moving
  // background are ready, after at least FIRST ms.
  useEffect(() => {
    const root = document.querySelector(".dl");
    if (!root?.classList.contains("is-loading")) return;
    let done = false;
    const lift = () => {
      if (done) return;
      done = true;
      // Slide it up: mark it leaving before dropping .is-loading, so
      // nothing waiting on afterPreloader() sees an uncovered moment.
      document.querySelector(".dl-pageloader")?.classList.add("is-leaving");
      root.classList.remove("is-loading");
      setState("leaving");
    };
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)").matches;
    const shader = new Promise((res) => {
      if (!desktop || root.classList.contains("has-ambient")) return res();
      const mo = new MutationObserver(() => root.classList.contains("has-ambient") && (mo.disconnect(), res()));
      mo.observe(root, { attributes: true, attributeFilter: ["class"] });
      setTimeout(() => { mo.disconnect(); res(); }, 1500);
    });
    const minTime = new Promise((res) => setTimeout(res, Math.max(0, FIRST - performance.now())));
    Promise.all([document.fonts?.ready, shader, minTime]).then(lift);
    const t = setTimeout(lift, MAX);
    return () => clearTimeout(t);
  }, []);

  // 1. A click on a link to another Viteo page: hold it and slide down.
  useEffect(() => {
    // Capture phase: runs before next/link's handler, which then sees the
    // prevented default and leaves the navigation to us.
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || !url.pathname.startsWith(BASE)) return;
      if (url.pathname === window.location.pathname) return; // same page: anchors, query changes
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault();
      started.current = performance.now();
      target.current = url.pathname + url.search + url.hash;
      setState("on");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // 2. Covered: navigate behind it.
  useEffect(() => {
    if (!on || !target.current) return;
    const t = setTimeout(() => { const href = target.current; target.current = null; router.push(href); }, COVER);
    return () => clearTimeout(t);
  }, [on, router]);

  // 3. The new page is in: after the loader's beat, slide it up (or, on the
  // landing, hand straight over to its identical intro preloader).
  useEffect(() => {
    if (!on || target.current) return;
    const root = document.querySelector(".dl");
    const t = setTimeout(() => {
      setState(root?.classList.contains("is-intro-pending") ? "instant-off" : "leaving");
    }, Math.max(0, MIN - (performance.now() - started.current)));
    return () => clearTimeout(t);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Up and out of view: hidden, ready for the next one.
  useEffect(() => {
    if (state !== "leaving") return;
    const t = setTimeout(() => setState("off"), LEAVE);
    return () => clearTimeout(t);
  }, [state]);

  // Failsafe: never stay up if a navigation stalls or was cancelled.
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => { target.current = null; setState("leaving"); }, MAX);
    return () => clearTimeout(t);
  }, [on]);

  return (
    <div className={`dl-pageloader ${on ? "is-on" : ""} ${state === "leaving" ? "is-leaving" : ""} ${state === "instant-off" ? "is-instant" : ""}`} aria-hidden="true">
      <span className="dl-preloader-mark"><LogoMark /></span>
      <span className="dl-preloader-word">viteo</span>
    </div>
  );
}
