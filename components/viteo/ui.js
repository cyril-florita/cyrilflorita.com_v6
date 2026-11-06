"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ViewTransition, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { BASE, PRODUCTS, getOwn } from "./data";
import InstallApp from "./InstallApp";
export { focusAfterMenuLink, onRadioKeyDown, radioTabIndex, useBackdropClose, useMounted, SrStatus } from "./a11y";
import { focusAfterMenuLink, onRadioKeyDown, radioTabIndex } from "./a11y";

// Shared Viteo UI: logo, pill illustrations, buttons, and the page shell
// (header, footer with the concept notice). Styles: app/pitch/viteo/viteo.css.

// The Viteo mark: a "V" of two capsules meeting at the base, one glossy in
// the theme's accent, one in ink. Gradient ids are per instance (useId).
// The capsule-"V" mark on its own (also printed on the product box).
export const LogoMark = ({ className = "" }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={`dl-logo-mark ${className}`.trim()} viewBox="0 0 44 44" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--dl-logo-1)" }} />
          <stop offset="1" style={{ stopColor: "var(--dl-logo-2)" }} />
        </linearGradient>
      </defs>
      <g className="dl-logo-a">
        <rect x="15" y="1" width="12" height="38" rx="6" transform="rotate(-24 21 39)" fill={`url(#${id}a)`} />
      </g>
      <g className="dl-logo-b">
        <rect x="17" y="1" width="12" height="38" rx="6" transform="rotate(24 23 39)" fill="var(--dl-logo-ink, var(--dl-ink))" />
      </g>
    </svg>
  );
};

// The Viteo logo: the mark beside a lowercase wordmark. Hovering the logo
// (or its link) spins each capsule a full turn around its own centre, in
// opposite directions, back into the V (CSS: "logo" in viteo.css).
export const Logo = ({ small = false }) => (
  <span className={`dl-logo ${small ? "dl-logo-sm" : ""}`}>
    <LogoMark />
    <span>viteo</span>
  </span>
);

// One pill: the product's 3D render (public/img/viteo/pills/<id>.webp, baked
// from components/viteo/pillModels.js by scripts/render-pills.mjs), sized by
// its form's CSS box (capsule / softgel / tablet) and tilted per use.
export const Pill = ({ id, size = "md", tilt = 0 }) => {
  const p = getOwn(PRODUCTS, id);
  if (!p) return null;
  return (
    <span
      className={`dl-pill dl-pill-${p.form} dl-pill-${size} dl-pill-3d${p.shape === "oblong" ? " dl-pill-oblong" : ""}`}
      style={{
        "--c": p.color,
        "--c2": p.color2 || "#fffaf0",
        "--tilt": `${tilt}deg`,
        "--img": `url(/img/viteo/pills/${id}.webp)`,
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
    aria-label={`${label}: ${ids.map((i) => getOwn(PRODUCTS, i)?.name).filter(Boolean).join(", ")}`}
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
// a .dl-product (landing hero), .dl-product-sm (order confirmation) or
// .dl-product-xs (plan, checkout summary, pack-filling finale).
// `owner` prints the customer's name on the pack ("Cyril's"). `morph`
// (default) names it for page transitions, so the same pack moves from page
// to page; the landing hero turns it off (its 3D version takes over there).
export const ProductBox = ({ name = "Morning pack", owner, morph = true }) => {
  const box = (
  <div className="dl-box">
    <div className="dl-box-front">
      <LogoMark className="dl-box-mark" />
      <span className="dl-box-brand">viteo</span>
      <span className="dl-box-info">
        {owner && <span className="dl-box-owner">{owner}&apos;s</span>}
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
  return morph ? (
    <ViewTransition name="dl-pack" share="dl-morph" default="none">
      {box}
    </ViewTransition>
  ) : box;
};

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
// script in app/pitch/viteo/layout.js). This reads them live and writes
// them back, saving the choice for the next visit.
export const THEMES = [
  {
    id: "aqua",
    label: "Aqua",
    fonts: "Plus Jakarta Sans + Inter",
    color: "#7DE2DF",
  },
  {
    id: "grove",
    label: "Grove",
    fonts: "Outfit + Figtree",
    color: "#5FBF8A",
  },
  {
    id: "peach",
    label: "Peach",
    fonts: "Fraunces + DM Sans",
    color: "#F7A47C",
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

// `show`: "both" (the menu, the design system), "themes" (the footer) or
// "mode" (the light/dark toggle alone, at the right of the desktop nav).
export const ThemeSwitcher = ({ show = "both" }) => {
  const { theme, mode } = useDlTheme();
  return (
    <div className={`dl-switcher${show === "both" ? "" : ` is-${show}`}`}>
      {show !== "mode" && (
      <div className="dl-switcher-themes" role="radiogroup" aria-label="Theme" onKeyDown={onRadioKeyDown}>
        {THEMES.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={theme === t.id}
            tabIndex={radioTabIndex(theme === t.id, i, THEMES.some((x) => x.id === theme))}
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
      )}
      {show !== "themes" && (
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
      )}
    </div>
  );
};

const NAV = [
  ["How it works", `${BASE}/#how`],
  ["Ingredients", `${BASE}/#ingredients`],
  ["Partners", `${BASE}/partners/`],
  ["Account", `${BASE}/account/`],
];

// Header: inline nav on desktop; on tablet and phone (≤960px) the links,
// theme switcher and "Personalize your pack" button move into a full-screen menu behind a
// hamburger. The menu opens with a circular wipe and its items stagger in;
// Esc, a link, the close button or widening the window closes it.
export const Header = () => {
  const [open, setOpen] = useState(false);
  // trailingSlash: strip it before comparing paths.
  const path = (usePathname() || "").replace(/\/$/, "");
  // No "Personalize your pack" while you're taking it.
  const onPersonalize = path === `${BASE}/personalize`;
  // The current page's link is marked (aria-current, a pill in the nav); signing in counts as Account.
  const current = (href) => !href.includes("#") && (path === href.replace(/\/$/, "") || (href === `${BASE}/account/` && path === `${BASE}/sign-in`)) ? "page" : undefined;
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
      // Tab and Shift+Tab wrap around inside the open menu (a modal dialog).
      if (e.key === "Tab") {
        const f = [...(menuRef.current?.querySelectorAll("a[href], button:not([disabled])") ?? [])].filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === first || !menuRef.current.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !menuRef.current.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
        return;
      }
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
  // A menu link: close, and if it stays on this page, move focus to its target.
  const closeTo = (href) => () => { close(); focusAfterMenuLink(href, path); };

  // The design system has no site header: its own sidebar / top bar and menu
  // (DsChrome) carry the logo, its sections and the way home.
  if (path === `${BASE}/design-system`) return null;

  return (
    <header className="dl-header">
      <div className="dl-wrap dl-header-inner">
        <div className="dl-header-brand">
          <Link href={`${BASE}/`} aria-label="Viteo home">
            <Logo />
          </Link>
        </div>
        <nav className="dl-nav" aria-label="Viteo">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} aria-current={current(href)}>
              {label}
            </Link>
          ))}
        </nav>
        {/* Desktop: light/dark at the right of the nav (the themes are in the
            footer). Tablet/phone: both in the menu instead. */}
        <ThemeSwitcher show="mode" />
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
          <Link href={`${BASE}/`} aria-label="Viteo home" onClick={closeTo(`${BASE}/`)}>
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
            <Link key={href} href={href} onClick={closeTo(href)} style={{ "--i": i }} aria-current={current(href)}>
              {label}
              <Arrow />
            </Link>
          ))}
        </nav>
        {!onPersonalize && (
          <div className="dl-wrap dl-menu-cta" style={{ "--i": NAV.length }}>
            <Button href={`${BASE}/personalize/`} onClick={close}>
              Personalize your pack <Arrow />
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
          Personalized daily vitamins, explained. These statements have not
          been evaluated by the Food and Drug Administration. This product is
          not intended to diagnose, treat, cure, or prevent any disease. Talk
          to your doctor before starting any supplement.
        </p>
        <div className="dl-footer-themes">
          <ThemeSwitcher show="themes" />
        </div>
      </div>
      <nav aria-label="Footer">
        <Link href={`${BASE}/`}>Home</Link>
        <Link href={`${BASE}/personalize/`}>Personalize your pack</Link>
        <Link href={`${BASE}/plan/`}>Your plan</Link>
        <Link href={`${BASE}/checkout/`}>Checkout</Link>
        <Link href={`${BASE}/account/`}>Account</Link>
        <Link href={`${BASE}/partners/`}>For professionals</Link>
        <Link href={`${BASE}/lot/`}>Batch results</Link>
        <Link href={`${BASE}/emails/`}>Emails</Link>
        <Link href={`${BASE}/design-system/`}>Design system</Link>
        <InstallApp />
      </nav>
    </div>
    {/* Always visible: this is a design & dev pitch, not a store. */}
    <div className="dl-wrap dl-footer-legal">
      <p>
        <strong>Design and Dev Pitch</strong> &middot; &copy; {new Date().getFullYear()} Cyril Florita. All
        rights reserved.
      </p>
      {/* A full page load: the portfolio uses a different layout and styles. */}
      <a href="/">Back to portfolio</a>
    </div>
  </footer>
);

// A prominent preview-mode notice (sign-in, the account's sign-in gate):
// an info icon, "Preview mode" and what's simulated.
export const PreviewNotice = ({ children }) => (
  <div className="dl-preview-notice" role="note">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" />
    </svg>
    <p><strong>Preview mode.</strong> {children}</p>
  </div>
);


// The design system's radio demos (option cards and the segmented control):
// the same markup as the real ones, with working selection and arrow keys.
export const DemoRadios = ({ as: Tag = "div", className, label, kind = "option", options }) => {
  const [on, setOn] = useState(0);
  return (
    <Tag className={className} role="radiogroup" aria-label={label} onKeyDown={onRadioKeyDown}>
      {options.map((o, i) => (
        <button
          key={o.label}
          type="button"
          role="radio"
          aria-checked={on === i}
          tabIndex={radioTabIndex(on === i, i, true)}
          className={kind === "option" ? `dl-option${on === i ? " is-on" : ""}` : on === i ? "is-on" : undefined}
          onClick={() => setOn(i)}
        >
          {kind === "option" ? (
            <>
              <span className="dl-option-text"><span>{o.label}</span>{o.hint && <span className="dl-meta">{o.hint}</span>}</span>
              <span className="dl-option-check" />
            </>
          ) : o.label}
        </button>
      ))}
    </Tag>
  );
};
