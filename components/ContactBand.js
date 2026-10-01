"use client";
// Closing "Let's work together" band — ends the home page (after My Work)
// and About Me (as its last snap section). Title types in like the other
// section titles (TITLE_SELECTOR in layout/MotionEffects.js); pieces fade in
// via the scroll reveals. Pass `resume` (a URL to a PDF in /public) to show
// a résumé download button. Styles: "contact band" in _components.scss.
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const EMAIL = "cyril.florita@pm.me";

const LINKEDIN = "https://www.linkedin.com/in/cyrilflorita";

// Same links, order, and icons as the footer (layout/Footer.js), minus
// email — the band already has an email button and address.
const PROFILES = [
  { label: "Behance", href: "https://www.behance.net/cyrilflorita", icon: "fab fa-behance" },
  { label: "GitHub", href: "https://github.com/cyril-florita", icon: "fab fa-github" },
  { label: "LinkedIn", href: LINKEDIN, icon: "fab fa-linkedin-in" },
  { label: "Twitter/X", href: "https://x.com/CyrilFlorita", icon: "fab fa-x-twitter" },
];

// The spelled-out address. With a mouse it's a copy button (tooltip "Copy
// email address", then "Copied!"); on touch devices — and until hydrated —
// it stays a plain mailto link, which is what a phone wants.
const MOUSE = "(hover: hover) and (pointer: fine)";
const watchMouse = (notify) => {
  const mq = window.matchMedia(MOUSE);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
};
const hasMouse = () => window.matchMedia(MOUSE).matches && !!navigator.clipboard;

const CopyEmail = () => {
  const canCopy = useSyncExternalStore(watchMouse, hasMouse, () => false);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!canCopy) return <a href={`mailto:${EMAIL}`}>{EMAIL}</a>;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      window.location.href = `mailto:${EMAIL}`; // clipboard blocked: fall back
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      className="cyril-copy-email"
      data-tip={copied ? "Copied!" : "Click to copy email address"}
      onClick={copy}
      onMouseLeave={() => copied && setCopied(false)}
    >
      {EMAIL}
      <span className="cyril-sr-only" role="status">{copied ? "Email address copied" : ""}</span>
    </button>
  );
};

const ContactBand = ({ resume, glow = false }) => (
  <div className="cyril-contact">
    {/* Dotted background diamonds in the empty half beside the text, sized
        off the band's height so both fit whole (.cyril-contact .cyril-bg-item
        in _components.scss). */}
    <div className="cyril-bg-item cyril-bg-item-large" style={{ top: "28.0%", right: "7%" }} />
    <div className="cyril-bg-item" style={{ top: "16%", left: "42%" }} />
    {/* Accent glow behind the title, above the diamonds (About Me + home). */}
    {glow && <div className="cyril-section-glow" aria-hidden="true" />}
    <div className="container">
      <p className="cyril-upper subheader">
        &#91; Let&apos;s <span className="cyril-accent">connect</span> &#93;
      </p>
      <h2 className="cyril-up glitch cyril-contact-title" data-text="Let's work together">
        Let&apos;s work together
      </h2>
      <p className="cyril-contact-lede">
        Have a project, a role, or an idea in mind? I&apos;d love to hear about it.
      </p>
      <div className="cyril-contact-actions">
        <a className="cyril-button" href={`mailto:${EMAIL}`}>
          <i className="fa-solid fa-paper-plane" aria-hidden="true" />
          Email Me
        </a>
        <a className="cyril-button cyril-type-2" href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="fab fa-linkedin-in" aria-hidden="true" />
          {/* "LinkedIn" with only the L and I at full size, so the word reads
              as LinkedIn rather than a run of capitals. */}
          <span aria-hidden="true">L<span className="cyril-sc">inked</span>I<span className="cyril-sc">n</span></span>
        </a>
        {resume && (
          <a className="cyril-button cyril-type-2" href={resume} download>
            <i className="fa-solid fa-download" aria-hidden="true" />
            Résumé
          </a>
        )}
      </div>
      <p className="cyril-contact-email">
        <CopyEmail />
      </p>
      <ul className="cyril-contact-profiles" aria-label="Profiles">
        {PROFILES.map(({ label, href, icon }) => (
          <li key={label}>
            <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
              <i className={icon} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ContactBand;
