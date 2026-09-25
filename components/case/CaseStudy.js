"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { wipeThen } from "@/components/Preloader";
import { useRouter } from "next/navigation";
import { imageProps, SIZES_HINT } from "@/components/imageProps";
import CountUp from "@/components/CountUp";

// Building blocks for the editorial case-study layout (piloted on
// app/gty_v9/page.js). Styles live under "case study" in _components.scss;
// scroll reveals for these pieces are registered in REVEAL_SELECTORS
// (public/utility/index.js) and the title's letter type-in in
// TITLE_SELECTOR (layout/MotionEffects.js).

const VideoFigure = dynamic(() => import("@/components/VideoFigure"), {
  ssr: false,
  loading: () => <p>Loading video...</p>,
});

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Hero: eyebrow (category + a short descriptor — deliberately no dates, so
// older work doesn't read as dated), oversized left-aligned title, summary,
// the facts row, then (optionally)
// a full-bleed image that settles from a slight zoom as it scrolls up.
export const CaseHero = ({ category, detail, title, summary, facts, image, imageAlt }) => {
  const imgRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || prefersReducedMotion()) return;

    let rafId = null;
    const update = () => {
      rafId = null;
      const rect = img.parentElement.getBoundingClientRect();
      // 0 when the image's top is at the bottom of the viewport, 1 once it
      // has risen to 15% from the top.
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight * 0.85), 0), 1);
      img.style.scale = String(1.08 - 0.08 * progress);
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <header className="container cyril-case-hero">
        <p className="cyril-upper cyril-case-eyebrow">
          <span className="cyril-accent">{category}</span>
          {detail && (
            <>
              <span className="cyril-case-eyebrow-sep" aria-hidden="true" />
              {detail}
            </>
          )}
        </p>
        <h1 className="cyril-up glitch cyril-case-title" data-text={title}>{title}</h1>
        <p className="cyril-case-summary">{summary}</p>
        {facts && (
          <dl className="cyril-case-facts" style={{ "--fact-count": facts.length }}>
            {facts.map(({ label, value }) => (
              <div key={label} className="cyril-case-fact">
                <dt className="cyril-upper">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>
      {image && (
        <div className="cyril-case-bleed">
          {/* On screen at arrival — load it right away, first. */}
          <img ref={imgRef} {...imageProps(image, "100vw")} alt={imageAlt} fetchPriority="high" />
        </div>
      )}
    </>
  );
};

// Two-column body: a sticky section index on the left (highlighting the
// section being read, click to jump) and the sections on the right. Pages
// with fewer than 3 sections get no index — the left column stays as an
// empty margin (apart from the back button) so text lines up the same on
// every project page.
//
// The left column is one sticky rail: the index with a "Back to All Work"
// button under it, so the way back stays in view while reading. Each page stores
// sessionStorage.returnToProject on mount, so the button only has to wipe
// back to the grid. Hidden below 1200px with the index; CaseNext's copy of
// the button covers tablet/mobile.
export const BackToAllWork = ({ onClick, className = "" }) => (
  <button type="button" onClick={onClick} className={`cyril-button cyril-type-2 ${className}`}>
    <svg className="cyril-prev" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
    Back to All Work
  </button>
);

export const CaseLayout = ({ sections, children }) => {
  const router = useRouter();
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return;

    // A section is "current" while it crosses a thin band ~40% down the
    // viewport.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -59% 0px" });

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const jumpTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="container cyril-case-body">
      <aside className="cyril-case-rail">
      {sections.length >= 3 && (
      <nav className="cyril-case-toc" aria-label="Case study sections">
        <ol>
          {sections.map(({ id, label }, i) => (
            <li key={id} className={id === activeId ? "cyril-active" : ""}>
              <a href={`#${id}`} onClick={jumpTo(id)}>
                <span className="cyril-case-toc-num">{String(i + 1).padStart(2, "0")}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      )}
      <BackToAllWork onClick={() => wipeThen(() => router.push("/"))} className="cyril-case-rail-back" />
      </aside>
      <div className="cyril-case-main">{children}</div>
    </div>
  );
};

export const CaseSection = ({ id, number, title, children }) => (
  <section id={id} className="cyril-case-section">
    <div className="cyril-case-section-head">
      <span className="cyril-upper cyril-case-section-num">{String(number).padStart(2, "0")}</span>
      <h2 className="cyril-case-heading">{title}</h2>
    </div>
    <div className="cyril-case-content">{children}</div>
  </section>
);

// An image that opens in the lightbox (ImageView binds any <a href="/img…">).
// `ratio` crops very tall images to a framed preview from the top; the
// lightbox still shows the whole thing. `size`: "text" (prose width) or
// "full" (the whole content column, wider than the text).
// Figures show the WebP thumbnails (lazy-loaded) and link to the original,
// which the zoom viewer opens; the size hint comes from the enclosing grid.
const GridLayout = createContext(null);

export const CaseFigure = ({ src, alt, caption, ratio, size = "full" }) => {
  const layout = useContext(GridLayout);
  const hint = SIZES_HINT[layout === "offset" ? "two" : layout || size];
  return (
  <figure className={`cyril-case-figure cyril-case-figure-${size}`}>
    <a href={src} className="cyril-project-figure">
      <div className="cyril-cover" style={ratio ? { aspectRatio: ratio } : undefined}>
        <img {...imageProps(src, hint)} alt={alt} loading="lazy" decoding="async" className={ratio ? "cyril-case-cropped" : undefined} />
        <div className="cyril-hover-link">
          <i className="fa fa-search-plus" />
        </div>
      </div>
    </a>
    {caption && <figcaption className="cyril-upper">{caption}</figcaption>}
  </figure>
  );
};

export const CaseVideo = ({ src, caption, size = "full" }) => (
  <figure className={`cyril-case-figure cyril-case-figure-${size}`}>
    <VideoFigure url={src} marginTop="" marginBottom="" />
    {caption && <figcaption className="cyril-upper">{caption}</figcaption>}
  </figure>
);

// Figures side by side. layout "two" = level pair; "three" = gallery rows
// (for sets of graphics); "offset" = two where the second sits lower, for a
// staggered editorial rhythm.
export const CaseGrid = ({ layout = "two", children }) => (
  <GridLayout.Provider value={layout}>
    <div className={`cyril-case-grid cyril-case-grid-${layout}`}>{children}</div>
  </GridLayout.Provider>
);

export const CaseStats = ({ items }) => (
  <dl className="cyril-case-stats" style={{ "--stat-count": items.length }}>
    {items.map(({ value, label }) => (
      <div key={label} className="cyril-case-stat">
        <dt className="cyril-case-stat-value"><CountUp value={value} /></dt>
        <dd className="cyril-upper">{label}</dd>
      </div>
    ))}
  </dl>
);

export const CaseQuote = ({ children, cite }) => (
  <blockquote className="cyril-case-quote">
    <p>{children}</p>
    {cite && <cite className="cyril-upper">{cite}</cite>}
  </blockquote>
);

// Closing band: "Back to All Work" link back to the grid plus a large "Next project" link whose image
// fades in on hover (always shown on touch/smaller screens).
export const CaseNext = ({ href, title, category, image, onBack }) => {
  const router = useRouter();
  const goNext = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // new tab etc.
    e.preventDefault();
    wipeThen(() => router.push(href));
  };
  return (
  <div className="container cyril-case-end">
    <BackToAllWork onClick={onBack} className="cyril-case-back" />
    <Link href={href} className="cyril-case-next" onClick={goNext}>
      <span className="cyril-case-next-image" aria-hidden="true">
        <img {...imageProps(image, SIZES_HINT.half)} alt="" loading="lazy" decoding="async" />
      </span>
      <span className="cyril-upper cyril-case-next-eyebrow">Next project</span>
      <span className="cyril-up cyril-case-next-title">
        {title}
        <svg className="cyril-case-next-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
      </span>
      <span className="cyril-upper cyril-accent cyril-case-next-category">{category}</span>
    </Link>
  </div>
  );
};
