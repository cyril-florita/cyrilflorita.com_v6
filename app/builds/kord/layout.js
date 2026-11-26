import { Archivo, JetBrains_Mono } from "next/font/google";
import "./kord.css";
import Reveal from "@/components/kord/Reveal";
import ToTop from "@/components/kord/ToTop";
import FindModal from "@/components/kord/FindModal";
import Preloader from "@/components/kord/Preloader";

// Kord: an online-only road-bike brand, the fourth design and dev pitch (in progress).
// Like the other pitches it lives outside app/(site), so none of the portfolio's styles or
// chrome load here. The bike is modelled in Blender (scripts/kord/build_bike.py) and drawn
// with three.js (components/kord/BikeStory.js). Read app/builds/kord/README.md.

// Archivo for everything (expanded and heavy for display, normal width for text; the bike's
// logo and frame wordmark are Archivo Expanded Black, stretched — see scripts/kord/make_wordmark.py),
// JetBrains Mono for specs.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--cd-font", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--cd-mono-face", display: "swap", preload: false });   // kord.css builds --cd-mono from it, with the ® font first

export const metadata = {
  title: "Kord · Road bikes, built to order",
  description:
    "Kord is an online-only road-bike brand: a 3D bike you can turn and take apart, a range of four road bikes, and ride-ready delivery. Designed and built by Cyril Florita.",
  alternates: { canonical: "/builds/kord/" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    siteName: "Cyril Florita",
    locale: "en_US",
    images: [{ url: "/og/kord.jpg", width: 1200, height: 630, alt: "Kord, an online-only road-bike brand: the Arc in 3D" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/kord.jpg"] },
};

export const viewport = { themeColor: "#0B0C0E", maximumScale: 5, userScalable: true };

export default function KordLayout({ children }) {
  // the preloader on every page, and between pages (2026-11-25, the user's call; it was the landing's only)
  return <div className={`cd ${archivo.variable} ${mono.variable}`}><Preloader />{children}<Reveal /><ToTop /><FindModal /></div>;
}
