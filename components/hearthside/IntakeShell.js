"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BASE } from "./data";
import { ModeSwitch } from "./client";
import { resetSample, useIntake } from "./store";
import { isOverdue } from "./intake-data";
import { Icon, LogoMark } from "./ui";

// The intake system's app shell: a sidebar, a slim staff-preview bar, then
// the screen. Separate from the public site's header and footer.

const NAV = [
  { href: `${BASE}/intake/`, label: "Board", icon: "clipboard" },
  { href: `${BASE}/intake/tasks/`, label: "Tasks", icon: "check" },
  { href: `${BASE}/intake/partners/`, label: "Partners", icon: "social" },
  { href: `${BASE}/intake/reports/`, label: "Reports", icon: "info" },
  { href: `${BASE}/intake/rules/`, label: "Rules", icon: "shield" },
];
const norm = (p) => (p || "/").replace(/\/+$/, "");

export default function IntakeShell({ children }) {
  const path = norm(usePathname());
  const data = useIntake();
  const overdue = data ? data.referrals.filter((r) => isOverdue(r)).length : 0;
  return (
    <div className="hs-app">
      <aside className="hs-app-side">
        <Link className="hs-app-brand" href={`${BASE}/intake/`}>
          <LogoMark size={30} />
          <span><b>Hearthside</b><small>Intake</small></span>
        </Link>
        <nav aria-label="Intake">
          <ul>
            {NAV.map((n) => {
              const on = n.href.endsWith("/intake/") ? path === norm(n.href) || path.startsWith(`${norm(n.href)}/referral`) : path.startsWith(norm(n.href));
              return (
                <li key={n.href}>
                  <Link href={n.href} aria-current={on ? "page" : undefined}>
                    <Icon name={n.icon} size={20} />{n.label}
                    {n.label === "Board" && overdue > 0 && <span className="hs-app-count" aria-label={`${overdue} overdue`}>{overdue}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hs-app-side-foot">
          <a href={`${BASE}/`}>← Public website</a>
        </div>
      </aside>
      <div className="hs-app-main">
        <div className="hs-app-bar">
          <p><span className="hs-sample">Staff preview</span> Sample referrals and people. Changes stay in this browser.</p>
          <div className="hs-app-bar-actions">
            <button type="button" className="hs-btn hs-btn-quiet" onClick={() => { if (window.confirm("Reset the intake system to its sample referrals?")) resetSample(); }}>Reset sample data</button>
            <ModeSwitch />
          </div>
        </div>
        <main id="main" tabIndex={-1} className="hs-app-content">{children}</main>
      </div>
    </div>
  );
}
