// Server layout so this route can export metadata (page.js is a client component).
const title = "The Patricia MacArthur Pastoral Care Fund";
const description = "A logo for the Patricia MacArthur Pastoral Care Fund: two poppies in a continuous line, a handwritten name, and a circular frame, in full color and in gold on black.";
const url = "/patricia-macarthur-pastoral-care-fund/";
const images = [{ url: "/og/patricia-macarthur-pastoral-care-fund.jpg", width: 1200, height: 630, alt: "The Patricia MacArthur Pastoral Care Fund" }];

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
    images: ["/og/patricia-macarthur-pastoral-care-fund.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
