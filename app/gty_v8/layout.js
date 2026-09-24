// Server layout so this route can export metadata (page.js is a client component).
const title = "GTY Website, v.8";
const description = "Enhancing the user experience of GTY.org, the digital home for John MacArthur's teaching ministry, through the UX design and front-end development strategies…";
const url = "/gty_v8/";
const images = [{ url: "/og/gty_v8.jpg", width: 1200, height: 630, alt: "GTY Website, v.8" }];

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
    images: ["/og/gty_v8.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
