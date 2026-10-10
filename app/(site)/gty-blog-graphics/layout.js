// Server layout so this route can export metadata (page.js is a client component).
const title = "GTY Blog Graphics";
const description = "Blog graphics for Grace to You that pair imagery and typography to visually encapsulate the essence of each post, making the content inviting and memorable…";
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
