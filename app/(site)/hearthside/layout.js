// Server layout so this route can export metadata (page.js is a client component).
const title = "Hearthside — Home Health Website & Intake System (Design & Dev Pitch)";
const description = "A design and dev pitch: a phone-first website for a home health agency, for families and referral partners, plus the intake system behind it, designed and built end to end.";
const url = "/hearthside/";
const images = [{ url: "/og/hearthside.jpg", width: 1200, height: 630, alt: "Hearthside Home Health, a home health website and intake system" }];

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
    images: ["/og/hearthside.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
