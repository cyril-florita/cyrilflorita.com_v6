"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { BASE, NAV, PHONE } from "./data";
import { Button, Icon, Logo } from "./ui";

// Light / dark, saved as localStorage `hs-mode`. The pre-paint script in
// layout.js applies the saved choice (else the OS preference) before first
// paint; this keeps the button in sync and saves changes.
export function ModeSwitch() {
  const [mode, setMode] = useState(null);
  // Follows the attribute, so several switches on one page (the design
  // system shows one beside the footer's) stay in step.
  useEffect(() => {
    const root = document.querySelector(".hs");
    if (!root) return;
    const read = () => setMode(root.getAttribute("data-hs-mode") || "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-hs-mode"] });
    return () => mo.disconnect();
  }, []);
  const next = mode === "dark" ? "light" : "dark";
  const toggle = () => {
    const root = document.querySelector(".hs");
    root?.setAttribute("data-hs-mode", next);
    try { localStorage.setItem("hs-mode", next); } catch {}
    setMode(next);
  };
  return (
    <button className="hs-mode" type="button" onClick={toggle} aria-label={mode ? `Switch to ${next} mode` : "Switch colour mode"}>
      <Icon name={mode === "dark" ? "sun" : "moon"} size={22} />
    </button>
  );
}

const norm = (p) => (p || "/").replace(/\/+$/, "") || "/";

export function Header() {
  const pathname = norm(usePathname());
  const stripRef = useRef(null);

  // Phones and tablets (≤1080px): the nav is a horizontal strip under the
  // logo row that scrolls sideways. The current page's link is scrolled into
  // view, and fades mark whichever edge has more links past it.
  useEffect(() => {
    const ul = stripRef.current;
    if (!ul) return;
    const edges = () => {
      const start = ul.scrollLeft > 4, end = ul.scrollLeft + ul.clientWidth < ul.scrollWidth - 4;
      for (const el of [ul, ul.parentElement]) { el.toggleAttribute("data-more-start", start); el.toggleAttribute("data-more-end", end); }
    };
    const current = ul.querySelector('[aria-current="page"]');
    if (current && ul.scrollWidth > ul.clientWidth) ul.scrollTo({ left: current.parentElement.offsetLeft - 16 });
    edges();
    ul.addEventListener("scroll", edges, { passive: true });
    window.addEventListener("resize", edges);
    return () => { ul.removeEventListener("scroll", edges); window.removeEventListener("resize", edges); };
  }, [pathname]);

  // Scrolling down slides the sticky header up out of view and the contact
  // dock down; scrolling up brings both back (every screen size). Both stay
  // near the top of the page and while keyboard focus is in either. The class
  // lives on the .hs root; the CSS does the (gentle, reduced-motion-aware)
  // movement.
  useEffect(() => {
    const root = document.querySelector(".hs");
    if (!root) return;
    const TOP = 96, STEP = 8;
    let last = Math.max(0, window.scrollY), raf = 0;
    const set = (hide) => root.classList.toggle("is-scroll-hidden", hide);
    const check = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      if (y < TOP || document.activeElement?.closest?.(".hs-header, .hs-dock")) { set(false); last = y; return; }
      const d = y - last;
      if (Math.abs(d) < STEP) return; // ignore jitter; keep the anchor until a real move
      set(d > 0);
      last = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", check);
    check();
    return () => { window.removeEventListener("scroll", onScroll); document.removeEventListener("focusin", check); cancelAnimationFrame(raf); set(false); };
  }, []);

  return (
    <header className="hs-header">
      <div className="hs-wrap hs-header-row">
        <Logo />
        <nav className="hs-nav" aria-label="Main">
          <ul ref={stripRef}>
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={pathname === norm(l.href) ? "page" : undefined}>
                  {l.short ? <><span className="hs-nav-full">{l.label}</span><span className="hs-nav-short">{l.short}</span></> : l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hs-header-actions">
          <ModeSwitch />
        </div>
      </div>
    </header>
  );
}

// "Is this ZIP code in your service area?" Pure lookup against the sample
// list; it only says whether we serve the address, nothing about coverage.
export function ZipCheck({ areas, compact, onResult }) {
  const id = useId();
  const [zip, setZip] = useState("");
  const [result, setResult] = useState(null);
  const index = useMemo(() => {
    const m = new Map();
    for (const a of areas) for (const [town, zips] of a.communities) for (const z of zips) m.set(z, { town, area: a.name });
    return m;
  }, [areas]);
  const check = (e) => {
    e.preventDefault();
    const z = zip.trim();
    if (!/^\d{5}$/.test(z)) return setResult({ kind: "invalid" });
    const hit = index.get(z);
    const res = hit ? { kind: "yes", z, ...hit } : { kind: "no", z };
    setResult(res);
    onResult?.(res);
  };
  return (
    <form className={`hs-zip${compact ? " is-compact" : ""}`} onSubmit={check} noValidate>
      <label htmlFor={`${id}-zip`}>Check your ZIP code</label>
      <div className="hs-zip-row">
        <input id={`${id}-zip`} className="hs-input" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="e.g. 91355"
          value={zip} onChange={(e) => { setZip(e.target.value.replace(/\D/g, "")); setResult(null); }}
          aria-describedby={`${id}-result`} />
        <button className="hs-btn hs-btn-secondary" type="submit">Check</button>
      </div>
      <p id={`${id}-result`} className={`hs-zip-result${result ? ` is-${result.kind}` : ""}`} role="status">
        {result?.kind === "yes" && <><Icon name="check" size={20} /> Yes, we serve {result.z} ({result.town}, {result.area}).</>}
        {result?.kind === "no" && <><Icon name="info" size={20} /> {result.z} is outside our service area. Call us and we&rsquo;ll help you find an agency nearby.</>}
        {result?.kind === "invalid" && <>Please enter a 5-digit ZIP code.</>}
      </p>
    </form>
  );
}

// Colour scheme: Tide (cool, the default) or Shore (warm and cool combined), saved as
// localStorage `hs-theme` and applied before first paint by layout.js.
// A radio group of swatches, in the preview bar with the other demo notes.
// Each swatch: the scheme's page and its signature colour, light then dark
// (hearthside.css shows the pair for the current mode).
const THEMES = [
  { id: "tide", name: "Tide", a: "#F2F5F7", b: "#1F5E8C", aDark: "#10161C", bDark: "#7FB6E0" },
  { id: "shore", name: "Shore", a: "#F6F2EA", b: "#1A2430", aDark: "#121820", bDark: "#EE9466" },
];
export function ThemeSwitch() {
  const [theme, setTheme] = useState("tide");
  useEffect(() => {
    setTheme(document.querySelector(".hs")?.getAttribute("data-hs-theme") || "tide"); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  const pick = (id) => {
    document.querySelector(".hs")?.setAttribute("data-hs-theme", id);
    try { localStorage.setItem("hs-theme", id); } catch {}
    setTheme(id);
  };
  // Arrow keys move between options, as in any radio group.
  const onKey = (e) => {
    const i = THEMES.findIndex((t) => t.id === theme);
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = THEMES[(i + d + THEMES.length) % THEMES.length];
    pick(next.id);
    e.currentTarget.querySelector(`[data-id="${next.id}"]`)?.focus();
  };
  return (
    <div className="hs-theme">
      <span className="hs-theme-label" id="hs-theme-label">Colour scheme</span>
      <div className="hs-theme-opts" role="radiogroup" aria-labelledby="hs-theme-label" onKeyDown={onKey}>
        {THEMES.map((t) => (
          <button key={t.id} data-id={t.id} type="button" role="radio" aria-checked={theme === t.id} tabIndex={theme === t.id ? 0 : -1}
            className="hs-theme-opt" onClick={() => pick(t.id)}>
            <span className="hs-theme-dot" style={{ "--a": t.a, "--b": t.b, "--a-dark": t.aDark, "--b-dark": t.bDark }} aria-hidden="true" />
            <span className="hs-theme-name">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// The contact dock: the site's one home for "talk to us" (the header carries
// none). A floating pill on desktop, aligned with the content's left edge
// (a back-to-top button sits on its right edge), a full-width bar on
// tablets and phones. It changes with the page: families get the phone number
// and Request a call; referral partners (the referral and status pages) get
// the intake line and Refer a patient. It slides away with the header while
// scrolling down (Header's .is-scroll-hidden), and steps aside while the
// page's own opening buttons or the footer (same contacts) are on screen.
const PARTNER_PAGES = ["/referrals", "/status"];
export function ContactDock() {
  const path = norm(usePathname()).replace(BASE, "") || "/";
  const partner = PARTNER_PAGES.includes(path);
  // Hidden while the footer is on screen, and while a page's own opening
  // calls to action ([data-dock-hide]: the Home hero's buttons, a page head's
  // buttons) are, so the same actions never show twice.
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const foot = document.querySelector(".hs-footer");
    if (!foot || !("IntersectionObserver" in window)) return;
    const seen = new Map();
    const update = () => setHide([...seen.values()].some(Boolean));
    const footIo = new IntersectionObserver(([e]) => { seen.set(e.target, e.isIntersecting); update(); }, { rootMargin: "0px 0px -40% 0px" });
    const ctaIo = new IntersectionObserver((es) => { es.forEach((e) => seen.set(e.target, e.isIntersecting)); update(); });
    footIo.observe(foot);
    document.querySelectorAll("[data-dock-hide]").forEach((el) => ctaIo.observe(el));
    return () => { footIo.disconnect(); ctaIo.disconnect(); };
  }, [path]);
  // Back to top (desktop): shown once the page is a screen down, on the
  // right edge of the content, opposite the dock.
  const [far, setFar] = useState(false);
  useEffect(() => {
    const onScroll = () => setFar(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const toTop = () => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };
  const tab = hide ? -1 : undefined;
  return (
    <div className="hs-dock-bar">
    <div className="hs-dock-shell">
    <div className="hs-wrap hs-dock-row">
    <div className={`hs-dock${hide ? " is-hidden" : ""}`} role="region" aria-label={partner ? "Referral contacts" : "Contact us"} aria-hidden={hide || undefined}>
      <a className="hs-btn hs-btn-secondary hs-dock-phone" href={PHONE.href} tabIndex={tab}>
        <Icon name="phone" size={20} />
        <span className="hs-dock-label">{partner ? "Intake line" : "Call"}</span>
        <span className="hs-dock-num">{PHONE.display}</span>
      </a>
      {partner
        ? <Link className="hs-btn hs-btn-primary" href={path === "/referrals" ? "#refer" : `${BASE}/referrals/#refer`} tabIndex={tab}>Refer a patient</Link>
        : <Link className="hs-btn hs-btn-primary" href={`${BASE}/contact/`} tabIndex={tab}>Request a call</Link>}
    </div>
    <button type="button" className={`hs-btn hs-btn-secondary hs-totop${far ? "" : " is-hidden"}`} onClick={toTop} aria-label="Back to top" tabIndex={far ? undefined : -1} aria-hidden={far ? undefined : true}>
      <Icon name="up" size={22} />
    </button>
    </div>
    </div>
    </div>
  );
}

// Scroll reveals for the public pages: pieces below the fold fade and rise
// into place as they scroll into view (styles under "Motion" in
// hearthside.css), siblings in a short stagger. Only what starts below the
// fold is hidden, only once this runs, and never under reduced motion; the
// classes come off once a piece has settled, so its own transitions (hovers)
// aren't delayed. Re-runs per page.
const REVEAL = ".hs-row-body > :not(.hs-ruled):not(.hs-services):not(.hs-creds):not(.hs-clinicians), .hs-ruled > *, .hs-services > *, .hs-creds > *, .hs-clinicians > *, .hs-band";
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const fold = window.innerHeight; // anything peeking into the first screen stays visible (it signals more below)
    // Cards in a sideways-scrolling row (the phone swipe rows) reveal as one
    // row, not one by one: cards off to the right never scrolled into view
    // vertically, so they stayed lowered and rose as they were swiped in, and
    // their offset made the row itself scroll up and down by a few pixels.
    const swipes = (el) => /auto|scroll/.test(getComputedStyle(el.parentElement).overflowX);
    const els = [...new Set([...document.querySelectorAll(`main :is(${REVEAL})`)].map((el) => (swipes(el) ? el.parentElement : el)))].filter((el) => el.getBoundingClientRect().top > fold);
    const settle = (e) => { if (e.target === e.currentTarget && e.propertyName === "opacity") { e.target.classList.remove("hs-reveal", "is-in"); e.target.style.removeProperty("--hs-i"); e.target.removeEventListener("transitionend", settle); } };
    els.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => els.includes(c));
      el.style.setProperty("--hs-i", Math.min(sibs.indexOf(el), 5));
      el.classList.add("hs-reveal");
      el.addEventListener("transitionend", settle);
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); els.forEach((el) => { el.classList.remove("hs-reveal", "is-in"); el.style.removeProperty("--hs-i"); el.removeEventListener("transitionend", settle); }); };
  }, [pathname]);
  return null;
}

// "How can we help?" on phones: a segmented switch (two toggle buttons, the
// chosen one in a leaf) above the two path cards, showing one card at a time
// so both choices are visible without scrolling and the chosen card keeps its
// points and buttons. Starts on families. Above 760px the switch is hidden
// and both cards show side by side (hearthside.css, "How can we help?").
export function PathSwitch({ labels, children }) {
  const [active, setActive] = useState(0);
  const id = useId();
  // Switching: the raised thumb glides to the chosen option (CSS), and the
  // card changes inside a view transition — the old one slides out and fades
  // toward the side it came from, the new one slides in from the other side
  // and its photo settles from a slight zoom (hearthside.css). Instant under
  // reduced motion or without view transitions.
  const choose = (i) => {
    if (i === active) return;
    document.documentElement.setAttribute("data-hs-path-dir", i > active ? "next" : "prev");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) return setActive(i);
    document.startViewTransition(() => flushSync(() => setActive(i)));
  };
  return (
    <>
      <div className="hs-seg" role="group" aria-label="Who is this for?" data-active={active}>
        {labels.map((l, i) => (
          <button key={l} type="button" className="hs-seg-btn" aria-pressed={active === i} aria-controls={`${id}-paths`} onClick={() => choose(i)}>{l}</button>
        ))}
      </div>
      <div id={`${id}-paths`} className="hs-ruled hs-paths" data-active={active}>{children}</div>
    </>
  );
}

// Desktop: a quiet "more below" cue at the bottom of the first screen, shown
// only while the page is at the top and the next section (`target`) isn't
// peeking into view; a gentle drift (still under reduced motion). Clicking it
// scrolls to that section.
export function ScrollCue({ target }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(target);
    if (!el) return;
    const check = () => setShow(window.scrollY < 40 && el.getBoundingClientRect().top > window.innerHeight - 24);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { window.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, [target]);
  const go = () => document.getElementById(target)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return (
    <button type="button" className={`hs-cue${show ? " is-shown" : ""}`} onClick={go} aria-label="Scroll to more" tabIndex={show ? 0 : -1} aria-hidden={show ? undefined : true}>
      <Icon name="arrow" size={20} />
    </button>
  );
}

// Home's "Behind the scenes" demo, for agency owners: a mini intake board in
// which one referral travels — it arrives in New (glowing), the ZIP rule
// routes it to Assigned, then the first call moves it to Contact attempted —
// with a toast for each step, on a loop. It runs only while on screen; under
// reduced motion it shows the final state, still.
const BTS_STEPS = [
  { col: 0, toast: "New referral from Larkfield Medical Center" },
  { col: 1, toast: "Routed by ZIP 91355 → Priya Shah" },
  { col: 2, toast: "First call logged · 1 document requested" },
];
export function BehindTheScenes() {
  const ref = useRef(null);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStep(2); return; } // eslint-disable-line react-hooks/set-state-in-effect
    let timer = 0;
    const run = () => { timer = window.setInterval(() => setStep((s) => (s + 1) % (BTS_STEPS.length + 1)), 1900); };
    const io = new IntersectionObserver(([e]) => { window.clearInterval(timer); if (e.isIntersecting) run(); }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); window.clearInterval(timer); };
  }, []);
  const s = Math.min(step, BTS_STEPS.length - 1);
  const resetting = step === BTS_STEPS.length; // a beat where the card fades before looping
  return (
    <div ref={ref} className="hs-bts" aria-hidden="true">
      <div className="hs-bts-bar"><span /><span /><span /><b>Hearthside intake</b></div>
      <div className="hs-bts-board">
        {["New", "Assigned", "Contacted"].map((c, i) => (
          <div key={c} className="hs-bts-col">
            <p className="hs-bts-head">{c}</p>
            <div className="hs-bts-card is-static"><b>HS-2479{i}</b><span>{["Sherman Oaks", "Van Nuys", "Burbank"][i]}</span></div>
          </div>
        ))}
        <div className={`hs-bts-card is-moving${resetting ? " is-out" : ""}${s === 0 ? " is-new" : ""}`} style={{ "--col": s }}>
          <b>HS-24812</b><span>Valencia · Skilled nursing</span>
          <i className={`hs-bts-avatar${s > 0 ? " is-on" : ""}`}>PS</i>
        </div>
      </div>
      <p key={resetting ? "x" : s} className={`hs-bts-toast${resetting ? " is-out" : ""}`}>{BTS_STEPS[s].toast}</p>
    </div>
  );
}

// The proposal's "Save as PDF": the browser's print dialog (proposal.css has
// the print styles).
export function PrintButton() {
  return (
    <button type="button" className="hs-btn hs-btn-secondary hs-btn-sm" onClick={() => window.print()}>Save as PDF</button>
  );
}
