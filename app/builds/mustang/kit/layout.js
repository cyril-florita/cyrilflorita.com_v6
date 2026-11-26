// The campaign kit: the deliverables built from the ad, for the dealer's team. Noindex like the ad.
export const metadata = {
  title: "Mustang · Campaign kit",
  description: "The Mustang campaign kit: the interactive landing page, a launch email with an animated hero, and seven-second social spots in three sizes. Designed and built by Cyril Florita; not affiliated with Ford.",
  alternates: { canonical: "/builds/mustang/kit/" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website", siteName: "Cyril Florita", locale: "en_US", url: "/builds/mustang/kit/",
    title: "Mustang · Campaign kit",
    description: "The interactive landing page, a launch email, and seven-second social spots, from one creative concept.",
    images: [{ url: "/og/mustang.jpg", width: 1200, height: 630, alt: "The Ford Mustang interactive ad: a blue Dark Horse under a giant MUSTANG" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/mustang.jpg"] },
};
export default function Layout({ children }) { return children; }
