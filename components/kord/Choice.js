"use client";

// A row of option cards as a radio group (the builder's steps, the design system's samples):
// roving tabindex, arrow keys / Home / End pick and move focus, `render` draws each option.
export default function Choice({ label, name, value, options, onPick, render, className = "" }) {
  const i0 = Math.max(0, options.findIndex((o) => o.id === value));
  const onKey = (e, i) => {
    const k = e.key, n = options.length;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(k)) return;
    e.preventDefault();
    const j = k === "Home" ? 0 : k === "End" ? n - 1 : (i + (k === "ArrowRight" || k === "ArrowDown" ? 1 : -1) + n) % n;
    onPick(options[j].id); e.currentTarget.parentElement.children[j]?.focus();
  };
  return (
    <div className={`cd-build-opts ${className}`} role="radiogroup" aria-label={label}>
      {options.map((o, i) => (
        <button key={o.id} type="button" role="radio" aria-checked={o.id === value} tabIndex={i === i0 ? 0 : -1} name={name}
          className={`cd-build-opt${o.id === value ? " is-on" : ""}`} onClick={() => onPick(o.id)} onKeyDown={(e) => onKey(e, i)}>
          {render(o)}
        </button>
      ))}
    </div>
  );
}
