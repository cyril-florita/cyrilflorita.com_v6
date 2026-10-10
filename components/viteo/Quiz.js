"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BASE, QUESTIONS, recommend } from "./data";
import { write } from "./store";
import { Arrow, BigWordHead, Button, PillTray } from "./ui";

// The quiz: one question per screen, with a progress bar. Single-choice
// questions advance on their own after a short beat; multi-choice and the
// name step use Continue. Questions can be skipped by earlier answers (no
// fish question for plant-based diets). The last screen "builds" the pack,
// then hands off to /plan/.

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Quiz() {
  const router = useRouter();
  // Always a fresh start (retaking the quiz replaces the old answers).
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [building, setBuilding] = useState(null); // recommended ids while "building"
  const headingRef = useRef(null);
  const advanceTimer = useRef(null);

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
    setTimeout(() => router.push(`${BASE}/plan/`), reducedMotion() ? 400 : 2600);
  };

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
          <PillTray ids={building} label="Your pack" />
          <p className="dl-meta">Matching {building.length} essentials to your answers</p>
        </div>
      </section>
    );
  }

  const pct = Math.round(((step + (answered ? 1 : 0)) / steps.length) * 100);

  return (
    <section className="dl-quiz">
      <div className="dl-wrap dl-quiz-inner dl-panel dl-panel-1">
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
    </section>
  );
}
