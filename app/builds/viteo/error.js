"use client"; // Error boundaries must be Client Components
import { useEffect, useRef } from "react";
import { Button } from "@/components/viteo/ui";
import { resetPreview } from "@/components/viteo/store";

// Viteo's error screen. It renders inside the Viteo layout (header, footer
// and theme stay), in place of the page that failed. In this prototype the
// likely cause is preview data saved in the browser by an older version, so
// besides "Try again" it offers to clear that data (answers, pack, order and
// sign-in; the theme choice stays) and render the page again.
export default function ViteoError({ error, retry, reset }) {
  const heading = useRef(null);

  useEffect(() => {
    console.error(error);
    heading.current?.focus({ preventScroll: true });
  }, [error]);

  // retry() re-fetches and re-renders the page; reset() only re-renders.
  const again = () => (retry || reset)?.();
  const clearData = () => {
    resetPreview();
    if (reset) reset();
    else window.location.reload();
  };

  return (
    <section className="dl-section">
      <div className="dl-wrap dl-empty">
        <h1 className="dl-h2" tabIndex={-1} ref={heading}>Something went wrong.</h1>
        <p className="dl-section-lede">
          This page couldn&apos;t load. Try again, or reset the preview data saved in this browser: your
          answers, pack, order, and sign-in. Nothing is sent anywhere.
        </p>
        <div className="dl-hero-actions">
          <Button size="lg" onClick={again}>Try again</Button>
          <Button variant="ghost" size="lg" onClick={clearData}>Reset preview data</Button>
        </div>
      </div>
    </section>
  );
}
