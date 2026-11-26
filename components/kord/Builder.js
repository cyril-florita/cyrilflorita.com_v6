"use client";

import { useEffect, useRef, useState } from "react";
import {
  BIKES, PAINTS, SIZES, PAINT_PRICE, GROUPSETS, WHEELSETS, SHIP_DAYS, FIND,
  normalizeBuild, priceBuild, weighBuild, buildQuery, money, plain,
} from "@/components/kord/data";
import { addToCart } from "@/components/kord/cartStore";
import BikeViewer from "@/components/kord/BikeViewer";
import Choice from "@/components/kord/Choice";
import { Words } from "@/components/kord/ui";

// The builder (/builds/kord/build/): the bike in 3D on the left (sticky; on phones, on top), five
// steps on the right — bike, size, paint, groupset, wheels — and a summary pinned under them with
// the price, the weight and a ship date, which update as you choose. Starts from the query string
// (?bike=meridian&size=54&paint=ember&group=race&wheels=deep, as Find your bike and the range send
// it). Changing the bike also switches to that bike's own paint unless one was picked here.

const SIZE_FOR = Object.fromEntries(FIND.find((q) => q.id === "height").a.map((a) => [a.size, a.label]));
const delta = (n) => (n ? `+${money(n)}` : "Included");
const grams = (kg) => (kg ? `${kg > 0 ? "+" : "−"}${Math.round(Math.abs(kg) * 1000)} g` : "");

export default function Builder() {
  const [build, setBuild] = useState(() => normalizeBuild({}));
  const [ship, setShip] = useState("");
  const [said, setSaid] = useState("");
  const [added, setAdded] = useState(false);
  const cartRef = useRef(null);
  // once added, the button gives way to a label, so focus goes on to View cart (the next step)
  useEffect(() => { if (added) cartRef.current?.focus({ preventScroll: true }); }, [added]);

  useEffect(() => {
    const q = Object.fromEntries(new URLSearchParams(location.search));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the query string after hydration
    setBuild(normalizeBuild(q));
    const d = new Date(); d.setDate(d.getDate() + SHIP_DAYS);
    setShip(d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
  }, []);

  const set = (k, v) => {
    setAdded(false);
    setBuild((b) => {
      const n = { ...b, [k]: v };
      // a new bike keeps the paint: every bike comes in every paint (2026-11-25; it used to switch to the bike's "own" paint)
      return normalizeBuild(n);
    });
  };

  const bike = BIKES.find((b) => b.id === build.bike);
  const paint = PAINTS.find((p) => p.id === build.paint);
  const group = GROUPSETS.find((g) => g.id === build.group);
  const wheels = WHEELSETS.find((w) => w.id === build.wheels);
  const price = priceBuild(build), kg = weighBuild(build);

  const add = () => { addToCart(build); setAdded(true); setSaid(`Added the Kord ${plain(bike.name)} to your cart.`); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(`${location.origin}/builds/kord/build/${buildQuery(build)}`); setSaid("Link copied"); } catch { /* ignore */ }
  };

  return (
    <div className="cd-build">
      <div className="cd-build-stage">
        <BikeViewer className="cd-viewer-stage" bike={bike.id} spec={{ group: build.group, rim: (wheels.id === "stock" ? parseInt(bike.wheels, 10) : parseInt(wheels.short, 10)) / 1000, size: build.size }} paint={paint} still={`/builds/kord/bikes/${bike.id}-${paint.id}.webp`} label={`The Kord ${plain(bike.name)}`} />
        {/* the label goes under the name, never above it as an eyebrow (the user's rule) */}
        <div className="cd-build-tag" aria-hidden="true">
          <strong>{plain(bike.name)}</strong>
          <span className="cd-subhead">Kord® {bike.type}</span>
        </div>
      </div>

      <div className="cd-build-panel">
        <header className="cd-build-head">
          <h1 className="cd-h2"><Words text={`Build your ${bike.name}`} /></h1>
          <p className="cd-lede">Five choices. The price and weight update as you go, and every bike is built to order and fitted to you.</p>
        </header>

        <section className="cd-build-step" aria-labelledby="st-bike">
          <h2 id="st-bike" className="cd-build-h"><span>01</span> Bike</h2>
          {/* each bike's key stats in its own box (2026-11-25, the user's pick: the specs as part of the choice) */}
          <Choice label="Bike" name="bike" value={build.bike} options={BIKES} onPick={(v) => set("bike", v)} className="is-2"
            render={(b) => (<><strong>{b.name}</strong><span>{b.type}</span><span className="cd-build-stats">{b.weight} kg · {parseInt(b.wheels, 10)} mm wheels · {b.tires} tires</span><em>From {money(b.from)}</em></>)} />
          <p className="cd-build-note">Want every spec side by side? <a href={`/builds/kord/compare/?a=${build.bike}&size=${build.size}&paint=${build.paint}`}>Compare all four</a>.</p>
        </section>

        <section className="cd-build-step" aria-labelledby="st-size">
          <h2 id="st-size" className="cd-build-h"><span>02</span> Size</h2>
          <Choice label="Size" name="size" value={build.size} options={SIZES.map((s) => ({ id: s }))} onPick={(v) => set("size", v)} className="is-sizes"
            render={(s) => (<><strong>{s.id}</strong><span>{SIZE_FOR[s.id]}</span></>)} />
          <p className="cd-build-note">Not sure? <a href="/builds/kord/#find">Find your bike and size</a>. We confirm your size with your fit details before we build.</p>
        </section>

        <section className="cd-build-step" aria-labelledby="st-paint">
          <h2 id="st-paint" className="cd-build-h"><span>03</span> Paint</h2>
          <p className="cd-build-note cd-build-note-top">Every Kord® comes in every paint, on any bike and in any size.</p>
          <Choice label="Paint" name="paint" value={build.paint} options={PAINTS} onPick={(v) => set("paint", v)} className="is-2"
            render={(p) => (<><i className="cd-build-swatch" style={{ "--swatch": p.hex }} aria-hidden="true" /><strong>{p.name}</strong><em>{PAINT_PRICE[p.id] ? `Signature, +${money(PAINT_PRICE[p.id])}` : "Included"}</em></>)} />
        </section>

        <section className="cd-build-step" aria-labelledby="st-group">
          <h2 id="st-group" className="cd-build-h"><span>04</span> Groupset</h2>
          <Choice label="Groupset" name="group" value={build.group} options={GROUPSETS} onPick={(v) => set("group", v)}
            render={(g) => (<><strong>{g.name}</strong><span>{g.line}</span><em>{delta(g.price)}{g.weight ? ` · ${grams(g.weight)}` : ""}</em></>)} />
        </section>

        <section className="cd-build-step" aria-labelledby="st-wheels">
          <h2 id="st-wheels" className="cd-build-h"><span>05</span> Wheels</h2>
          <Choice label="Wheels" name="wheels" value={build.wheels} options={WHEELSETS} onPick={(v) => set("wheels", v)}
            render={(w) => (<><strong>{w.id === "stock" ? bike.wheels : w.name}</strong><span>{w.line(bike)}</span><em>{delta(w.price)}{w.weight ? ` · ${grams(w.weight)}` : ""}</em></>)} />
        </section>

        <div className="cd-build-sum">
          <div className="cd-build-sum-row">
            <div>
              <p className="cd-build-sum-name">Kord® {bike.name} · {build.size} · {paint.name}</p>
              <p className="cd-build-sum-spec">{group.name} · {wheels.short || bike.wheels} wheels · {kg.toFixed(2)} kg</p>
              <p className="cd-build-sum-ship">{ship ? `Ships by ${ship}` : " "}</p>
            </div>
            <p className="cd-build-price"><strong>{money(price)}</strong></p>
          </div>
          <div className="cd-build-sum-actions">
            {/* after adding (2026-11-24, the user's call): the button becomes a plain label and View cart the
                solid button; changing any option brings Add to cart back */}
            {added ? (
              <>
                <p className="cd-build-added"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>Added to cart</p>
                <a ref={cartRef} className="cd-btn cd-btn-primary" href="/builds/kord/cart/">View cart<span className="cd-arrow" aria-hidden="true">→</span></a>
              </>
            ) : (
              <>
                <button type="button" className="cd-btn cd-btn-primary" onClick={add}>Add to cart</button>
                <button type="button" className="cd-build-copy" onClick={copy}>Copy a link to this build</button>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="cd-sr" role="status" aria-live="polite">{said}</p>
    </div>
  );
}
