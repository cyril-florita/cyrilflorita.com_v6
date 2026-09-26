// Server layout so this route can export metadata (page.js is a client component).
const title = "35-Day Generosity Challenge";
const description = "A living landing page for a five-week, multi-channel campaign: one hub that evolved every Monday as supporters worked through a week-by-week journey.";
const url = "/35-day-generosity-challenge/";
const images = [{ url: "/og/35-day-generosity-challenge.jpg", width: 1200, height: 630, alt: "35-Day Generosity Challenge" }];

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
    images: ["/og/35-day-generosity-challenge.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
