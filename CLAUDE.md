# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Cyril Florita's personal portfolio site — a statically-exported Next.js (App Router) site. `next.config.js` sets `output: 'export'` and `trailingSlash: true`, so there is no Node server at runtime; `next build` produces static HTML/CSS/JS into `out/`, which is uploaded via SFTP (see `deploy.js`).

## Commands

```bash
npm run dev      # next dev — local dev server
npm run build    # next build — produces the static export in out/
npm run start    # next start (rarely useful since the site is statically exported)
npm run lint     # next lint
npm run deploy   # next build && node deploy.js — builds, then SFTP-uploads out/ using SFTP_HOST/SFTP_PORT/SFTP_USERNAME/SFTP_PASSWORD from .env
npm run thumbs   # regenerate WebP thumbnails + size manifest for public/img/portfolio (run after adding/replacing images)
```

### Images: thumbnails + lazy loading

`scripts/make-thumbs.mjs` (via `npm run thumbs`, uses the `sharp` that Next already ships) writes 800w and 1600w WebP copies of every `public/img/portfolio/*.jpg|png` to `public/img/thumbs/portfolio/` and their original `[w, h]` to `components/data/imageSizes.json`. It is **not** part of `next build` — rerun it (and commit the output) whenever portfolio images are added or replaced, or new images will fall back to the full-size original. `components/imageProps.js` turns an original's URL into `<img>` props (WebP `src`/`srcSet`/`sizes` + intrinsic `width`/`height`); grid tiles, case figures and the next-project image use it with `loading="lazy"`, while above-the-fold heroes load eagerly with `fetchPriority="high"`. Links still point at the originals, which only the zoom viewer loads. The Isotope grid no longer waits for images (every tile has a fixed-ratio cover), so lazy images can't stall its layout.

There is no test suite in this repo.

### SCSS

Styles are authored in `public/scss/` (`_variables.scss`, `_common.scss`, `_components.scss`, entry point `style.scss`) and compiled to the checked-in `public/scss/style.css`, which is what `app/layout.js` actually imports (`@scss/style.css`). **After editing any `.scss` partial, you must recompile `style.css`** — but do not run a full `sass` compile of `style.scss`, because `_common.scss` contains a glitch-effect `@keyframes` block generated with SCSS `random()`, so a full recompile rewrites those keyframes with new random values every time and produces a huge unrelated diff. Instead, hand-patch just the new/changed rules into `public/scss/style.css` (and `_components.scss`) directly, matching the existing compiled-CSS style (nesting flattened, `variables.$x` resolved to `var(--color-x)`, etc.). If you do need a full recompile, run `npx sass public/scss/style.scss public/scss/style.css --style=expanded --no-source-map` and then check `git diff` isn't dominated by keyframe churn before committing.

## Architecture

### Routing model: static export + hard navigation between top-level sections

- `app/page.js` (`/`, "My Work") is the merged Hero + Portfolio page: `<Intro />` (the hero, `id="intro"`) sits above `PortfolioIsotope` (heading "My Work" + the filterable grid, anchored at `id="portfolio-start"`). Scrolling down from the hero (mouse wheel) fades/slides it away while the page scrolls to `#portfolio-start` at the same time; scrolling up from the top of My Work reverses it. This hero↔grid transition is driven entirely by classes on `#intro` (`cyril-hero-exit`, `cyril-hero-collapsed`) — see below.
- `app/about-me/page.js` (`/about-me`) is the one-page About Me scroller (background/experience/skills/tools/education sections, scroll-snapped via `public/utility/onepage.js`, paginated with `layout/Pagination.js`'s 5 dots). It does **not** include the hero — that only lives on `/`.
- Individual project case studies live at top-level routes `app/<slug>/page.js` (e.g. `app/gty_v9/page.js` → `/gty_v9`) — there is no `/portfolio` route; those pages exist standalone, one per project, and each "back to portfolio" link does `router.push('/')` after setting `sessionStorage.returnToProject = <project id>`, which `app/page.js`'s mount effect reads to collapse the hero and scroll straight to that project in the grid (see `cyril-hero-collapsed` below).
- Nav links between `/` and `/about-me` (`layout/Nav.js`, `layout/Header.js`) deliberately use `window.location.href` instead of `next/link` client-side transitions — each nav is a **full page reload** of a statically-exported HTML file, preceded by `cyrilUtility.handlePageTransition()`, which slides the preloader panel up over the page (`wipeThen` in `components/Preloader.js`) and resolves once it's covering; the new document starts with its preloader already covering and slides it away, so the two read as one wipe. Because of this, per-page mount effects (theme init, page-enter fade via `.cyril-page.cyril-active`, `cyrilUtility.tpInner()`, etc.) really do re-run from scratch on every navigation between sections — there is no persisted SPA state across `/` ↔ `/about-me`. The project detail pages' back-navigation (`router.push('/')`) is the one place that intentionally uses Next's client router instead of a hard reload.
- **`next.config.js` sets `trailingSlash: true`**, so `usePathname()` returns paths like `/about-me/` (trailing slash) on the actual exported site — not `/about-me`. Any exact `pathname === '/about-me'` check needs the trailing slash stripped first (root `/` is unaffected, it never gets one appended). `layout/Nav.js` and `layout/SiteLayout.js` both normalize `usePathname()` at the top of the component for this reason — do the same in any new code that compares `pathname` to a non-root route.
- "Which section is currently showing" (hero vs. My Work, on `/`; hero vs. About Me's top section, via `#background`) is intentionally derived by reading classes off the relevant DOM element at the moment of each interaction (e.g. `#intro`'s `cyril-hero-exit` class) rather than cached in a separate JS variable/ref — multiple independent places (the wheel handler, Nav's click handlers, Header's logo click, the mount effect) all toggle these classes directly, and an out-of-band counter drifted out of sync with them in the past.

### Theming (dark/light)

- Theme is a `data-theme="light"|"dark"` attribute on `<html>`, driving CSS custom properties defined in `public/scss/_variables.scss` (`:root` = light, `[data-theme="dark"]` overrides).
- Because navigation is a hard reload (see above) and the default `:root` is light, `app/layout.js` inlines a plain (non-`next/script`) synchronous `<script>` as the first child of `<head>` that reads `localStorage.getItem('theme')` and sets `data-theme` on `<html>` **before first paint**, to avoid a light-mode flash. This must stay a raw `<script>` tag directly in `<head>` — using `next/script` (even with `strategy="beforeInteractive"`) gets serialized into the RSC/flight payload instead of emitted as a literal blocking script tag in this Next.js version's static export, which reintroduces the flash.
- `components/ClientThemeProvider.js` (mounted once in `app/layout.js`, wraps the whole tree) re-applies the theme on mount, swaps `.theme-aware-image` `<img>` sources between `data-light-src`/`data-dark-src`, and listens for OS `prefers-color-scheme` changes (only when the user hasn't explicitly chosen a theme via the toggle).
- `layout/ThemeToggle.js` is the actual light/dark switch button; it writes `data-theme` + `localStorage.theme` directly.

### Portfolio grid filtering (Isotope)

`components/PortfolioIsotope.js` renders all portfolio items as static markup (each `.cyril-grid-item` has filter classes like `fil-uix`, `fil-branding`, `fil-marketing`, `fil-illustration`) and layers `isotope-layout` on top for filter/sort/masonry behavior:

- Filter state (`filterKey`) drives an `isotope.arrange({ filter, sortBy })` call. `"*"` shows everything; `"fil-branding-marketing-illustration"` is a combined virtual filter (`.fil-branding, .fil-marketing, .fil-illustration`) for one of the nav buttons.
- DOM order is the "All" order, with UI/UX-related projects intentionally placed first among the 14 items so that the default filter view leads with web/UI/UX work.
- Selecting the UI/UX filter also re-sorts (`sortBy: "orderUix"`, driven by a `data-order-uix` attribute + custom `getSortData` on the Isotope instance) into a different order than "All", and switching back to "All" explicitly re-sorts via Isotope's built-in `"original-order"` key (not the literal string `"original"`, which is not a real Isotope sort key and silently no-ops). This ordering swap plus a brief `.cyril-is-filtering` opacity-dip class (added/removed around the `arrange()` call, see `_components.scss`) is what makes filter changes visually obvious — without both the reorder and the dip, items that already matched the new filter wouldn't visibly move or flash, and switching filters would look like nothing happened.
- On mobile (`max-width: 1200px`), the round "Case Study" badge (`<h3>` inside `.cyril-cover`) and the hover-link icon (`.cyril-hover-link`) can't both show (no `:hover` on touch). CSS uses `:has()`/`:not(:has())` on `.cyril-cover` to hide the hover-link icon on items that have the badge, and to reposition it into the badge's slot on items that don't.

### One-page scroll behavior (`/about-me` only)

`public/utility/onepage.js` implements full-viewport section snapping (mouse wheel → `scrollTo` per `.cyril-section`, paired with `.cyril-dot` pagination) on `/about-me`, but only above 1200px width and only while `<body>` has the `cyril-custom-scroll` class. `SiteLayout` removes that class on other routes, and `app/about-me/page.js` re-adds it on mount, since `app/layout.js` also sets it as the body's initial className (relevant for the very first paint before hydration). The "current section" for the wheel handler is read from whichever `.cyril-section` currently has the `cyril-active` class rather than a private counter, for the same drift-avoidance reason noted above.

### Case-study layout (project pages)

`components/case/CaseStudy.js` holds the editorial project-page building blocks — `CaseHero` (eyebrow — category + descriptor, no dates —, big left-aligned title, summary, facts row, full-bleed image that settles from a zoom on scroll), `CaseLayout` (sticky numbered section index that highlights the current section + content column), `CaseSection`, `CaseFigure` (lightbox image; `ratio` crops very tall images to a framed top preview), `CaseVideo`, `CaseGrid` (`two` / `offset`), `CaseStats`, `CaseQuote`, `CaseNext` (back button + "Next project" band). Styles are the "case study" block at the end of `_components.scss`, all scoped to `.cyril-case-*`. All 14 project pages use it. The section index only renders with 3+ sections (otherwise the left column is an empty margin and section numbers are hidden). Conventions: no dates in the hero/facts (older work shouldn't read as dated), facts only when the page text supports them, captions from original labels/alt/filenames, and `CaseNext` points at the next project in `PortfolioIsotope`'s DOM order (the last wraps to `/gty_v9`) — keep that chain in sync if the grid order changes. The old project-page-only styles (`.cyril-project-page .cyril-top-banner`, `.cyril-project-content`) are now unused; `.cyril-top-banner` itself is still used by the My Work heading on `/`.

### Zoom viewer (image lightbox)

`components/ZoomViewer.js` (mounted by `SiteLayout`; replaced the old `components/popup/*` lightbox) intercepts clicks on any `<a href="/img/…jpg|png|…">` and opens the image in a viewer that grows out of the clicked thumbnail. The browsable set is the link's `data-zoom-group` (else every image link on the `.cyril-case-page`, else just that link). Caption comes from `data-zoom-caption` → the figure's `<figcaption>` → the img alt. Each image gets a shareable `#zoom-<id>` hash (`data-zoom-id`, else the filename slug) that reopens it on load. Prev/next via buttons/arrow keys/swipe; Esc, scroll, or swipe-down closes; click (mouse) or pinch/double-tap (touch) zooms in.

Individual graphics in the My Work grid (no pages of their own, `fil-marketing`, rendered by `GraphicItem` in `PortfolioIsotope.js`): the 30 GTY social graphics (`components/data/socialGraphics.js`, square tiles, `data-zoom-group="social"`, also the gallery on `/gty-social-media-graphics`) the 62 GTY blog graphics (`components/data/blogGraphics.js`, `cyril-banner-item` ~2:1 tiles, `data-zoom-group="blog"`; the `/gty-blog-graphics` page keeps its own figure layout), and the 39 GTY resource graphics (`components/data/resourceGraphics.js`, per-item `label` from the page section and `shape`, `data-zoom-group="resources"`). All graphics render after the case studies in a random order per visit. To itemize another set: add a data file (id/src/caption), map it through `GraphicItem` with its own group and tile shape.

### Motion

- The preloader (`components/Preloader.js`) gates every entrance animation: use `onPreloaderHidden(cb)` to start anything that should play in view. It doubles as the page-transition panel: `wipeThen(go)` slides it up over the page, runs `go` (hard navigation or `router.push`), and — for client-side route changes — slides it away once the new page is in. All internal navigation goes through it (nav/logo via `handlePageTransition`, grid project links, `CaseNext`, every page's back button); a `pageshow` handler reveals pages restored from the back/forward cache. There's no body fade-in any more (the preloader covers first paint).
- `components/CountUp.js`: numbers count up from zero when first scrolled into view (case-study stats, About Me Experience duration), keeping prefix/suffix/decimals; the final value is in the HTML.
- Scroll reveals: `cyrilUtility.revealOnScroll()` (`.cyril-reveal` → `.cyril-revealed`); About Me desktop uses `.cyril-stagger` per section in `onepage.js`. Which pieces animate is `SECTION_REVEAL_SELECTORS` in `public/utility/index.js`; the first section (`#background`) gets hero-style timing (80px rise, 1.2s, 180ms stagger).
- Hero first-load entrance: `playHeroIntro()` in `app/page.js` (`.cyril-hero-piece`); the h1 is pre-split into letters in `01 Intro.js` and typed in via `scrambleInTitle`.
- Split titles (`splitChars` / `scrambleInTitle` / `.cyril-split` in `public/utility/index.js`): the hero h1, the My Work h2 and About Me section h2s type in letter by letter through a letter scramble. `MotionEffects.js` drives the h2s: once on scroll, except desktop About Me where each title retypes whenever its section becomes active.
- `layout/MotionEffects.js` (mounted by `SiteLayout`): subheader text scramble, section-title type-in, scroll + mouse parallax on the dotted `.cyril-bg-item` circles (desktop), plus desktop-mouse-only diamond custom cursor, magnetic clickables (not links inside paragraphs or large blocks), portfolio cover tilt, hero mouse parallax. Pointer effects use the CSS `translate` property (not `transform`) so they compose with the elements' own transform-based animations.
- `layout/ScrollProgress.js`: accent progress bar on project pages.
- Theme switch cross-fade: `.cyril-theme-switching` on `<html>`, added briefly by `ThemeToggle.js`.
- All of it respects `prefers-reduced-motion`. Avoid continuously running animations on tablet/mobile (see the bg noise flicker history).

### Path aliases

`jsconfig.json` defines `@/*` → repo root, `@css/*` → `public/css/*`, `@scss/*` → `public/scss/*`, `@fonts/*` → `public/fonts/*`. Use these instead of relative `../../` imports, matching existing code.
