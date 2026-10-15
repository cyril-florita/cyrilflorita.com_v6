import { Atkinson_Hyperlegible, Space_Grotesk } from "next/font/google";

// Preloads the portfolio's fonts for portfolio routes only. The root layout
// (app/layout.js) defines the same fonts with `preload: false` — it has to put
// their CSS variables on <html> for the portfolio's `body` styles, and a
// preload there would make every /pitch prototype download fonts it never
// uses (68KB on Viteo). These calls use identical options, so they resolve
// to the same font files: rendering one hidden element with them (SiteFonts)
// is enough for Next to preload those files on the routes that render it.
// Not used by app/not-found.js: the root not-found boundary is part of every
// route's tree, so a preload there leaked onto Viteo too (the 404 page just
// loads the fonts without preloading them).
const atkinson = Atkinson_Hyperlegible({ weight: ["400", "700"], style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ weight: ["400", "500", "600", "700"], style: ["normal"], subsets: ["latin"], display: "swap" });

export default function SiteFonts() {
  return <span hidden aria-hidden="true" className={`${atkinson.className} ${spaceGrotesk.className}`} />;
}
