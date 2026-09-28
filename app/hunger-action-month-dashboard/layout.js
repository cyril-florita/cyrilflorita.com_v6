// Server layout so this route can export metadata (page.js is a client component).
const title = "Hunger Action Month Campaign Dashboard";
const description = "A live campaign dashboard and the tracking plan behind it: Children's Hunger Fund's first analytics governance, built into a fast, resilient internal tool.";
const url = "/hunger-action-month-dashboard/";
const images = [{ url: "/og/hunger-action-month-dashboard.jpg", width: 1200, height: 630, alt: "Hunger Action Month Campaign Dashboard" }];

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
    images: ["/og/hunger-action-month-dashboard.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
