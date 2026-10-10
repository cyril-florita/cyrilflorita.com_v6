"use client";
import Isotope from "isotope-layout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { SOCIAL_GRAPHICS } from "@/components/data/socialGraphics";
import { BLOG_GRAPHICS } from "@/components/data/blogGraphics";
import { RESOURCE_GRAPHICS } from "@/components/data/resourceGraphics";
import { imageProps, SIZES_HINT } from "@/components/imageProps";
import TileMedia, { GridVideo } from "@/components/TileMedia";
import { gsap } from "gsap";
import { wipeThen } from './Preloader';
import { useRouter } from "next/navigation";
import { cyrilUtility } from "@/public/utility/index";

// A single graphic as its own grid item (Marketing filter by default; web
// pieces pass filter="fil-uix" so they show under Web & App). It links to the
// original image, which the zoom viewer opens; `group` keeps prev/next
// within its set. `shape` picks the cover ratio: "square" or "banner"
// (the ~2:1 blog header size). A magnifying-glass icon shows on hover.
const GraphicItem = ({ id, src, caption, group, label, shape, filter = "fil-marketing", note, noteHref, poster, position }) => {
  // Videos play in the tile (while on screen, via GridVideo) and in the
  // viewer; GIFs animate as-is.
  const video = /\.mp4$/i.test(src);
  return (
    <div id={id} className={`cyril-grid-item ${filter}`}>
      <a href={src} data-zoom-group={group} data-zoom-id={id} data-zoom-caption={caption} data-zoom-note={note} data-zoom-link={noteHref} data-zoom-poster={poster}>
        <div className={`cyril-portfolio-item cyril-${shape}-item cyril-mb-80`}>
          <div className="cyril-cover">
            {video ? (
              <GridVideo src={src} poster={poster} label={caption} />
            ) : (
              /* Clips the hover Ken Burns zoom (.cyril-ken-burns in _components.scss). */
              <span className="cyril-ken-burns">
                <img {...imageProps(src, SIZES_HINT.gridTile)} alt={caption} loading="lazy" decoding="async" style={position ? { objectPosition: position } : undefined} />
              </span>
            )}
            <div className="cyril-hover-link cyril-zoom-link">
              {video ? (
                <svg className="cyril-play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="7 4 20 12 7 20 7 4" /></svg>
              ) : (
                <i className="fas fa-search-plus" />
              )}
            </div>
          </div>
          <div className="cyril-project-descr">
            <p className="cyril-upper cyril-accent cyril-mb-10">{label}</p>
            <h4 className="cyril-up">{caption}</h4>
          </div>
        </div>
      </a>
    </div>
  );
};

// Grace to You (v.8) web pieces: the mockup revisions (images; GIFs animate
// in the grid) and the recorded page builds (videos, playing in the grid).
// Long screenshots are cropped from the top (position). Two sets so
// the viewer never mixes videos and images.
const GTY8 = "/img/portfolio/gty8_";
const GTY8_POSTER = "/img/thumbs/portfolio/gty8_";
const GTY8_NOTE = { filter: "fil-uix", note: "Part of the Grace to You (v.8) case study", noteHref: "/gty_v8/" };
const GTY8_PIECES = [
  { id: "gty8-initial-mockups", src: `${GTY8}design_0 - init.gif`, caption: "GTY Initial Mockups", shape: "wide" },
  { id: "gty8-revision-1", src: `${GTY8}design_rev-1.gif`, caption: "GTY Pages (Horizontal/Vertical Page Scroll Prototype)", shape: "wide" },
  { id: "gty8-revision-4-1", src: `${GTY8}design_rev-4_1.jpg`, caption: "GTY Homepage (Glass Version)", shape: "long", position: "50% 0%" },
  { id: "gty8-revision-4-2", src: `${GTY8}design_rev-4_2.jpg`, caption: "GTY Featured Products", shape: "long", position: "50% 0%" },
  { id: "gty8-revision-6-1", src: `${GTY8}design_rev-6_1.jpg`, caption: "GTY Homepage (Minimal Version)", shape: "long", position: "50% 0%" },
  { id: "gty8-revision-6-2", src: `${GTY8}design_rev-6_2.jpg`, caption: "GTY Store", shape: "long", position: "50% 0%" },
  { id: "gty8-revision-6-3", src: `${GTY8}design_rev-6_3.jpg`, caption: "GTY Blogpost", shape: "long", position: "50% 0%" },
  { id: "gty8-revision-6-4", src: `${GTY8}design_rev-6_4.jpg`, caption: "GTY Devotionals", shape: "long", position: "50% 0%" },
].map((g) => ({ ...g, ...GTY8_NOTE, group: "gty8-designs", label: "Web Design" }));
const GTY8_VIDEOS = [
  ["gty8-revision-2", "design_rev-2", "GTY Homepage (Section Slides Prototype)", "Web Design"],
  ["gty8-homepage", "homepage_min", "GTY Homepage", "Front-End Development"],
  ["gty8-about-pages", "about", "GTY About Pages", "Front-End Development"],
  ["gty8-resource-pages", "resources", "GTY Resource Pages", "Front-End Development"],
  ["gty8-giving-pages", "giving", "GTY Giving Pages", "Front-End Development"],
  ["gty8-store-pages", "store", "GTY Store, Product & Checkout", "Front-End Development"],
  ["gty8-account-pages", "account", "GTY Account Pages", "Front-End Development"],
  ["gty8-micro-interactions", "micro-interactions", "GTY Micro-interactions", "Front-End Development"],
].map(([id, file, caption, label]) => ({
  id, caption, label, src: `${GTY8}${file}.mp4`, poster: `${GTY8_POSTER}${file}-poster.webp`, shape: "wide", group: "gty8-video", ...GTY8_NOTE,
}));

const GRAPHIC_SETS = [
  ...SOCIAL_GRAPHICS.map((g) => ({ ...g, group: "social", label: "Social Media Graphic", shape: "square" })),
  ...BLOG_GRAPHICS.map((g) => ({ ...g, group: "blog", label: "Blog Graphic", shape: "banner" })),
  ...RESOURCE_GRAPHICS.map((g) => ({ ...g, group: "resources" })),
  // Web pieces: single screens from a case study, shown under Web & App.
  // The viewer links back to the case study they belong to.
  {
    id: "grace-stream-website",
    src: "/img/portfolio/grace-stream_website.jpg",
    caption: "Grace Stream Website",
    label: "Web Design",
    shape: "long",
    group: "web",
    filter: "fil-uix",
    note: "Part of the Grace Stream case study",
    noteHref: "/grace-stream/",
  },
  ...GTY8_PIECES,
  ...GTY8_VIDEOS,
];

// Fisher–Yates shuffle (returns a new array).
const shuffled = (items) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// "Spread-out" shuffle: random, but avoids placing two graphics from the same
// set (social / blog / resources) next to each other. Pure randomness clumps
// (runs of 3–4 blog banners), which looks less random, and mixing sets also
// mixes tile shapes so the masonry columns grow evenly. Each step picks a set
// other than the previous one, weighted by how many it has left — except when
// the largest set would otherwise outnumber everything else left (then it must
// go next, or it would end up piled together at the end).
const spreadShuffled = (items) => {
  const pools = new Map();
  shuffled(items).forEach((item) => {
    if (!pools.has(item.group)) pools.set(item.group, []);
    pools.get(item.group).push(item);
  });
  const out = [];
  let last = null;
  while (out.length < items.length) {
    const remaining = [...pools.entries()].filter(([, list]) => list.length);
    const left = remaining.reduce((n, [, list]) => n + list.length, 0);
    const [bigGroup, bigList] = remaining.reduce((a, b) => (b[1].length > a[1].length ? b : a));
    let choices = remaining.filter(([g]) => g !== last);
    if (bigGroup !== last && bigList.length > left - bigList.length) choices = [[bigGroup, bigList]];
    // Only the previous set has items left — no choice but to repeat it.
    if (!choices.length) choices = remaining;
    const total = choices.reduce((n, [, list]) => n + list.length, 0);
    let pick = Math.random() * total;
    const [group, list] = choices.find(([, l]) => (pick -= l.length) < 0) || choices[choices.length - 1];
    out.push(list.pop());
    last = group;
  }
  return out;
};

// Isotope filter selector for a filter key.
const filterSelector = (key) => {
  if (key === "*") return "*";
  // Case Studies: every project page except the pure illustrations
  // (Patricia MacArthur is branding + illustration, so it stays).
  if (key === "case-studies") return ".cyril-grid-item[data-project]:not(.fil-illustration:not(.fil-branding))";
  if (key === "fil-branding-marketing-illustration") return ".fil-branding, .fil-marketing, .fil-illustration";
  return `.${key}`;
};

// A soft glow in the accent color that glides behind whichever My Work tile
// is hovered (desktop with a mouse, dark mode — see .cyril-grid-glow) and
// fades out when the pointer leaves the grid. Reduced motion: it jumps
// instead of gliding.
const useGridGlow = (glowRef) => {
  useEffect(() => {
    const glow = glowRef.current;
    const grid = document.querySelector(".cyril-portfolio-grid");
    if (!glow || !grid) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const host = glow.offsetParent || glow.parentElement;
    let current = null;

    const onOver = (e) => {
      const cover = e.target.closest(".cyril-grid-item")?.querySelector(".cyril-cover");
      if (!cover || cover === current) return;
      current = cover;
      const c = cover.getBoundingClientRect(), h = host.getBoundingClientRect();
      const x = c.left - h.left + c.width / 2, y = c.top - h.top + c.height / 2;
      const size = Math.max(c.width, c.height) * 1.9;
      gsap.to(glow, {
        x: x - size / 2, y: y - size / 2, width: size, height: size, opacity: 1,
        duration: reduce ? 0 : 0.7, ease: "power3.out", overwrite: "auto",
      });
    };
    const onLeave = () => {
      current = null;
      gsap.to(glow, { opacity: 0, duration: reduce ? 0 : 0.5, ease: "power2.out", overwrite: "auto" });
    };
    grid.addEventListener("pointerover", onOver);
    grid.addEventListener("pointerleave", onLeave);
    return () => {
      grid.removeEventListener("pointerover", onOver);
      grid.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(glow);
    };
  }, [glowRef]);
};

const PortfolioIsotope = () => {
  const glowRef = useRef(null);
  useGridGlow(glowRef);
  // Case studies (items with a page) stay first, in their set order; the
  // individual graphics follow in a fresh spread-out random order on each
  // visit. Fixed for the life of the page so filtering doesn't reshuffle
  // them; safe to randomize during render because this component is
  // client-only (ssr: false in app/page.js).
  const [graphics] = useState(() => spreadShuffled(GRAPHIC_SETS));
  const router = useRouter();


  // Isotope
  const isotope = useRef();
  const isFirstFilter = useRef(true);
  // Restore whichever sort option was active when the user clicked into a
  // project, so coming back via the browser's back button lands them back
  // on the same filter instead of resetting to the default.
  // Starting filter: Case Studies by default ("All" is the last button). A filter saved when leaving for a project is restored on the
  // way back — except for a shared #zoom-<id> link, which always opens on
  // "All" so the graphic it points to is there.
  const DEFAULT_FILTER = "case-studies";
  const [filterKey, setFilterKey] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_FILTER;
    try {
      if (window.location.hash.startsWith("#zoom-")) return "*";
      return sessionStorage.getItem("portfolioFilter") || DEFAULT_FILTER;
    } catch {
      return DEFAULT_FILTER;
    }
  });

  // One-shot: clear it so a later, unrelated visit to "/" doesn't also
  // inherit a stale filter. And if we're returning to a project the restored
  // filter hides (e.g. picked Design & Dev, then followed "Next project" into
  // a branding piece), switch to "All" so app/page.js can scroll to its tile.
  useEffect(() => {
    try {
      sessionStorage.removeItem("portfolioFilter");
    } catch {}
    // The pending return target: app/page.js hands it over via
    // window.cyrilReturnToProject if its mount effect ran first; otherwise
    // (this grid can mount in the same commit, and child effects run
    // before the parent's) it's still in sessionStorage.
    let returnId = window.cyrilReturnToProject;
    try {
      returnId = returnId || sessionStorage.getItem("returnToProject");
    } catch {}
    window.cyrilReturnToProject = null;
    const target = returnId && document.getElementById(returnId);
    if (target && filterKey !== "*" && !target.matches(filterSelector(filterKey))) setFilterKey("*");
  }, []);

  // Project links: remember the filter (restored on the way back), then
  // wipe the transition panel in before the client-side route change.
  const saveFilterOnNavigate = (e) => {
    try {
      sessionStorage.setItem("portfolioFilter", filterKey);
    } catch {}
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // new tab etc.
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    wipeThen(() => router.push(href));
  };

  useEffect(() => {
    const grid = document.querySelector(".cyril-portfolio-grid");
    if (!grid) return;

    // This component is dynamically imported, so its items didn't exist yet
    // when SiteLayout first tagged the page — tag them now.
    cyrilUtility.revealOnScroll();

    isotope.current = new Isotope(".cyril-portfolio-grid", {
      itemSelector: ".cyril-grid-item",
      percentPosition: true,
      masonry: {
        columnWidth: ".cyril-grid-item",
      },
      getSortData: {
        orderAll: (itemElem) => parseInt(itemElem.getAttribute("data-order-all"), 10) || 999,
        orderBrand: (itemElem) => parseInt(itemElem.getAttribute("data-order-brand"), 10) || 999,
        orderWeb: (itemElem) => parseInt(itemElem.getAttribute("data-order-web"), 10) || 999,
      },
      animationOptions: {
        duration: 750,
        easing: "linear",
        queue: false,
      },
      initLayout: false,
    });

    // Every tile's cover has a fixed aspect ratio (square/long/wide), so the
    // layout doesn't depend on its image — lay out now instead of waiting for
    // images (which are lazy-loaded and may not load until scrolled to).
    isotope.current.layout();

    // …but a tile's *text* can still change height after that — most often a
    // web font that only starts downloading once the grid's own text renders
    // (so it isn't covered by document.fonts.ready), re-wrapping titles and
    // leaving tiles overlapping the ones below (seen on phones/tablets). So
    // re-lay out whenever any tile's content changes size, at most once per
    // frame. Layout only moves tiles (their size comes from CSS), so this
    // can't feed back into itself.
    let relayoutFrame = null;
    const relayout = () => {
      if (relayoutFrame) return;
      relayoutFrame = requestAnimationFrame(() => {
        relayoutFrame = null;
        isotope.current?.layout();
      });
    };
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(relayout) : null;
    grid.querySelectorAll(".cyril-portfolio-item").forEach((el) => resizeObserver?.observe(el));
    document.fonts?.ready.then(relayout);
    document.fonts?.addEventListener?.("loadingdone", relayout);

    // Safety nets — iOS Safari was still seen leaving titles overlapping the
    // next tile on first load despite the observer above. Re-lay out once the
    // page has fully loaded and when any tile's media loads, and for the
    // first 10s compare every tile's height twice a second, re-laying out if
    // anything changed.
    window.addEventListener("load", relayout);
    grid.addEventListener("load", relayout, true); // img/video load events don't bubble
    grid.addEventListener("loadedmetadata", relayout, true);
    const heights = () => Array.from(grid.querySelectorAll(".cyril-grid-item"), (el) => el.offsetHeight).join(",");
    let lastHeights = heights();
    let checks = 0;
    const heightCheck = setInterval(() => {
      const now = heights();
      if (now !== lastHeights) {
        lastHeights = now;
        relayout();
      }
      if (++checks >= 20) clearInterval(heightCheck);
    }, 500);

    // Cleanup
    return () => {
      resizeObserver?.disconnect();
      clearInterval(heightCheck);
      window.removeEventListener("load", relayout);
      grid.removeEventListener("load", relayout, true);
      grid.removeEventListener("loadedmetadata", relayout, true);
      document.fonts?.removeEventListener?.("loadingdone", relayout);
      if (relayoutFrame) cancelAnimationFrame(relayoutFrame);
      if (isotope.current) {
        isotope.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!isotope.current) return;

    const grid = document.querySelector(".cyril-portfolio-grid");
    const skipFlash = isFirstFilter.current;
    isFirstFilter.current = false;

    try {
      const filter = filterSelector(filterKey);

      // Case Studies keeps the DOM (file) order, which is laid out as its
      // three-across rows. Web & App, "All" and Marketing & Branding each have
      // an order of their own (data-order-web / data-order-all /
      // data-order-brand), chosen so
      // every tile lands somewhere new when switching filters — the grid
      // visibly moves, not just hides tiles. Graphics have no order
      // attribute, so they sort after the case studies, keeping their
      // per-visit random order (original-order).
      const sortBy =
        filterKey === "*" ? ["orderAll", "original-order"]
        : filterKey === "fil-uix" ? ["orderWeb", "original-order"]
        : filterKey === "fil-branding-marketing-illustration" ? ["orderBrand", "original-order"]
        : "original-order";

      if (grid && !skipFlash) grid.classList.add("cyril-is-filtering");
      if (skipFlash) {
        // First arrange (the default / restored filter): apply it instantly
        // instead of animating tiles out on load.
        isotope.current.arrange({ filter, sortBy, transitionDuration: 0 });
        window.setTimeout(() => isotope.current?.options && (isotope.current.options.transitionDuration = "0.4s"), 100);
      } else {
        isotope.current.arrange({ filter, sortBy });
      }
      if (grid && !skipFlash) {
        window.setTimeout(() => grid.classList.remove("cyril-is-filtering"), 250);
      }
    } catch (error) {
      console.error('Error filtering items:', error);
    }
  }, [filterKey]);
  const handleFilterKeyChange = (key) => (e) => {
    e.preventDefault();
    setFilterKey(key);
  };

  const activeBtn = (value) => (value === filterKey ? "cyril-current" : "");

  return (

    <Fragment>

      <div className="cyril-filter">
        <div className="container">
          <ul className="cyril-filter-links cyril-mb-30" aria-label="Filter projects">

            <li>
              <button
                type="button"
                className={activeBtn("case-studies")}
                aria-pressed={filterKey === "case-studies"}
                onClick={handleFilterKeyChange("case-studies")}
              >
                Case Studies
              </button>
            </li>

            {/* Web & App: the web and app projects (the fil-uix class, kept
                from the old "Design & Development" filter). */}
            <li>
              <button
                type="button"
                className={activeBtn("fil-uix")}
                aria-pressed={filterKey === "fil-uix"}
                onClick={handleFilterKeyChange("fil-uix")}
              >
                Web &amp; App
              </button>
            </li>

            <li>
              <button
                type="button"
                className={activeBtn("fil-branding-marketing-illustration")}
                aria-pressed={filterKey === "fil-branding-marketing-illustration"}
                onClick={handleFilterKeyChange("fil-branding-marketing-illustration")}
              >
                Marketing &amp; Branding
              </button>
            </li>

            <li>
              <button
                type="button"
                className={activeBtn("*")}
                aria-pressed={filterKey === "*"}
                onClick={handleFilterKeyChange("*")}
              >
                All
              </button>
            </li>
          </ul>
        </div>
      </div>{/* end of .cyril-filter */}

      <div className="container cyril-grid-glow-host">
        <div ref={glowRef} className="cyril-grid-glow" aria-hidden="true" />
        <div className="cyril-portfolio-grid">

          <div className="grid-sizer" />

          {/* wide . viteo (self-initiated concept; first in Case Studies, second in Web & App) */}
          <div id="viteo" data-project="viteo" data-order-web="2" data-order-all="20" className="cyril-grid-item fil-uix">
            <Link href="/viteo" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/viteo" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Product Design &amp; Development · Concept</p>
                  <h4 className="cyril-up">Viteo</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . hunger action month campaign dashboard (looping video thumbnail) */}
          <div id="hamdashboard" data-project="hamdashboard" data-order-web="6" data-order-all="10" data-order-brand="1" className="cyril-grid-item fil-uix fil-marketing">
            <Link href="/hunger-action-month-dashboard" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/hunger-action-month-dashboard" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design, Development, &amp; Campaign Performance Tracking</p>
                  <h4 className="cyril-up">Hunger Action Month Campaign Dashboard</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . the study bible app */}
          <div id="thestudybibleapp" data-project="thestudybibleapp" data-order-web="1" data-order-all="7" className="cyril-grid-item fil-uix">
            <Link href="/the-study-bible-app" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/the-study-bible-app" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">App Design &amp; Prototyping</p>
                  <h4 className="cyril-up">The Study Bible App</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty v9 (looping video thumbnail) */}
          <div id="gty9" data-project="gty9" data-order-web="3" data-order-all="8" className="cyril-grid-item fil-uix">
            <Link href="/gty_v9" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/gty_v9" />
                  <h3>Case Study</h3>
                  {/* <div className="cyril-hover-link coming-soon">
                    <span className="cyril-upper">Coming Soon</span>
                  </div> */}
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UX Design</p>
                  <h4 className="cyril-up">Grace to You</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . hunger action month */}
          <div id="hungeractionmonth" data-project="hungeractionmonth" data-order-web="5" data-order-all="4" data-order-brand="2" className="cyril-grid-item fil-uix fil-marketing">
            <Link href="/hunger-action-month" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/hunger-action-month" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design, Development, &amp; Campaign Performance Tracking</p>
                  <h4 className="cyril-up">Hunger Action Month</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . giving tuesday (looping video thumbnail) */}
          <div id="givingtuesday" data-project="givingtuesday" data-order-web="10" data-order-all="2" data-order-brand="3" className="cyril-grid-item fil-uix fil-marketing">
            <Link href="/giving-tuesday" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/giving-tuesday" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design, Development, &amp; Campaign Performance Tracking</p>
                  <h4 className="cyril-up">Giving Tuesday Campaign</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . gty v8 */}
          <div id="gty8" data-project="gty8" data-order-web="4" data-order-all="1" className="cyril-grid-item fil-uix">
            <Link href="/gty_v8" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/gty_v8" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UX Design &amp; Front-End Development</p>
                  <h4 className="cyril-up">Grace to You (v.8)</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . 35-day generosity challenge (looping video thumbnail) */}
          <div id="generositychallenge" data-project="generositychallenge" data-order-web="13" data-order-all="6" data-order-brand="6" className="cyril-grid-item fil-uix fil-marketing">
            <Link href="/35-day-generosity-challenge" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/35-day-generosity-challenge" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design, Development, &amp; Campaign Performance Tracking</p>
                  <h4 className="cyril-up">35-Day Generosity Challenge</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . gracestream */}
          <div id="gracestream" data-project="gracestream" data-order-web="9" data-order-all="11" data-order-brand="4" className="cyril-grid-item fil-branding fil-uix">
            <Link href="/grace-stream" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/grace-stream" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding, Design, &amp; Development</p>
                  <h4 className="cyril-up">Grace Stream</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty dashboard */}
          <div id="gtydashboard" data-project="gtydashboard" data-order-web="7" data-order-all="3" className="cyril-grid-item fil-uix">
            <Link href="/gty-dashboard" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/gty-dashboard" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design &amp; Development</p>
                  <h4 className="cyril-up">GTY Dashboard</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . volunteer leadership team (looping video thumbnail) */}
          <div id="volunteerleadership" data-project="volunteerleadership" data-order-web="12" data-order-all="5" data-order-brand="7" className="cyril-grid-item fil-uix fil-marketing">
            <Link href="/volunteer-leadership-team" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/volunteer-leadership-team" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design &amp; Development</p>
                  <h4 className="cyril-up">Volunteer Leadership Team</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . truth matters podcast */}
          <div id="truthmatters" data-project="truthmatters" data-order-web="11" data-order-all="12" data-order-brand="5" className="cyril-grid-item fil-branding fil-uix">
            <Link href="/truth-matters" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover truth-matters">
                  <TileMedia slug="/truth-matters" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding, Design, &amp; Development</p>
                  <h4 className="cyril-up">Truth Matters Podcast</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty app (looping video thumbnail — Fig. 01 on its page) */}
          <div id="gtyapplanding" data-project="gtyapplanding" data-order-web="8" data-order-all="13" className="cyril-grid-item fil-uix">
            <Link href="/gty-app-landing" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                {/* Cover sized to the video (640×488), so none of it is cropped. */}
                <div className="cyril-cover" style={{ paddingBottom: `${(488 / 640) * 100}%` }}>
                  <TileMedia slug="/gty-app-landing" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design &amp; Development</p>
                  <h4 className="cyril-up">GTY App Landing Page</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . marketing . blog graphics */}
          <div id="gtyblog" data-project="gtyblog" data-order-all="9" data-order-brand="9" className="cyril-grid-item fil-marketing">
            <Link href="/gty-blog-graphics" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/gty-blog-graphics" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Blog Graphics</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . social media graphics */}
          <div id="gtysocialmedia" data-project="gtysocialmedia" data-order-all="14" data-order-brand="8" className="cyril-grid-item fil-marketing">
            <Link href="/gty-social-media-graphics" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/gty-social-media-graphics" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Social Media Graphics</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty resources */}
          <div id="gtyresources" data-project="gtyresources" data-order-all="16" data-order-brand="10" className="cyril-grid-item fil-marketing">
            <Link href="/gty-resources" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/gty-resources" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Resources</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . (branding) study bible app */}
          <div id="thestudybibleapplogo" data-project="thestudybibleapplogo" data-order-all="15" data-order-brand="11" className="cyril-grid-item fil-branding">
            <Link href="/the-study-bible-app-logo" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/the-study-bible-app-logo" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding</p>
                  <h4 className="cyril-up">The Study Bible App Logo</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . patricia macarthur */}
          <div id="patriciamacarthur" data-project="patriciamacarthur" data-order-all="17" data-order-brand="12" className="cyril-grid-item fil-branding fil-illustration">
            <Link href="/patricia-macarthur-pastoral-care-fund" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/patricia-macarthur-pastoral-care-fund" />
                  <h3>Case Study</h3>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding</p>
                  <h4 className="cyril-up">The Patricia MacArthur Pastoral Care Fund</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . sekihmentis */}
          <div id="sekihmentis" data-project="sekihmentis" data-order-all="19" data-order-brand="13" className="cyril-grid-item fil-illustration">
            <Link href="/sekihmentis" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/sekihmentis" />
                  <div className="cyril-hover-link cyril-corner-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Illustration</p>
                  <h4 className="cyril-up">SekihMentis</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . illustration . he took my place */}
          <div id="hetookmyplace" data-project="hetookmyplace" data-order-all="18" data-order-brand="14" className="cyril-grid-item fil-illustration">
            <Link href="/he-took-my-place" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <TileMedia slug="/he-took-my-place" />
                  <div className="cyril-hover-link cyril-corner-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Illustration</p>
                  <h4 className="cyril-up">He Took My Place</h4>
                </div>
              </div>
            </Link>
          </div>





          {/* individual graphics — no pages; each opens in the zoom viewer
              (components/ZoomViewer.js), browsable within its own set */}
          {graphics.map((g) => <GraphicItem key={g.id} {...g} />)}

        </div>{/* end of .cyril-portfolio-grid */}

      </div>{/* end of .container */}

    </Fragment>

  );
};
export default PortfolioIsotope;