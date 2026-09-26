// Server layout so this route can export metadata (page.js is a client component).
const title = "Giving Tuesday Campaign";
const description = "A single-purpose donation page for Children's Hunger Fund's biggest giving day: built to convert, rebuilt for a corporate match, and run live.";
const url = "/giving-tuesday/";
const images = [{ url: "/og/giving-tuesday.jpg", width: 1200, height: 630, alt: "Giving Tuesday Campaign" }];

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
    images: ["/og/giving-tuesday.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
