import { Big_Shoulders, Michroma, Exo_2 } from "next/font/google";
import "./mustang.css";
import SmoothScroll from "@/components/mustang/SmoothScroll";

// Mustang: an interactive car ad, the third design and dev pitch. A spec ad —
// unofficial, not affiliated with Ford (the footer says so) — so it stays out
// of search (noindex) and the sitemap. Like the other pitches it lives
// outside app/(site), so none of the portfolio's styles or chrome load here.
// The car is modelled in Blender by scripts/mustang/build_car.py and drawn
// with three.js (components/mustang/CarStage.js).

// The giant word: Big Shoulders at 800, a Chicago-signage grotesk (picked 2026-11-17, after Six Caps and Antonio).
// Google now ships Display and Text as one family with an optical-size axis; at this size the browser picks the Display cut.
const word = Big_Shoulders({ subsets: ["latin"], weight: "variable", axes: ["opsz"], variable: "--ms-font-word", display: "swap" });
const michroma = Michroma({ subsets: ["latin"], weight: "400", variable: "--ms-font-head", display: "swap" });
// Body text: Exo 2 (picked from nine options on 2026-11-17; it was Inter).
const body = Exo_2({ subsets: ["latin"], variable: "--ms-font-body", display: "swap" });

export const metadata = {
  title: "Ford Mustang · Interactive ad concept",
  description:
    "An interactive ad concept for the Ford Mustang: a 3D car you can turn all the way around, with live windows on its taillights, cockpit and headlights. A design and dev pitch by Cyril Florita, not affiliated with Ford.",
  alternates: { canonical: "/pitch/mustang/" },
  robots: { index: false, follow: true },
  // its own share image (from the desktop landing, via npm run og), not the portfolio's default
  openGraph: {
    type: "website",
    siteName: "Cyril Florita",
    locale: "en_US",
    url: "/pitch/mustang/",
    title: "Ford Mustang · Interactive ad concept",
    description: "A 3D Mustang Dark Horse you can turn all the way around, with live windows on its taillights, cockpit and headlights. A design and dev pitch by Cyril Florita.",
    images: [{ url: "/og/mustang.jpg", width: 1200, height: 630, alt: "The Ford Mustang interactive ad: a blue Dark Horse under a giant MUSTANG, with its offer and three close-up windows" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/mustang.jpg"] },
};

export const viewport = { themeColor: "#05080E", maximumScale: 5, userScalable: true };

export default function MustangLayout({ children }) {
  return (
    <div className={`ms ${word.variable} ${michroma.variable} ${body.variable}`}>
      <SmoothScroll />
      {children}
    </div>
  );
}
