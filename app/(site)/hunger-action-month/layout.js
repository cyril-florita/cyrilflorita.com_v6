// Server layout so this route can export metadata (page.js is a client component).
const title = "Hunger Action Month";
const description = "A rebuilt campaign page with analytics designed in from day one: every channel tagged, every key interaction measured, every donation traceable.";
const url = "/hunger-action-month/";
const images = [{ url: "/og/hunger-action-month.jpg", width: 1200, height: 630, alt: "Hunger Action Month" }];

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
    images: ["/og/hunger-action-month.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
