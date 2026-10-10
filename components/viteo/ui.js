"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { BASE, PRODUCTS } from "./data";

// Shared Viteo UI: logo, pill illustrations, buttons, and the page shell
// (header, footer with the concept notice). Styles: app/lab/viteo/viteo.css.

export const Logo = ({ small = false }) => (
  <span className={`dl-logo ${small ? "dl-logo-sm" : ""}`}>
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="19" r="8" fill="var(--dl-sun)" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = Math.PI + (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={16 + Math.cos(a) * 11}
            y1={19 + Math.sin(a) * 11}
            x2={16 + Math.cos(a) * 14.5}
            y2={19 + Math.sin(a) * 14.5}
            stroke="var(--dl-sun)"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        );
      })}
      <rect
        x="2"
        y="26"
        width="28"
        height="2.6"
        rx="1.3"
        fill="var(--dl-ink)"
      />
    </svg>
    <span>Viteo</span>
  </span>
);

// One pill, drawn in CSS: capsule (two-tone), softgel (glossy oval), tablet.
export const Pill = ({ id, size = "md", tilt = 0 }) => {
  const p = PRODUCTS[id];
  if (!p) return null;
  return (
    <span
      className={`dl-pill dl-pill-${p.form} dl-pill-${size}`}
      style={{
        "--c": p.color,
        "--c2": p.color2 || "#fffaf0",
        "--tilt": `${tilt}deg`,
      }}
      aria-hidden="true"
    />
  );
};

// A day's pack: the pills scattered in a little tray.
const TILTS = [-24, 18, -8, 32, -36, 10];
export const PillTray = ({ ids, label = "Your daily pack", size = "lg" }) => (
  <div
    className={`dl-tray dl-tray-${size}`}
    role="img"
    aria-label={`${label}: ${ids.map((i) => PRODUCTS[i]?.name).join(", ")}`}
  >
    {ids.map((id, i) => (
      <span key={id} className="dl-tray-slot" style={{ "--i": i }}>
        <Pill
          id={id}
          size={size === "sm" ? "sm" : "md"}
          tilt={TILTS[i % TILTS.length]}
        />
      </span>
    ))}
  </div>
);

// The Viteo product box, drawn in CSS (front, side and top faces; styles
// under "Hero product shot" in viteo.css). Sized by its container: put it in
// a .dl-product (landing hero) or .dl-product-sm (order confirmation).
export const ProductBox = ({ name = "Morning pack" }) => (
  <div className="dl-box">
    <div className="dl-box-front">
      <span className="dl-box-brand">Viteo</span>
      <span className="dl-box-info">
        <span className="dl-box-name">{name}</span>
        <span className="dl-box-meta">30 daily packs</span>
      </span>
    </div>
    <div className="dl-box-side">
      <span>Personalized daily vitamins</span>
    </div>
    <div className="dl-box-top" />
  </div>
);

export const Button = ({
  href,
  variant = "primary",
  size,
  children,
  className = "",
  ...rest
}) => {
  const cls =
    `dl-btn dl-btn-${variant} ${size ? `dl-btn-${size}` : ""} ${className}`.trim();
  if (href)
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
};

// Section heading with the section's name set huge and faint behind it (in
// place of an eyebrow). The word sizes itself to fill the heading's column
// (container units over its longest line's character count; "\n" breaks a
// long phrase onto lines); it's decoration, so it's hidden from screen
// readers and the heading carries the meaning.
export const BigWordHead = ({ word, children, className = "" }) => {
  const lines = word.split("\n");
  return (
    <div className={`dl-bigword-head ${className}`.trim()}>
      <div
        className="dl-bigword-fit"
        style={{ "--chars": Math.max(...lines.map((l) => l.length)) }}
        aria-hidden="true"
      >
        <p className="dl-bigword">
          {lines.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </p>
      </div>
      {children}
    </div>
  );
};

export const Arrow = () => (
  <svg
    className="dl-arrow"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// Theme + mode live as attributes on the .dl root (set before paint by the
// script in app/lab/viteo/layout.js). This reads them live and writes
// them back, saving the choice for the next visit.
export const THEMES = [
  {
    id: "aqua",
    label: "Aqua",
    fonts: "Plus Jakarta Sans + Inter",
    color: "#A6E0E8",
  },
  {
    id: "grove",
    label: "Grove",
    fonts: "Outfit + Figtree",
    color: "#5FBF8A",
  },
];
const root = () => document.querySelector(".dl");
const subscribeTheme = (cb) => {
  const el = root();
  if (!el) return () => {};
  const mo = new MutationObserver(cb);
  mo.observe(el, {
    attributes: true,
    attributeFilter: ["data-dl-theme", "data-dl-mode"],
  });
  return () => mo.disconnect();
};
const themeSnapshot = () => {
  const el = root();
  return `${el?.dataset.dlTheme || "aqua"}|${el?.dataset.dlMode || "dark"}`;
};
export const useDlTheme = () => {
  const [theme, mode] = useSyncExternalStore(
    subscribeTheme,
    themeSnapshot,
    () => "aqua|dark",
  ).split("|");
  return { theme, mode };
};
const setDl = (key, value) => {
  root()?.setAttribute(`data-dl-${key}`, value);
  try {
    localStorage.setItem(`dl-${key}`, value);
  } catch {}
};

export const ThemeSwitcher = () => {
  const { theme, mode } = useDlTheme();
  return (
    <div className="dl-switcher">
      <div className="dl-switcher-themes" role="radiogroup" aria-label="Theme">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={theme === t.id}
            className={theme === t.id ? "is-on" : ""}
            onClick={() => setDl("theme", t.id)}
            title={`${t.label} theme`}
          >
            <span
              className="dl-switcher-dot"
              style={{ background: t.color }}
              aria-hidden="true"
            />
            <span className="dl-switcher-label">{t.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="dl-switcher-mode"
        onClick={() => setDl("mode", mode === "dark" ? "light" : "dark")}
        aria-label={
          mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        title={mode === "dark" ? "Light mode" : "Dark mode"}
      >
        {mode === "dark" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
          </svg>
        )}
      </button>
    </div>
  );
};

const NAV = [
  ["How it works", `${BASE}/#how`],
  ["Ingredients", `${BASE}/#ingredients`],
  ["Account", `${BASE}/account/`],
];

// Header: inline nav on desktop; on tablet and phone (≤960px) the links,
// theme switcher and quiz button move into a full-screen menu behind a
// hamburger. The menu opens with a circular wipe and its items stagger in;
// Esc, a link, the close button or widening the window closes it.
export const Header = () => {
  const [open, setOpen] = useState(false);
  // No "Take the quiz" while you're taking it (trailingSlash: strip it first).
  const onQuiz = (usePathname() || "").replace(/\/$/, "") === `${BASE}/quiz`;
  const burgerRef = useRef(null);
  const menuRef = useRef(null);
  // Opened by keyboard (Enter/Space give a click with detail 0) or by
  // pointer: keyboard users get focus moved to the first link; pointer users
  // get it on the dialog itself, so no focus ring flashes on tap.
  const viaKeyboard = useRef(false);


  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      burgerRef.current?.focus();
    };
    const wide = window.matchMedia("(min-width: 961px)");
    const onWide = (e) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    const target = viaKeyboard.current
      ? menuRef.current?.querySelector(".dl-menu-nav a")
      : menuRef.current;
    target?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="dl-header">
      <div className="dl-wrap dl-header-inner">
        <div className="dl-header-brand">
          <Link href={`${BASE}/`} aria-label="Viteo home">
            <Logo />
          </Link>
          {/* Desktop: beside the logo. Tablet/phone: in the menu instead. */}
          <ThemeSwitcher />
        </div>
        <nav aria-label="Viteo">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          {!onQuiz && (
            <Button href={`${BASE}/quiz/`} size="sm">
              Take the quiz
            </Button>
          )}
        </nav>
        <button
          ref={burgerRef}
          type="button"
          className="dl-burger"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="dl-menu"
          onClick={(e) => {
            viaKeyboard.current = e.detail === 0;
            setOpen(true);
          }}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        id="dl-menu"
        ref={menuRef}
        className={`dl-menu ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        inert={!open}
      >
        <div className="dl-wrap dl-menu-top">
          <Link href={`${BASE}/`} aria-label="Viteo home" onClick={close}>
            <Logo />
          </Link>
          <button
            type="button"
            className="dl-burger is-x"
            aria-label="Close menu"
            onClick={(e) => {
              close();
              // Hand focus back; after a tap, without a visible ring.
              burgerRef.current?.focus({
                preventScroll: true,
                focusVisible: e.detail === 0,
              });
            }}
          >
            <span />
            <span />
          </button>
        </div>
        <nav className="dl-wrap dl-menu-nav" aria-label="Viteo menu">
          {NAV.map(([label, href], i) => (
            <Link key={href} href={href} onClick={close} style={{ "--i": i }}>
              {label}
              <Arrow />
            </Link>
          ))}
        </nav>
        {!onQuiz && (
          <div className="dl-wrap dl-menu-cta" style={{ "--i": NAV.length }}>
            <Button href={`${BASE}/quiz/`} onClick={close}>
              Take the quiz <Arrow />
            </Button>
          </div>
        )}
        <div className="dl-wrap dl-menu-foot" style={{ "--i": NAV.length + 1 }}>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};

// Back-to-top button: shows after a screen of scrolling, glides to the top
// (instantly under reduced motion) and moves focus to the page's main content.
export const ToTop = () => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const check = () => setOn(window.scrollY > window.innerHeight);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);
  const go = () => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main")?.focus({ preventScroll: true });
  };
  return (
    <button
      type="button"
      className={`dl-totop ${on ? "is-on" : ""}`}
      onClick={go}
      aria-label="Back to top"
      tabIndex={on ? 0 : -1}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
};

export const Footer = () => (
  <footer className="dl-footer">
    <div className="dl-wrap dl-footer-inner">
      <div>
        <Logo small />
        <p>
          Personalized daily vitamins, explained. Products, prices, reviews and
          people are made up. Nothing here is medical advice; talk to a
          healthcare professional before starting any supplement.
        </p>
      </div>
      <nav aria-label="Prototype pages">
        <Link href={`${BASE}/`}>Home</Link>
        <Link href={`${BASE}/quiz/`}>Quiz</Link>
        <Link href={`${BASE}/plan/`}>Your plan</Link>
        <Link href={`${BASE}/checkout/`}>Checkout</Link>
        <Link href={`${BASE}/account/`}>Account</Link>
        <Link href={`${BASE}/design-system/`}>Design system</Link>
      </nav>
    </div>
    {/* Always visible: this is a design concept, not a store. */}
    <div className="dl-wrap dl-footer-legal">
      <p>
        <strong>Concept project</strong> by Cyril Florita. Viteo is not a real
        product; nothing here is for sale or medical advice.
      </p>
      {/* A full page load: the portfolio uses a different layout and styles. */}
      <a href="/">Back to portfolio</a>
    </div>
  </footer>
);
