"use client";
import { useEffect, useState } from "react";

// Phones (≤680px): an app-style tab bar fixed to the bottom of the account
// page. Each tab jumps to its card; the tab for whichever card is mid-screen
// is highlighted. Hidden on larger screens, where the whole grid fits.
const TABS = [
  { id: "acc-next", label: "Delivery", icon: <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01" /> },
  { id: "acc-checkin", label: "Check-in", icon: <path d="M5 12l4 4 10-10" /> },
  { id: "acc-pack", label: "Pack", icon: <path d="M8 4h8l3 4v12H5V8zM5 8h14M12 4v4" /> },
  { id: "acc-settings", label: "Settings", icon: <path d="M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6" /> },
];

export default function AccountTabs() {
  const [active, setActive] = useState(TABS[0].id);
  useEffect(() => {
    const els = TABS.map((t) => document.getElementById(t.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: reduce ? "auto" : "smooth" });
    setActive(id);
  };
  return (
    <nav className="dl-tabbar" aria-label="Account sections">
      {TABS.map((t) => (
        <a key={t.id} href={`#${t.id}`} onClick={go(t.id)} className={active === t.id ? "is-on" : ""} aria-current={active === t.id ? "true" : undefined}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{t.icon}</svg>
          {t.label}
        </a>
      ))}
    </nav>
  );
}
