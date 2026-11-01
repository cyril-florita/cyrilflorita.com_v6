// Server layout so this route can export metadata (page.js is a client component).
const title = "GTY Blog Graphics";
const description = "Header graphics for the Grace to You blog: one strong image and a clear title for each post, inside a frame readers recognize.";
const url = "/gty-blog-graphics/";
const images = [{ url: "/og/gty-blog-graphics.jpg", width: 1200, height: 630, alt: "GTY Blog Graphics" }];

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
    images: ["/og/gty-blog-graphics.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
