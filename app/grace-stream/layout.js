// Server layout so this route can export metadata (page.js is a client component).
const title = "Grace Stream";
const description = "Designing and building Grace to You's 24/7 online broadcasting platform—a digital space where truth can stream 24/7 and people can tune in without distraction.";
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
