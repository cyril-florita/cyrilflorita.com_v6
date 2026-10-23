"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE } from "./data";
import { coordinator, stageName } from "./intake-data";
import { resetSample, useIntake } from "./store";
import { Icon } from "./ui";

// The intake app's command palette: ⌘K / Ctrl+K (or the Search button) opens
// a native <dialog> with one combobox that finds screens, referrals (by ID,
// patient, town, or coordinator) and actions. Arrow keys move, Enter runs,
// Esc closes and focus returns to where it was.

const SCREENS = [
  { label: "Board", hint: "Every open referral", icon: "clipboard", href: `${BASE}/intake/` },
  { label: "Tasks", hint: "Follow-ups and overdue work", icon: "check", href: `${BASE}/intake/tasks/` },
  { label: "Partners", hint: "Referral relationships", icon: "social", href: `${BASE}/intake/partners/` },
  { label: "Reports", hint: "Speed, sources, outcomes", icon: "info", href: `${BASE}/intake/reports/` },
  { label: "Rules", hint: "Routing and time limits", icon: "shield", href: `${BASE}/intake/rules/` },
];
const ACTIONS = [
  { label: "Send a test referral", hint: "Opens the public referral form", icon: "arrow", href: `${BASE}/referrals/#refer` },
  { label: "Switch light or dark mode", icon: "moon", run: () => document.querySelector(".hs-app .hs-mode")?.click() },
  { label: "Reset sample data", hint: "Back to the starting referrals", icon: "close", run: () => { if (window.confirm("Reset the intake system to its sample referrals?")) resetSample(); } },
  { label: "Public website", icon: "family", href: `${BASE}/`, hard: true },
];

export const openPalette = () => window.dispatchEvent(new Event("hs:palette"));

export default function CommandPalette() {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const data = useIntake();

  useEffect(() => {
    const show = () => { const d = ref.current; if (d && !d.open) { setQ(""); setActive(0); d.showModal(); inputRef.current?.focus(); } }; // autoFocus only fires on mount, and the dialog is mounted closed
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); show(); } };
    window.addEventListener("keydown", onKey);
    window.addEventListener("hs:palette", show);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("hs:palette", show); };
  }, []);

  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    const has = (...xs) => !t || xs.some((x) => x && x.toLowerCase().includes(t));
    const refs = (data?.referrals ?? [])
      .filter((r) => t && has(r.id, r.patient.name, r.patient.town, coordinator(r.coordinator)?.name))
      .slice(0, 6)
      .map((r) => ({ label: `${r.patient.name}`, hint: `${r.id} · ${r.patient.town} · ${stageName(r.stage)}`, icon: "clipboard", href: `${BASE}/intake/referral/?id=${r.id}` }));
    return [
      ["Referrals", refs],
      ["Go to", SCREENS.filter((s) => has(s.label, s.hint))],
      ["Actions", ACTIONS.filter((a) => has(a.label, a.hint))],
    ].filter(([, items]) => items.length);
  }, [q, data]);
  const flat = groups.flatMap(([, items]) => items);
  const cur = Math.min(active, Math.max(flat.length - 1, 0));

  const run = (item) => {
    ref.current?.close();
    if (item.run) item.run();
    else if (item.hard) window.location.href = item.href;
    else router.push(item.href);
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!flat.length) return;
      const n = (cur + (e.key === "ArrowDown" ? 1 : -1) + flat.length) % flat.length;
      setActive(n);
      ref.current?.querySelector(`#hs-cmd-${n}`)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && flat[cur]) { e.preventDefault(); run(flat[cur]); }
  };

  let i = -1;
  return (
    <dialog ref={ref} className="hs-cmd" aria-label="Search the intake system" onClick={(e) => { if (e.target === ref.current) ref.current.close(); }}>
      <div className="hs-cmd-box">
        <div className="hs-cmd-field">
          <Icon name="search" size={22} />
          <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKeyDown}
            role="combobox" aria-expanded="true" aria-controls="hs-cmd-list" aria-activedescendant={flat.length ? `hs-cmd-${cur}` : undefined} aria-autocomplete="list"
            placeholder="Search referrals, screens, or actions" spellCheck={false} autoComplete="off" />
          <kbd>Esc</kbd>
        </div>
        <div id="hs-cmd-list" role="listbox" aria-label="Results" className="hs-cmd-list">
          {groups.map(([title, items]) => (
            <div key={title} role="group" aria-label={title}>
              <p className="hs-cmd-group" aria-hidden="true">{title}</p>
              {items.map((item) => {
                i += 1;
                const n = i;
                return (
                  <div key={item.label + item.hint} id={`hs-cmd-${n}`} role="option" aria-selected={n === cur} className="hs-cmd-item"
                    onMouseMove={() => n !== cur && setActive(n)} onClick={() => run(item)}>
                    <Icon name={item.icon} size={20} />
                    <span><b>{item.label}</b>{item.hint && <small>{item.hint}</small>}</span>
                    {n === cur && <kbd aria-hidden="true">↵</kbd>}
                  </div>
                );
              })}
            </div>
          ))}
          {!flat.length && <p className="hs-cmd-none">No matches for &ldquo;{q}&rdquo;. Try a referral ID, a patient name, or a town.</p>}
        </div>
        <p className="hs-cmd-foot" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> to move · <kbd>↵</kbd> to open · <kbd>⌘K</kbd> anywhere</p>
      </div>
    </dialog>
  );
}
