"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // The menu (≤1080px): Esc or a link closes it; focus moves in and back.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    menuRef.current?.querySelector("a")?.focus();
    const btn = btnRef.current;
    return () => { document.removeEventListener("keydown", onKey); btn?.focus(); };
  }, [open]);
  useEffect(() => setOpen(false), [pathname]); // eslint-disable-line react-hooks/set-state-in-effect

  const links = NAV.map((l) => (
    <li key={l.href}>
      <Link href={l.href} aria-current={pathname === norm(l.href) ? "page" : undefined}>{l.label}</Link>
    </li>
  ));

  return (
    <header className="hs-header">
      <div className="hs-wrap hs-header-row">
        <Logo />
        <nav className="hs-nav" aria-label="Main">
          <ul>{links}</ul>
        </nav>
        <div className="hs-header-actions">
          <a className="hs-header-phone" href={PHONE.href}>
            <Icon name="phone" size={18} />
            <span>{PHONE.display}</span>
          </a>
          <Button href={`${BASE}/contact/`} size="sm">Request a call</Button>
          <button ref={btnRef} className="hs-menu-btn" type="button" aria-expanded={open} aria-controls="hs-menu" onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? "close" : "menu"} size={24} />
            <span>{open ? "Close" : "Menu"}</span>
          </button>
        </div>
      </div>
      <div id="hs-menu" ref={menuRef} className="hs-menu" hidden={!open}>
        <ul>{links}</ul>
        <div className="hs-menu-actions">
          <Button href={`${BASE}/contact/`}>Request a call</Button>
          <a className="hs-phone" href={PHONE.href}><Icon name="phone" size={20} /><span>{PHONE.display}</span></a>
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
const THEMES = [
  { id: "tide", name: "Tide", a: "#F2F5F7", b: "#1F5E8C" },
  { id: "shore", name: "Shore", a: "#F6F2EA", b: "#1A2430" },
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
            <span className="hs-theme-dot" style={{ "--a": t.a, "--b": t.b }} aria-hidden="true" />
            <span className="hs-theme-name">{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Phones: the two things a worried family member needs most, always in thumb
// reach. Hidden while any of the footer (its contact details, then the
// agency-owner pitch at the very bottom) is on screen.
export function CallBar() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const foot = document.querySelector(".hs-footer");
    if (!foot || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setHide(e.isIntersecting), { rootMargin: "0px 0px -40% 0px" });
    io.observe(foot);
    return () => io.disconnect();
  }, []);
  return (
    <div className={`hs-callbar${hide ? " is-hidden" : ""}`} aria-hidden={hide || undefined}>
      <a className="hs-btn hs-btn-secondary" href={PHONE.href} tabIndex={hide ? -1 : undefined}><Icon name="phone" size={20} />Call</a>
      <Link className="hs-btn hs-btn-primary" href={`${BASE}/contact/`} tabIndex={hide ? -1 : undefined}>Request a call</Link>
    </div>
  );
}

// The Home hero's headline notch, contoured to its lines (after a reference):
// instead of one page-coloured block, each line of the h1 gets its
// own background hugging its length, as one staircase shape with rounded
// corners, convex where a line ends and concave where the photo tucks in
// (including where the shape meets the photo's left and bottom edges). Line
// boxes depend on the wrap, so this measures them (Range client rects) and
// draws the shape as one SVG path behind the text, redrawn on resize and once
// fonts load. Without JS, or below 961px where the notch is ordinary flow,
// the CSS block notch / no notch applies.
const R = 26; // corner radius
const PAD_X = 30; // past each line's last glyph
const PAD_TOP = 22; // above the first line

function linesOf(el, stage) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rows = [];
  for (const r of range.getClientRects()) {
    if (!r.width || !r.height) continue;
    const top = r.top - stage.top, bottom = r.bottom - stage.top, right = r.right - stage.left;
    const row = rows.find((x) => Math.abs(x.top - top) < 4);
    if (row) { row.right = Math.max(row.right, right); row.bottom = Math.max(row.bottom, bottom); }
    else rows.push({ top, bottom, right });
  }
  return rows;
}

function contourPath(rows, H) {
  const n = rows.length;
  // Contiguous bands: each boundary sits midway between two lines.
  const y = [rows[0].top - PAD_TOP];
  for (let i = 1; i < n; i++) y.push((rows[i - 1].bottom + rows[i].top) / 2);
  y.push(H);
  const w = rows.map((r) => r.right + PAD_X);
  const band = (i) => y[i + 1] - y[i];
  let d = `M0 ${H} L0 ${y[0] - R}`;
  // A quarter arc to (tx, ty) around (cx, cy); the sweep follows the turn.
  const arc = (fx, fy, tx, ty, cx, cy, rr) => {
    const sweep = (fx - cx) * (ty - cy) - (fy - cy) * (tx - cx) > 0 ? 1 : 0;
    return ` L${fx} ${fy} A${rr} ${rr} 0 0 ${sweep} ${tx} ${ty}`;
  };
  // Where the shape meets the photo's left edge: the photo's corner rounds over it.
  d += arc(0, y[0] - R, R, y[0], R, y[0] - R, R);
  // The first line's top-right corner.
  let r0 = Math.min(R, band(0) / 2);
  d += arc(w[0] - r0, y[0], w[0], y[0] + r0, w[0] - r0, y[0] + r0, r0);
  for (let i = 1; i < n; i++) {
    const a = w[i - 1], b = w[i], yy = y[i];
    const rr = Math.min(R, Math.abs(b - a) / 2, band(i - 1) / 2, band(i) / 2);
    if (rr < 1) continue;
    if (b > a) {
      d += arc(a, yy - rr, a + rr, yy, a + rr, yy - rr, rr); // photo tucks in
      d += arc(b - rr, yy, b, yy + rr, b - rr, yy + rr, rr); // line end
    } else {
      d += arc(a, yy - rr, a - rr, yy, a - rr, yy - rr, rr);
      d += arc(b + rr, yy, b, yy + rr, b + rr, yy + rr, rr);
    }
  }
  // Where the last line meets the photo's bottom edge.
  const wl = w[n - 1], rl = Math.min(R, band(n - 1) / 2);
  d += arc(wl, H - rl, wl + rl, H, wl + rl, H - rl, rl);
  return `${d} Z`;
}

export function HeroContour() {
  const ref = useRef(null);
  useEffect(() => {
    const svg = ref.current;
    const stage = svg?.parentElement;
    const notch = stage?.querySelector(".hs-hero-notch");
    if (!stage || !notch) return;
    let raf = 0;
    const draw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (getComputedStyle(notch).position !== "absolute") { stage.classList.remove("is-contoured"); return; }
        const box = stage.getBoundingClientRect();
        const rows = [...notch.querySelectorAll("h1 > span")].flatMap((el) => linesOf(el, box)).sort((a, b) => a.top - b.top);
        if (!rows.length) return;
        const H = stage.querySelector(".hs-hero-art").getBoundingClientRect().bottom - box.top;
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
        svg.firstChild.setAttribute("d", contourPath(rows, H));
        stage.classList.add("is-contoured");
      });
    };
    draw();
    // The stage for width changes, the notch for anything that rewraps or
    // changes the headline (a stale shape once outlived an edit to it).
    const ro = new ResizeObserver(draw);
    ro.observe(stage);
    ro.observe(notch);
    document.fonts?.ready.then(draw);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); stage.classList.remove("is-contoured"); };
  }, []);
  return <svg ref={ref} className="hs-hero-contour" aria-hidden="true" focusable="false"><path /></svg>;
}
