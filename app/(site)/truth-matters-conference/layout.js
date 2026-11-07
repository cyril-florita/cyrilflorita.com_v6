// Server layout so this route can export metadata (page.js is a client component).
const title = "Truth Matters Conference";
const description = "The brand for Grace to You's Truth Matters conference: John MacArthur's handwriting turned into a mark for the LED wall, an animated logo, livestream and web graphics, merch, and stickers.";
const url = "/truth-matters-conference/";
const images = [{ url: "/og/truth-matters-conference.jpg", width: 1200, height: 630, alt: "Truth Matters Conference" }];

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
    images: ["/og/truth-matters-conference.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
