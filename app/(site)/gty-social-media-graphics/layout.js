// Server layout so this route can export metadata (page.js is a client component).
const title = "GTY Social Media Graphics";
const description = "Quote graphics tailored for social media sharing, designed to drive engagement and direct traffic back to the Grace to You website.";
const url = "/gty-social-media-graphics/";
const images = [{ url: "/og/gty-social-media-graphics.jpg", width: 1200, height: 630, alt: "GTY Social Media Graphics" }];

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
    images: ["/og/gty-social-media-graphics.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
