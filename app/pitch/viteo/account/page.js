import Account from "@/components/viteo/Account";

export const metadata = {
  title: "Your account",
  robots: { index: false, follow: true },
  alternates: { canonical: "/pitch/viteo/account/" },
};

export default function AccountPage() {
  return <Account />;
}
