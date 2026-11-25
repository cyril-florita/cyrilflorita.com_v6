import { Archivo, JetBrains_Mono } from "next/font/google";
import "./kord.css";
import Reveal from "@/components/kord/Reveal";
import ToTop from "@/components/kord/ToTop";

// Kord: an online-only road-bike brand, the fourth design and dev pitch (in progress).
// Like the other pitches it lives outside app/(site), so none of the portfolio's styles or
// chrome load here. The bike is modelled in Blender (scripts/kord/build_bike.py) and drawn
// with three.js (components/kord/BikeStory.js). Read app/pitch/kord/README.md.

// Archivo for everything (expanded and heavy for display, normal width for text; the bike's
// logo and frame wordmark are Archivo Expanded Black, stretched — see scripts/kord/make_wordmark.py),
// JetBrains Mono for specs.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--cd-font", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--cd-mono", display: "swap", preload: false });

export const metadata = {
  title: "Kord · Road bikes, built to order",
  description:
    "Kord is an online-only road-bike brand: a 3D bike you can turn and take apart, a range of four road bikes, and ride-ready delivery. A design and dev pitch by Cyril Florita.",
  alternates: { canonical: "/pitch/kord/" },
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
  return <div className={`cd ${archivo.variable} ${mono.variable}`}>{children}<Reveal /><ToTop /></div>;
}
