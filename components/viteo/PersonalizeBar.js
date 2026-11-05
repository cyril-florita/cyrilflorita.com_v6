"use client";
import { useEffect, useState } from "react";
import { BASE } from "./data";
import { Arrow, Button } from "./ui";

// Phones and tablets (≤960px): a "Personalize your pack" bar fixed to the bottom of
// the landing page. It slides up once the hero's own call to action has
// scrolled away, and steps aside again at the closing call to action (no
// two "Personalize your pack" buttons on screen at once). Hidden entirely on desktop.
export default function PersonalizeBar() {
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
    <div className={`dl-personalize-bar ${on ? "is-on" : ""}`} inert={!on}>
      <span className="dl-personalize-bar-text">
        <strong>8 questions</strong>
        <span>About 2 minutes</span>
      </span>
      <Button href={`${BASE}/personalize/`}>
        Personalize your pack<span className="dl-personalize-bar-time"> · 2 min</span> <Arrow />
      </Button>
    </div>
  );
}
