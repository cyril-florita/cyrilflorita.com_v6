import { DM_Mono, Hanken_Grotesk, Host_Grotesk } from "next/font/google";
import "./hearthside.css";

// Hearthside Home Health: a fictional skilled home health agency and the
// intake system behind its website, built as a design and dev pitch. Like
// Viteo, it lives outside app/(site), so none of the portfolio's styles or
// preloader load here. Light mode by default (the audience reads better on
// light pages); dark mode follows the OS unless someone picks one.
//
// Searchable, like Viteo: the public pages are in app/sitemap.js (HEARTHSIDE)
// and set their own canonicals; the intake app and the status page are
// noindex.

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--hs-font-head", display: "swap" }); // headings
const host = Host_Grotesk({ subsets: ["latin"], variable: "--hs-font-text", display: "swap" }); // body text
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--hs-font-mono", display: "swap" });

export const metadata = {
  title: {
    default: "Hearthside Home Health — Skilled care at home",
    template: "%s — Hearthside Home Health",
  },
  description:
    "Hearthside Home Health, a home health website and intake system concept, designed and built by Cyril Florita.",
  openGraph: {
    type: "website",
    siteName: "Cyril Florita",
    locale: "en_US",
    images: [{ url: "/og/hearthside.jpg", width: 1200, height: 630, alt: "Hearthside Home Health, a home health website and intake system concept" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/hearthside.jpg"] },
};

// Zoom stays available (the root layout locks it for the portfolio).
export const viewport = { themeColor: "#F7F3EC", maximumScale: 5, userScalable: true };

// Saved colour scheme (Tide by default; a saved "hearth", the removed warm scheme, falls back to it) and mode (else the OS
// preference), applied before first paint.
const MODE_SCRIPT = `(function(){var e=document.currentScript.parentElement;try{var t=localStorage.getItem('hs-theme');if(t==='shore')e.setAttribute('data-hs-theme',t);var m=localStorage.getItem('hs-mode');if(m!=='light'&&m!=='dark')m=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';e.setAttribute('data-hs-mode',m);}catch(x){}})();`;

export default function HearthsideLayout({ children }) {
  return (
    <div className={`hs ${host.variable} ${hanken.variable} ${mono.variable}`} data-hs-theme="tide" data-hs-mode="light" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
      <a className="hs-skip" href="#main">Skip to content</a>
      {/* (public)/layout.js adds the site's header, frame and footer; intake/
          has its own app shell. */}
      {children}
    </div>
  );
}
