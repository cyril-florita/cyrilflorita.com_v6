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
```

There is no test suite in this repo.

### SCSS

Styles are authored in `public/scss/` (`_variables.scss`, `_common.scss`, `_components.scss`, entry point `style.scss`) and compiled to the checked-in `public/scss/style.css`, which is what `app/layout.js` actually imports (`@scss/style.css`). **After editing any `.scss` partial, you must recompile `style.css`** — but do not run a full `sass` compile of `style.scss`, because `_common.scss` contains a glitch-effect `@keyframes` block generated with SCSS `random()`, so a full recompile rewrites those keyframes with new random values every time and produces a huge unrelated diff. Instead, hand-patch just the new/changed rules into `public/scss/style.css` (and `_components.scss`) directly, matching the existing compiled-CSS style (nesting flattened, `variables.$x` resolved to `var(--color-x)`, etc.). If you do need a full recompile, run `npx sass public/scss/style.scss public/scss/style.css --style=expanded --no-source-map` and then check `git diff` isn't dominated by keyframe churn before committing.

## Architecture

### Routing model: static export + hard navigation between top-level sections

- `app/page.js` (`/`) is the one-page home ("About Me" — intro/background/experience/skills/tools/education sections stacked and scroll-snapped).
- `app/portfolio/page.js` (`/portfolio`, "My Work") and its per-project subdirectories (`app/portfolio/<slug>/page.js`) are separate routes, one per case study.
- Nav links between `/` and `/portfolio` (`layout/Nav.js`, `layout/Header.js`) deliberately use `window.location.href` instead of `next/link` client-side transitions — each nav is a **full page reload** of a statically-exported HTML file, animated by `cyrilUtility.handlePageTransition()` (adds a `page-exit` class, waits ~400ms) before the reload fires. Because of this, per-page mount effects (theme init, page-enter fade via `.cyril-page.cyril-active`, `cyrilUtility.tpInner()`, etc.) really do re-run from scratch on every navigation between sections — there is no persisted SPA state across `/` ↔ `/portfolio`.
- Individual portfolio project pages read `sessionStorage` (`returnToProject`) to scroll the portfolio grid back to the project the user came from when navigating back.

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

### One-page scroll behavior (home only)

`public/utility/onepage.js` implements full-viewport section snapping (mouse wheel → `scrollTo` per `.cyril-section`, paired with `.cyril-dot` pagination) on the home page, but only above 1200px width and only while `<body>` has the `cyril-custom-scroll` class. `SiteLayout` removes that class on non-home routes, and `app/page.js` re-adds it on mount, since `app/layout.js` also sets it as the body's initial className (relevant for the very first paint before hydration).

### Path aliases

`jsconfig.json` defines `@/*` → repo root, `@css/*` → `public/css/*`, `@scss/*` → `public/scss/*`, `@fonts/*` → `public/fonts/*`. Use these instead of relative `../../` imports, matching existing code.
