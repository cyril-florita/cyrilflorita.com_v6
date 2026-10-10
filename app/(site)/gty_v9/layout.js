// Server layout so this route can export metadata (page.js is a client component).
const title = "Grace to You";
const description = "Redesigning GTY.org to broaden audience reach and improve engagement & retention through a more accessible and unified digital experience.";
const url = "/gty_v9/";
const images = [{ url: "/og/gty_v9.jpg", width: 1200, height: 630, alt: "Grace to You" }];

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
    images: ["/og/gty_v9.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
