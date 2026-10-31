import Link from "next/link";
import { BASE, NAV, PHONE, PITCH_MAILTO, REFERRAL_FAX } from "./data";
import { Button, Icon, LogoMark, Row } from "./ui";
import { ThemeSwitch } from "./client";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="hs-footer">
      <div className="hs-wrap hs-footer-grid">
        <div className="hs-footer-brand">
          <div className="hs-footer-logo">
            <LogoMark size={34} />
            <span>Hearthside Home Health</span>
          </div>
          <p>Skilled home health care across the San Fernando and Santa Clarita Valleys.</p>
          <p className="hs-footer-contact">
            <a href={PHONE.href}><Icon name="phone" size={18} /> {PHONE.display}</a>
            <span>Referral fax {REFERRAL_FAX}</span>
            <span>Office in Van Nuys, visits by appointment</span>
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="hs-footer-head">Hearthside</h2>
          <ul>
            {NAV.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}
            <li><a href="#request-a-call">Request a call</a></li>
          </ul>
        </nav>
        <div>
          <h2 className="hs-footer-head">Your information</h2>
          <p>
            We don&rsquo;t use advertising pixels or session recording on this site, and our forms only ask for what we need to call you back. Health details are shared through our secure intake system, never by email or text.
          </p>
          <p className="hs-footer-demo"><Link href={`${BASE}/design-system/`}>Design system</Link></p>
        </div>
      </div>
      <div className="hs-wrap hs-footer-legal">
        <p>
          Medicare information is general guidance; see{" "}
          <a href="https://www.medicare.gov/coverage/home-health-services">medicare.gov</a> for details. If this is an emergency, call 911.
        </p>
        {/* The colour scheme, bottom right beside the legal lines (light/dark is in the header). */}
        <div className="hs-footer-controls">
          <ThemeSwitch />
        </div>
        <p className="hs-footer-pitch">
          Design and Dev Pitch · © {year} <a href="/">Cyril Florita</a>. All rights reserved.
        </p>
      </div>
      {/* Last, after the legal lines: for home health owners who find the
          concept, what it is and how to get one like it. */}
      <div className="hs-wrap">
        <Row label="For agency owners" labelledBy="hs-owner" tight>
          <div className="hs-owner">
            <div>
              <h2 id="hs-owner">Run a home health agency?</h2>
              <p>Hearthside is a concept: a website families can actually use, and the referral intake system behind it, from first call to start of care. If you&rsquo;d like your agency&rsquo;s site and intake to work like this, let&rsquo;s talk.</p>
            </div>
            <div className="hs-owner-ctas">
              <Button href={PITCH_MAILTO} lead="mail">Email Cyril</Button>
              <Button href={`${BASE}/intake/`} variant="secondary" icon="arrow">Try the intake demo</Button>
              <Button href={`${BASE}/proposal/`} variant="secondary" icon="arrow">Read the proposal</Button>
              <a className="hs-btn hs-btn-quiet" href="/">See more of Cyril&rsquo;s work</a>
            </div>
          </div>
        </Row>
      </div>
    </footer>
  );
}
