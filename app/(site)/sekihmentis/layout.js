// Server layout so this route can export metadata (page.js is a client component).
const title = "SekihMentis";
const description = "A grungy “Transformers: Autobots Big Gun” themed background graphic designed for my MySpace profile.";
const url = "/sekihmentis/";
const images = [{ url: "/og/sekihmentis.jpg", width: 1200, height: 630, alt: "SekihMentis" }];

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
    images: ["/og/sekihmentis.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
