import { Outfit, Figtree, Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Header, Footer, ToTop } from "@/components/viteo/ui";
import Reveal from "@/components/viteo/Reveal";
import "./viteo.css";

// Viteo: a fictional personalized-vitamin subscription, built as a
// product design concept. It lives outside app/(site), so none of the
// portfolio's styles, frame or preloader load here, and it is kept out of
// search results (robots noindex; not in the sitemap). The footer carries
// the concept notice; links back to the portfolio are plain <a> tags, so
// they do a full page load.
//
// Two themes, each with light and dark mode (viteo.css): Aqua (default;
// Plus Jakarta Sans + Inter, navy + pastel blocks) and Grove (Outfit +
// Figtree, calm botanical). Dark mode is the default. Every page
// sits in a rounded frame (.dl-frame) of bento panels.

const outfit = Outfit({ subsets: ["latin"], variable: "--dl-font-grove-display", display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--dl-font-grove-body", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--dl-font-aqua-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--dl-font-aqua-body", display: "swap" });

export const metadata = {
  title: {
    default: "Viteo — personalized daily vitamins (concept)",
    template: "%s — Viteo (concept)",
  },
  description: "Viteo is a fictional personalized-vitamin subscription: a product design concept by Cyril Florita.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/lab/viteo/" },
};

// Applies the saved theme and mode before first paint, so there's no flash
// (else the defaults on the element: Aqua, dark). ThemeSwitcher keeps these
// in sync. Themes that no longer exist fall back to Aqua.
const THEME_SCRIPT = `(function(){try{var e=document.currentScript.parentElement;var t=localStorage.getItem('dl-theme');var m=localStorage.getItem('dl-mode');if(t==='aqua'||t==='grove')e.setAttribute('data-dl-theme',t);if(m==='light'||m==='dark')e.setAttribute('data-dl-mode',m);}catch(x){}})();`;

export default function ViteoLayout({ children }) {
  return (
    <div
      className={`dl ${outfit.variable} ${figtree.variable} ${jakarta.variable} ${inter.variable}`}
      data-dl-theme="aqua"
      data-dl-mode="dark"
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      <div className="dl-frame">
        <Header />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
      </div>
      <ToTop />
      <Reveal />
    </div>
  );
}
