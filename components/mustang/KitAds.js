"use client";

import { useState } from "react";

// The kit page's display ads: each HTML5 ad live in an iframe at its real size, with a Replay
// button (the ads play once and stop, as ad networks require), and its downloads.
const Down = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v12M6 11l6 6 6-6M5 20h14" /></svg>
);

function Ad({ ad, base }) {
  const [run, setRun] = useState(0);
  return (
    <figure className={`kit-ad kit-ad-${ad.id}`}>
      <div className="kit-ad-head">
        <p><span className="kit-ad-size">{ad.id.replace("x", " × ")}</span> {ad.name}</p>
        <button type="button" className="kit-replay" onClick={() => setRun((n) => n + 1)} aria-label={`Replay the ${ad.id} ad`}>Replay</button>
      </div>
      <div className="kit-ad-frame" tabIndex={0} role="region" aria-label={`${ad.id} banner preview`}>
        <iframe key={run} src={`${base}${ad.id}/index.html`} width={ad.w} height={ad.h} title={`The ${ad.id} banner`} loading="lazy" scrolling="no" />
      </div>
      <figcaption>
        <a className="kit-dl" href={`${base}mustang-${ad.id}-html5.zip`} download>HTML5 · {ad.zip} KB <Down /></a>
        <a className="kit-dl" href={`${base}mustang-${ad.id}.gif`} download>GIF · {ad.gif} KB <Down /></a>
        <a className="kit-dl" href={`${base}mustang-${ad.id}.jpg`} download>Backup JPG <Down /></a>
      </figcaption>
    </figure>
  );
}

export default function KitAds({ ads, base }) {
  return <div className="kit-ads">{ads.map((ad) => <Ad key={ad.id} ad={ad} base={base} />)}</div>;
}
