// Server layout so this route can export metadata (page.js is a client component).
const title = "He Took My Place";
const description = "A desktop wallpaper designed for my Illustration class, sparked by coming to grips with the reality of the gospel.";
const url = "/he-took-my-place/";
const images = [{ url: "/og/he-took-my-place.jpg", width: 1200, height: 630, alt: "He Took My Place" }];

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
    images: ["/og/he-took-my-place.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
