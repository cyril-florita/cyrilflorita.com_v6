"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BASE, PRODUCTS, QUESTIONS, recommend } from "./data";
import { write } from "./store";
import { Arrow, BigWordHead, Button, Pill, PillTray, ProductBox } from "./ui";

// The quiz: one question per screen, with a progress bar. Single-choice
// questions advance on their own after a short beat; multi-choice and the
// name step use Continue. Questions can be skipped by earlier answers (no
// fish question for plant-based diets). Beside the questions, "Your pack so
// far" fills live as answers earn pills (each drops in with its reason), on
// a pack printed with the person's name. The last screen drops the pills
// into the pack (a GSAP timeline: each pill falls with its own drift and
// spin, and the pack squashes a little as each one lands), then hands off
// to /plan/ when the timeline completes.

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Quiz() {
  const router = useRouter();
  // Always a fresh start (retaking the quiz replaces the old answers).
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [building, setBuilding] = useState(null); // recommended ids while "building"
  const headingRef = useRef(null);
  const fillRef = useRef(null);
  const advanceTimer = useRef(null);

  const live = useMemo(() => recommend(answers, { fill: false }), [answers]);
  const owner = answers.name?.trim() || undefined;
  const packName = answers.time === "evening" ? "Evening pack" : "Morning pack";
  const steps = useMemo(() => QUESTIONS.filter((q) => !q.skip || !q.skip(answers)), [answers]);
  const q = steps[Math.min(step, steps.length - 1)];
  const value = answers[q.id];
  const answered = q.type === "multi" ? (value || []).length > 0 : q.type === "text" ? !!(value || "").trim() : !!value;
  const last = step >= steps.length - 1;

  // Move focus to each new question for keyboard and screen-reader users.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const finish = (all) => {
    const picks = recommend(all);
    write("answers", all);
    write("cart", { items: picks, plan: "two" });
    setBuilding(picks.map((p) => p.id));
  };

  // The finale: drop the pills into the pack, then go to the plan.
  useEffect(() => {
    if (!building) return;
    const go = () => router.push(`${BASE}/plan/`);
    const box = fillRef.current;
    if (!box || reducedMotion()) {
      const t = setTimeout(go, 400);
      return () => clearTimeout(t);
    }
    const pills = [...box.querySelectorAll(".dl-fill-pill")];
    const pack = box.querySelector(".dl-product");
    const tl = gsap.timeline({ delay: 0.3, onComplete: go });
    pills.forEach((el, i) => {
      const drift = ((i * 37) % 7) - 3; // a little sideways wander, per pill
      const at = i * 0.38;
      tl.fromTo(el,
        { y: -40, x: drift * 6, rotation: -40 - ((i * 23) % 30), autoAlpha: 0 },
        { y: 150, x: drift * 2, rotation: 25 + ((i * 17) % 25), autoAlpha: 1, duration: 0.75 + (i % 3) * 0.08, ease: "power2.in" },
        at);
      // Into the pack: it shrinks out of sight as it drops in…
      tl.to(el, { y: 178, scale: 0.55, autoAlpha: 0, duration: 0.2, ease: "power1.in" }, ">");
      // …and the pack squashes a touch to catch it.
      if (pack) tl.fromTo(pack, { scaleX: 1, scaleY: 1 }, { scaleX: 1.04, scaleY: 0.95, duration: 0.09, yoyo: true, repeat: 1, ease: "power1.out", transformOrigin: "50% 100%" }, "<");
    });
    tl.to({}, { duration: 0.35 }); // a beat on the full pack before moving on
    return () => tl.kill();
  }, [building, router]);

  const next = (all = answers) => {
    clearTimeout(advanceTimer.current);
    if (last) finish(all);
    else setStep((s) => s + 1);
  };

  const back = () => {
    clearTimeout(advanceTimer.current);
    setStep((s) => Math.max(0, s - 1));
  };

  const set = (v) => {
    const all = { ...answers, [q.id]: v };
    setAnswers(all);
    if (q.type === "single") {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => next(all), reducedMotion() ? 0 : 320);
    }
  };

  const toggle = (v) => {
    const cur = value || [];
    if (cur.includes(v)) set(cur.filter((x) => x !== v));
    else if (cur.length < (q.max || 99)) set([...cur, v]);
  };

  if (building) {
    return (
      <section className="dl-quiz dl-building" aria-live="polite">
        <div className="dl-wrap dl-building-inner">
          <BigWordHead word="One moment">
            <h1 className="dl-h2">Building your pack{answers.name ? `, ${answers.name}` : ""}…</h1>
          </BigWordHead>
          {/* The pills drop into the printed pack, one after another. */}
          <div ref={fillRef} className="dl-pack-fill" role="img" aria-label={`Your pack: ${building.map((i) => PRODUCTS[i]?.name).join(", ")}`}>
            {building.map((id, i) => (
              <span key={id} className="dl-fill-pill" aria-hidden="true">
                <Pill id={id} size="lg" tilt={-20} />
              </span>
            ))}
            <div className="dl-product dl-product-sm" aria-hidden="true">
              <ProductBox name={packName} owner={owner} />
            </div>
          </div>
          <p className="dl-meta">Matching {building.length} essentials to your answers</p>
        </div>
      </section>
    );
  }

  const pct = Math.round(((step + (answered ? 1 : 0)) / steps.length) * 100);

  return (
    <section className="dl-quiz">
      <div className="dl-wrap dl-quiz-layout">
      <div className="dl-quiz-inner dl-panel dl-panel-1">
        {/* Phones: the quiz is full-screen (no site header), so it has its own way out. */}
        <Link className="dl-quiz-exit" href={`${BASE}/`} aria-label="Leave the quiz">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </Link>
        <div className="dl-progress" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="dl-meta dl-quiz-count">
          Question {step + 1} of {steps.length}
        </p>

        <form
          key={q.id}
          className="dl-question"
          onSubmit={(e) => {
            e.preventDefault();
            if (answered) next();
          }}
        >
          <h1 className="dl-h2" tabIndex={-1} ref={headingRef}>{q.title}</h1>
          {q.sub && <p className="dl-section-lede">{q.sub}</p>}

          {q.type === "text" && (
            <label className="dl-field dl-field-lg">
              <span className="dl-sr">{q.placeholder}</span>
              <input
                type="text"
                autoComplete="given-name"
                maxLength={30}
                placeholder={q.placeholder}
                value={value || ""}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              />
            </label>
          )}

          {q.type !== "text" && (
            <div className={`dl-options ${q.type === "multi" ? "dl-options-grid" : ""}`} role={q.type === "multi" ? "group" : "radiogroup"} aria-label={q.title}>
              {q.options.map((o) => {
                const on = q.type === "multi" ? (value || []).includes(o.value) : value === o.value;
                const full = q.type === "multi" && !on && (value || []).length >= q.max;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role={q.type === "multi" ? "checkbox" : "radio"}
                    aria-checked={on}
                    disabled={full}
                    className={`dl-option ${on ? "is-on" : ""}`}
                    onClick={() => (q.type === "multi" ? toggle(o.value) : set(o.value))}
                  >
                    {o.icon && <span className="dl-option-icon" aria-hidden="true">{o.icon}</span>}
                    <span className="dl-option-text">
                      <span>{o.label}</span>
                      {o.hint && <span className="dl-meta">{o.hint}</span>}
                    </span>
                    <span className="dl-option-check" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          )}

          <div className="dl-quiz-nav">
            {step > 0 ? (
              <Button variant="ghost" onClick={back}>Back</Button>
            ) : (
              <span />
            )}
            {(q.type !== "single" || last) && (
              <button type="submit" className="dl-btn dl-btn-primary" disabled={!answered}>
                {last ? "Build my pack" : "Continue"} <Arrow />
              </button>
            )}
          </div>
          {q.type === "multi" && (
            <p className="dl-meta dl-quiz-hint" aria-live="polite">
              {(value || []).length} of {q.max} selected
            </p>
          )}
        </form>
      </div>

      {/* Your pack so far: earned live by the answers. */}
      <aside className="dl-card dl-quiz-pack" aria-label="Your pack so far" aria-live="polite">
        <div className="dl-product dl-product-xs" aria-hidden="true">
          <ProductBox name={packName} owner={owner} />
        </div>
        <h2 className="dl-h3">Your pack so far</h2>
        {live.length ? (
          <>
            <PillTray ids={live.map((p) => p.id)} label="Your pack so far" size="sm" />
            <ul className="dl-quiz-why">
              {live.map((p) => (
                <li key={p.id}>
                  <strong>{PRODUCTS[p.id].name}</strong> {p.why}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="dl-meta">Your answers add pills here, each with the reason it&apos;s in your pack.</p>
        )}
      </aside>
      </div>
    </section>
  );
}
