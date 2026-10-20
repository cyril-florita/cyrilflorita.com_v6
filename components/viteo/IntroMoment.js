"use client";
import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { CARTON_FALL, backStrength, introState, pillFall } from "./introFall";

// The landing page's entrance, every time it loads, as one GSAP timeline:
// the logo's capsules swing in, the black circle opens, the carton drops onto
// it and the pills tumble in one by one at different speeds (introFall.js),
// the badge spins in and the copy rises.
//
// The CSS hero is animated through custom properties (--iy, --ir, --is,
// --io), which viteo.css turns into the individual translate / rotate /
// scale / opacity properties only while .dl.is-intro is set, so the
// elements' own transforms (the pills' tilt, the box's 3D turn) are left
// alone. Each carton and pill tween also writes introState, which the 3D
// scene (ProductStory.js) reads every frame: one tween drives both. Any
// click, key or wheel jumps to the end. Never under reduced motion.
//
// Preloader: until the page is ready, the logo animation (.dl-preloader in
// page.js) covers the landing page and the intro's pieces stay hidden
// (.dl.is-intro-pending). On desktop with a mouse, "ready" means the 3D scene
// has compiled its shaders and uploaded its textures (ProductStory's
// dl:3d-ready), so none of that work lands in the middle of the intro;
// elsewhere, the web fonts. At least 2s (0.6s on phones), so the animation plays even on a fast connection; at most 4s.

const VARS = ["--iy", "--ir", "--is", "--io"];

export default function IntroMoment() {
  // A layout effect, so the intro's start state is set before the browser
  // paints (also when arriving by client-side navigation). The pre-paint
  // script in layout.js has already hidden the pieces on a full load.
  useLayoutEffect(() => {
    const root = document.querySelector(".dl");
    if (!root) return;
    const art = root.querySelector(".dl-bento-art");
    const pre = root.querySelector(".dl-preloader");
    // No intro (or preloader) under reduced motion, or when the link points
    // at a section further down (/pitch/viteo/#faq): go straight there.
    if (!art || window.location.hash || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("is-intro-pending");
      return;
    }
    // Arriving by client-side navigation: the pre-paint script didn't run,
    // so hide the pieces and show the preloader now, before this paints.
    root.classList.add("is-intro-pending");
    const wake = (ms) => window.dispatchEvent(new CustomEvent("dl:wake", { detail: { ms } }));
    let cancelled = false;
    let stop = () => {};

    const $ = (sel) => [...root.querySelectorAll(sel)];
    const logo = $(".dl-header .dl-logo :is(.dl-logo-a, .dl-logo-b)");
    const orbit = art.querySelector(".dl-orbit");
    const box = art.querySelector(".dl-product > .dl-box");
    const pills = $(".dl-bento-art .dl-burst .dl-pill");
    const badge = art.querySelector(".dl-badge");
    const copy = $(".dl-bento-copy > *");
    const all = [...logo, orbit, box, ...pills, badge, ...copy].filter(Boolean);

    // A fall: one proxy tween per object, eased with its own bounce. It
    // writes the CSS hero's custom properties and the 3D scene's state.
    const fall = (tl, el, f, state) => {
      state.p = 0; state.drop = f.h; state.turn = f.r;
      if (el) gsap.set(el, { "--iy": `${-f.h * 100}cqw`, "--ir": `${f.r}deg`, "--io": 0 });
      const proxy = { e: 0 };
      tl.to(proxy, {
        e: 1,
        duration: f.dur,
        ease: `back.out(${backStrength(f.o).toFixed(2)})`,
        onUpdate() {
          const p = this.progress();
          state.p = Math.max(p, 0.0001);
          state.drop = (1 - proxy.e) * f.h;
          state.turn = (1 - proxy.e) * f.r;
          if (el) {
            el.style.setProperty("--iy", `${(-state.drop * 100).toFixed(3)}cqw`);
            el.style.setProperty("--ir", `${state.turn.toFixed(2)}deg`);
            el.style.setProperty("--io", Math.min(1, p / 0.3).toFixed(3));
          }
        },
      }, f.delay);
    };

    const start = () => {
    if (cancelled) return;
    introState.active = true;
    root.classList.add("is-intro");
    // The preloader fades out as the intro begins (kept on screen past the
    // pending class by an inline display, then removed).
    if (pre) pre.style.display = "grid";
    root.classList.remove("is-intro-pending"); // the timeline's start state takes over
    const tl = gsap.timeline({ onComplete: () => end() });
    if (pre) tl.to(pre, { autoAlpha: 0, duration: 0.45, ease: "power2.out", onComplete: () => { pre.style.display = "none"; } }, 0);

    // Logo capsules swing in from either side; the circle opens.
    logo.forEach((el, i) => {
      tl.fromTo(el, { "--ir": `${i ? 40 : -40}deg`, "--io": 0 }, { "--ir": "0deg", "--io": 1, duration: 0.9, ease: "back.out(1.4)" }, i * 0.08);
    });
    if (orbit) tl.fromTo(orbit, { "--is": 0.7, "--io": 0 }, { "--is": 1, "--io": 1, duration: 0.8, ease: "power3.out" }, 0.1);
    // The product shot, object by object.
    fall(tl, box, CARTON_FALL, introState.carton);
    pills.forEach((el, i) => fall(tl, el, pillFall(i), introState.pills[i]));
    // The badge spins in; the copy rises, staggered.
    if (badge) tl.fromTo(badge, { "--is": 0.4, "--ir": "-90deg", "--io": 0 }, { "--is": 1, "--ir": "0deg", "--io": 1, duration: 0.8, ease: "power3.out" }, 0.8);
    if (copy.length) tl.fromTo(copy, { "--iy": "24px" }, { "--iy": "0px", duration: 0.8, ease: "power3.out", stagger: 0.1 }, 0.35);

    wake(tl.duration() * 1000 + 400);

    let ended = false;
    function end() {
      if (ended) return;
      ended = true;
      tl.kill();
      introState.active = false;
      introState.carton.p = 1; introState.carton.drop = 0; introState.carton.turn = 0;
      introState.pills.forEach((s) => { s.p = 1; s.drop = 0; s.turn = 0; });
      root.classList.remove("is-intro");
      all.forEach((el) => VARS.forEach((v) => el.style.removeProperty(v)));
      if (pre) pre.style.display = "none";
      wake(400);
      ["pointerdown", "keydown", "wheel"].forEach((t) => window.removeEventListener(t, end));
    }
    ["pointerdown", "keydown", "wheel"].forEach((t) => window.addEventListener(t, end, { passive: true }));
    stop = end;
    };

    // Wait for the page to be ready (see above), then start.
    const desktop3d = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 961px)").matches;
    const ready = desktop3d
      ? new Promise((r) => { if (window.__dl3dReady) r(); else window.addEventListener("dl:3d-ready", r, { once: true }); })
      : (document.fonts?.ready ?? Promise.resolve());
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    // Phones get a shorter minimum (0.6s): a long cover hurts their load (Lighthouse's
    // speed index on slow 4G); elsewhere the animation plays at least 2s.
    const phone = window.matchMedia("(max-width: 680px)").matches;
    Promise.all([wait(phone ? 600 : 2000), Promise.race([ready, wait(4000)])]).then(start);
    return () => {
      cancelled = true;
      stop();
      root.classList.remove("is-intro-pending");
    };
  }, []);
  return null;
}
