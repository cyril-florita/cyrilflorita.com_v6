import { Fragment } from "react";
import { BRAND } from "@/components/kord/data";
import { WORDMARK } from "@/components/kord/wordmark";
import CartLink from "@/components/kord/CartLink";
import MobileMenu from "@/components/kord/MobileMenu";
import HeaderScroll from "@/components/kord/HeaderScroll";

// Kord's shell: logo, header and footer (server-safe).

// The mark: a crank's circle with a chartreuse arc, the stroke of a pedal turn.
export function LogoMark({ size = 28 }) {
  return (
    <svg className="cd-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.28" />
      <path d="M16 3.5 A12.5 12.5 0 1 1 3.5 16" fill="none" stroke="var(--cd-accent)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
    </svg>
  );
}

export function Logo({ href = "/builds/kord/" }) {
  return (
    <a className="cd-logo" href={href} aria-label={`${BRAND.name} home`}>
      <LogoMark />
      {/* "KORD" in Archivo Expanded Black, stretched 2.2x wide and 0.8x tall (scripts/kord/make_wordmark.py) */}
      <svg className="cd-logo-word" viewBox={WORDMARK.viewBox} style={{ aspectRatio: WORDMARK.ratio }} aria-hidden="true" focusable="false">
        <path d={WORDMARK.d} fill="currentColor" />
      </svg>
      <span className="cd-reg" aria-hidden="true">®</span>
    </a>
  );
}

export const NAV = [
  { href: "/builds/kord/#range", label: "Models" },
  { href: "/builds/kord/#find", label: "Help me choose" },
  { href: "/builds/kord/compare/", label: "Compare" },
  { href: "/builds/kord/guarantee/", label: "The Kord® Guarantee" },
];

export function Header() {
  return (
    <header className="cd-header">
      <HeaderScroll />
      <div className="cd-wrap cd-header-row">
        <Logo />
        <nav className="cd-nav" aria-label="Main">
          <ul>
            {NAV.map((n) => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}
          </ul>
        </nav>
        <div className="cd-header-end">
          <CartLink />
          <a className="cd-btn cd-btn-ghost cd-btn-sm cd-header-build" href="/builds/kord/build/">Build yours</a>
          <MobileMenu links={[...NAV, { href: "/builds/kord/fit/", label: "Virtual fit" }, { href: "/builds/kord/cart/", label: "Cart" }]} />
        </div>
      </div>
    </header>
  );
}

// A heading's words, each in its own mask (`.cd-w`), for the word-by-word rise: on load for the hero
// and the app pages' titles (CSS), as they scroll into view for section headings (Reveal.js). `--i`
// staggers them; `start` continues the count after a line break.
export function Words({ text, start = 0 }) {
  const ws = String(text).split(" ");
  return ws.map((w, i) => (
    <Fragment key={i}><span className="cd-w" style={{ "--i": start + i }}><span>{w}</span></span>{i < ws.length - 1 ? " " : null}</Fragment>
  ));
}

export function Sample({ children = "Sample content" }) {
  return <span className="cd-sample">{children}</span>;
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="cd-footer">
      <div className="cd-wrap">
        <div className="cd-footer-top">
          <Logo />
          <p className="cd-footer-line">Your Kord® bike, refined by you, built for the road, delivered to your door.</p>
        </div>
        <p className="cd-credit">
          3D model: frame, fork, cockpit and saddle based on <a href="https://sketchfab.com/3d-models/road-bike-cb03b0657fbc4693b59194124ba713db" target="_blank" rel="noopener noreferrer">“Road Bike”</a> by <a href="https://sketchfab.com/tanity" target="_blank" rel="noopener noreferrer">tanity</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> (rescaled, recolored and fitted with new wheels, drivetrain, brakes and decals).
        </p>
        <p className="cd-footer-links"><a href="/builds/kord/fit/">Virtual fit</a><a href="/builds/kord/design-system/">Design system</a></p>
        <p className="cd-legal">
          Designed and built by <a href="/">Cyril Florita</a> · © {year}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
