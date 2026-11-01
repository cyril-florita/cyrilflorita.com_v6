// Server layout so this route can export metadata (page.js is a client component).
const title = "GTY App Landing Page";
const description = "A redesigned landing page for the Grace to You app, with its benefits up front and download buttons at the top and bottom, so more visitors download and use it.";
const url = "/gty-app-landing/";
const images = [{ url: "/og/gty-app-landing.jpg", width: 1200, height: 630, alt: "GTY App Landing Page" }];

export const metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    siteName: "Cyril Florita",
    locale: "en_US",
    url,
    title: `${title} — Cyril Florita`,
    description,
    images,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} — Cyril Florita`,
    description,
    images: ["/og/gty-app-landing.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
