import Checkout from "@/components/viteo/Checkout";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: true },
  alternates: { canonical: "/builds/viteo/checkout/" },
};

export default function CheckoutPage() {
  return <Checkout />;
}
