// Server layout so this route can export metadata (page.js is a client component).
const title = "The Study Bible App Logo";
const description = "Creating a visual identity for The Study Bible app: a simple, versatile logo that communicates usability, clarity, and a sense of illumination.";
const url = "/the-study-bible-app-logo/";
const images = [{ url: "/og/the-study-bible-app-logo.jpg", width: 1200, height: 630, alt: "The Study Bible App Logo" }];

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
    images: ["/og/the-study-bible-app-logo.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
