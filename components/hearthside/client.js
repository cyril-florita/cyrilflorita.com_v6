"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { BASE, NAV, PHONE } from "./data";
import { Button, Icon, Logo } from "./ui";

// Switching light/dark or the colour scheme: every colour changes at once.
// Colour transitions (buttons, links, the nav leaf) are suspended for the
// switch — they used to fade a beat behind the page, which read as a flicker —
// and where view transitions exist the two looks crossfade (0.3s; instant
// under reduced motion).
function switchLook(apply) {
  const root = document.querySelector(".hs");
  const run = () => {
    root?.classList.add("hs-switching");
    flushSync(apply);
    void root?.offsetWidth; // apply the new colours with transitions off
    requestAnimationFrame(() => requestAnimationFrame(() => root?.classList.remove("hs-switching")));
  };
  if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return run();
  const html = document.documentElement;
  html.setAttribute("data-hs-vt", "look");
  document.startViewTransition(run).finished.finally(() => html.removeAttribute("data-hs-vt"));
}

// Light / dark, saved as localStorage `hs-mode`. The pre-paint script in
// layout.js applies the saved choice (else dark, the default) before first
// paint; this keeps the button in sync and saves changes.
export function ModeSwitch() {
  const [mode, setMode] = useState(null);
  // Follows the attribute, so several switches on one page (the design
  // system shows one beside the footer's) stay in step.
  useEffect(() => {
    const root = document.querySelector(".hs");
    if (!root) return;
    const read = () => setMode(root.getAttribute("data-hs-mode") || "dark");
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-hs-mode"] });
    return () => mo.disconnect();
  }, []);
  const next = mode === "dark" ? "light" : "dark";
  const toggle = () => switchLook(() => {
    document.querySelector(".hs")?.setAttribute("data-hs-mode", next);
    try { localStorage.setItem("hs-mode", next); } catch {}
    setMode(next);
  });
  return (
    <button className="hs-mode" type="button" onClick={toggle} aria-label={mode ? `Switch to ${next} mode` : "Switch color mode"}>
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

  // Scrolling down slides the sticky header up out of view; scrolling up
  // brings it back (every screen size). It stays near the top of the page and
  // while keyboard focus is in the header or the dock. The class lives on the
  // .hs root; the CSS does the (gentle, reduced-motion-aware) movement. The
  // contact dock does NOT follow: once the page's own opening calls to action
  // have scrolled away, it stays put.
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
  // The last message stays rendered while the result area folds shut, so the
  // text doesn't vanish before the height finishes animating.
  const [view, setView] = useState(null);
  const index = useMemo(() => {
    const m = new Map();
    for (const a of areas) for (const [town, zips] of a.communities) for (const z of zips) m.set(z, { town, area: a.name });
    return m;
  }, [areas]);
  const check = (e) => {
    e.preventDefault();
    const z = zip.trim();
    const show = (r) => { setResult(r); setView(r); };
    if (!/^\d{5}$/.test(z)) return show({ kind: "invalid" });
    const hit = index.get(z);
    const res = hit ? { kind: "yes", z, ...hit } : { kind: "no", z };
    show(res);
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
      {/* No space is reserved for the answer: this folds open to the message's
          height (hearthside.css) only when there is one. */}
      <div className={`hs-zip-reveal${result ? " is-open" : ""}`}>
        <div>
          <p id={`${id}-result`} className={`hs-zip-result${view ? ` is-${view.kind}` : ""}`} role="status">
            {view?.kind === "yes" && <><Icon name="check" size={20} /> Yes, we serve {view.z} ({view.town}, {view.area}).</>}
            {view?.kind === "no" && <><Icon name="info" size={20} /> {view.z} is outside our service area. Call us and we&rsquo;ll help you find an agency nearby.</>}
            {view?.kind === "invalid" && <>Please enter a 5-digit ZIP code.</>}
          </p>
        </div>
      </div>
    </form>
  );
}

// Colour scheme: Tide (cool) or Shore (warm and cool combined, the default), saved as
// localStorage `hs-theme` and applied before first paint by layout.js.
// A radio group of swatches, in the preview bar with the other demo notes.
// Each swatch: the scheme's page and its signature colour, light then dark
// (hearthside.css shows the pair for the current mode).
const THEMES = [
  { id: "tide", name: "Tide", a: "#F2F5F7", b: "#1F5E8C", aDark: "#1E2A36", bDark: "#7FB6E0" },
  { id: "shore", name: "Shore", a: "#F6F2EA", b: "#1E2A36", aDark: "#1E2A36", bDark: "#EE9466" },
];
export function ThemeSwitch() {
  const [theme, setTheme] = useState("shore");
  useEffect(() => {
    setTheme(document.querySelector(".hs")?.getAttribute("data-hs-theme") || "shore"); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  const pick = (id) => {
    if (id === theme) return;
    switchLook(() => {
      document.querySelector(".hs")?.setAttribute("data-hs-theme", id);
      try { localStorage.setItem("hs-theme", id); } catch {}
      setTheme(id);
    });
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
      <span className="hs-theme-label" id="hs-theme-label">Color scheme</span>
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
// the intake line and Refer a patient. It appears once the page's own opening
// buttons have scrolled out of view and then stays (it no longer slides away
// with the header), stepping aside only while those buttons or the footer
// (same contacts) are on screen. The phone is the filled (black) button and
// the main action the outlined (white) one.
const PARTNER_PAGES = ["/referrals", "/status"];
export function ContactDock() {
  const path = norm(usePathname()).replace(BASE, "") || "/";
  const partner = PARTNER_PAGES.includes(path);
  // Hidden while the footer is on screen, and while a page's own opening
  // calls to action ([data-dock-hide]: the Home hero's buttons, a page head's
  // buttons) are, so the same actions never show twice. A [data-dock-after]
  // section (Home's How can we help?, which offers the same choices) keeps it
  // hidden until the reader has scrolled past it: on screen or still below.
  // Starts hidden and shows once the observers have reported: it used to be
  // rendered visible, so on pages with opening buttons it popped up on load
  // and slid away again.
  const [hide, setHide] = useState(true);
  useEffect(() => {
    const foot = document.querySelector(".hs-footer");
    if (!foot || !("IntersectionObserver" in window)) return setHide(false); // eslint-disable-line react-hooks/set-state-in-effect
    const ctas = [...document.querySelectorAll("[data-dock-hide], [data-dock-after]")];
    const seen = new Map();
    const update = () => { if (seen.size > ctas.length) setHide([...seen.values()].some(Boolean)); };
    const footIo = new IntersectionObserver(([e]) => { seen.set(e.target, e.isIntersecting); update(); }, { rootMargin: "0px 0px -40% 0px" });
    const ctaIo = new IntersectionObserver((es) => {
      es.forEach((e) => seen.set(e.target, e.isIntersecting || (e.target.hasAttribute("data-dock-after") && e.boundingClientRect.top > (e.rootBounds?.bottom ?? window.innerHeight))));
      update();
    });
    footIo.observe(foot);
    ctas.forEach((el) => ctaIo.observe(el));
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
      <a className="hs-btn hs-btn-primary hs-dock-phone" href={PHONE.href} tabIndex={tab}>
        <Icon name="phone" size={20} className="hs-btn-lead" />
        <span className="hs-dock-label">{partner ? "Intake line" : "Call"}</span>
        <span className="hs-dock-num">{PHONE.display}</span>
      </a>
      {partner
        ? <Link className="hs-btn hs-btn-secondary" href={path === "/referrals" ? "#refer" : `${BASE}/referrals/#refer`} tabIndex={tab}><Icon name="refer" size={20} className="hs-btn-lead" />Refer a patient</Link>
        : (
          <>
            <a className="hs-btn hs-btn-secondary" href="#request-a-call" tabIndex={tab}><Icon name="callback" size={20} className="hs-btn-lead" />Request a call</a>
            {/* Desktop only (hearthside.css): a third white button for referral partners. */}
            <Link className="hs-btn hs-btn-secondary hs-dock-refer" href={`${BASE}/referrals/#refer`} tabIndex={tab}><Icon name="refer" size={20} className="hs-btn-lead" />Refer a patient</Link>
          </>
        )}
    </div>
    <button type="button" className={`hs-btn hs-btn-secondary hs-totop${far ? "" : " is-hidden"}`} onClick={toTop} aria-label="Back to top" tabIndex={far ? undefined : -1} aria-hidden={far ? undefined : true}>
      <Icon name="up" size={20} className="hs-btn-lead" /> {/* doesn't nudge on hover */}
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
const REVEAL = ".hs-row-body > :not(.hs-ruled):not(.hs-services):not(.hs-creds):not(.hs-clinicians):not(h2):not(h3):not(.hs-steps-story):not(.hs-faq), .hs-ruled > *, .hs-services > *, .hs-creds > *, .hs-clinicians > *, .hs-bleed, .hs-band"; // row headings and the statement reveal word by word (SplitHeads)
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
    // Text-only blocks (a paragraph, a list, the closing band, a column of
    // heading and copy) are left to their own word and line reveals
    // (SplitHeads, LineReveal): a block fade on top hid those, which played
    // underneath it. Blocks with a photo or a widget keep the fade.
    const textOnly = (el) => el.matches("p, ul, ol, .hs-band") || (!el.querySelector("img, .hs-photo-frame, .hs-photo, .hs-bts, .hs-logos, .hs-zip, .hs-faq, form, svg.hs-map, .hs-area-map, table") && !!el.querySelector("p, h2, h3, li"));
    const els = [...new Set([...document.querySelectorAll(`main :is(${REVEAL})`)].map((el) => (swipes(el) ? el.parentElement : el)))].filter((el) => el.getBoundingClientRect().top > fold && !el.closest(".hs-steps-story.is-story") && !textOnly(el));
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

// Every heading in the page content (h1–h3: page titles, section headings,
// card and step titles) reveals word by word — each word rises out of its own
// mask, 35ms apart — as it scrolls into view, and replays: a heading that drops
// back below the screen (scrolling up past it) resets, so it plays again on
// the way down. Headings already on screen when the page opens show at once
// (they join the cycle after). Not the Home hero (its own entrance) or the
// pinned steps' titles (they animate with each step); never under reduced
// motion. A heading's text becomes its accessible name and the word spans are
// hidden from assistive tech.
const SPLIT = "main :is(h1, h2, h3):not(.hs-visually-hidden), main .hs-bleed-line, .hs-footer h2"; // plus the line over the full-bleed photo, set like a headline, and the footer's headings
const SPLIT_SKIP = ".hs-hero, .hs-steps-story.is-story .hs-step, .hs-title-split"; // page titles are split on the server
export function SplitHeads() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = [...document.querySelectorAll(SPLIT)].filter((el) => !el.closest(SPLIT_SKIP));
    // Effects run twice in dev: headings an earlier run split are reused.
    // Labels first (innerText needs layout), before any heading is rewritten.
    const labels = new Map(els.filter((el) => !el.classList.contains("hs-split") && /^H[1-6]$/.test(el.tagName)).map((el) => [el, el.innerText.replace(/\s+/g, " ").trim()])); // innerText keeps the break between a name and its credentials
    els.filter((el) => !el.classList.contains("hs-split")).forEach((el) => {
      const heading = labels.has(el); // a paragraph (the photo line) keeps its words readable instead
      if (heading) el.setAttribute("aria-label", labels.get(el));
      let i = 0;
      const walk = (node) => [...node.childNodes].forEach((n) => {
        if (n.nodeType === 1) return walk(n);
        if (n.nodeType !== 3) return;
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const mask = document.createElement("span");
          mask.className = "hs-w";
          if (heading) mask.setAttribute("aria-hidden", "true");
          const word = document.createElement("span");
          word.textContent = part;
          word.style.setProperty("--wi", Math.min(i++, 14));
          mask.append(word);
          frag.append(mask);
        });
        n.replaceWith(frag);
      });
      walk(el);
    });
    // On screen already: shown in the same frame, so nothing drops in. Read
    // every heading's position after all the writes, in one layout pass (a
    // read per heading between writes forced a layout each).
    const fresh = els.filter((el) => !el.classList.contains("hs-split"));
    const rects = fresh.map((el) => el.getBoundingClientRect());
    fresh.forEach((el, i) => {
      el.classList.add("hs-split");
      if (rects[i].top < window.innerHeight && rects[i].bottom > 0) el.classList.add("is-in");
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("is-in");
      else if (e.boundingClientRect.top > (e.rootBounds?.bottom ?? window.innerHeight)) e.target.classList.remove("is-in"); // left below the screen: replay next time
    }), { rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}

// Paragraphs and list items reveal line by line: each line fades in and rises
// 12px, 60ms after the one above, so a whole paragraph is readable in about
// half a second (word by word made people wait to read). Words become plain
// inline spans (screen readers read the paragraph as before; links keep
// their underline), grouped into lines by where they sit; the lines are
// re-measured on resize. Replays like the headings: a paragraph that drops
// back below the screen resets. On-screen ones at load show at once. Not the
// hero, forms, the pinned steps, the hover notes or the design-system page;
// never under reduced motion.
const LINES = "main :is(p, .hs-list li, .hs-checks li, .hs-path-list li), .hs-footer p";
const LINES_SKIP = ".hs-hero, .hs-bleed-line, form, .hs-steps-story.is-story .hs-step, .hs-clinician-note, .hs-bts, .hs-zip, .hs-faq, .hs-dock, .hs-sample, .hs-help-label, .hs-path-tag";
export function LineReveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (/design-system/.test(pathname)) return;
    // Kept off the load path (a mobile Lighthouse run showed it as one
    // ~460ms task): nothing happens until the page is idle — a paragraph not
    // yet split simply shows as plain text — then paragraphs are split only
    // as they come within a screen of view, in batches that write every
    // paragraph first, measure every word in one layout pass, then write the
    // line numbers (reading and writing per paragraph forced a layout each).
    const prepared = [];
    let prep, io, idle, t = 0;
    const measure = (list) => {
      const tops = list.map((el) => [...el.querySelectorAll(".hs-lw")].map((w) => [w, w.getClientRects()[0]?.top ?? 0]));
      tops.forEach((words) => {
        let line = -1, top = null;
        words.forEach(([w, tp]) => { if (top === null || tp - top > 4) { line++; top = tp; } w.style.setProperty("--li", Math.min(line, 12)); });
      });
    };
    const split = (el, flex) => {
      // A flex or grid item (a checklist row: icon + text) gets its text in
      // one wrapper first, or every word would become its own flex item.
      if (flex) {
        const wrap = document.createElement("span");
        [...el.childNodes].filter((n) => !(n.nodeType === 1 && n.matches("svg, .hs-icon"))).forEach((n) => wrap.append(n));
        el.append(wrap);
      }
      const walk = (node) => [...node.childNodes].forEach((n) => {
        if (n.nodeType === 1) { if (!n.matches("svg, .hs-icon, .hs-sample, br")) walk(n); return; }
        if (n.nodeType !== 3) return;
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const w = document.createElement("span");
          w.className = "hs-lw";
          w.textContent = part;
          frag.append(w);
        });
        n.replaceWith(frag);
      });
      walk(el);
    };
    const start = () => {
      // A flex or grid paragraph made of several stacked items (the footer's
      // phone / fax / office lines) is left alone: wrapping its items into one
      // line ran them together. Only "icon + text" rows get wrapped. (Reads
      // only, before any writes.)
      const els = [...document.querySelectorAll(LINES)].filter((el) => !el.closest(LINES_SKIP) && !el.querySelector(":scope > .hs-sample:only-child") && el.textContent.trim().length > 12);
      const flex = new Map(els.map((el) => [el, /flex|grid/.test(getComputedStyle(el).display)]));
      const todo = els.filter((el) => !(flex.get(el) && [...el.children].filter((c) => !c.matches("svg, .hs-icon")).length > 1));
      // Its own class (is-read): Reveal also uses is-in and strips it when its
      // block fade settles, which hid paragraphs again.
      io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-read");
        else if (e.boundingClientRect.top > (e.rootBounds?.bottom ?? window.innerHeight)) e.target.classList.remove("is-read");
      }), { rootMargin: "0px 0px -6% 0px" });
      prep = new IntersectionObserver((es) => {
        const batch = es.filter((e) => e.isIntersecting).map((e) => e.target).filter((el) => !el.classList.contains("hs-lines"));
        if (!batch.length) return;
        batch.forEach((el) => { prep.unobserve(el); split(el, flex.get(el)); });
        measure(batch);
        const h = window.innerHeight;
        const rects = batch.map((el) => el.getBoundingClientRect());
        batch.forEach((el, i) => {
          el.classList.add("hs-lines");
          if (rects[i].top < h && rects[i].bottom > 0) el.classList.add("is-read"); // already on screen: shown at once
          io.observe(el);
          prepared.push(el);
        });
      }, { rootMargin: "0px 0px 100% 0px" });
      // Effects run twice in dev: paragraphs an earlier run split are reused.
      todo.filter((el) => el.classList.contains("hs-lines")).forEach((el) => { io.observe(el); prepared.push(el); });
      todo.filter((el) => !el.classList.contains("hs-lines")).forEach((el) => prep.observe(el));
    };
    idle = "requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 1500 }) : setTimeout(start, 300);
    const onResize = () => { clearTimeout(t); t = setTimeout(() => measure(prepared), 150); };
    window.addEventListener("resize", onResize);
    return () => {
      ("cancelIdleCallback" in window ? cancelIdleCallback : clearTimeout)(idle);
      prep?.disconnect(); io?.disconnect(); window.removeEventListener("resize", onResize); clearTimeout(t);
    };
  }, [pathname]);
  return null;
}

// Sliding-mask rows: the partner marks are uncovered left to right, one after
// another, as their row scrolls into view, and replay when it drops back
// below the screen (like the headings). On screen at page load, they play as
// the last beat of the entrance (after "Why you can trust us"). CSS does the
// animation ("Partners Who Trust Us" in hearthside.css); this only toggles
// .is-in. Never under reduced motion.
const MASKS = "main .hs-logos";
export function MaskRows() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const els = [...document.querySelectorAll(MASKS)];
    const timers = [];
    els.forEach((el) => {
      el.classList.add("hs-mask");
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) timers.push(setTimeout(() => el.classList.add("is-in"), 1500));
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { if (performance.now() > 1600) e.target.classList.add("is-in"); }
      else if (e.boundingClientRect.top > (e.rootBounds?.bottom ?? window.innerHeight)) e.target.classList.remove("is-in");
    }), { rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [pathname]);
  return null;
}

// Sideways-scrolling rows (the phone swipe rows) are focusable while they
// actually scroll, so keyboard users can scroll them too, and named after
// their section's heading. Re-checked on resize.
export function SwipeRows() {
  const pathname = usePathname();
  useEffect(() => {
    const sync = () => document.querySelectorAll("main .hs-swipe").forEach((el) => {
      if (el.scrollWidth > el.clientWidth + 1) {
        el.tabIndex = 0;
        if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", el.closest("section")?.querySelector("h2")?.textContent.trim() || "Cards");
      } else el.removeAttribute("tabindex");
    });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [pathname]);
  return null;
}

// Hover that only follows the hand. Cards passing under a still cursor used
// to flash their hover states as the page scrolled back and forth (the path
// cards' and clinicians' photo zooms, the clinicians' lines) — it read as a
// glitch. So the photo and overlay hover effects need data-hover on main,
// which only real pointer movement sets (and not within 200ms of a scroll)
// and any scroll clears; the browser's own after-scroll mouse events don't
// move, so they don't count. Attributes change only when the state does —
// an earlier version also toggled pointer-events on main at every scroll,
// which restyled the whole page and made trackpad scrolling jittery.
export function ScrollCalm() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let lx = -1, ly = -1, lastScroll = 0, btn = null;
    const main = () => document.getElementById("main");
    const scroll = () => {
      const m = main();
      if (!m?.hasAttribute("data-hover")) return void (lastScroll = performance.now());
      // A nudge of the trackpad that leaves the pointer on the same button
      // keeps its hover (clearing it made the card's photo zoom out and back).
      if (btn && document.elementFromPoint(lx, ly)?.closest(".hs-btn") === btn) return;
      lastScroll = performance.now();
      m.removeAttribute("data-hover");
    };
    const move = (e) => {
      const moved = Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly) > 2;
      lx = e.clientX; ly = e.clientY;
      btn = e.target.closest?.(".hs-btn") ?? null;
      if (!moved || performance.now() - lastScroll < 200) return;
      const m = main();
      if (m && !m.hasAttribute("data-hover")) m.setAttribute("data-hover", "");
    };
    window.addEventListener("wheel", scroll, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("wheel", scroll); window.removeEventListener("scroll", scroll); window.removeEventListener("pointermove", move); };
  }, []);
  return null;
}

// How care begins on desktop: a pinned scroll story. The steps sit stacked
// in one sticky frame while the wrapper scrolls past; scroll progress picks
// the step on show (data-on), whose photo opens through the leaf as its text
// rises in, and a rail fills as the story goes (--hs-p). Only on desktop
// (≥1081px) without reduced motion; otherwise the plain grid. All four steps
// stay in the accessibility tree (hidden steps are transparent, not removed).
export function StepStory({ children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1081px) and (prefers-reduced-motion: no-preference)");
    const frame = el.firstElementChild;
    const all = [...el.querySelectorAll(".hs-step")];
    // Scroll work stays cheap: geometry is measured on resize only, the
    // listener is attached only while the story is near the screen, and the
    // rail's progress is a non-inherited custom property on the list alone
    // (registered in CSS), so updating it restyles nothing else.
    let raf = 0, top = 0, span = 1, startY = 0, lastP = -1;
    const measure = () => {
      top = parseFloat(getComputedStyle(frame).top) || 0;
      startY = el.getBoundingClientRect().top + window.scrollY;
      span = Math.max(1, el.offsetHeight - frame.offsetHeight);
    };
    // Below the screen, no step is on, so step 1 plays its entrance (the
    // photo opening, the numeral and text rising) as the story scrolls in —
    // the first time and every time the reader comes back down to it.
    const reset = () => all.forEach((li) => li.removeAttribute("data-on"));
    const update = () => {
      raf = 0;
      if (el.getBoundingClientRect().top > window.innerHeight * 0.8) return reset();
      const p = Math.min(1, Math.max(0, (window.scrollY + top - startY) / span));
      // Hysteresis: a step changes only once the scroll is clearly past the
      // boundary (6% of a step), so small scrolls up and down around one
      // don't flip the steps back and forth.
      const x = p * all.length;
      let on = all.findIndex((li) => li.hasAttribute("data-on"));
      if (on < 0) on = Math.min(all.length - 1, Math.floor(x));
      else if (x >= on + 1.06 || x <= on - 0.06) on = Math.min(all.length - 1, Math.max(0, Math.floor(x)));
      if (Math.abs(p - lastP) > 0.002) { frame.style.setProperty("--hs-p", p.toFixed(3)); lastP = p; }
      all.forEach((li, k) => { if (li.hasAttribute("data-on") !== (k === on)) li.toggleAttribute("data-on", k === on); });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => { measure(); onScroll(); };
    let near = false;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting === near) return;
      near = e.isIntersecting;
      if (near && el.classList.contains("is-story")) { measure(); update(); window.addEventListener("scroll", onScroll, { passive: true }); }
      else {
        window.removeEventListener("scroll", onScroll);
        if (e.boundingClientRect.top > 0) reset(); // left below the screen: replay next time
      }
    }, { rootMargin: "50% 0px" });
    const apply = () => {
      const on = mq.matches;
      el.classList.toggle("is-story", on);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      io.disconnect(); near = false;
      if (on) {
        measure(); update();
        window.addEventListener("resize", onResize);
        io.observe(el);
      } else {
        all.forEach((li) => li.removeAttribute("data-on"));
        frame.style.removeProperty("--hs-p");
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => { mq.removeEventListener("change", apply); io.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} className="hs-steps-story">{children}</div>;
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
