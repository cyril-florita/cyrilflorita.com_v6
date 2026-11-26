import LotLookup from "@/components/viteo/LotLookup";

export const metadata = {
  title: "Batch results",
  description: "Look up any Viteo batch by the lot code on the box: identity, potency, heavy metals and microbials, tested by an independent lab. Sample data in this design and dev pitch.",
  alternates: { canonical: "/pitch/viteo/lot/" },
};

export default function LotPage() {
  return <LotLookup />;
}
