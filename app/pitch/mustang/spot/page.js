"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CarStage, { PAINTS } from "@/components/mustang/CarStage";
import Smoke from "@/components/mustang/Smoke";
import Grit from "@/components/mustang/Grit";
import "./spot.css";

// The campaign kit's recording page (/pitch/mustang/spot/?f=…): the ad's stage laid out
// for one deliverable at a time, with the car on a clock (CarStage's `spot`), so the
// capture scripts (README: "Campaign kit") record the same thing every time. Open it at
// the deliverable's own pixel size with a device scale of 1:
//   story 1080×1920 · feed 1080×1350 · wide 1920×1080 — the 7s social spots
//   gif 1200×640 — the email's turntable loop (one full turn in GIF_PERIOD seconds)
//   still 1200×800 &view=rear|cockpit|lights — the email's feature shots
const GIF_PERIOD = 6;
const FORMATS = {
  story: { spin: -0.33, yaw0: 1.7, intro: true, zoom: 0.9, lift: 0.2, smoke: true, copy: true },
  feed: { spin: -0.33, yaw0: 1.7, intro: true, zoom: 0.78, lift: 0.19, smoke: true, copy: true },
  wide: { spin: -0.33, yaw0: 1.7, intro: true, zoom: 0.74, lift: 0.15, smoke: true, copy: true },
  gif: { spin: (-Math.PI * 2) / GIF_PERIOD, yaw0: -0.62, intro: false, zoom: 0.58, smoke: false, copy: false },
  still: { spin: 0, intro: false, smoke: false, copy: false },
};

const Slashes = () => <span className="ms-slashes" aria-hidden="true"><i /><i /><i /><i /></span>;

function Spot() {
  const q = useSearchParams();
  const f = FORMATS[q.get("f")] ? q.get("f") : "story";
  const fmt = FORMATS[f];
  const paint = PAINTS.find((p) => p.id === q.get("paint"))?.hex;
  const spot = { ...fmt, view: f === "still" ? q.get("view") || "rear" : null, paint };
  return (
    <main className={`sp sp-${f}`}>
      <CarStage spot={spot}>
        <div className="ms-bg" aria-hidden="true"><Grit /></div>
        {fmt.smoke && <Smoke />}
        <div className="ms-floor" aria-hidden="true" />
        {f !== "still" && <p className="sp-word" aria-hidden="true">MUSTANG</p>}
        {fmt.copy && (
          <>
            <p className="sp-top"><span>S650</span><span>Mustang <Slashes /></span></p>
            <div className="sp-copy">
              <p className="sp-line">Turn it. Open it. Look closer.</p>
              <h1 className="sp-title">Yours from $499 a month.</h1>
              <p className="sp-terms">36-month lease · $3,999 due at signing</p>
              <p className="sp-btn">Explore it in 3D</p>
              <p className="sp-stamp">[ Sample offer ]</p>
            </div>
          </>
        )}
      </CarStage>
    </main>
  );
}

export default function Page() {
  return <Suspense><Spot /></Suspense>;
}
