import { ViewTransition } from "react";
import { ContactDock, Header, Reveal } from "@/components/hearthside/client";
import { Footer } from "@/components/hearthside/chrome";

// The public website: header, the editorial frame (hairlines down both sides
// on wide screens) and footer, plus the contact dock (a floating pill on desktop, a bottom bar on tablets and phones). The intake system (../intake) has its own shell.
export default function PublicLayout({ children }) {
  return (
    <div className="hs-shell">
      <Header />
      {/* Page changes animate the main column (hearthside.css, "Motion"). */}
      <ViewTransition name="hs-main">
        <main id="main" tabIndex={-1}>{children}</main>
      </ViewTransition>
      <Reveal />
      <Footer />
      <ContactDock />
    </div>
  );
}
