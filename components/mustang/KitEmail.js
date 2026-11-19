"use client";

import { useState } from "react";

// The kit page's email preview: the real email (public/pitch/mustang/kit/email.html) in an
// iframe at a desktop inbox's width or a phone's, so its stacking rules can be seen working.
const SIZES = [
  { id: "desktop", label: "Desktop", width: 680 },
  { id: "phone", label: "Phone", width: 375 },
];

export default function KitEmail() {
  const [size, setSize] = useState("desktop");
  const w = SIZES.find((s) => s.id === size).width;
  return (
    <div className="kit-email">
      <div className="kit-seg" role="group" aria-label="Preview width">
        {SIZES.map((s) => (
          <button key={s.id} type="button" aria-pressed={size === s.id} onClick={() => setSize(s.id)}>{s.label}</button>
        ))}
      </div>
      <div className="kit-email-frame" style={{ "--w": `${w}px` }}>
        <iframe src="/pitch/mustang/kit/email.html" title={`The Mustang email at ${w}px wide`} loading="lazy" />
      </div>
    </div>
  );
}
