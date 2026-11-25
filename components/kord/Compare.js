"use client";

import { useEffect, useState } from "react";
import { DETAILS, GEO_ROWS, SIZES, compareOrder, money, plain, sizeGeo } from "@/components/kord/data";
import Choice from "@/components/kord/Choice";

// Compare (/pitch/kord/compare/): the four bikes side by side — the still, type and price, the
// specs, the riding position and mounts, and the geometry in a size picked under its heading (56 by
// default; 2026-11-24). ?a=meridian&b=atlas (as Find your bike sends it) puts that pair first and
// highlights them, and &size=54 picks the size. On phones the table scrolls sideways with the row
// labels pinned.

export default function Compare() {
  const [pair, setPair] = useState([null, null]);
  const [size, setSize] = useState("56");
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the query string after hydration
    setPair([q.get("a"), q.get("b")]);
    if (SIZES.includes(q.get("size"))) setSize(q.get("size"));
  }, []);
  const bikes = compareOrder(pair[0], pair[1]);
  const hi = (id) => pair.includes(id);
  const rows = [
    { label: "Weight", get: (b) => `${b.weight} kg` },
    { label: "Wheels", get: (b) => b.wheels },
    { label: "Gearing", get: (b) => b.gearing },
    { label: "Tires", get: (b) => b.tires },
    { label: "Tire clearance", get: (b) => b.clearance },
    { label: "Position", get: (b) => DETAILS[b.id].position },
    { label: "Mounts", get: (b) => DETAILS[b.id].mounts },
    { label: "Best for", get: (b) => DETAILS[b.id].best },
  ];
  return (
    <div className="cd-compare-scroll" tabIndex={0} role="region" aria-label="The four bikes compared (scrolls sideways)">
      <table className="cd-compare">
        <caption className="cd-sr">The Kord range compared: specs, position, mounts and geometry in a {size} cm frame</caption>
        <thead>
          <tr>
            <td />
            {bikes.map((b) => (
              <th key={b.id} scope="col" className={hi(b.id) ? "is-hi" : ""}>
                <img src={`/pitch/kord/bikes/${b.id}.webp`} width="1200" height="720" alt="" loading="lazy" />
                <strong>{b.name}</strong>
                <span className="cd-card-type">{b.type}</span>
                <span className="cd-compare-price"><span>From</span> <b>{money(b.from)}</b></span>
                <a className="cd-btn cd-btn-ghost cd-btn-sm" href={`/pitch/kord/build/?bike=${b.id}&size=${size}`}>Build<span className="cd-sr"> the {plain(b.name)}</span><span className="cd-arrow" aria-hidden="true">→</span></a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {bikes.map((b) => <td key={b.id} className={hi(b.id) ? "is-hi" : ""}>{r.get(b)}</td>)}
            </tr>
          ))}
          <tr className="cd-compare-sep">
            <th scope="row" colSpan={bikes.length + 1}>
              <span>Geometry, {size} cm</span>
              <Choice label="Frame size" name="compare-size" value={size} className="cd-compare-sizes"
                options={SIZES.map((s) => ({ id: s }))} onPick={setSize} render={(o) => o.id} />
            </th>
          </tr>
          {GEO_ROWS.map((g) => (
            <tr key={g.k}>
              <th scope="row">{g.label}</th>
              {bikes.map((b) => <td key={b.id} className={hi(b.id) ? "is-hi" : ""}>{sizeGeo(b.id, size)[g.k]}{g.unit === "°" ? "°" : ` ${g.unit}`}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
