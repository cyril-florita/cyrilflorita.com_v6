// Server layout so this route can export metadata (page.js is a client component).
const title = "About Me";
const description = "About Cyril Florita, a versatile Designer and Developer who crafts thoughtful, beautiful, and functional digital experiences: background, experience, skills.";
const url = "/about-me/";
const images = [{ url: "/og/default.jpg", width: 1200, height: 630, alt: "Cyril Florita" }];

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
    images: ["/og/default.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
