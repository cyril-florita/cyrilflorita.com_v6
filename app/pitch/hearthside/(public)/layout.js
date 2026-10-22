import { CallBar, Header } from "@/components/hearthside/client";
import { Footer } from "@/components/hearthside/chrome";

// The public website: header, the editorial frame (hairlines down both sides
// on wide screens) and footer, plus the phone call bar. The intake system (../intake) has its own shell.
export default function PublicLayout({ children }) {
  return (
    <div className="hs-shell">
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
      <CallBar />
    </div>
  );
}
