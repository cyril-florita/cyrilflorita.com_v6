// Server layout so this route can export metadata (page.js is a client component).
const title = "GTY Resources";
const description = "Clean, modern graphics for Grace to You that highlight products being promoted, offered for free, or sold at a discount, clearly communicating the value of…";
const url = "/gty-resources/";
const images = [{ url: "/og/gty-resources.jpg", width: 1200, height: 630, alt: "GTY Resources" }];

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
    images: ["/og/gty-resources.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
