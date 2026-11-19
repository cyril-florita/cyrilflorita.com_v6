// Server layout so this route can export metadata (page.js is a client component).
const title = "Mustang — Interactive 3D Car Ad (Design & Dev Pitch)";
const description = "A design and dev pitch for a car dealership: a mobile-first interactive Ford Mustang ad, enhanced for desktops, with a 3D Dark Horse you can turn, repaint, and look inside, and a campaign kit that carries it into a launch email and social spots. Unofficial; not affiliated with Ford.";
const url = "/mustang/";
const images = [{ url: "/og/mustang.jpg", width: 1200, height: 630, alt: "An interactive Ford Mustang ad: the 3D car under a giant MUSTANG, with the lease offer below it" }];

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
    images: ["/og/mustang.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
