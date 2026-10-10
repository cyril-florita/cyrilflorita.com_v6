// Server layout so this route can export metadata (page.js is a client component).
const title = "Volunteer Leadership Team";
const description = "A recruitment landing page for Children's Hunger Fund's new North Texas facility: designed in code, built to a printed-flyer deadline, and launched in 19 days.";
const url = "/volunteer-leadership-team/";
const images = [{ url: "/og/volunteer-leadership-team.jpg", width: 1200, height: 630, alt: "Volunteer Leadership Team" }];

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
    images: ["/og/volunteer-leadership-team.jpg"],
  },
};

export default function Layout({ children }) {
  return children;
}
