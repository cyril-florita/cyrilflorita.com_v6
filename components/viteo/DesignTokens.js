"use client";
import { useDlTheme, THEMES } from "./ui";
import { useHydrated } from "./store";

// Design-system bits that follow the active theme and mode: color swatches
// with their live values, and the current font pairing.

const COLORS = [
  { name: "Accent", token: "--dl-sun", use: "Primary actions, highlights, the brand mark" },
  { name: "Accent text", token: "--dl-sun-deep", use: "Accent text and links (AA on the background)" },
  { name: "Ink", token: "--dl-ink", use: "Text, icons, secondary buttons" },
  { name: "Ink soft", token: "--dl-ink-2", use: "Supporting text and metadata" },
  { name: "Background", token: "--dl-cream", use: "Page background" },
  { name: "Paper", token: "--dl-paper", use: "Cards and inputs" },
  { name: "Line", token: "--dl-line", use: "Borders and dividers" },
  { name: "Sage", token: "--dl-sage", use: "Success, savings, reasons" },
  { name: "Butter", token: "--dl-butter", use: "Notes and gentle emphasis" },
];

export const Swatches = () => {
  const { theme, mode } = useDlTheme();
  const hydrated = useHydrated();
  const root = hydrated ? document.querySelector(".dl") : null;
  const value = (token) => (root ? getComputedStyle(root).getPropertyValue(token).trim().toUpperCase() : "");
  return (
    <ul className="dl-swatches" data-theme-key={`${theme}-${mode}`}>
      {COLORS.map((c) => (
        <li key={c.token} className="dl-card dl-swatch">
          <span className="dl-swatch-chip" style={{ background: `var(${c.token})` }} />
          <strong>{c.name}</strong>
          <span className="dl-meta">{value(c.token)} · <code>{c.token}</code></span>
          <span className="dl-meta">{c.use}</span>
        </li>
      ))}
    </ul>
  );
};

export const CurrentTheme = () => {
  const { theme, mode } = useDlTheme();
  const t = THEMES.find((x) => x.id === theme) || THEMES[0];
  return (
    <p className="dl-meta dl-ds-current">
      Showing <strong>{t.label}</strong> in <strong>{mode}</strong> mode · {t.fonts}. Switch themes and modes from the header.
    </p>
  );
};
