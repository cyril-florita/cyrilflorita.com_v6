import Account from "@/components/viteo/Account";

export const metadata = {
  title: "Your account",
  robots: { index: false, follow: true },
  alternates: { canonical: "/builds/viteo/account/" },
};

export default function AccountPage() {
  return <Account />;
}
