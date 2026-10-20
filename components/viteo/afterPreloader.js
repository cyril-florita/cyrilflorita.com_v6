// Runs `cb` once the landing's preloader (.is-intro-pending, the only
// preloader Viteo has) no longer covers the page — for entrance animations
// that should play in view, like the routine chart drawing in. Runs at once
// on every other page. Returns a cancel function.
export function afterPreloader(cb) {
  const root = document.querySelector(".dl");
  if (!root?.classList.contains("is-intro-pending")) { cb(); return () => {}; }
  const mo = new MutationObserver(() => {
    if (root.classList.contains("is-intro-pending")) return;
    mo.disconnect();
    cb();
  });
  mo.observe(root, { attributes: true, attributeFilter: ["class"] });
  return () => mo.disconnect();
}
