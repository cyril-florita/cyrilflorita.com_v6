import SignIn from "@/components/viteo/SignIn";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: true },
  alternates: { canonical: "/pitch/viteo/sign-in/" },
};

export default function SignInPage() {
  return <SignIn />;
}
