import Link from "next/link";
import { BASE, PHONE } from "./data";
import { PHOTO_LQIP } from "./photo-lqip";

// Hearthside's shared, server-safe pieces: the logo, icons, buttons and the
// honesty labels. Interactive bits (header menu, mode switch) live in
// client.js. Styles: app/pitch/hearthside/hearthside.css (all under .hs).

// The mark: a plain H knocked out of a leaf, the shape every photo and
// illustration backdrop on the site uses (large quarter-circle sweeps top
// right and bottom left, small corners on the other two). The leaf takes the
// ink colour and the H the page colour, so it inverts with the mode.
export function LogoMark({ size = 40, title }) {
  return (
    <svg className="hs-mark" width={size} height={size} viewBox="0 0 40 40" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path className="hs-mark-leaf" d="M3.5 0H25a15 15 0 0 1 15 15v21.5a3.5 3.5 0 0 1-3.5 3.5H15A15 15 0 0 1 0 25V3.5A3.5 3.5 0 0 1 3.5 0Z" />
      <path className="hs-mark-h" d="M12.5 11h4.4v6.9h6.2V11h4.4v18h-4.4v-7.1h-6.2V29h-4.4Z" />
    </svg>
  );
}

// The lockup: mark, a hairline, then the wordmark and its descriptor.
export function Logo({ href = `${BASE}/` }) {
  return (
    // No prefetch: Home's prefetched data carries a high-priority preload of
    // its hero photo, so every page with the logo downloaded it (151KB on
    // phones). Home still loads on click.
    <Link className="hs-logo" href={href} prefetch={false} aria-label="Hearthside Home Health, home">
      <LogoMark size={36} />
      <span className="hs-logo-rule" aria-hidden="true" />
      <span className="hs-logo-text">
        <span className="hs-logo-name">Hearthside</span>
        <span className="hs-logo-sub">Home Health</span>
      </span>
    </Link>
  );
}

const ICONS = {
  nurse: <><rect x="3" y="7" width="18" height="13" rx="3" /><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M12 10.5v6M9 13.5h6" /></>, // a medical bag: the nurse who comes to you
  pt: <><circle cx="13" cy="4.5" r="1.8" /><path d="M10 21l2-6 3 2v4M8 12l3-4 4 1 2 3M12 15l-1.5-4.5" /></>,
  ot: <><path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11M10 10V5a1.5 1.5 0 0 1 3 0v5M13 10V6a1.5 1.5 0 0 1 3 0v6" /><path d="M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 5 14.5V12a1.5 1.5 0 0 1 2-1.4" /></>,
  speech: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4h0A2.5 2.5 0 0 1 4 13.5Z" /><path d="M8.5 10h.01M12 10h.01M15.5 10h.01" /></>,
  social: <><circle cx="8.5" cy="8" r="3" /><circle cx="16.5" cy="9" r="2.5" /><path d="M3 20a5.5 5.5 0 0 1 11 0M14 15.2a4.5 4.5 0 0 1 7 3.8" /></>,
  aide: <><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" /></>,
  phone: <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5L16 14l4 1.5V19a1.5 1.5 0 0 1-1.5 1.5A15.5 15.5 0 0 1 3.5 5.5 1.5 1.5 0 0 1 5 4Z" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
  family: <><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10v9.5h12V10" /><path d="M10 19.5v-5h4v5" /></>,
  clipboard: <><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 5V3.5h6V5M9 11h6M9 15h4" /></>,
  shield: <><path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6Z" /><path d="m9 12 2 2 4-4" /></>,
  map: <><path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z" /><circle cx="12" cy="10" r="2.2" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.5h.01" /></>,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
};

export function Icon({ name, size = 24, className = "" }) {
  return (
    <svg className={`hs-icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

// variant: primary (ember fill) | secondary (outlined) | quiet (text link look)
export function Button({ href, children, variant = "primary", icon, size, ...rest }) {
  const cls = `hs-btn hs-btn-${variant}${size ? ` hs-btn-${size}` : ""}`;
  const body = (
    <>
      {children}
      {icon && <Icon name={icon} size={20} />}
    </>
  );
  if (!href) return <button className={cls} type="button" {...rest}>{body}</button>;
  // Plain links for phone, email, external and same-page (#) targets: the
  // client router would swallow a hash change (Careers' #apply-<role> links
  // listen for it) and has no business with tel:/mailto:.
  if (/^(tel:|mailto:|https?:|#)/.test(href)) return <a className={cls} href={href} {...rest}>{body}</a>;
  return <Link className={cls} href={href} {...rest}>{body}</Link>;
}

export function PhoneLink({ className = "" }) {
  return (
    <a className={`hs-phone ${className}`} href={PHONE.href}>
      <Icon name="phone" size={20} />
      <span>{PHONE.display}</span>
    </a>
  );
}

// The honest marker on invented content (credentials, people, data).
export function Sample({ children = "Sample content" }) {
  return <span className="hs-sample">{children}</span>;
}


// The editorial row: a small mono label in its own column, content to the
// right, a hairline above (hearthside.css, .hs-row).
export function Row({ label, labelledBy, children, tight, id }) {
  return (
    <section id={id} className={`hs-row${tight ? " is-tight" : ""}`} aria-labelledby={labelledBy}>
      <div className="hs-row-label"><span className="hs-label">{label}</span></div>
      <div className="hs-row-body">{children}</div>
    </section>
  );
}

// A photo, or a placeholder until it arrives. With `src` (a base path like
// "/img/hearthside/photos/name", exported as -900.webp and -1600.webp by the
// grading step) it renders the real image, cropped to `ratio` around
// `position`; without it, a quiet block that says what the shot should be, so
// the page doubles as the shot list. Photos are warm-graded to sit with the
// illustrations and never share a component with them.
export function Photo({ shot, ratio = "4 / 3", src, alt, position = "50% 50%", sizes = "(max-width: 900px) 92vw, 60vw" }) {
  // A real photo sits in a frame (the leaf shape, clipping), which paints a
  // tiny blurred preview (photo-lqip.js) until the image arrives, and lets the
  // image ease in on its focal point while a call to action beside it is
  // hovered (hearthside.css).
  if (src) {
    const lqip = PHOTO_LQIP[src];
    return (
      <span className="hs-photo-frame" style={{ aspectRatio: ratio, backgroundImage: lqip ? `url(${lqip})` : undefined, backgroundPosition: position }}>
        <img className="hs-photo-img" src={`${src}-1600.webp`} srcSet={`${src}-600.webp 600w, ${src}-900.webp 900w, ${src}-1600.webp 1600w`} sizes={sizes}
          alt={alt ?? shot} loading="lazy" decoding="async" style={{ objectPosition: position, transformOrigin: position }} />
      </span>
    );
  }
  return (
    <div className="hs-photo" style={{ "--ratio": ratio }} role="img" aria-label={`Photo placeholder: ${shot}`}>
      <span className="hs-photo-inner" aria-hidden="true">
        <svg className="hs-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></svg>
        <span className="hs-photo-tag">Photo</span>
        <span>{shot}</span>
      </span>
    </div>
  );
}

// Fictional referral partners for the logo strip (sample content).
const PARTNER_MARKS = {
  ring: <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="17" cy="17" r="15" /><path d="M17 9v16M9 17h16" /></svg>,
  square: <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="26" height="26" /><rect x="9" y="9" width="12" height="12" fill="currentColor" /></svg>,
  leaf: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 26C6 13 14 6 26 6c0 12-7 20-20 20Z" /><path d="M6 26 18 14" /></svg>,
  arch: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 28V15a11 11 0 0 1 22 0v13" /><path d="M11 28V16a5 5 0 0 1 10 0v12" /></svg>,
  wave: <svg width="34" height="24" viewBox="0 0 34 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 8c5-6 10 6 15 0s10 6 15 0M2 16c5-6 10 6 15 0s10 6 15 0" /></svg>,
  sun: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="16" cy="16" r="6" /><path d="M16 2v5M16 25v5M2 16h5M25 16h5M6 6l3.5 3.5M22.5 22.5 26 26M6 26l3.5-3.5M22.5 9.5 26 6" /></svg>,
};
export const PARTNERS = [
  { mark: "ring", name: "Larkfield", sub: "Medical Center" },
  { mark: "square", name: "Calloway", sub: "Family Practice", style: "is-mono" },
  { mark: "leaf", name: "Fernwood", sub: "Senior Living", style: "is-serif" },
  { mark: "arch", name: "Westbrook", sub: "Rehabilitation" },
  { mark: "wave", name: "Brightwater", sub: "Orthopedics", style: "is-serif" },
  { mark: "sun", name: "Oakline", sub: "Cardiology", style: "is-mono" },
];
export function PartnerLogos() {
  return (
    <ul className="hs-logos" aria-label="Sample referral partners">
      {PARTNERS.map((p) => (
        <li key={p.name} className={p.style}>
          <span aria-hidden="true">{PARTNER_MARKS[p.mark]}</span>
          <span className="hs-logo-word"><b>{p.name}</b><small>{p.sub}</small></span>
        </li>
      ))}
    </ul>
  );
}

// A subpage's opening: the title on the left, lede on the right,
// and optionally a wide banner photo (first on phones, app-style).
export function PageHead({ title, lede, children, photo }) {
  return (
    <header className={`hs-page-head${photo ? " has-photo" : ""}`}>
      <div>
        <h1>{title}</h1>
      </div>
      <div data-dock-hide={children ? "" : undefined}>
        {lede && <p className="hs-lede">{lede}</p>}
        {children}
      </div>
      {/* Optional banner photo: under the title row on desktop (16:6 unless the
          photo passes its own ratio), first on phones. */}
      {photo && <div className="hs-page-photo"><Photo ratio="16 / 6" sizes="(max-width: 760px) 92vw, 1280px" {...photo} /></div>}
    </header>
  );
}

// Loading placeholder for the intake screens: the shape of a screen head and
// a few blocks, shimmering softly (still under reduced motion).
export function Skeleton({ blocks = 4, label = "Loading" }) {
  return (
    <div className="hs-skel" aria-busy="true" aria-label={label} role="status">
      <span className="hs-skel-line is-title" />
      <span className="hs-skel-line" />
      <span className="hs-skel-grid">{Array.from({ length: blocks }, (_, i) => <span key={i} className="hs-skel-block" />)}</span>
    </div>
  );
}
