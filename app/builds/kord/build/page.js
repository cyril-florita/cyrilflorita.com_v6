import { Header, Footer } from "@/components/kord/ui";
import Builder from "@/components/kord/Builder";

export const metadata = {
  title: "Build your bike · Kord",
  description: "Build a Kord road bike: frame, size, paint, groupset and wheels, with the price and weight as you go. Designed and built by Cyril Florita.",
  alternates: { canonical: "/builds/kord/build/" },
  robots: { index: false, follow: true },
};

export default function BuildPage() {
  return (
    <>
      <Header />
      <main id="main" className="cd-main-app">
        <Builder />
      </main>
      <Footer />
    </>
  );
}
