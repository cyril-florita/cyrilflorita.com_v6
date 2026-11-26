"use client";

import { useEffect, useState } from "react";
import { DETAILS, FIND, PAINTS, SIZES, SIZE_GEO, compareOrder, money, plain, sizeGeo } from "@/components/kord/data";
import Choice from "@/components/kord/Choice";
import "@/app/pitch/kord/css/compare.css";

// Compare (/pitch/kord/compare/, rebuilt 2026-11-25 at the user's call — it was a table): the four bikes
// as cards side by side, each with its studio still, name, price and Build button and then its specs; the
// rows line up across the cards (CSS subgrid). Under them, "How the frames differ": the four frames drawn
// to scale over each other, then the size picker (between the drawing and the table, so a change shows in
// both — the user's call), then one colour each (the dot on each card), the hovered or
// focused bike brought forward; a table of the measures that change with the size (stack, reach,
// head and seat angles, wheelbase), whose column heads are the drawing's key. (Bars under
// the numbers were tried on 2026-11-25 and removed at the user's call.) On phones
// and tablets the cards are a swipe row. ?a=meridian&b=atlas (Find your bike) puts that pair first and
// highlights it; &size=54 picks the size. A paint picker at the top shows every bike in the same paint
// (Stealth by default, or &paint=), the Build buttons carrying it (2026-11-25: each bike in its own paint
// made the paint look like part of the model).

// each bike's colour in the drawing and on its card's dot — hues that aren't paints (2026-11-25: they were
// the paints' colours, so the red Meridian dot read as Ember and the paint seemed part of the model)
const COLOR = { arc: "#f2b23e", crest: "#3fd2e4", meridian: "#d9b98a", atlas: "#2fbf8f" };   // amber, cyan, sand, green (no pink or violet: the user's call; the Meridian was blue until Cobalt became a paint, 2026-11-25)

// each size's rider heights ("173 to 180 cm"), from Find your bike's height question, as the builder shows them
const SIZE_FOR = Object.fromEntries(FIND.find((q) => q.id === "height").a.map((a) => [a.size, a.label.charAt(0).toLowerCase() + a.label.slice(1)]));
// how to read the drawing, for riders new to bike geometry (the user asked for it, 2026-11-25)
const READ = [
  { t: "Bars higher up", row: "Stack", d: "A more upright, relaxed position, easier on your back and neck." },
  { t: "Bars further forward", row: "Reach", d: "A longer, lower stretch: faster, but harder to hold all day." },
  { t: "Wheels further apart", row: "Wheelbase", d: "Steadier on rough roads and descents; closer together turns more quickly." },
];

const SPECS = [
  { k: "weight", label: "Weight", get: (b) => `${b.weight} kg` },
  { k: "wheels", label: "Wheels", get: (b) => b.wheels },
  { k: "gearing", label: "Gearing", get: (b) => b.gearing },
  { k: "tires", label: "Tires", get: (b) => b.tires },
  { k: "clearance", label: "Tire clearance", get: (b) => b.clearance },
  { k: "position", label: "Position", get: (b) => DETAILS[b.id].position },
  { k: "mounts", label: "Mounts", get: (b) => DETAILS[b.id].mounts },
  { k: "best", label: "Best for", get: (b) => DETAILS[b.id].best },
  // the frame measures that are the same in every size stay on the cards
  { k: "chainstay", label: "Chainstays", get: (b) => `${DETAILS[b.id].geo.chainstay} mm` },
  { k: "drop", label: "BB drop", get: (b) => `${DETAILS[b.id].geo.drop} mm` },
];
// the ones that change with the size are in "How the frames differ", under the drawing (the user's call)
const GEO = [
  { k: "stack", label: "Stack", unit: "mm" }, { k: "reach", label: "Reach", unit: "mm" },
  { k: "head", label: "Head angle", unit: "°" }, { k: "seat", label: "Seat angle", unit: "°" },
  { k: "wheelbase", label: "Wheelbase", unit: "mm" },
];

// the frame, to scale (mm; y up from the ground), from a bike's geometry in a size
const R_WHEEL = 340;
function frame(id, size) {
  const g = sizeGeo(id, size), s = SIZE_GEO[size] || SIZE_GEO["56"], rad = Math.PI / 180;
  const bb = [0, R_WHEEL - g.drop];
  const ra = [-Math.sqrt(g.chainstay ** 2 - g.drop ** 2), R_WHEEL], fa = [ra[0] + g.wheelbase, R_WHEEL];
  const ht = [g.reach, bb[1] + g.stack], down = [Math.cos(g.head * rad), -Math.sin(g.head * rad)];
  const hl = Math.max(90, 150 + (g.stack - 570));            // the head tube: 150 mm on a 56 Arc, longer as the stack grows
  const hb = [ht[0] + down[0] * hl, ht[1] + down[1] * hl];
  const up = [-Math.cos(g.seat * rad), Math.sin(g.seat * rad)];
  const at = (len) => [bb[0] + up[0] * len, bb[1] + up[1] * len];
  const st = at(540 + s.seat), saddle = at(735 + s.saddle);
  const ss = at(540 + s.seat - 40);
  const stem = [ht[0] - down[0] * 30, ht[1] - down[1] * 30], bar = [stem[0] + 100, stem[1] + 6];
  const P = (p) => `${p[0].toFixed(1)} ${(-p[1]).toFixed(1)}`;
  const tubes = `M${P(ra)} L${P(bb)} L${P(hb)} L${P(ht)} L${P(st)} L${P(bb)} M${P(ra)} L${P(ss)} M${P(hb)} L${P(fa)} M${P(st)} L${P(saddle)} M${P(ht)} L${P(stem)} L${P(bar)}`;
  const seat = `M${(saddle[0] - 70).toFixed(1)} ${(-saddle[1]).toFixed(1)} L${(saddle[0] + 60).toFixed(1)} ${(-saddle[1]).toFixed(1)}`;
  return { tubes, seat, ra, fa, bar };
}

export default function Compare() {
  const [pair, setPair] = useState([null, null]);
  const [size, setSize] = useState("56");
  const [paint, setPaint] = useState(PAINTS[0].id);   // every bike in one paint, so paint reads as a choice, not part of a model
  const [focus, setFocus] = useState(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the query string after hydration
    setPair([q.get("a"), q.get("b")]);
    if (SIZES.includes(q.get("size"))) setSize(q.get("size"));
    if (PAINTS.some((p) => p.id === q.get("paint"))) setPaint(q.get("paint"));
  }, []);
  const bikes = compareOrder(pair[0], pair[1]);
  const hi = (id) => pair.includes(id);
  const hover = (id) => ({ onPointerEnter: () => setFocus(id), onPointerLeave: () => setFocus(null), onFocus: () => setFocus(id), onBlur: () => setFocus(null) });

  return (
    <div className="cd-cmp">
      <div className="cd-cmp-paint">
        <p className="cd-cmp-size-label">Every bike comes in every paint · <strong>{PAINTS.find((p) => p.id === paint).name}</strong></p>
        <Choice label="Paint" name="compare-paint" value={paint} options={PAINTS} onPick={setPaint} className="cd-cmp-paints"
          render={(p) => (<><i className="cd-build-swatch" style={{ "--swatch": p.hex }} aria-hidden="true" /><strong>{p.name}</strong></>)} />
      </div>

      <div className="cd-cmp-cards" tabIndex={0} role="region" aria-label="The four bikes compared">
        {bikes.map((b) => {
          return (
            <article key={b.id} className={`cd-cmp-card${hi(b.id) ? " is-hi" : ""}${focus === b.id ? " is-focus" : ""}`} style={{ "--c": COLOR[b.id] }} {...hover(b.id)}>
              <span className="cd-shot cd-studio"><img src={`/pitch/kord/bikes/${b.id}-${paint}.webp`} width="1200" height="720" alt="" loading="lazy" /></span>
              <div className="cd-cmp-head">
                <h2><span className="cd-cmp-dot" aria-hidden="true" />{b.name}</h2>
                <p className="cd-card-type">{b.type}</p>
              </div>
              <p className="cd-cmp-price"><span>From</span> <b>{money(b.from)}</b></p>
              <a className="cd-btn cd-btn-ghost cd-btn-sm cd-cmp-build" href={`/pitch/kord/build/?bike=${b.id}&size=${size}&paint=${paint}`}>Build<span className="cd-sr"> the {plain(b.name)}</span><span className="cd-arrow" aria-hidden="true">→</span></a>
              <dl className="cd-cmp-list">
                {SPECS.map((s) => (
                  <div key={s.k} className="cd-cmp-row">
                    <dt>{s.label}</dt>
                    <dd>{s.get(b)}</dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>

      <figure className="cd-cmp-draw" aria-labelledby="cmp-draw-title">
        <div className="cd-cmp-draw-head">
          <h2 id="cmp-draw-title">How the frames differ</h2>
          <p className="cd-subhead">Drawn to scale</p>
          <p className="cd-cmp-draw-lede">Each outline is one bike&apos;s frame, laid over the others at the same scale. Where the lines meet, the bikes are alike; where the colors split apart, they differ.</p>
        </div>
        <svg viewBox="-800 -1090 1830 1130" role="img" aria-label={`The four frames drawn over each other to scale, in size ${size}`} className={focus ? "has-focus" : ""}>
          <line className="cd-cmp-ground" x1="-800" x2="1030" y1="0" y2="0" />
          {[...bikes].reverse().map((b) => {           // the highlighted pair (first in the cards) drawn last, on top
            const f = frame(b.id, size);
            return (
              <g key={b.id} className={`cd-cmp-frame${focus === b.id ? " is-focus" : ""}`} style={{ "--c": COLOR[b.id] }}>
                <circle cx={f.ra[0]} cy={-f.ra[1]} r={R_WHEEL} />
                <circle cx={f.fa[0]} cy={-f.fa[1]} r={R_WHEEL} />
                <path className="cd-cmp-tubes" style={{ d: `path("${f.tubes}")` }} />
                <path className="cd-cmp-seat" style={{ d: `path("${f.seat}")` }} />
              </g>
            );
          })}
        </svg>
        <figcaption>
          <div className="cd-cmp-size">
            <p className="cd-cmp-size-label">Your size</p>
            <Choice label="Frame size" name="compare-size" value={size} className="cd-cmp-sizes"
              options={SIZES.map((s) => ({ id: s }))} onPick={setSize} render={(o) => o.id} />
            <p className="cd-cmp-size-fit" aria-live="polite">Size {size} fits riders {SIZE_FOR[size]}.</p>
          </div>
          <div className="cd-cmp-geo-wrap">
            <table className="cd-cmp-geo">
              <caption>Geometry in size {size}, the measures that change with the size</caption>
              <thead>
                <tr>
                  <td />
                  {bikes.map((b) => (
                    <th key={b.id} scope="col" style={{ "--c": COLOR[b.id] }} className={focus === b.id ? "is-focus" : ""} {...hover(b.id)}>
                      <span className="cd-cmp-dot" aria-hidden="true" />{b.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GEO.map((x) => (
                  <tr key={x.k}>
                    <th scope="row">{x.label}{x.unit === "mm" && <span> · mm</span>}</th>
                    {bikes.map((b) => <td key={b.id} className={focus === b.id ? "is-focus" : ""}>{sizeGeo(b.id, size)[x.k]}{x.unit === "°" ? "°" : ""}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cd-cmp-read">
            <h3>How to read it</h3>
            <ul>
              {READ.map((r) => <li key={r.t}><strong>{r.t} <em>{r.row}</em></strong>{r.d}</li>)}
            </ul>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
