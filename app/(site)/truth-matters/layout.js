// Server layout so this route can export metadata (page.js is a client component).
const title = "Truth Matters Podcast";
const description = "The brand, UX/UI design, and WordPress website for Grace to You's Truth Matters Podcast, with a global player that keeps playing while you browse.";
const url = "/truth-matters/";
const images = [{ url: "/og/truth-matters.jpg", width: 1200, height: 630, alt: "Truth Matters Podcast" }];

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
    images: ["/og/truth-matters.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
