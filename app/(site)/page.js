"use client";
import Intro from "@/components/01 Intro";
import SiteLayout from "@/layout/SiteLayout";
import ContactBand from "@/components/ContactBand";
import dynamic from "next/dynamic";
import { applyHiddenState, cyrilUtility, hideSplitTitle, scrambleInTitle } from "@/public/utility/index";
import { onPreloaderHidden } from "@/components/Preloader";
import { FIRE_LAP, fireFrames } from "@/components/fireFrame";
import { session } from "@/components/safeStorage";
import { useEffect, useRef } from "react";

const PortfolioIsotope = dynamic(
  () => import("@/components/PortfolioIsotope"),
  {
    ssr: false,
  }
);

const TRANSITION_MS = 500;

// Coming back from a case study: a "You were just here" toast on its tile's cover
// that rises in, holds, and fades away (.cyril-you-were-here in
// _components.scss; no movement under reduced motion). Decorative — the tile
// itself is the content — so it's hidden from screen readers.
const YOU_WERE_HERE_MS = 3200;
const showYouWereHere = (tile) => {
  const cover = tile.querySelector('.cyril-cover');
  if (!cover || cover.querySelector('.cyril-you-were-here')) return;
  const toast = document.createElement('span');
  toast.className = 'cyril-you-were-here';
  toast.setAttribute('aria-hidden', 'true');
  // Four outline rings (.cyril-you-were-here-ring) ripple out from the diamond.
  toast.innerHTML = 'You were<br>just here' + '<i class="cyril-you-were-here-ring"></i>'.repeat(4);
  cover.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('is-in')));
  // A spotlight: the other cards dim while the toast shows (.is-spotlight
  // on the grid) and come back with it, after the full ~3s. Moving the mouse
  // doesn't end it. While it's on, the grid glow sits behind the returned
  // card (useGridGlow), and hovering a dimmed card neither lights nor colours
  // it nor burns its border (.is-spotlight in _components.scss, useFireFrame).
  // Only a wheel or touch scroll, a click or tap, or a key ends it early.
  // Not 'scroll', which layout and programmatic scrolls also fire.
  const grid = tile.closest('.cyril-portfolio-grid');
  const events = [[window, 'wheel', undim], [window, 'touchmove', undim], [window, 'pointerdown', undim], [window, 'keydown', undim]];
  function undim() {
    grid?.classList.remove('is-spotlight');
    tile.classList.remove('is-spotlit');
    events.forEach(([el, type, fn]) => el?.removeEventListener(type, fn));
  }
  if (grid) {
    tile.classList.add('is-spotlit');
    grid.classList.add('is-spotlight');
    events.forEach(([el, type, fn]) => el.addEventListener(type, fn, { passive: true }));
  }
  // …and the tile's fiery frame burns once round (.is-burning; the same
  // flame as the desktop hover, on any screen size, not under reduced motion).
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    cover.classList.add('is-burning');
    const lap = cover.animate(fireFrames(cover.offsetWidth, cover.offsetHeight), { duration: FIRE_LAP });
    lap.finished.catch(() => {}).finally(() => cover.classList.remove('is-burning'));
  }
  setTimeout(() => {
    undim();
    toast.classList.remove('is-in');
    setTimeout(() => toast.remove(), 600);
  }, YOU_WERE_HERE_MS);
};

// Coming back to a project: glide its tile to the centre of the screen,
// then the toast and spotlight once it lands (scrollend, or a fallback where
// it isn't supported). Used on a normal arrival and on a back/forward-cache
// restore of this page.
const glideToProject = (id) => {
  const tile = document.getElementById(id) || document.querySelector(`[data-project="${id}"]`);
  if (!tile) return;
  tile.scrollIntoView({ behavior: scrollBehavior(), block: 'center' });
  let shown = false;
  const show = () => {
    if (shown) return;
    shown = true;
    showYouWereHere(tile);
  };
  window.addEventListener('scrollend', show, { once: true });
  setTimeout(show, scrollBehavior() === 'smooth' ? 1400 : 100);
};

// Smooth programmatic scrolls, except under reduced motion.
const scrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

// First-load hero entrance: each piece rises in, top to bottom, once the
// preloader is gone — see .cyril-hero-piece in _components.scss. Ordered by
// on-screen position (not DOM order) since tablet/mobile move the photo above
// the text. Only plays when the hero is actually the landing view, not when
// arriving straight at My Work.
const HERO_STEP_MS = 180;
// Matches the 1.2s .cyril-hero-piece transition, plus a little slack.
const HERO_ENTRANCE_MS = 1300;

const playHeroIntro = () => {
  const hero = document.getElementById('intro');
  if (!hero) return;

  const pieces = Array.from(hero.querySelectorAll(
    '.cyril-banner-text > .subheader, .cyril-banner-text > h1, .cyril-short > p, .cyril-buttons-frame > .cyril-button, .cyril-banner-image, .cyril-hero-mobile-photo'
  ))
    .map((el) => ({ el, rect: el.getBoundingClientRect() }))
    // Skip whichever photo is display:none at this width.
    .filter(({ rect }) => rect.width > 0 && rect.height > 0)
    .sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left));

  let headlineDelay = 0;
  pieces.forEach(({ el }, i) => {
    el.style.setProperty('--hero-delay', `${i * HERO_STEP_MS}ms`);
    if (el.tagName === 'H1') headlineDelay = i * HERO_STEP_MS;
  });
  applyHiddenState(pieces.map(({ el }) => el), 'cyril-hero-piece');

  // The headline doesn't rise with the rest — its letters type in through
  // a letter scramble (scrambleInTitle), then the glitch switches on.
  const headline = hero.querySelector('h1.cyril-hero-piece');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (headline && !reduceMotion) hideSplitTitle(headline);

  onPreloaderHidden(() => {
    hero.classList.add('cyril-hero-in');
    if (headline && !reduceMotion) {
      setTimeout(() => scrambleInTitle(headline), headlineDelay);
    }

    // Once everything has landed, drop the entrance class (no visual change
    // at that point) so the pieces get their own transitions back — e.g.
    // the buttons' hover easing and magnetic pull.
    setTimeout(() => {
      pieces.forEach(({ el }) => el.classList.remove('cyril-hero-piece'));
    }, pieces.length * HERO_STEP_MS + HERO_ENTRANCE_MS);
  });
};

const Index = () => {
  const transitioningRef = useRef(false);

  // Hero slides/fades away while the page scrolls to My Work at the same
  // time; the reverse brings the hero back and pushes My Work out of view.
  // Shared by the wheel handler below and by the mount effect, so arriving
  // from another page plays the exact same transition as scrolling does.
  // Both keep the header/footer chrome visible through the scroll — it's
  // never the user's own scrolling that should hide it away here.
  const goToPortfolio = () => {
    transitioningRef.current = true;
    cyrilUtility.keepFrameVisible();
    document.getElementById('intro')?.classList.add('cyril-hero-exit');
    document.getElementById('portfolio-start')?.scrollIntoView({ behavior: scrollBehavior() });
    setTimeout(() => { transitioningRef.current = false; }, TRANSITION_MS);
  };

  const goToHero = () => {
    transitioningRef.current = true;
    cyrilUtility.keepFrameVisible();
    const hero = document.getElementById('intro');
    // Bring it back into layout first (in case it's collapsed), forcing a
    // reflow before removing cyril-hero-exit so the browser registers the
    // opacity: 0 state and actually animates the fade-in instead of just
    // popping straight to visible.
    hero?.classList.remove('cyril-hero-collapsed');
    void hero?.offsetHeight;
    hero?.classList.remove('cyril-hero-exit');
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    setTimeout(() => { transitioningRef.current = false; }, TRANSITION_MS);
  };

  useEffect(() => {
    // Prevent the browser from restoring a stale scroll position on load/refresh
    // so the hero always starts full-page and in view.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Check if we're returning to a specific project
    const returnToProject = session.get('returnToProject');
    // Check if the nav sent us here to land directly on the My Work section
    const scrollToPortfolio = session.get('scrollToPortfolio');

    if (returnToProject) {
      // Clear the storage
      session.remove('returnToProject');
      // Let the grid (mounts a moment later) switch to "All" if its restored
      // filter would hide this project — see PortfolioIsotope.js.
      window.cyrilReturnToProject = returnToProject;

      // We're jumping straight into the portfolio grid. Remove the hero from
      // layout entirely (instead of just fading/scrolling past it) so My Work
      // is the actual top of the page — no scroll-position math needed — and
      // the page-enter reveal is a plain fade (no slide/scale to peek it).
      document.getElementById('intro')?.classList.add('cyril-hero-exit', 'cyril-hero-collapsed');
      document.querySelector('.cyril-page')?.classList.add('cyril-fade-only');
      window.scrollTo(0, 0);

      // Once the preloader has slid away (so the glide is seen, and Isotope
      // has laid the grid out), scroll smoothly to the project's tile and
      // centre it on the screen.
      onPreloaderHidden(() => {
        setTimeout(() => glideToProject(returnToProject), 300);
      });
    } else if (scrollToPortfolio) {
      session.remove('scrollToPortfolio');

      // Let the page load normally with the hero showing, then play the
      // exact same animated hand-off as scrolling down manually would.
      window.scrollTo(0, 0);
      setTimeout(() => {
        goToPortfolio();
      }, 900);
    } else {
      window.scrollTo(0, 0);
      playHeroIntro();
    }

    cyrilUtility.tpInner();

    // Enable smooth scroll behavior (not under reduced motion, where the
    // stylesheet already turns it off).
    if (scrollBehavior() === "smooth") document.documentElement.style.scrollBehavior = "smooth";

    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);
  }, []);

  // The browser's Back from a case study that was a full page load (opened
  // in its own tab, from a search, or reloaded) restores this page from the
  // back/forward cache, so the mount effect above doesn't run again: pick up
  // the project the case study left in returnToProject and give it the same
  // glide, toast and spotlight. (Back after the client router's own
  // navigation remounts the page, which the mount effect already handles.)
  useEffect(() => {
    const onPageShow = (e) => {
      if (!e.persisted) return;
      const id = session.get('returnToProject');
      if (!id) return;
      session.remove('returnToProject');
      document.getElementById('intro')?.classList.add('cyril-hero-exit', 'cyril-hero-collapsed');
      onPreloaderHidden(() => setTimeout(() => glideToProject(id), 300));
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  // Which section is "current" is read straight off the DOM (the hero's own
  // classes) on every wheel event, rather than tracked in a separate ref —
  // so it can never drift out of sync with whatever the mount effect above,
  // Nav.js, or Header.js did to the hero.
  useEffect(() => {
    const handleWheel = (event) => {
      // Desktop only — on tablet/mobile, scrolling to My Work should just
      // be a normal scroll, not this hijacked hero <-> My Work hand-off.
      if (window.innerWidth < 1200) return;

      if (transitioningRef.current) {
        event.preventDefault();
        return;
      }

      const hero = document.getElementById('intro');
      const heroShown = !!hero && !hero.classList.contains('cyril-hero-exit');

      if (heroShown) {
        if (event.deltaY > 0 && window.scrollY <= 10) {
          event.preventDefault();
          goToPortfolio();
        }
        return;
      }

      if (event.deltaY < 0) {
        // If the hero is collapsed out of layout, My Work IS the top of the
        // page, so there's nothing to measure — any scroll-up near position
        // 0 means "reveal the hero". Otherwise (hero just faded out via the
        // wheel above, still occupying its layout space) use its own start
        // position as the threshold.
        const isCollapsed = hero?.classList.contains('cyril-hero-collapsed');
        const portfolioStart = document.getElementById('portfolio-start');
        const nearTop = isCollapsed
          ? window.scrollY <= 50
          : !!portfolioStart && window.scrollY <= portfolioStart.offsetTop + 50;

        if (nearTop) {
          event.preventDefault();
          goToHero();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <SiteLayout header={0}>
      <div>
        <div className="cyril-page cyril-main-page">

          {/* intro (from the About Me one-page's first section) */}
          <Intro />

          
          <div id="portfolio-start" className="container" style={{ position: 'relative' }}>

            <div className="cyril-top-banner">
              <p className="cyril-upper subheader">
                &#91; My <span className="cyril-accent">select projects</span> &#93;
              </p>
              <h2 className="cyril-up cyril-mb-20 glitch" data-text="My Work">My Work</h2>
              <p className="cyril-left-offset">
                Explore a selection of projects showcasing my creative approach and technical expertise.
              </p>
            </div>
            <div
              className="cyril-bg-item"
              style={{ top: "30%", right: "15%", transform: "rotate(-45deg)" }}
            />
          </div>
          <PortfolioIsotope />
          <ContactBand glow />
        </div>
      </div>
    </SiteLayout>
  );
};

export default Index;
