// Server layout so this route can export metadata (page.js is a client component).
const title = "Grace Stream";
const description = "Grace Stream, Grace to You's 24/7 online broadcast of John MacArthur's teaching: I designed its brand and built the front end of its player page.";
const url = "/grace-stream/";
const images = [{ url: "/og/grace-stream.jpg", width: 1200, height: 630, alt: "Grace Stream" }];

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
    images: ["/og/grace-stream.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
