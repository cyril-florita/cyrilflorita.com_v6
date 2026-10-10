// Server layout so this route can export metadata (page.js is a client component).
const title = "The Study Bible App";
const description = "Leading the redesign of The Study Bible app to address the legacy app's critical usability issues with an experience that's simple, clean, yet delightful.";
const url = "/the-study-bible-app/";
const images = [{ url: "/og/the-study-bible-app.jpg", width: 1200, height: 630, alt: "The Study Bible App" }];

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
    images: ["/og/the-study-bible-app.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
