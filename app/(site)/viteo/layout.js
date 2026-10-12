// Server layout so this route can export metadata (page.js is a client component).
const title = "Viteo — Personalized Vitamin Subscription (Design & Dev Pitch)";
const description = "A design and dev pitch: a direct-to-consumer personalized vitamin subscription, designed and built end to end — quiz, plan, checkout, account and a 3D scroll story.";
const url = "/viteo/";
const images = [{ url: "/og/viteo.jpg", width: 1200, height: 630, alt: "Viteo, a personalized vitamin subscription" }];

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
