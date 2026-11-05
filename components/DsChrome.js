"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// The design-system pages' own chrome (Viteo and Hearthside): they have no
// site header. ≥1200px, a sticky full-height sidebar — the logo (home), the
// numbered sections (the case studies' index: the current one marked with
// aria-current while it crosses a band ~40% down the screen), then "Back to …
// home" at its foot (and `toggle`, if passed). Below 1200px, Viteo's top bar
// and full-screen menu: the logo left, the menu button right, the sections as
// the menu's links (a tap closes it and scrolls there), back home at its foot. `prefix` ("dl" / "hs") names the classes, so each pitch
// styles it in its own tokens (its css/design-system.css). Jumps only scroll:
// no hash in the URL (Next treats history.replaceState as a navigation, which
// ran the pitch's page view transition).
export default function DsChrome({ prefix: p, sections, logo, logoIsLink, home, homeLabel, homeClass, burgerClass = "", toggle, linkIcon, toTopClass, toTopIcon }) {
  const [active, setActive] = useState(sections[0]?.[0]);
  const [open, setOpen] = useState(false);
  const [far, setFar] = useState(false); // a screen down: show back-to-top (if the page asks for one)
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const barRef = useRef(null);
  const ids = sections.map(([id]) => id).join(" ");

  useEffect(() => {
    const els = ids.split(" ").map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -59% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  // Below 1200px the top bar slides up out of view while the page scrolls
  // down and comes back on any scroll up (8px jitter threshold; always shown
  // within 96px of the top). The class only; the CSS does the movement.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const TOP = 96, STEP = 8;
    let last = Math.max(0, window.scrollY), raf = 0;
    const check = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      if (y < TOP) { bar.classList.remove("is-hidden"); last = y; return; }
      const d = y - last;
      if (Math.abs(d) < STEP) return;
      bar.classList.toggle("is-hidden", d > 0);
      last = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (!toTopClass) return;
    const check = () => setFar(window.scrollY > window.innerHeight);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [toTopClass]);
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };

  // The menu: page scroll locked while open; Esc or widening to the sidebar
  // closes it; focus moves in and returns to the menu button.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); burgerRef.current?.focus(); } };
    const wide = window.matchMedia("(min-width: 1200px)");
    const onWide = (e) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    menuRef.current?.querySelector("a")?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const go = (id) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  const jump = (id) => (e) => { e.preventDefault(); go(id); };
  const jumpFromMenu = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => go(id)); // after the scroll lock lifts
  };

  // `logoIsLink`: the logo already links home (Hearthside's Logo), so it isn't wrapped in another link.
  const logoLink = logoIsLink
    ? <span className={`${p}-dsc-logo`}>{logo}</span>
    : <Link href={home} className={`${p}-dsc-logo`} aria-label={homeLabel.replace(/^Back to /, "")}>{logo}</Link>;
  const back = <Link href={home} className={homeClass}>{homeLabel}</Link>;

  return (
    <>
      <div ref={barRef} className={`${p}-dsc-bar`}>
        {logoLink}
        <button ref={burgerRef} type="button" className={`${p}-dsc-burger ${burgerClass}`.trim()} aria-label="Open the design system menu" aria-expanded={open} aria-controls={`${p}-dsc-menu`} onClick={() => setOpen(true)}>
          <span /><span />
        </button>
      </div>
      <div id={`${p}-dsc-menu`} ref={menuRef} className={`${p}-dsc-menu${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Design system menu" inert={!open}>
        <div className={`${p}-dsc-menu-top`}>
          {logoLink}
          <button type="button" className={`${p}-dsc-burger is-x ${burgerClass}`.trim()} aria-label="Close the menu" onClick={() => { setOpen(false); burgerRef.current?.focus(); }}>
            <span /><span />
          </button>
        </div>
        <nav className={`${p}-dsc-menu-nav`} aria-label="Sections">
          {sections.map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={jumpFromMenu(id)} style={{ "--i": i }} aria-current={id === active ? "location" : undefined}>
              {label}{linkIcon}
            </a>
          ))}
        </nav>
        <div className={`${p}-dsc-menu-foot`} style={{ "--i": sections.length }}>{back}{toggle}</div>
      </div>
      <aside className={`${p}-dsc-side`}>
        {logoLink}
        <nav className={`${p}-ds-rail`} aria-label="Sections">
          <ol>
            {sections.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`} onClick={jump(id)} aria-current={id === active ? "location" : undefined}>
                  <span className={`${p}-ds-rail-num`}>{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className={`${p}-dsc-foot`}>{back}{toggle}</div>
      </aside>
      {toTopClass && (
        <button type="button" className={`${p}-dsc-totop ${toTopClass}${far ? "" : " is-hidden"}`} onClick={toTop} aria-label="Back to top" tabIndex={far ? undefined : -1} aria-hidden={far ? undefined : true}>
          {toTopIcon}
        </button>
      )}
    </>
  );
}
