"use client";
import { useEffect } from "react";

// The landing page's entrance, once per visit (sessionStorage): the logo's
// sun rises, the black circle opens, the product drops onto it with a soft
// bounce, the badge spins in and the copy follows. About 1.6s; any click,
// key or wheel skips it. It's pure CSS (.dl.is-intro rules in viteo.css);
// this only adds and removes the class, and wakes the 3D scene
// (ProductStory listens for "dl:wake") so the 3D box follows the drop.
// Never under reduced motion.

const LENGTH = 1700;

export default function IntroMoment() {
  useEffect(() => {
    const root = document.querySelector(".dl");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("dl-intro")) return;
      sessionStorage.setItem("dl-intro", "1");
    } catch {
      return;
    }
    const wake = (ms) => window.dispatchEvent(new CustomEvent("dl:wake", { detail: { ms } }));
    root.classList.add("is-intro");
    wake(LENGTH + 400);
    const end = () => {
      root.classList.remove("is-intro");
      wake(400);
      clearTimeout(timer);
      ["pointerdown", "keydown", "wheel"].forEach((t) => window.removeEventListener(t, end));
    };
    const timer = setTimeout(end, LENGTH);
    ["pointerdown", "keydown", "wheel"].forEach((t) => window.addEventListener(t, end, { passive: true }));
    return end;
  }, []);
  return null;
}
