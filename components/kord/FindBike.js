"use client";

import { useEffect, useRef, useState } from "react";
import { FIND, PAINTS, findBike, encodeFind, decodeFind, money, plain } from "@/components/kord/data";
import { local } from "@/components/safeStorage";
import BikeViewer from "@/components/kord/BikeViewer";
import { Words } from "@/components/kord/ui";

// Find your bike, inline on the landing (the #find section): four questions, one at a time, then
// the match — the bike in 3D in its paint (BikeViewer, created only once there's a result), the
// reasons in the visitor's own words, a frame size, the key specs and where to go next. Answers
// are remembered (localStorage `kd-find`) and can be shared as ?find=flat.long.comfort.h3.
// Choosing an answer moves to the next unanswered question; arrow keys move between answers.

const KEY = "kd-find";
const pad = (n) => String(n).padStart(2, "0");

export default function FindBike() {
  const [phase, setPhase] = useState("intro");      // intro | ask | result
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [said, setSaid] = useState("");
  const [copied, setCopied] = useState(false);
  const headRef = useRef(null), sectionRef = useRef(null), advanceT = useRef(0), warmed = useRef(false);

  // restore: a shared link wins over what this browser remembers
  useEffect(() => {
    const shared = decodeFind(new URLSearchParams(location.search).get("find"));
    let saved = null;
    try { saved = JSON.parse(local.get(KEY) || "null"); } catch { saved = null; }
    const a = shared || (findBike(saved) ? saved : null);
    if (!a) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring client-only state after hydration
    setAnswers(a); setPhase("result");
    if (shared) requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ block: "start" }));
  }, []);
  useEffect(() => () => clearTimeout(advanceT.current), []);

  // move focus to the new question or the result, so keyboard and screen-reader users follow along;
  // if its heading is off screen (a phone, after answering low down), bring it into view
  useEffect(() => {
    const h = headRef.current; if (phase === "intro" || !h) return;
    h.focus({ preventScroll: true });
    const r = h.getBoundingClientRect();
    if (r.top < 70 || r.bottom > innerHeight) h.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [phase, step]);

  const warm = () => {           // start fetching the studio and the decoder while they answer (the model depends on the match)
    if (warmed.current) return; warmed.current = true;
    for (const u of ["/pitch/kord/studio.hdr", "/pitch/kord/draco/draco_decoder.wasm"]) fetch(u).catch(() => {});
  };
  const start = (i = 0) => { warm(); setStep(i); setPhase("ask"); setSaid(`Question ${i + 1} of ${FIND.length}: ${FIND[i].q}`); };
  const nextUnanswered = (a, from) => {
    for (let k = 1; k <= FIND.length; k++) { const j = (from + k) % FIND.length; if (!a[FIND[j].id]) return j; }
    return -1;
  };
  const choose = (q, opt) => {
    const a = { ...answers, [q.id]: opt.id };
    setAnswers(a);
    clearTimeout(advanceT.current);
    advanceT.current = setTimeout(() => {
      const j = nextUnanswered(a, step);
      if (j === -1) {
        local.set(KEY, JSON.stringify(a));
        const r = findBike(a);
        setPhase("result"); setSaid(`Your bike: the ${plain(r.bike.name)}, ${r.bike.type}. Size ${r.size}.`);
      } else { setStep(j); setSaid(`Question ${j + 1} of ${FIND.length}: ${FIND[j].q}`); }
    }, 260);
  };
  const back = () => {
    clearTimeout(advanceT.current);
    if (step === 0) { setPhase("intro"); return; }
    setStep(step - 1); setSaid(`Question ${step} of ${FIND.length}: ${FIND[step - 1].q}`);
  };
  const restart = () => { local.remove(KEY); setAnswers({}); setCopied(false); start(0); };
  const copyLink = async () => {
    const url = `${location.origin}${location.pathname}?find=${encodeFind(answers)}#find`;
    try { await navigator.clipboard.writeText(url); setCopied(true); setSaid("Link copied"); } catch { /* ignore */ }
  };
  const onOptKey = (e, i, n) => {
    const k = e.key;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(k)) return;
    e.preventDefault();
    const j = k === "Home" ? 0 : k === "End" ? n - 1 : (i + (k === "ArrowRight" || k === "ArrowDown" ? 1 : -1) + n) % n;
    e.currentTarget.parentElement.children[j]?.focus();
  };

  const q = FIND[step];
  const r = phase === "result" ? findBike(answers) : null;
  const paint = r ? PAINTS.find((p) => p.id === r.paint) : null;

  return (
    <section ref={sectionRef} id="find" className={`cd-section cd-find is-${phase}`} aria-label="Find your bike">
      <div className="cd-wrap">
        {phase === "intro" && (
          <div className="cd-find-row">
            <div>
              <h2 className="cd-h2"><Words text="Not sure which one? Answer four questions." /></h2>
              <p className="cd-subhead">Find your bike</p>
              <p className="cd-lede">Tell us how you ride and we&apos;ll match you to a bike and a size, with the reasons, in under a minute.</p>
              <button type="button" className="cd-btn cd-btn-primary" onClick={() => start(0)}>Find your bike<span className="cd-arrow" aria-hidden="true">→</span></button>
            </div>
            <ol className="cd-find-qs">
              {FIND.map((f, i) => (
                <li key={f.id}><button type="button" onClick={() => start(i)}><span className="cd-mono">{pad(i + 1)}</span>{f.q}</button></li>
              ))}
            </ol>
          </div>
        )}

        {phase === "ask" && (
          <div className="cd-find-row cd-find-ask">
            <div className="cd-find-qhead">
              <p className="cd-find-progress" aria-hidden="true"><span>{pad(step + 1)}</span> / {pad(FIND.length)}</p>
              <div className="cd-find-bar" aria-hidden="true">{FIND.map((f, i) => <i key={f.id} className={answers[f.id] ? "is-done" : i === step ? "is-now" : ""} />)}</div>
              <h2 ref={headRef} tabIndex={-1} id="cd-find-q" className="cd-h2">{q.q}</h2>
              {q.id === "height" && <p className="cd-find-note">For your frame size. We confirm it with your fit details before we build.</p>}
              <button type="button" className="cd-find-back" onClick={back}><span aria-hidden="true">←</span> {step === 0 ? "Back" : "Previous question"}</button>
            </div>
            <div className="cd-find-opts" role="radiogroup" aria-labelledby="cd-find-q">
              {q.a.map((opt, i) => {
                const on = answers[q.id] === opt.id;
                const focusable = on || (!answers[q.id] && i === 0);
                return (
                  <button key={opt.id} type="button" role="radio" aria-checked={on} tabIndex={focusable ? 0 : -1}
                    className={`cd-find-opt${on ? " is-on" : ""}`} onClick={() => choose(q, opt)} onKeyDown={(e) => onOptKey(e, i, q.a.length)}>
                    <span className="cd-find-opt-dot" aria-hidden="true" />{opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {r && (
          <div className="cd-find-row cd-find-result">
            <div className="cd-find-copy">
              <h2 ref={headRef} tabIndex={-1} className="cd-h2 cd-find-name">The {r.bike.name}</h2>
              <p className="cd-subhead">Your bike</p>
              <p className="cd-find-meta">{r.bike.type} · Size {r.size} <span>for {r.height.charAt(0).toLowerCase() + r.height.slice(1)}</span></p>
              <ul className="cd-find-why">
                {r.reasons.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <dl className="cd-find-specs">
                <div><dt>Weight</dt><dd>{r.bike.weight} kg</dd></div>
                <div><dt>Wheels</dt><dd>{r.bike.wheels}</dd></div>
                <div><dt>Gearing</dt><dd>{r.bike.gearing}</dd></div>
                <div><dt>Tires</dt><dd>{r.bike.tires}, {r.bike.clearance} clearance</dd></div>
              </dl>
            </div>
            <BikeViewer bike={r.bike.id} place={{ fit: 0.44, x: 0.72, y: 0.36 }} spec={{ size: r.size }} paint={paint} still={`/pitch/kord/bikes/${r.bike.id}.webp`} label={`The Kord ${plain(r.bike.name)}`} />
            {/* price, the two buttons and the links on one line, across the section under the bike
                (2026-11-24, the user's call; they were stacked in the copy column) */}
            <div className="cd-find-buy">
              <p className="cd-find-price">From <strong>{money(r.bike.from)}</strong></p>
              <div className="cd-find-actions">
                <a className="cd-btn cd-btn-primary" href={`/pitch/kord/build/?bike=${r.bike.id}&size=${r.size}&paint=${r.paint}`}>Build your {r.bike.name}<span className="cd-arrow" aria-hidden="true">→</span></a>
                <a className="cd-btn cd-btn-ghost" href={`/pitch/kord/compare/?a=${r.bike.id}&b=${r.runner.id}&size=${r.size}`}>Compare with the {r.runner.name}</a>
              </div>
              <p className="cd-find-links">
                <button type="button" onClick={restart}>Start over</button>
                <button type="button" onClick={copyLink}>{copied ? "Link copied" : "Copy a link to this result"}</button>
              </p>
            </div>
          </div>
        )}
      </div>
      <p className="cd-sr" role="status" aria-live="polite">{said}</p>
    </section>
  );
}

