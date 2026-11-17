"use client";

import dynamic from "next/dynamic";

// The root not-found boundary is sent with every route of the app, along with
// the client components it imports and their CSS, so importing the 404 page here
// directly made every page (the pitches too) preload the portfolio's ~170KB of
// styles. Loaded in the browser only (next/dynamic, ssr: false), the page and its
// styles form their own chunk that only a 404 fetches. Until it arrives, a cover
// in the preloader's colour (white, black in dark mode; the theme is set before
// first paint by app/layout.js) stands in, so there's no blank white flash.
const Cover = () => (
  <>
    <style>{`.nf-cover{position:fixed;inset:0;z-index:100000;background:#fff}html[data-theme="dark"] .nf-cover{background:#000}`}</style>
    <div className="nf-cover" aria-hidden="true" />
  </>
);

const NotFoundPage = dynamic(() => import("@/components/NotFoundPage"), { ssr: false, loading: Cover });

export default function NotFound() {
  return <NotFoundPage />;
}
