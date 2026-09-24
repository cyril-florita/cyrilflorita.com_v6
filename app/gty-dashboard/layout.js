// Server layout so this route can export metadata (page.js is a client component).
const title = "GTY Dashboard";
const description = "A TV-optimized dashboard interface for the Grace to You office that cycles through weather updates, streaming activity, broadcast schedules, live website…";
const url = "/gty-dashboard/";
const images = [{ url: "/og/gty-dashboard.jpg", width: 1200, height: 630, alt: "GTY Dashboard" }];

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
    images: ["/og/gty-dashboard.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
