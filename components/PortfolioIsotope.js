"use client";
import Isotope from "isotope-layout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { SOCIAL_GRAPHICS } from "@/components/data/socialGraphics";
import { BLOG_GRAPHICS } from "@/components/data/blogGraphics";
import { RESOURCE_GRAPHICS } from "@/components/data/resourceGraphics";
import { imageProps, SIZES_HINT } from "@/components/imageProps";
import { wipeThen } from './Preloader';
import { useRouter } from "next/navigation";
import { cyrilUtility } from "@/public/utility/index";

// A looping, silent video in place of a tile's thumbnail. Shows its poster
// and downloads nothing until the tile is near the viewport (preload="none"),
// plays only while on screen, pauses when scrolled away. Reduced motion: the
// poster only. Styled like tile images (grayscale → color on hover).
const GridVideo = ({ src, poster, label }) => {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else if (!video.paused) video.pause();
    }, { rootMargin: "200px 0px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      aria-label={label}
    />
  );
};

// A crossfading slideshow in place of a tile's thumbnail (images stacked,
// one visible at a time). Advances only while the tile is on screen; reduced
// motion shows the first image only. Styled like tile images.
const SLIDE_MS = 2500;
const GridSlideshow = ({ images, label }) => {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = null;
    const stop = () => { clearInterval(timer); timer = null; };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !timer) {
        timer = setInterval(() => setActive((i) => (i + 1) % images.length), SLIDE_MS);
      } else if (!entry.isIntersecting) stop();
    });
    observer.observe(el);
    return () => { observer.disconnect(); stop(); };
  }, [images.length]);
  return (
    <span ref={ref} className="cyril-grid-slideshow" role="img" aria-label={label}>
      {images.map((src, i) => (
        <img
          key={src}
          {...imageProps(src, SIZES_HINT.gridTile)}
          alt=""
          loading="lazy"
          decoding="async"
          className={i === active ? "is-active" : undefined}
        />
      ))}
    </span>
  );
};

// A single graphic as its own grid item (Marketing filter). It links to the
// original image, which the zoom viewer opens; `group` keeps prev/next
// within its set. `shape` picks the cover ratio: "square" or "banner"
// (the ~2:1 blog header size). No hover icon — the cursor's "View" says it.
const GraphicItem = ({ id, src, caption, group, label, shape }) => (
  <div id={id} className="cyril-grid-item fil-marketing">
    <a href={src} data-zoom-group={group} data-zoom-id={id} data-zoom-caption={caption}>
      <div className={`cyril-portfolio-item cyril-${shape}-item cyril-mb-80`}>
        <div className="cyril-cover">
          <img {...imageProps(src, SIZES_HINT.gridTile)} alt={caption} loading="lazy" decoding="async" />
        </div>
        <div className="cyril-project-descr">
          <p className="cyril-upper cyril-accent cyril-mb-10">{label}</p>
          <h4 className="cyril-up">{caption}</h4>
        </div>
      </div>
    </a>
  </div>
);

const GRAPHIC_SETS = [
  ...SOCIAL_GRAPHICS.map((g) => ({ ...g, group: "social", label: "Social Media Graphic", shape: "square" })),
  ...BLOG_GRAPHICS.map((g) => ({ ...g, group: "blog", label: "Blog Graphic", shape: "banner" })),
  ...RESOURCE_GRAPHICS.map((g) => ({ ...g, group: "resources" })),
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
  if (key === "fil-branding-marketing-illustration") return ".fil-branding, .fil-marketing, .fil-illustration";
  return `.${key}`;
};

const PortfolioIsotope = () => {
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
  // on the same filter instead of resetting to "All".
  // Starting filter: "All" by default. A filter saved when leaving for a
  // project is restored on the way back — except for a shared #zoom-<id>
  // link, which always opens on "All" so the graphic it points to is there.
  const DEFAULT_FILTER = "*";
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
        orderUix: (itemElem) => parseInt(itemElem.getAttribute("data-order-uix"), 10) || 999,
        orderBrand: (itemElem) => parseInt(itemElem.getAttribute("data-order-brand"), 10) || 999,
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

    // Cleanup
    return () => {
      resizeObserver?.disconnect();
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

      // Each filter has its own order (data-order-uix / data-order-brand),
      // chosen so every tile it keeps lands somewhere new — switching
      // filters always visibly moves the grid, not just hides tiles.
      // Graphics have no order attribute, so they sort after the case
      // studies, keeping their per-visit random order (original-order).
      const sortBy =
        filterKey === "fil-uix" ? ["orderUix", "original-order"]
        : filterKey === "fil-branding-marketing-illustration" ? ["orderBrand", "original-order"]
        : "original-order";

      if (grid && !skipFlash) grid.classList.add("cyril-is-filtering");
      isotope.current.arrange({ filter, sortBy });
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
                className={activeBtn("*")}
                aria-pressed={filterKey === "*"}
                onClick={handleFilterKeyChange("*")}
              >
                All
              </button>
            </li>

            <li>
              <button
                type="button"
                className={activeBtn("fil-uix")}
                aria-pressed={filterKey === "fil-uix"}
                onClick={handleFilterKeyChange("fil-uix")}
              >
                Design &amp; Development
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
          </ul>
        </div>
      </div>{/* end of .cyril-filter */}

      <div className="container">
        <div className="cyril-portfolio-grid">

          <div className="grid-sizer" />

          {/* wide . hunger action month */}
          <div id="hungeractionmonth" data-project="hungeractionmonth" data-order-uix="3" data-order-brand="2" className="cyril-grid-item fil-uix fil-marketing">
            <Link href="/hunger-action-month" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <GridVideo
                    src="/img/portfolio/chf-hunger-action-month_preview.mp4"
                    poster="/img/thumbs/portfolio/chf-hunger-action-month_preview-poster.webp"
                    label="Hunger Action Month landing page preview"
                  />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design &amp; Development</p>
                  <h4 className="cyril-up">Hunger Action Month</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . gty v8 */}
          <div id="gty8" data-project="gty8" data-order-uix="1" className="cyril-grid-item fil-uix">
            <Link href="/gty_v8" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <GridVideo
                    src="/img/portfolio/gty8_homepage.mp4"
                    poster="/img/thumbs/portfolio/gty8_homepage-poster.webp"
                    label="GTY Website, v.8 homepage preview"
                  />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UX Design &amp; Web Development</p>
                  <h4 className="cyril-up">GTY Website, v.8</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty dashboard */}
          <div id="gtydashboard" data-project="gtydashboard" data-order-uix="2" className="cyril-grid-item fil-uix">
            <Link href="/gty-dashboard" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <GridSlideshow
                    label="GTY Dashboard screens"
                    images={[
                      "/img/portfolio/gty-dashboard-1b.jpg",
                      "/img/portfolio/gty-dashboard-2a.jpg",
                      "/img/portfolio/gty-dashboard-2b.jpg",
                      "/img/portfolio/gty-dashboard-3.jpg",
                      "/img/portfolio/gty-dashboard-4.jpg",
                      "/img/portfolio/gty-dashboard-5.jpg",
                    ]}
                  />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design &amp; Development</p>
                  <h4 className="cyril-up">GTY Dashboard</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . 35-day generosity challenge */}
          <div id="generositychallenge" data-project="generositychallenge" data-order-uix="10" data-order-brand="1" className="cyril-grid-item fil-uix fil-marketing">
            <Link href="/35-day-generosity-challenge" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_chf-35-day-generosity.jpg", SIZES_HINT.gridTile)} alt="Thumb - 35-Day Generosity Challenge" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design &amp; Development</p>
                  <h4 className="cyril-up">35-Day Generosity Challenge</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . giving tuesday */}
          <div id="givingtuesday" data-project="givingtuesday" data-order-uix="4" data-order-brand="12" className="cyril-grid-item fil-uix fil-marketing">
            <Link href="/giving-tuesday" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_chf-giving-tuesday.jpg", SIZES_HINT.gridTile)} alt="Thumb - Giving Tuesday Campaign" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design &amp; Development</p>
                  <h4 className="cyril-up">Giving Tuesday Campaign</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . truth matters podcast */}
          <div id="truthmatters" data-project="truthmatters" data-order-uix="5" data-order-brand="3" className="cyril-grid-item fil-branding fil-uix">
            <Link href="/truth-matters" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover truth-matters">
                  <img {...imageProps("/img/portfolio/thumb_truth-matters-podcast-2.jpg", SIZES_HINT.gridTile)} alt="Thumb - Truth Matters Podcast" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design, Development, &amp; Branding</p>
                  <h4 className="cyril-up">Truth Matters Podcast</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . gracestream */}
          <div id="gracestream" data-project="gracestream" data-order-uix="6" data-order-brand="4" className="cyril-grid-item fil-branding fil-uix">
            <Link href="/grace-stream" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_grace-stream.jpg", SIZES_HINT.gridTile)} alt="Thumb - Grace Stream" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design, Development, &amp; Branding</p>
                  <h4 className="cyril-up">Grace Stream</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty app . */}
          <div id="gtyapplanding" data-project="gtyapplanding" data-order-uix="7" className="cyril-grid-item fil-uix">
            <Link href="/gty-app-landing" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_gty-app-landing.jpg", SIZES_HINT.gridTile)} alt="Thumb - GTY App Landing Page" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Design &amp; Development</p>
                  <h4 className="cyril-up">GTY App Landing Page</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . gty v.9 */}
          <div id="gty9" data-project="gty9" data-order-uix="8" className="cyril-grid-item fil-uix">
            <Link href="/gty_v9" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_gty9.jpg", SIZES_HINT.gridTile)} alt="Thumb - GTY Website, v.9" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                  {/* <div className="cyril-hover-link coming-soon">
                    <span className="cyril-upper">Coming Soon</span>
                  </div> */}
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UX Design</p>
                  <h4 className="cyril-up">GTY Website, v.9</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . the study bible app */}
          <div id="thestudybibleapp" data-project="thestudybibleapp" data-order-uix="9" className="cyril-grid-item fil-uix">
            <Link href="/the-study-bible-app" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_the-study-bible-app.jpg", SIZES_HINT.gridTile)} alt="Thumb - The Study Bible App" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">App Design</p>
                  <h4 className="cyril-up">The Study Bible App</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . (branding) study bible app */}
          <div id="thestudybibleapplogo" data-project="thestudybibleapplogo" data-order-brand="5" className="cyril-grid-item fil-branding">
            <Link href="/the-study-bible-app-logo" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_study-bible-app-logo-2.jpg", SIZES_HINT.gridTile)} alt="Thumb - The Study Bible App Logo" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding</p>
                  <h4 className="cyril-up">The Study Bible App Logo</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . patricia macarthur */}
          <div id="patriciamacarthur" data-project="patriciamacarthur" data-order-brand="6" className="cyril-grid-item fil-branding fil-illustration">
            <Link href="/patricia-macarthur-pastoral-care-fund" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_patricia-macarthur-pastoral-fund.jpg", SIZES_HINT.gridTile)} alt="Thumb - The Patricia MacArthur Pastoral Care Fund Logo" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding</p>
                  <h4 className="cyril-up">The Patricia MacArthur Pastoral Care Fund</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty resources */}
          <div id="gtyresources" data-project="gtyresources" data-order-brand="7" className="cyril-grid-item fil-marketing">
            <Link href="/gty-resources" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_gty-resources.jpg", SIZES_HINT.gridTile)} alt="Thumb - GTY Resources" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Resources</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . marketing . blog graphics */}
          <div id="gtyblog" data-project="gtyblog" data-order-brand="8" className="cyril-grid-item fil-marketing">
            <Link href="/gty-blog-graphics" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_gty-blog.jpg", SIZES_HINT.gridTile)} alt="Thumb - GTY Blog Graphics" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Blog Graphics</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . social media graphics */}
          <div id="gtysocialmedia" data-project="gtysocialmedia" data-order-brand="9" className="cyril-grid-item fil-marketing">
            <Link href="/gty-social-media-graphics" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_gty-social-media.jpg", SIZES_HINT.gridTile)} alt="Thumb - GTY Social Media Graphics" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Social Media Graphics</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . sekihmentis */}
          <div id="sekihmentis" data-project="sekihmentis" data-order-brand="10" className="cyril-grid-item fil-illustration">
            <Link href="/sekihmentis" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_sekihmentis.jpg", SIZES_HINT.gridTile)} alt="Thumb - SekihMentis" loading="lazy" decoding="async" />
                  <div className="cyril-hover-link">
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
          <div id="hetookmyplace" data-project="hetookmyplace" data-order-brand="11" className="cyril-grid-item fil-illustration">
            <Link href="/he-took-my-place" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_he-took-my-place.jpg", SIZES_HINT.gridTile)} alt="Thumb - He Took My Place" loading="lazy" decoding="async" />
                  <div className="cyril-hover-link">
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