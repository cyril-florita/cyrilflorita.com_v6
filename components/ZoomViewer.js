"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onPreloaderHidden } from "@/components/Preloader";
import { imageSize, thumbFor } from "@/components/imageProps";

// Site-wide image viewer (replaces the old magnific-style lightbox). Any link
// to an image under /img/ opens here instead of navigating:
// - the image grows out of the clicked thumbnail and shrinks back into it
// - a link's set: its data-zoom-group (e.g. the social graphics in the My
//   Work grid), else every figure on the case-study page, else just itself
// - prev/next via buttons, arrow keys, or swipe; Esc, scroll, or swipe down
//   closes; click (mouse) or pinch / double-tap (touch) zooms into detail
// - each image gets a shareable #zoom-<id> hash (data-zoom-id, else the
//   file name) that reopens it on load
// Styles: "zoom viewer" in _components.scss.

const IMAGE_LINK = 'a[href*="/img/"]';
const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;
const MOVE_MS = 500;
const FADE_MS = 160;
const MOVE = `left ${MOVE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), top ${MOVE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), width ${MOVE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), height ${MOVE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${FADE_MS}ms ease, transform 0.3s ease`;

const isImageLink = (a) =>
  !!a && !a.hasAttribute("download") && IMAGE_EXT.test(a.getAttribute("href") || "");

const slugFromHref = (href) =>
  href.split("/").pop().replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const describe = (link) => {
  const img = link.querySelector("img");
  const figcaption = link.closest("figure")?.querySelector("figcaption");
  const href = link.getAttribute("href");
  return {
    link,
    img,
    href,
    caption: link.dataset.zoomCaption || figcaption?.textContent.trim() || img?.alt || "",
    id: link.dataset.zoomId || slugFromHref(href),
  };
};

const isShown = (el) => el.getClientRects().length > 0;

const groupFor = (link) => {
  let links;
  if (link.dataset.zoomGroup) {
    links = [...document.querySelectorAll(`a[data-zoom-group="${link.dataset.zoomGroup}"]`)];
  } else if (link.closest(".cyril-case-page")) {
    links = [...link.closest(".cyril-case-page").querySelectorAll(IMAGE_LINK)].filter(isImageLink);
  } else {
    links = [link];
  }
  // Skip anything hidden (e.g. grid items filtered out by Isotope).
  return links.filter((l) => l === link || isShown(l)).map(describe);
};

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Where the image sits when open: as large as fits, never upscaled past its
// real size, leaving room for the controls and caption.
const fitRect = (nw, nh) => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw <= 768;
  const padX = mobile ? 16 : 100;
  const padTop = mobile ? 70 : 80;
  const padBottom = mobile ? 90 : 100;
  const maxW = vw - padX * 2;
  const maxH = vh - padTop - padBottom;
  const s = Math.min(maxW / nw, maxH / nh, 1);
  const width = nw * s;
  const height = nh * s;
  return { left: (vw - width) / 2, top: padTop + (maxH - height) / 2, width, height };
};

const place = (el, r) => {
  el.style.left = `${r.left}px`;
  el.style.top = `${r.top}px`;
  el.style.width = `${r.width}px`;
  el.style.height = `${r.height}px`;
};

const inViewport = (r) => r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;

// Natural size: from the thumbnail manifest (instant), else from the
// already-loaded thumbnail when it's the same file, else by loading it.
const naturalSize = (item) =>
  new Promise((resolve) => {
    const known = imageSize(item.href);
    if (known) {
      resolve(known);
      return;
    }
    const t = item.img;
    if (t && t.naturalWidth && t.currentSrc === new URL(item.href, window.location.href).href) {
      resolve([t.naturalWidth, t.naturalHeight]);
      return;
    }
    const probe = new Image();
    probe.onload = () => resolve([probe.naturalWidth, probe.naturalHeight]);
    probe.onerror = () => resolve([4, 3]);
    probe.src = item.href;
  });

const absolute = (url) => new URL(url, window.location.href).href;

// Show the image right away using what's already loaded (the page's
// thumbnail), then swap in the full-resolution original once it arrives.
const showImage = (img, item, currentHref) => {
  const preview = item.img?.currentSrc || (imageSize(item.href) ? thumbFor(item.href) : item.href);
  img.src = preview;
  if (absolute(preview) === absolute(item.href)) return;
  const full = new Image();
  full.onload = () => {
    if (currentHref.current === item.href) img.src = item.href;
  };
  full.src = item.href;
};

const ZoomViewer = () => {
  const [view, setView] = useState(null); // { items, index, fromThumb }
  const overlayRef = useRef(null);
  const imgRef = useRef(null);
  const closeRef = useRef(null);
  const busy = useRef(false);
  const returnFocus = useRef(null);
  const hiddenThumb = useRef(null);
  // scale/x/y = the zoom transform; base = the image's unzoomed rect.
  const zoom = useRef({ scale: 1, x: 0, y: 0, base: null });
  const viewRef = useRef(null);
  viewRef.current = view;
  const currentHref = useRef(null);

  const hideThumb = (item) => {
    if (hiddenThumb.current) hiddenThumb.current.style.visibility = "";
    hiddenThumb.current = item?.img || null;
    if (hiddenThumb.current) hiddenThumb.current.style.visibility = "hidden";
  };

  const setTransform = (animate = true) => {
    const img = imgRef.current;
    if (!img) return;
    const { scale, x, y } = zoom.current;
    img.style.transition = animate ? MOVE : "none";
    img.style.transform = scale === 1 && !x && !y ? "" : `translate(${x}px, ${y}px) scale(${scale})`;
    overlayRef.current?.classList.toggle("cyril-zoom-zoomed", scale > 1);
  };

  const resetZoom = () => {
    zoom.current = { scale: 1, x: 0, y: 0, base: null };
    setTransform();
  };

  // Open on any image-link click (delegated, so late-mounted content works).
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.(IMAGE_LINK);
      if (!isImageLink(link) || busy.current || viewRef.current) return;
      e.preventDefault();
      const items = groupFor(link);
      returnFocus.current = link;
      setView({ items, index: Math.max(0, items.findIndex((i) => i.link === link)), fromThumb: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Reopen from a shared #zoom-<id> link once the page (and the grid, which
  // mounts late) is in place.
  useEffect(() => {
    const match = window.location.hash.match(/^#zoom-(.+)$/);
    if (!match) return;
    let timer;
    const unsubscribe = onPreloaderHidden(() => {
      timer = setTimeout(() => {
        const link = [...document.querySelectorAll(IMAGE_LINK)]
          .filter(isImageLink)
          .find((l) => describe(l).id === decodeURIComponent(match[1]));
        if (!link) return;
        const items = groupFor(link);
        returnFocus.current = link;
        setView({ items, index: Math.max(0, items.findIndex((i) => i.link === link)), fromThumb: false });
      }, 700);
    });
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Opening animation (runs once per open).
  const opened = useRef(false);
  useLayoutEffect(() => {
    if (!view || opened.current) return;
    opened.current = true;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    const item = view.items[view.index];
    busy.current = true;
    zoom.current = { scale: 1, x: 0, y: 0, base: null };

    currentHref.current = item.href;
    showImage(img, item, currentHref);
    naturalSize(item).then(([nw, nh]) => {
      const to = fitRect(nw, nh);
      const thumbRect = item.img?.getBoundingClientRect();
      const grow = view.fromThumb && thumbRect && inViewport(thumbRect) && !reducedMotion();
      img.style.objectPosition = item.img ? getComputedStyle(item.img).objectPosition : "50% 50%";
      img.style.transition = "none";
      if (grow) {
        place(img, thumbRect);
        img.style.opacity = "1";
        hideThumb(item);
      } else {
        place(img, to);
        img.style.opacity = "0";
      }
      void img.offsetWidth;
      img.style.transition = MOVE;
      overlay.classList.add("cyril-zoom-open");
      place(img, to);
      img.style.opacity = "1";
      setTimeout(() => { busy.current = false; }, MOVE_MS);
    });

    history.replaceState(null, "", `#zoom-${item.id}`);
    closeRef.current?.focus({ preventScroll: true });
    // Preload neighbours.
    [view.index - 1, view.index + 1].forEach((i) => {
      const n = view.items[(i + view.items.length) % view.items.length];
      if (n) new Image().src = n.href;
    });
  }, [view]);

  const close = () => {
    const v = viewRef.current;
    if (!v || busy.current) return;
    busy.current = true;
    const img = imgRef.current;
    const overlay = overlayRef.current;
    const item = v.items[v.index];
    zoom.current = { scale: 1, x: 0, y: 0, base: null };
    img.style.transform = "";
    const thumbRect = item.img?.getBoundingClientRect();
    const shrink = thumbRect && inViewport(thumbRect) && !reducedMotion();
    img.style.transition = MOVE;
    if (shrink) place(img, thumbRect);
    else img.style.opacity = "0";
    overlay.classList.remove("cyril-zoom-open");
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setTimeout(() => {
      hideThumb(null);
      opened.current = false;
      busy.current = false;
      setView(null);
      returnFocus.current?.focus({ preventScroll: true });
    }, shrink ? MOVE_MS : 250);
  };

  const go = (delta) => {
    const v = viewRef.current;
    if (!v || busy.current || v.items.length < 2) return;
    busy.current = true;
    const img = imgRef.current;
    const nextIndex = (v.index + delta + v.items.length) % v.items.length;
    const next = v.items[nextIndex];
    zoom.current = { scale: 1, x: 0, y: 0, base: null };
    img.style.transition = MOVE;
    img.style.transform = "";
    img.style.opacity = "0";
    setTimeout(() => {
      naturalSize(next).then(([nw, nh]) => {
        currentHref.current = next.href;
        showImage(img, next, currentHref);
        img.style.transition = "none";
        img.style.objectPosition = "50% 50%";
        place(img, fitRect(nw, nh));
        setView({ ...v, index: nextIndex });
        hideThumb(next);
        history.replaceState(null, "", `#zoom-${next.id}`);
        void img.offsetWidth;
        img.style.transition = MOVE;
        img.style.opacity = "1";
        const after = v.items[(nextIndex + delta + v.items.length) % v.items.length];
        if (after) new Image().src = after.href;
        setTimeout(() => { busy.current = false; }, FADE_MS);
      });
    }, FADE_MS);
  };

  // Keyboard, wheel, and resize while open.
  useEffect(() => {
    if (!view) return;
    const onKey = (e) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if ([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.key) && e.target.tagName !== "BUTTON") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab") {
        // Keep focus inside the viewer.
        const focusable = [...overlayRef.current.querySelectorAll("button")];
        const i = focusable.indexOf(document.activeElement);
        const nextI = e.shiftKey ? (i <= 0 ? focusable.length - 1 : i - 1) : (i + 1) % focusable.length;
        e.preventDefault();
        focusable[nextI]?.focus();
      }
    };
    const onWheel = (e) => {
      e.preventDefault();
      if (zoom.current.scale > 1) return;
      close();
    };
    const onResize = () => {
      const v = viewRef.current;
      if (!v || busy.current) return;
      naturalSize(v.items[v.index]).then(([nw, nh]) => {
        imgRef.current.style.transition = "none";
        place(imgRef.current, fitRect(nw, nh));
      });
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, [view]);

  // Pointer gestures on the image: click-to-zoom with a mouse (the view
  // follows the pointer while zoomed); pinch, double-tap, pan, swipe, and
  // swipe-down-to-close on touch.
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const lastTap = useRef(0);

  const maxScale = () => {
    const img = imgRef.current;
    const v = viewRef.current;
    const t = v?.items[v.index]?.img;
    const natural = t?.naturalWidth || img.naturalWidth || img.width;
    return Math.min(Math.max(natural / img.getBoundingClientRect().width, 1.8), 5);
  };

  const zoomAt = (clientX, clientY, scale) => {
    // Called while unzoomed, so this is the image's resting rect.
    const base = imgRef.current.getBoundingClientRect();
    // Zoom toward the point: shift so that point stays under the pointer.
    const cx = base.left + base.width / 2;
    const cy = base.top + base.height / 2;
    zoom.current = { scale, x: (cx - clientX) * (scale - 1), y: (cy - clientY) * (scale - 1), base };
    setTransform();
  };

  const onPointerDown = (e) => {
    if (busy.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const pts = [...pointers.current.values()];
    if (pts.length === 2) {
      const [a, b] = pts;
      gesture.current = {
        type: "pinch",
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale: zoom.current.scale,
        x: zoom.current.x,
        y: zoom.current.y,
      };
    } else {
      gesture.current = { type: "drag", sx: e.clientX, sy: e.clientY, x: zoom.current.x, y: zoom.current.y, moved: false, pointerType: e.pointerType };
    }
  };

  const onPointerMove = (e) => {
    if (e.pointerType === "mouse" && !pointers.current.size) {
      // Mouse hover while zoomed: pan toward the pointer.
      const { scale: s, base } = zoom.current;
      if (s > 1 && base) {
        // Map the pointer's position over the resting image to the part of
        // the zoomed image to show.
        const px = Math.min(Math.max((e.clientX - base.left) / base.width, 0), 1);
        const py = Math.min(Math.max((e.clientY - base.top) / base.height, 0), 1);
        zoom.current.x = (0.5 - px) * base.width * (s - 1);
        zoom.current.y = (0.5 - py) * base.height * (s - 1);
        setTransform(false);
      }
      return;
    }
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    if (g.type === "pinch" && pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const scale = Math.min(Math.max(g.scale * (Math.hypot(a.x - b.x, a.y - b.y) / g.dist), 1), 5);
      zoom.current = { scale, x: g.x * (scale / g.scale), y: g.y * (scale / g.scale) };
      setTransform(false);
    } else if (g.type === "drag") {
      const dx = e.clientX - g.sx;
      const dy = e.clientY - g.sy;
      if (Math.abs(dx) + Math.abs(dy) > 6) g.moved = true;
      if (g.pointerType === "mouse") return;
      if (zoom.current.scale > 1) {
        zoom.current.x = g.x + dx;
        zoom.current.y = g.y + dy;
        setTransform(false);
      } else if (dy > 0 && Math.abs(dy) > Math.abs(dx)) {
        // Swipe-down-to-close feedback.
        imgRef.current.style.transition = "none";
        imgRef.current.style.transform = `translateY(${dy}px)`;
        overlayRef.current.style.setProperty("--cyril-zoom-drag", String(Math.max(1 - dy / 400, 0.3)));
      }
    }
  };

  const onPointerUp = (e) => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size) return;
    gesture.current = null;
    overlayRef.current?.style.removeProperty("--cyril-zoom-drag");
    if (!g) return;
    if (g.type === "pinch") {
      if (zoom.current.scale < 1.05) resetZoom();
      return;
    }
    const dx = e.clientX - g.sx;
    const dy = e.clientY - g.sy;
    if (g.pointerType === "mouse") {
      if (g.moved) return;
      if (zoom.current.scale > 1) resetZoom();
      else zoomAt(e.clientX, e.clientY, maxScale());
      return;
    }
    // Touch
    if (zoom.current.scale > 1) {
      if (!g.moved && performance.now() - lastTap.current < 300) resetZoom();
      lastTap.current = performance.now();
      return;
    }
    if (!g.moved) {
      if (performance.now() - lastTap.current < 300) zoomAt(e.clientX, e.clientY, Math.min(2.5, maxScale()));
      lastTap.current = performance.now();
      return;
    }
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else if (dy > 90) close();
    else resetZoom();
  };

  if (!view) return null;
  const item = view.items[view.index];
  const many = view.items.length > 1;

  return (
    <div
      ref={overlayRef}
      className="cyril-zoom"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption || "Image viewer"}
    >
      <div className="cyril-zoom-backdrop" onClick={close} />
      <img
        ref={imgRef}
        className="cyril-zoom-img"
        alt={item.caption}
        draggable={false}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
      <button ref={closeRef} type="button" className="cyril-zoom-btn cyril-zoom-close" onClick={close} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
      </button>
      {many && (
        <>
          <button type="button" className="cyril-zoom-btn cyril-zoom-prev" onClick={() => go(-1)} aria-label="Previous image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button type="button" className="cyril-zoom-btn cyril-zoom-next" onClick={() => go(1)} aria-label="Next image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </>
      )}
      <div className="cyril-zoom-caption cyril-upper" aria-live="polite">
        {many && (
          <span className="cyril-zoom-count">
            {String(view.index + 1).padStart(2, "0")} / {String(view.items.length).padStart(2, "0")}
          </span>
        )}
        {item.caption && <span>{item.caption}</span>}
      </div>
    </div>
  );
};

export default ZoomViewer;
