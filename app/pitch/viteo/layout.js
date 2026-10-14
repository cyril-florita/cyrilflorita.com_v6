import { ViewTransition } from "react";
import { Outfit, Figtree, Plus_Jakarta_Sans, Inter, Fraunces, DM_Sans } from "next/font/google";
import { Header, Footer, ToTop } from "@/components/viteo/ui";
import Reveal from "@/components/viteo/Reveal";
import ScrollMotion from "@/components/viteo/ScrollMotion";
import AmbientShader from "@/components/viteo/AmbientShader";
import "./viteo.css";

// Viteo: a personalized-vitamin subscription, built as a design and dev
// pitch. It lives outside app/(site), so none of the portfolio's styles,
// frame or preloader load here. It's searchable (aimed at founders): the
// landing, quiz and design system are indexed and in the sitemap; plan,
// checkout and account are noindex (empty without a quiz result). Each page
// sets its own canonical. The footer carries the pitch notice; links back to the portfolio are plain <a> tags, so
// they do a full page load.
//
// Three themes, each with light and dark mode (viteo.css): Aqua (default;
// Plus Jakarta Sans + Inter, navy + pastel blocks), Grove (Outfit +
// Figtree, calm botanical) and Peach (Fraunces + DM Sans, peach + periwinkle on navy ink). Dark mode is the default. Every page
// sits in a rounded frame (.dl-frame) of bento panels.

// Only the default theme's fonts (Aqua) are preloaded: preloading all six
// made them compete on slow connections and held back the hero's first paint.
// Grove and Peach load when someone switches theme.
const outfit = Outfit({ subsets: ["latin"], variable: "--dl-font-grove-display", display: "swap", preload: false });
const figtree = Figtree({ subsets: ["latin"], variable: "--dl-font-grove-body", display: "swap", preload: false });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--dl-font-aqua-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--dl-font-aqua-body", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "opsz"], style: ["normal", "italic"], variable: "--dl-font-peach-display", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--dl-font-peach-body", display: "swap", preload: false });

export const metadata = {
  title: {
    default: "Viteo — Personalized daily vitamins",
    template: "%s — Viteo",
  },
  description:
    "Viteo is a direct-to-consumer personalized vitamin subscription — quiz, personalized plan, checkout and self-serve account — designed and built by Cyril Florita as a design and dev pitch.",
  openGraph: {
    type: "website",
    siteName: "Cyril Florita",
    locale: "en_US",
    images: [{ url: "/og/viteo.jpg", width: 1200, height: 630, alt: "Viteo, a personalized vitamin subscription" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/viteo.jpg"] },
  // Installable (a PWA scoped to /pitch/viteo/; see InstallApp.js).
  manifest: "/pitch/viteo/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Viteo", statusBarStyle: "black-translucent" },
  icons: { apple: "/pitch/viteo/apple-touch-icon.png" },
};

// Pinch-zoom stays available on Viteo (the root layout locks it for the
// portfolio); zooming is an accessibility requirement.
export const viewport = { themeColor: "#13151F", maximumScale: 5, userScalable: true };

// Applies the saved theme and mode before first paint, so there's no flash
// (else the defaults on the element: Aqua, dark). ThemeSwitcher keeps these
// in sync. Themes that no longer exist fall back to Aqua. On the landing
// page it also marks the intro as pending (unless reduced motion is on), so
// the hero's objects are hidden from the first paint until the intro's
// timeline starts (IntroMoment.js) instead of flashing in place first.
const THEME_SCRIPT = `(function(){var e=document.currentScript.parentElement;try{var t=localStorage.getItem('dl-theme');var m=localStorage.getItem('dl-mode');if(t==='aqua'||t==='grove'||t==='peach')e.setAttribute('data-dl-theme',t);if(m==='light'||m==='dark')e.setAttribute('data-dl-mode',m);}catch(x){}try{if(location.pathname.replace(/\\/+$/,'')==='/pitch/viteo'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)e.classList.add('is-intro-pending');}catch(x){}})();`;

export default function ViteoLayout({ children }) {
  return (
    <div
      className={`dl ${outfit.variable} ${figtree.variable} ${jakarta.variable} ${inter.variable} ${fraunces.variable} ${dmSans.variable}`}
      data-dl-theme="aqua"
      data-dl-mode="dark"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {/* The moving background, on every page (desktop); it persists across
          client-side page changes. */}
      <AmbientShader />
      <div className="dl-frame">
        <Header />
        {/* Page changes animate (View Transitions): the content eases out and the
            next page rises in; the printed pack morphs between pages
            (ProductBox). Header and footer stay put. */}
        <ViewTransition name="dl-main">
          <main id="main" tabIndex={-1}>{children}</main>
        </ViewTransition>
        <Footer />
      </div>
      <ToTop />
      <Reveal />
      <ScrollMotion />
    </div>
  );
}
