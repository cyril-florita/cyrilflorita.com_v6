import { DM_Mono, Fraunces, Hanken_Grotesk, Host_Grotesk } from "next/font/google";
import "./hearthside.css";

// Hearthside Home Health: a fictional skilled home health agency and the
// intake system behind its website, built as a design and dev pitch. Like
// Viteo, it lives outside app/(site), so none of the portfolio's styles or
// preloader load here. Shore in dark mode by default (since 2026-10-29: navy
// pages, warm ink); Tide and light mode when someone picks them.
//
// Searchable, like Viteo: the public pages are in app/sitemap.js (HEARTHSIDE)
// and set their own canonicals; the intake app and the status page are
// noindex.

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--hs-font-head", display: "swap" }); // headings
const host = Host_Grotesk({ subsets: ["latin"], variable: "--hs-font-text", display: "swap" }); // body text
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--hs-font-mono", display: "swap" });
// The editorial accent, Fraunces (chosen from ten on 2026-10-29; Instrument
// Serif read too condensed): the statement's second sentence, family quotes,
// the clinicians' own lines and the step numerals. The static 400 cut, as
// compared: the variable font's optical sizing turned large text into its
// narrow, high-contrast display cut. Preloaded: the Home hero's headline
// sets "Compassionate care" in it.
const serif = Fraunces({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--hs-font-serif", display: "swap" });

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
export const viewport = { themeColor: "#1E2A36", maximumScale: 5, userScalable: true };

// Saved colour scheme (Shore by default; Tide only when saved, and anything
// else — such as "hearth", the removed warm scheme — falls back to Shore) and
// mode (dark by default, whatever the OS prefers; light only when someone
// picks it), applied before first paint.
const MODE_SCRIPT = `(function(){var e=document.currentScript.parentElement;try{var t=localStorage.getItem('hs-theme');e.setAttribute('data-hs-theme',t==='tide'?t:'shore');var m=localStorage.getItem('hs-mode');if(m!=='light')m='dark';e.setAttribute('data-hs-mode',m);}catch(x){}})();`;

export default function HearthsideLayout({ children }) {
  return (
    <div className={`hs ${host.variable} ${hanken.variable} ${mono.variable} ${serif.variable}`} data-hs-theme="shore" data-hs-mode="dark" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />
      <a className="hs-skip" href="#main">Skip to content</a>
      {/* (public)/layout.js adds the site's header, frame and footer; intake/
          has its own app shell. */}
      {children}
    </div>
  );
}
