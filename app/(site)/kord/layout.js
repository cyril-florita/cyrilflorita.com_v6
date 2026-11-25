// Server layout so this route can export metadata (page.js is a client component).
const title = "Kord — 3D Road-Bike Store (Design & Dev Pitch)";
const description = "A design and dev pitch for an online-only road-bike brand: a 3D bike you can turn, repaint, and take apart as you scroll, four questions that match you to a bike and a size, and a builder, comparison, cart, and virtual fit around it.";
const url = "/kord/";
const images = [{ url: "/og/kord.jpg", width: 1200, height: 630, alt: "Kord: the Arc road bike in 3D in a dark studio, with its headline and paint rail" }];

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
    images: ["/og/kord.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
