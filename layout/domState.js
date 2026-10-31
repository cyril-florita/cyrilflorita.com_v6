"use client";
import { useCallback, useSyncExternalStore } from "react";

// Small read-only views of DOM state that other code owns (the hero's
// classes, About Me's active section, the theme attribute), read with
// useSyncExternalStore instead of being copied into React state from an
// effect. The server snapshot is what the static HTML renders with; React
// re-reads the real value after hydration.

const watchClass = (el, cb) => {
  if (!el) return () => {};
  const o = new MutationObserver(cb);
  o.observe(el, { attributes: true, attributeFilter: ["class"] });
  return () => o.disconnect();
};

// The "/" hero (#intro): "top" while it's showing, "exited" once it has been
// scrolled or clicked away (cyril-hero-exit), "none" on other pages.
export function useHeroState(pathname) {
  const subscribe = useCallback((cb) => watchClass(document.getElementById("intro"), cb), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps -- re-subscribe per page
  return useSyncExternalStore(
    subscribe,
    () => {
      const hero = document.getElementById("intro");
      return hero ? (hero.classList.contains("cyril-hero-exit") ? "exited" : "top") : "none";
    },
    () => "none",
  );
}

// About Me: whether its top section (#background) is the active one.
export function useTopSectionActive(pathname) {
  const subscribe = useCallback((cb) => {
    if (pathname !== "/about-me") return () => {};
    const stop = watchClass(document.querySelector("#background"), cb);
    window.addEventListener("scroll", cb, { passive: true });
    return () => { stop(); window.removeEventListener("scroll", cb); };
  }, [pathname]);
  return useSyncExternalStore(
    subscribe,
    () => pathname === "/about-me" && !!document.querySelector("#background")?.classList.contains("cyril-active"),
    () => false,
  );
}

// Whether this page uses the case-study layout (checked on the page itself,
// so the 404 page, served at any missing URL, doesn't count).
const noop = () => () => {};
export function useIsCasePage() {
  return useSyncExternalStore(noop, () => !!document.querySelector(".cyril-case-page"), () => false);
}

// The current theme, from data-theme on <html> (set before first paint by
// app/layout.js and switched by ThemeToggle). Anything but "light" is dark.
const watchTheme = (cb) => {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => o.disconnect();
};
export function useIsDark() {
  return useSyncExternalStore(watchTheme, () => document.documentElement.getAttribute("data-theme") !== "light", () => true);
}
