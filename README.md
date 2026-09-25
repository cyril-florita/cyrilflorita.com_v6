# Cyril Florita — Personal Website

Source for [cyrilflorita.com](https://cyrilflorita.com): Cyril Florita's design and development portfolio. The home page is a hero plus a filterable "My Work" grid, `/about-me` is a one-page scroller, and each project has its own case-study page.

The site is a statically exported Next.js app. `next build` writes plain HTML/CSS/JS to `out/`, and that folder is uploaded to the host over SFTP. Nothing runs on Node in production.

## Tech

- Next.js 16 (App Router, `output: 'export'`), React 19
- SCSS, compiled to a checked-in `public/scss/style.css`
- Bootstrap grid, Font Awesome (subset), Isotope, Swiper
- `sharp` (bundled with Next) for image thumbnails and share images

## Getting started

Requires **Node.js 20.9+** (the minimum for Next.js 16).

```bash
git clone https://github.com/cyril-florita/cyrilflorita.com_v6
cd cyrilflorita.com_v6
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Static export to `out/`. Runs `thumbs` and `og` first; both skip unchanged files |
| `npm run deploy` | Build, then upload `out/` over SFTP (see below) |
| `npm run thumbs` | 800w/1600w WebP thumbnails for `public/img/portfolio/` and the size manifest `components/data/imageSizes.json` |
| `npm run og` | 1200×630 share images in `public/og/`, plus app icons |
| `npm run lint` | `next lint` |

There is no test suite.

## Project structure

```text
app/            Routes: / (hero + My Work), /about-me, one folder per project case study,
                plus sitemap, robots, manifest and 404
components/     Page sections, case-study building blocks (components/case/),
                zoom viewer, preloader, data files (components/data/)
layout/         Site shell: header, nav, pagination, theme toggle, motion effects
public/scss/    SCSS sources and the compiled style.css
public/utility/ Vanilla JS helpers (one-page scroll, reveals, split titles)
public/img/     Portfolio images (originals) and generated thumbs/
scripts/        Build-time image scripts and the Font Awesome subsetter
deploy.js       SFTP upload of out/
```

Imports use the aliases in `jsconfig.json`: `@/` (repo root), `@css/`, `@scss/`, `@fonts/`.

## Workflow notes

- **Styles:** edit the `.scss` partials, then update `public/scss/style.css` as well, since that's the file the site imports. Hand-patching the changed rules is preferred. A full `sass` compile regenerates the glitch-effect keyframes (generated with `random()`), which floods the diff. If you do need a full compile:

  ```bash
  npx sass public/scss/style.scss public/scss/style.css --style=expanded --no-source-map
  ```

- **Portfolio images:** after adding or replacing images in `public/img/portfolio/`, run `npm run thumbs` and commit the output. Otherwise the new images fall back to the full-size originals.
- **Icons:** Font Awesome is subset to the icons in use. After using a new `fa-*` icon, re-run the subsetter or the icon renders blank:

  ```bash
  pip install fonttools brotli
  python scripts/subset-icons.py
  ```

- **New project pages:** build them from `components/case/CaseStudy.js`, add them to the grid in `components/PortfolioIsotope.js`, and keep the `CaseNext` "next project" chain in grid order.

## Deploying

Create a `.env` in the repo root:

```dotenv
SFTP_HOST=...
SFTP_PORT=22
SFTP_USERNAME=...
SFTP_PASSWORD=...
```

Then run `npm run deploy`. The upload target directory is set in `deploy.js` (`remotePath`). The host is Apache: `public/.htaccess` maps 404s to `/404.html`.

## More detail

[CLAUDE.md](CLAUDE.md) covers the architecture in depth: the routing and page-transition model, theming, grid filtering, motion, accessibility conventions and the zoom viewer.
