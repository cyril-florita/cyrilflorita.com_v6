"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BASE } from "./data";
import { Arrow } from "./ui";

// Phones and tablets (≤960px): a "Take the quiz" bar fixed to the bottom of
// the landing page. It slides up once the hero's own call to action has
// scrolled away, and steps aside again at the closing call to action (no
// two quiz buttons on screen at once). Hidden entirely on desktop.
export default function QuizBar() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const heroCta = document.querySelector(".dl-bento-hero .dl-underline-cta");
    const endCta = document.querySelector(".dl-cta");
    if (!heroCta) return;
    // A plain scroll check (rAF-throttled): an IntersectionObserver missed
    // big jumps (e.g. an anchor link) straight past the hero.
    let frame = 0;
    const check = () => {
      frame = 0;
      const vh = window.innerHeight;
      const heroGone = heroCta.getBoundingClientRect().bottom < 0;
      const end = endCta?.getBoundingClientRect();
      const atEnd = end ? end.top < vh && end.bottom > 0 : false;
      setOn(heroGone && !atEnd);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className={`dl-quizbar ${on ? "is-on" : ""}`} inert={!on}>
      <span className="dl-quizbar-text">
        <strong>Find your pack</strong>
        <span>8 questions · 2 minutes</span>
      </span>
      <Link className="dl-btn dl-btn-primary" href={`${BASE}/quiz/`}>
        Take the quiz <Arrow />
      </Link>
    </div>
  );
}
