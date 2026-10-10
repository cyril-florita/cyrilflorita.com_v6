// Server layout so this route can export metadata (page.js is a client component).
const title = "Viteo — Personalized Vitamins (Concept)";
const description = "A self-initiated product concept: a personalized vitamin subscription, designed and built end to end — quiz, plan, checkout and account.";
const url = "/viteo/";
const images = [{ url: "/og/viteo.jpg", width: 1200, height: 630, alt: "Viteo concept prototype" }];

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
    images: ["/og/viteo.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
