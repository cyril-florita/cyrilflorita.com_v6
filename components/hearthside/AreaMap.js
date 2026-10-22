"use client";
import { useState } from "react";
import { AREAS } from "./data";
import { ZipCheck } from "./client";

// The service area as a stylised map (not to scale): the two valleys, the
// mountains between them, the main freeways, and a dot per community. A ZIP
// check highlights its community.

const TOWNS = {
  Castaic: [452, 62], Valencia: [520, 122], "Stevenson Ranch": [462, 152], Saugus: [566, 92], Newhall: [540, 172], "Canyon Country": [604, 136],
  Chatsworth: [118, 300], "Porter Ranch": [196, 278], "Granada Hills": [272, 292], Sylmar: [392, 262], "San Fernando": [360, 298], Pacoima: [404, 318],
  "Mission Hills": [318, 316], "North Hills": [296, 346], Northridge: [216, 338], Winnetka: [150, 360], "Canoga Park": [112, 382], "West Hills": [66, 366],
  Reseda: [190, 392], "Van Nuys": [306, 392], "Panorama City": [336, 362], "Sun Valley": [446, 346], "Sunland-Tujunga": [534, 288],
  "Woodland Hills": [78, 432], Tarzana: [190, 448], Encino: [240, 434], "Sherman Oaks": [318, 440], "Valley Village": [392, 420],
  "North Hollywood": [446, 404], "Studio City": [424, 452], Burbank: [512, 398],
};
// Labels drawn to the left of their dot (they would clip or collide on the right).
const LEFT = new Set(["North Hollywood", "Sunland-Tujunga", "Saugus"]);
const LABELED = new Set(["Castaic", "Valencia", "Saugus", "Newhall", "Canyon Country", "Stevenson Ranch", "Chatsworth", "Granada Hills", "Sylmar", "Northridge", "Canoga Park", "Reseda", "Van Nuys", "Sunland-Tujunga", "Woodland Hills", "Encino", "Sherman Oaks", "North Hollywood", "Burbank", "San Fernando"]);

export default function AreaMap() {
  const [hit, setHit] = useState(null);
  return (
    <div>
      <figure className="hs-map" style={{ margin: "0 0 40px" }}>
        <svg viewBox="0 0 720 500" role="img" aria-label="Map of the service area: the Santa Clarita Valley to the north and the San Fernando Valley to the south">
          <rect className="hs-map-land" width="720" height="500" />
          {/* Mountains */}
          <path className="hs-map-mtn" d="M0 190 C60 170 120 210 190 205 C260 200 300 230 360 222 C420 214 470 236 520 228 C600 216 660 236 720 222 V250 C660 262 600 246 520 256 C470 262 420 244 360 250 C300 256 250 232 190 236 C120 240 60 214 0 232Z" />
          <path className="hs-map-mtn" d="M560 236 C610 220 660 250 720 240 V330 C680 320 640 300 600 300 C580 280 566 260 560 236Z" />
          <path className="hs-map-mtn" d="M0 470 C80 455 170 470 260 462 C340 455 420 470 500 458 C580 448 650 462 720 455 V500 H0Z" />
          <text className="hs-map-mtn-label" x="40" y="222">Santa Susana Mtns</text>
          <text className="hs-map-mtn-label" x="600" y="276">San Gabriel Mtns</text>
          <text className="hs-map-mtn-label" x="260" y="488">Santa Monica Mtns</text>
          {/* Service areas */}
          <path className="hs-map-area" d="M420 40 C480 22 600 30 690 70 C710 110 690 170 640 190 C580 205 470 200 430 175 C405 140 400 80 420 40Z" />
          <path className="hs-map-area" d="M40 300 C60 262 160 252 280 258 C400 250 520 262 580 300 C600 350 560 420 500 440 C380 462 200 462 70 450 C36 410 30 340 40 300Z" />
          {/* Freeways */}
          <path className="hs-map-road" d="M470 20 C480 120 450 200 420 250 C380 300 330 340 300 400" />
          <path className="hs-map-road" d="M40 420 C160 418 300 422 400 418 C460 416 520 400 560 380" />
          <path className="hs-map-road" d="M262 470 C266 400 262 330 250 260" />
          <path className="hs-map-road" d="M560 110 C600 150 640 190 690 210" />
          <path className="hs-map-road" d="M90 300 C200 296 330 300 470 296" />
          <text className="hs-map-region" x="452" y="210">Santa Clarita Valley</text>
          <text className="hs-map-region" x="60" y="478">San Fernando Valley</text>
          {Object.entries(TOWNS).map(([t, [x, y]]) => {
            const on = hit === t;
            return (
              <g key={t}>
                <circle className={`hs-map-dot${on ? " is-hit" : ""}`} cx={x} cy={y} r={on ? 7 : 3.5} />
                {(LABELED.has(t) || on) && <text className="hs-map-town" x={LEFT.has(t) ? x - 8 : x + 8} y={y + 4} textAnchor={LEFT.has(t) ? "end" : "start"} style={on ? { fontWeight: 700, fill: "var(--hs-ink)" } : undefined}>{t}</text>}
              </g>
            );
          })}
        </svg>
        <figcaption className="hs-map-note">Stylised, not to scale</figcaption>
      </figure>
      <div className="hs-two">
        <ZipCheck areas={AREAS} onResult={(r) => setHit(r.kind === "yes" ? r.town : null)} />
        <div className="hs-area-list">
          {AREAS.map((a) => (
            <div key={a.id}>
              <h3>{a.name}</h3>
              <p>{a.communities.map(([town]) => town).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
