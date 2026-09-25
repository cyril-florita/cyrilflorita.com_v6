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
  const [filterKey, setFilterKey] = useState(() => {
    if (typeof window === "undefined") return "*";
    try {
      return sessionStorage.getItem("portfolioFilter") || "*";
    } catch {
      return "*";
    }
  });

  // One-shot: clear it so a later, unrelated visit to "/" doesn't also
  // inherit a stale filter.
  useEffect(() => {
    try {
      sessionStorage.removeItem("portfolioFilter");
    } catch {}
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
    // Re-run once web fonts settle, since titles set each tile's height.
    isotope.current.layout();
    document.fonts?.ready.then(() => isotope.current?.layout());

    // Cleanup
    return () => {
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
      let filter;
      if (filterKey === "*") filter = "*";
      else if (filterKey === "fil-branding-marketing-illustration") filter = ".fil-branding, .fil-marketing, .fil-illustration";
      else filter = `.${filterKey}`;

      const sortBy = filterKey === "fil-uix" ? "orderUix" : "original-order";

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
                App/Web/UI/UX
              </button>
            </li>

            <li>
              <button
                type="button"
                className={activeBtn("fil-branding-marketing-illustration")}
                aria-pressed={filterKey === "fil-branding-marketing-illustration"}
                onClick={handleFilterKeyChange("fil-branding-marketing-illustration")}
              >
                Branding, Marketing, &amp; Illustration
              </button>
            </li>
          </ul>
        </div>
      </div>{/* end of .cyril-filter */}

      <div className="container">
        <div className="cyril-portfolio-grid">

          <div className="grid-sizer" />

          {/* long . gty v.9 */}
          <div id="gty9" data-project="gty9" data-order-uix="7" className="cyril-grid-item fil-uix">
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
          <div id="thestudybibleapp" data-project="thestudybibleapp" data-order-uix="6" className="cyril-grid-item fil-uix">
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

          {/* long . gty v8 */}
          <div id="gty8" data-project="gty8" data-order-uix="5" className="cyril-grid-item fil-uix">
            <Link href="/gty_v8" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_gty8.jpg", SIZES_HINT.gridTile)} alt="Thumb - GTY Website, v.8" loading="lazy" decoding="async" />
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

          {/* square . truth matters podcast */}
          <div id="truthmatters" data-project="truthmatters" data-order-uix="4" className="cyril-grid-item fil-branding fil-uix">
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
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding/UI/UX/Web</p>
                  <h4 className="cyril-up">Truth Matters Podcast</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . gracestream */}
          <div id="gracestream" data-project="gracestream" data-order-uix="3" className="cyril-grid-item fil-branding fil-uix">
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
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding/UI/UX/Web</p>
                  <h4 className="cyril-up">Grace Stream</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty dashboard */}
          <div id="gtydashboard" data-project="gtydashboard" data-order-uix="2" className="cyril-grid-item fil-uix">
            <Link href="/gty-dashboard" onClick={saveFilterOnNavigate}>
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img {...imageProps("/img/portfolio/thumb_gty-dashboard.jpg", SIZES_HINT.gridTile)} alt="Thumb - GTY Dashboard" loading="lazy" decoding="async" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UI Design &amp; Front-End</p>
                  <h4 className="cyril-up">GTY Dashboard</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty app . */}
          <div id="gtyapplanding" data-project="gtyapplanding" data-order-uix="1" className="cyril-grid-item fil-uix">
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
                  <p className="cyril-upper cyril-accent cyril-mb-10">Web Design &amp; Front-End</p>
                  <h4 className="cyril-up">GTY App Landing Page</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . (branding) study bible app */}
          <div id="thestudybibleapplogo" data-project="thestudybibleapplogo" className="cyril-grid-item fil-branding">
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

          {/* long . sekihmentis */}
          <div id="sekihmentis" data-project="sekihmentis" className="cyril-grid-item fil-illustration">
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
          <div id="hetookmyplace" data-project="hetookmyplace" className="cyril-grid-item fil-illustration">
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

          {/* wide . marketing . blog graphics */}
          <div id="gtyblog" data-project="gtyblog" className="cyril-grid-item fil-marketing">
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

          {/* square . patricia macarthur */}
          <div id="patriciamacarthur" data-project="patriciamacarthur" className="cyril-grid-item fil-branding fil-illustration">
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
                  <p className="cyril-upper cyril-accent cyril-mb-10">Illustration/Branding</p>
                  <h4 className="cyril-up">The Patricia MacArthur Pastoral Care Fund</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty resources */}
          <div id="gtyresources" data-project="gtyresources" className="cyril-grid-item fil-marketing">
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

          {/* square . social media graphics */}
          <div id="gtysocialmedia" data-project="gtysocialmedia" className="cyril-grid-item fil-marketing">
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

          {/* individual graphics — no pages; each opens in the zoom viewer
              (components/ZoomViewer.js), browsable within its own set */}
          {graphics.map((g) => <GraphicItem key={g.id} {...g} />)}

        </div>{/* end of .cyril-portfolio-grid */}

      </div>{/* end of .container */}

    </Fragment>

  );
};
export default PortfolioIsotope;