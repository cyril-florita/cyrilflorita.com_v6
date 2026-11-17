# Mustang pitch (`/pitch/mustang/`)

An interactive Ford Mustang (S650) ad: a spec ad that uses the real name. Unofficial — the footer says it isn't affiliated with Ford, there's no Ford badge or logo, and every figure is stamped sample content. Noindex, not in the sitemap. Layout after a poster the user supplied; car details after the user's S650 Dark Horse photos (side, front 3/4, rear 3/4).

## Files

| Path | What |
| --- | --- |
| `app/pitch/mustang/layout.js` | Fonts (Big Shoulders word at 800 — picked 2026-11-17 from ten narrow faces, after Six Caps and briefly Antonio; Google now ships it as one family with an `opsz` axis, `Big_Shoulders` in next/font, so the Display cut shows at this size —, Michroma heads, Exo 2 body — chosen from nine side-by-side options; it was Inter), metadata (noindex), mounts `SmoothScroll` |
| `app/pitch/mustang/page.js` | Stage children (bg, smoke, floor, word, label, copy, offer), spec strip, footer |
| `app/pitch/mustang/mustang.css` | Everything, scoped under `.ms`; phone rules in the two `max-width: 999px` blocks (the second, "round 2", wins) |
| `components/mustang/CarStage.js` | three.js stage, windows (`Tile`), phone paint dropdown (`PaintMenu`), swatches, hint |
| `components/mustang/Smoke.js` | Background fog |
| `components/mustang/OfferDetails.js` | "Offer details" button + modal |
| `components/mustang/SmoothScroll.js` | Mouse-wheel glide |
| `scripts/mustang/build_car.py` | Builds the car in Blender (see below); `scripts/mustang/sheet.mjs <dir>` tiles its previews |
| `public/pitch/mustang/car.glb`, `car-fallback.webp` | The model and the no-WebGL still |

## Layout

- **Desktop** (stage `100svh − 120px`, so the spec strip shows in the first screen): car centered under a giant MUSTANG behind the car (Big Shoulders 800, letter-spacing −0.02em so the letters almost touch (its natural spacing is tight; −0.045em ran them together); on desktop it's centred on the car, nudged 30px left (`left: −60px`), and as wide as it can be while the G stays 12px short of the windows (centring it in the space left of the windows instead, to make it bigger, was tried and reverted: too big, and off the car): `font-size: min(58.6svh − 119px, (100vw − 2 × (52px + min(250px, 19vw))) / 3.3)` (the word is 3.3em wide; the first term keeps its caps ≥40px under the top), and its caps' foot (0.85em down the 0.92 line box; caps start at 0.04em) 30px above the car's mid-height, `top: calc(47.5% − 0.85em − 30px)`; phones and tablets 26vw, foot just below the roofline so the word stays legible (mid-height hid too much of it there): `top: calc(var(--view-top) + 22vw + 20px − 0.85em)`; solid fill lit from above, no fade at the foot, with `padding-bottom: 0.08em` since a `background-clip: text` fill only paints inside the box — with Antonio it cut the G's bowl flat); paint rail on the far-left edge at mid-height (a vertical "Paint" label and the swatches in a column on a hairline, each name in a glass pill on hover/focus); hero text (title, line, paragraph — no button) beside it; three windows down the right; under the tires the drag hint, then the offer ("Yours from $499 a month.", terms line, "Offer details", then the "[ Sample offer ]" stamp under the button; `top: 66% + 52px`, `+ 40px` on short screens);
- **Phones/tablets (≤999px)**: label top left + paint dropdown top right (swatch and chevron only; names inside the open menu); the hero text is hidden visually but kept for screen readers (it holds the h1); a 16:10 car canvas, full width, with the full view zoomed in (`FULL.fov × 0.74`) so the car spans the screen with ~40px either side, and the drag hint at its feet (full view only); the giant word follows the canvas top (`--view-top`, set by a ResizeObserver in CarStage); windows (3 across, "Full view" spans the row); offer. Specs scroll sideways, each two lines — figure and a short label (`short` in `SPECS`; the full label stays for screen readers) (`components/mustang/SpecStrip.js`: scroll-snap, focusable; cues — a right-edge fade while more lies that way, a thin accent progress bar, and a one-time 56px nudge (snapping paused) once the strip is on screen and the entrance is done, ~2.2s).
- **Spec strip**: 5.0 L V8, 500 hp (Dark Horse), RWD, 6 or 10 speeds, 2+2.

## Layers (z-index inside `.ms-stage`, `isolation: isolate`)

0: `.ms-bg` (gradient, then `.ms-grit` from `Grit.js` — a tileable 512px texture of blotches, scuffs and baked-in grain drawn once to a canvas, shown in an overlay blend — and a corner vignette in `::after`), `.ms-smoke`, `.ms-floor` (in that order) · 1: `.ms-word` · 2: WebGL canvas (car, floor reflection, windows) · 3: `.ms-view` (drag surface) · 4: copy, offer · 5: windows, swatches · 8: phone paint dropdown. (A film-grain layer over the background was tried on 2026-11-17 and removed at the user's request.)

## The car stage (`CarStage.js`)

- three.js 0.185.1, imported on demand. One canvas over the stage; the main view is drawn into `.ms-view`'s rect and each window's camera into its `.ms-tile-window` rect (scissor/viewport). Renders on demand only. No WebGL → `car-fallback.webp`.
- Drag (with inertia) turns the car 360°; arrow keys too; the pointer adds a small parallax. Intro: once the model is ready the camera glides in from further back while the car turns into place (`introUntil`).
- **Windows** (`FEATURES`: rear, cockpit, lights; all `ar` 1.3, `slant` 7%): slanted frames — the windows are drawn first, each cut to shape by a zero-blend triangle over its corner, then its depth cleared and its own shape written at depth ~0 (`maskMesh`, colour off); the main view is drawn last, so it can't paint over a window but fills each cut corner with what surrounds it (a bare transparent corner showed the CSS floor behind the canvas, a dark wedge on the low window); the outline is an SVG polygon at the window's measured pixel size (keep the two in step). Hover/focus (desktop): the window stays put (a CSS shift left the WebGL view a frame behind — a dark sliver at its old edge; removed 2026-11-17), its label nudges, its camera pushes in with a swing (`hoverTile`), and a glow travels its border (three dashed polygons, `pathLength` 100, one literal keyframe set per layer — Chrome won't tween a dash offset written with `var()`). A click flies the main camera to that view; a wider "Full view" window (`FULL_TILE`) then appears under the three, and it or Esc returns.
- **Car hover**: the car's bounding box projected through the main camera; sets `data-car-hover` on the stage and fires `ms:car-hover` (Smoke listens).
- **Floor**: a transparent shader disc over the CSS `.ms-floor` band, with two shadows under the car (a broad soft one and a tighter, darker contact shadow). Plus a subtle reflection, as in the poster: a mirrored copy of the car under the floor drawn with dimmed copies of its materials (`reflect()`, applied to every mirrored part, the model's own materials too: 42% brightness, fading out over the first 0.42 units below the floor and toward the camera between world z 0.6 and 1.9, the paint colour kept in step), so only a short band by the tires shows, faintly, and it never reaches the offer. The floor is partly clear by the car (alpha 0.72, 0.95 farther out; wet patches a little clearer). A full-strength mirror read as glass where the floor fades toward the camera, which is why the copy fades itself. Grungy wet concrete after the poster (2026-11-17): low-frequency noise picks wet patches (a little clearer and darker, and the sheen catches on them) against dry, matte concrete (more opaque, mottled), with hairline cracks in the dry areas, a few darker stains and per-pixel grain, all in the shader.
- **Paint**: five paints; desktop swatches (the left rail) are a `role="radio"` group with roving tabindex; phones get `PaintMenu` (a glass pill opening a listbox; arrows, Home/End, Enter/Space, Esc, tap outside).
- Materials: Neutral tone mapping (AgX greyed the paint), a studio of overhead bars, softboxes and a gradient dome; paint is metallic flake (a random normal map, on box-projected UVs generated at load) under a mirror clear coat.
- Materials are matched by name from the glTF (`Paint`, `Glass`, `Trim`, `Grille`, `Mesh`, `Chrome`, `Rim`, `Tire`, `Disc`, `Caliper`, `Interior`, `LightWhite`, `LightRed`, `Screen`): a new material needs adding both in `build_car.py` and in `mats` in CarStage.js.

## Preloader (`Preloader.js`)

A fixed cover (z-index 60) with the S650 / MUSTANG lockup large and centred: the hairline draws across, the words rise out of their masks, the short rule under the slashes draws, and the four slashes light one after another while the car loads. Once the stage's `data-state` leaves `loading` (ready or fallback) and the fonts are in, all four light, the lockup lifts and the cover fades (at least 1.4s, at most 8s; a CSS timer lifts it after 9s without JS). While it's up the page can't scroll and every entrance animation in the stage and spec strip is paused (`:has(.ms-pre:not(.is-done))`), so they play when it lifts.

## Windows read as clickable

On phones, tablets and touch screens each feature window carries an "opens larger" mark in its top-right corner (`.ms-tile-open`: two arrows to opposite corners on a small dark glass square; accent-coloured on the open window; not on Full view), and at every size (desktop too since 2026-11-17; the mark stays touch-only, desktop has its hover glow) once per visit the hover glow runs one lap round each window in turn (`.ms-tiles.is-sweep`, 1.5s a lap, 0.45s apart, fading in and out; `ms-sweep-*` keyframes). CarStage adds `.is-sweep` (and removes it 2.7s later, or the sweep's filled keyframes would block the desktop hover glow) only once the car is ready, the preloader has lifted, the windows' entrance has finished (1.9s after) and the row is 60% in view; never under reduced motion. A constant throb was considered and rejected (it reads as a notification and runs forever).

On phones and tablets, opening a view adds the Full view window under the three (and closing it removes it), which moves the offer: CarStage measures the offer's top before the change and animates it from there (a FLIP in a `useLayoutEffect` on `view`, 0.55s, `translate` via the Web Animations API; skipped under reduced motion), so it glides down and back up instead of jumping.

## Buttons

`.ms-btn`'s fill is a `::before` layer that fades by opacity (the ghost button's tint too), with only the label colour transitioning: animating `background` itself made Chrome on macOS flash a stale frame mid-hover, as on Hearthside. Pointer cursor.

## Scrollbar

`:root:has(.ms)` sets the page's scrollbar to the accent blue of the `[ Sample offer ]` stamp (`--ms-accent`, #7fb9ff; written out, since the root sits outside `.ms` where the token lives) over the page's near-black, with `::-webkit-scrollbar` rules for Safari before 26. (It followed the chosen paint for a round; the user preferred one colour.)

## Smoke (`Smoke.js`)

Desktop with a mouse: a WebGL2 shader (domain-warped fractal noise, broad billows lit from above the center, nothing below the floor line) on its own canvas at 0.4× resolution, ~30fps, always drifting; paused while the tab is hidden or the stage is off screen. On `ms:car-hover` time runs ~3× faster, the fog swirls round the pointer and brightens. Each effect run creates a fresh canvas (React runs effects twice in dev; a released context can't come back) and a lost context falls back to the CSS layers. Phones/tablets/no WebGL: three CSS layers of a generated noise texture drifting at 38–64s, sped up 4× on hover. Reduced motion: still.

## Offer details (`OfferDetails.js`)

A native `<dialog>` (`showModal`) of clear glass (near-transparent tint, 22px blur, light edge — the blur is on the dialog itself: on the panel inside, it only saw the dialog and blurred nothing): sample lease/finance terms, then "Book a test drive" (primary) and "Call us" (ghost; the ad is pitched to one dealership, so no dealer locator — give it a `tel:` link once the dealer's number is known), which only show a preview note in a live region — nothing is booked from a concept — on the right on desktop (it slides in), while the car glides into the space left of it, centred there and sized to fill it with ~56px to spare each side (`freeW` / `fit` in CarStage's draw; `modalT` eases the view offset and fov); a bottom sheet on phones (up to `max(62dvh, 100dvh − 205px)`, i.e. just under the risen car — on a 390×844 phone all of it shows, fine print included; the page is held by a root `overflow: hidden` plus a touch-scroll block outside the sheet; its two buttons pinned to its foot on a frosted strip), where the page first scrolls to the top and the car rises in its canvas (view offset 0.3 of its height) so it shows above it (and back on close). While open, everything but the background fades (`.ms:has(.ms-offer-dialog[open])`); the dialog is in the top layer so it stays. The car stays in view behind it (OfferDetails fires `ms:modal`; CarStage skips the windows and clears the whole canvas each frame); the dialog sets `pointer-events: auto`, since it sits inside the faded (pointer-events none) offer block. Esc, ×, or a backdrop click that started on the backdrop closes it; focus returns to the button.

## Motion

CSS load sequence (word rises out of a mask, copy and labels fade up, windows slide in, then controls, offer and specs); mouse-wheel glide (`SmoothScroll.js`) and smooth anchors. Everything respects `prefers-reduced-motion`.

## The model

Since 2026-11-17 the car is a licensed model: **"[FREE] 2024 Ford Mustang Dark Horse" by livanovbog**, CC BY 4.0, https://sketchfab.com/3d-models/free-2024-ford-mustang-dark-horse-a29c8bb07f6e41b594fe2248366cffbf (commercial use allowed; the credit is in the page footer — keep it). The download (glTF zip) and its working files live in git-ignored `new-work/mustang/sketchfab-dark-horse/`.

Preparing it (`scripts/mustang/prep_dark_horse.py`):
1. The download comes with the hood, doors, door glass, mirrors, trunk lid and wing open. Each is a hinge matrix on a node; deleting those matrices in a copy of `scene.gltf` (`scene_closed.gltf`) closes them. The front wheels stay steered (~25°) on purpose. The snippet that does it is in the script's header comment history; it resets every non-identity `matrix` except the root, `option1`, `Wheel*`, `group*`, `Caliper*`, `Brakedisc*` and the tyres.
2. `Blender -b -P scripts/mustang/prep_dark_horse.py -- <scene_closed.gltf> <out_dir> --glb <file>` turns it to face +X (the stage's frame; it rotates the root's matrix — the importer uses quaternions), centres it with the wheels on the floor, drops the engine, renames `M_CarPaint`/`M_CarPaintNormal` → `Paint`, `M_Glass_Window` → `Glass`, `M_Rim_Main` → `Rim` (gunmetal), `M_Caliper` → `Caliper` (blue), replaces a grayscale swatch WebP can't hold with its average colour, caps textures at 1024px as WebP, and exports with Draco: 2.7 MB (from 26 MB). `--inspect` lists the parts and renders three quick looks.
3. Copy the result to `public/pitch/mustang/car.glb`. CarStage loads it with `DRACOLoader`; the decoder (three's `examples/jsm/libs/draco`) is vendored in `public/pitch/mustang/draco/` (ESLint ignores it). Everything not renamed keeps the model's own PBR materials and textures (tyres, grille, lamps, badges, interior).
4. `car-fallback.webp` (the no-WebGL still) is captured from the page in headless Chrome: a transparent page with only the canvas showing and the windows off (the modal's mode), trimmed.

The earlier hand-built car (`scripts/mustang/build_car.py`, a coupe lofted from cross-sections, last traced against `new-work/mustang/ref/dark-horse-2.webp`) is retired; its script stays for reference.

`.glb` is served as `model/gltf-binary` and the decoder `.wasm` as `application/wasm`, gzipped and cached for a day (`public/.htaccess`).

## Checking it

Build (`npx next build`), serve `out/`, and drive headless Chrome over CDP at 1440×900 and 390×844 (touch emulation on for phones). Also check `npm run dev` — dev runs effects twice, which once broke the smoke.

## Phones: page width

The phone spec strip hides each long label with an absolutely positioned screen-reader span; its `dt` is `position: relative` so the span stays inside the strip's scroller (it widened the page to ~730px, so phones scrolled sideways into black space and zoomed out, which showed as space under the footer). `.ms` also has `overflow-x: clip` as a guard.

## Known gaps

None structural now that the car is the licensed model. The material table in CarStage still carries entries for the retired car (`Trim`, `Mesh`, `Grille`, `LightWhite`, `LightRed`, `Screen`); they match nothing in the new model and are harmless.
