"use client";

// An inline script that runs while the HTML is parsed, before first paint
// (theme / mode set-up in the root, Viteo and Hearthside layouts). Rendered
// on the server as text/javascript, so the browser runs it; when React renders
// it in the browser (hydration, client navigation) it's text/plain, so React 19
// doesn't warn "Encountered a script tag while rendering React component" —
// React never runs those anyway. suppressHydrationWarning covers the type
// mismatch. From Next's "Preventing flash before hydration" guide.
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
