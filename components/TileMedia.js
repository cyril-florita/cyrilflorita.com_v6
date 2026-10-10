"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BLOG_GRAPHICS } from "@/components/data/blogGraphics";
import { RESOURCE_GRAPHICS } from "@/components/data/resourceGraphics";
import { imageProps, SIZES_HINT } from "@/components/imageProps";

// Each case study's thumbnail, defined once and shared by its My Work tile
// (components/PortfolioIsotope.js) and the "Next project" band on the page
// before it (CaseNext in components/case/CaseStudy.js), so the two always
// match. `shape` is the tile's cover shape (wide / square / long); `ratio`
// overrides it when the media has its own proportions.

// A looping, silent video in place of a tile's thumbnail. Shows its poster
// and downloads nothing until the tile is near the viewport (preload="none"),
// plays only while on screen, pauses when scrolled away. Reduced motion: the
// poster only. Styled like tile images (grayscale → color on hover).
export const GridVideo = ({ src, poster, label }) => {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else if (!video.paused) video.pause();
    }, { rootMargin: "200px 0px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      aria-label={label}
    />
  );
};

// A crossfading slideshow in place of a tile's thumbnail (images stacked,
// one visible at a time). `interval` = ms per image; `fade` = crossfade
// length in ms; `cut` swaps images instantly instead of fading.
// Advances only while the tile is on screen, and skips images that haven't
// loaded yet (so quick cuts never flash an empty frame); reduced motion
// shows the starting image only. Styled like tile images.
const SLIDE_MS = 2500;
// The GTY Resources tile's slideshow: a hand-picked sequence of resource
// graphics (Figs. 01, 17, 18, 34, 19, 20, 35 on /gty-resources, in this order).
const RESOURCE_SLIDES = [
  "resource-44nasmdbl",
  "resource-autumn-sale-version-1",
  "resource-autumn-sale-version-2",
  "resource-the-preachers-bible-version-2",
  "resource-autumn-sale-version-3",
  "resource-summer-sale-version-1",
  "resource-the-preachers-bible-version-3",
];
const RESOURCE_BANNERS = RESOURCE_SLIDES.map((id) => RESOURCE_GRAPHICS.find((g) => g.id === id).src);
// The GTY Blog Graphics tile's slideshow, same style: a hand-picked sequence
// (Figs. 01, 02, 03, 05, 15, 36, 56 on /gty-blog-graphics, in this order).
const BLOG_SLIDES = [
  "a-church-not-forsaken",
  "christ-gives-the-gospel",
  "inerrancy-and-evangelical-syncretism",
  "pauls-gospel-essential",
  "limitless-love",
  "is-there-a-temple-in-heaven",
  "the-inescapable-truth-about-god",
].map((id) => BLOG_GRAPHICS.find((g) => g.id === `blog-${id}`).src);
// The GTY Social Media Graphics tile's slideshow, same style (Figs. 01, 22,
// 27, 02, 26, 15, 30 on /gty-social-media-graphics, in this order).
const SOCIAL_SLIDES = [
  "/img/portfolio/gty-social_train-tracks---Light-of-God's-Truth.jpg",
  "/img/portfolio/gty-social_slant---Advancing-His-Kingdom.jpg",
  "/img/portfolio/gty-social_circle---Free-Offer-of-the-Gospel.jpg",
  "/img/portfolio/gty-social_masked-slant---Scriptures-Absolute,-Inerrant-Authority.jpg",
  "/img/portfolio/gty-social_california---Worry-is-the-Sin.jpg",
  "/img/portfolio/gty-social_hexagon---Know-Christ-As-Lord.jpg",
  "/img/portfolio/gty-social_layers---Christ-Is-Lord.jpg",
];
const GridSlideshow = ({ images, label, interval = SLIDE_MS, fade, cut = false }) => {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = null;
    const stop = () => { clearInterval(timer); timer = null; };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !timer) {
        timer = setInterval(() => setActive((i) => {
          const imgs = el.querySelectorAll("img");
          for (let step = 1; step < imgs.length; step++) {
            const next = (i + step) % imgs.length;
            if (imgs[next].complete && imgs[next].naturalWidth) return next;
          }
          return i;
        }), interval);
      } else if (!entry.isIntersecting) stop();
    });
    observer.observe(el);
    return () => { observer.disconnect(); stop(); };
  }, [images.length, interval]);
  return (
    <span ref={ref} className={`cyril-grid-slideshow${cut ? " is-cut" : ""}`} style={fade ? { "--slide-fade": `${fade}ms` } : undefined} role="img" aria-label={label}>
      {images.map((src, i) => (
        <img
          key={src}
          {...imageProps(src, SIZES_HINT.gridTile)}
          alt=""
          loading="lazy"
          decoding="async"
          className={i === active ? "is-active" : undefined}
        />
      ))}
    </span>
  );
};

// A phone in 3D perspective playing a screen recording (CSS 3D, animated
// with GSAP). While the tile is on screen the video plays and — on desktop
// with a mouse — the camera pushes in dramatically on the screen and pulls
// back out on a loop; hovering pauses it and turns the phone toward the
// pointer. Tablet
// and mobile get a still tilt (no continuous motion there); reduced motion
// gets the still tilt and the poster only. Styles: .cyril-phone3d.
const GridPhone3D = ({ src, poster, label }) => {
  const stageRef = useRef(null);
  const deviceRef = useRef(null);
  const videoRef = useRef(null);
  useEffect(() => {
    const stage = stageRef.current, device = deviceRef.current, video = videoRef.current;
    if (!stage || !device || !video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches && window.innerWidth > 1200;
    gsap.set(device, { scale: 0.95, rotationY: -24, rotationX: 10, rotationZ: 2, transformPerspective: 1200 });
    if (reduce || !("IntersectionObserver" in window)) return;

    // A dramatic push-in: from the whole tilted phone to a close-up of the
    // screen, a beat there, then a pull back out that swings to the other
    // side — and around again.
    const sway = animate
      ? gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "power3.inOut" } })
          .to(device, { scale: 1.75, rotationY: -4, rotationX: 2, rotationZ: 0, y: 40, duration: 1.8 })
          .to(device, { scale: 1.85, rotationY: 3, y: 10, duration: 1.6, ease: "sine.inOut" })
          .to(device, { scale: 0.95, rotationY: 22, rotationX: 8, rotationZ: -2, y: 0, duration: 1.8 })
          .to(device, { rotationY: 16, y: -6, duration: 1.2, ease: "sine.inOut" })
          .to(device, { scale: 1.7, rotationY: 5, rotationX: 3, rotationZ: 0, y: -30, duration: 1.8 })
          .to(device, { scale: 1.8, rotationY: -3, y: -10, duration: 1.4, ease: "sine.inOut" })
          .to(device, { scale: 0.95, rotationY: -24, rotationX: 10, rotationZ: 2, y: 0, duration: 1.8 })
          .to(device, { rotationY: -18, y: -6, duration: 1.2, ease: "sine.inOut" })
      : null;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { video.play().catch(() => {}); sway?.play(); }
      else { if (!video.paused) video.pause(); sway?.pause(); }
    }, { rootMargin: "100px 0px" });
    observer.observe(stage);

    // Desktop: turn toward the pointer while hovering, ease back after.
    const tile = stage.closest(".cyril-portfolio-item, .cyril-case-next") || stage;
    const onMove = (e) => {
      if (!animate) return;
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
      sway.pause();
      gsap.to(device, { scale: 1.05, rotationY: nx * 30 - 4, rotationX: -ny * 18 + 4, rotationZ: 0, y: -6, duration: 0.6, ease: "power2.out", overwrite: "auto" });
    };
    const onLeave = () => {
      if (!animate) return;
      gsap.to(device, { scale: 0.95, rotationY: -24, rotationX: 10, rotationZ: 2, y: 0, duration: 0.9, ease: "power2.out", overwrite: "auto", onComplete: () => sway.restart() });
    };
    tile.addEventListener("pointermove", onMove);
    tile.addEventListener("pointerleave", onLeave);
    return () => {
      observer.disconnect(); sway?.kill(); gsap.killTweensOf(device);
      tile.removeEventListener("pointermove", onMove); tile.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return (
    <span ref={stageRef} className="cyril-phone3d" role="img" aria-label={label}>
      <span className="cyril-phone3d-rings" aria-hidden="true">
        {Array.from({ length: 16 }, (_, i) => <i key={i} />)}
      </span>
      <span ref={deviceRef} className="cyril-phone3d-device">
        <video ref={videoRef} src={src} poster={poster} preload="none" muted loop playsInline />
        <span className="cyril-phone3d-glass" aria-hidden="true" />
        <span className="cyril-phone3d-island" aria-hidden="true" />
      </span>
    </span>
  );
};

export const TILE_MEDIA = {
  // Viteo (lab concept): the product, flow by flow.
  "/viteo": {
    kind: "slideshow", label: "Viteo prototype: landing, quiz, plan, checkout and account",
    images: [
      "/img/portfolio/viteo_desktop-landing.jpg",
      "/img/portfolio/viteo_desktop-quiz.jpg",
      "/img/portfolio/viteo_desktop-quiz-building.jpg",
      "/img/portfolio/viteo_desktop-plan.jpg",
      "/img/portfolio/viteo_desktop-checkout-review.jpg",
      "/img/portfolio/viteo_desktop-checkout-confirmed.jpg",
      "/img/portfolio/viteo_desktop-account.jpg",
      "/img/portfolio/viteo_desktop-hero-grove-light.jpg",
    ],
    interval: 1250, fade: 600,
    shape: "wide",
  },
  "/hunger-action-month-dashboard": {
    kind: "video", src: "/img/portfolio/chf-ham-dashboard_preview.mp4", poster: "/img/thumbs/portfolio/chf-ham-dashboard_preview-poster.webp", label: "Hunger Action Month Campaign Dashboard preview",
    shape: "square",
  },
  "/hunger-action-month": {
    kind: "video", src: "/img/portfolio/chf-hunger-action-month_preview.mp4", poster: "/img/thumbs/portfolio/chf-hunger-action-month_preview-poster.webp", label: "Hunger Action Month landing page preview",
    shape: "wide",
  },
  // The brand's story (final mark → on its blue photo → in the sunset photo → merchandise → the live page), crossfading.
  "/grace-stream": {
    kind: "slideshow", label: "Grace Stream brand, from mark to merchandise and the live page",
    images: [
      "/img/portfolio/grace-stream_logo-2.jpg",
      "/img/portfolio/grace-stream_logo.jpg",
      "/img/portfolio/thumb_grace-stream-square.jpg",
      "/img/portfolio/grace-stream_merch-mug.jpg",
      "/img/portfolio/grace-stream_merch-tote.jpg",
      "/img/portfolio/grace-stream_merch-cap.jpg",
      "/img/portfolio/thumb_grace-stream-website-square.jpg",
    ],
    interval: 1250, fade: 600,
    shape: "square",
  },
  "/gty_v9": {
    kind: "video", src: "/img/portfolio/gty9_preview.mp4", poster: "/img/thumbs/portfolio/gty9_preview-poster.webp", label: "Grace to You preview",
    shape: "wide",
  },
  "/gty_v8": {
    kind: "video", src: "/img/portfolio/gty8_homepage_min.mp4", poster: "/img/thumbs/portfolio/gty8_homepage_min-poster.webp", label: "Grace to You (v.8) homepage preview",
    shape: "wide",
  },
  "/giving-tuesday": {
    kind: "video", src: "/img/portfolio/chf-giving-tuesday_preview.mp4", poster: "/img/thumbs/portfolio/chf-giving-tuesday_preview-poster.webp", label: "Giving Tuesday Campaign landing page preview",
    shape: "wide",
  },
  "/gty-app-landing": {
    kind: "video", src: "/img/portfolio/gty-app-landing_min.mp4", poster: "/img/thumbs/portfolio/gty-app-landing_min-poster.webp", label: "GTY App Landing Page preview",
    shape: "wide", ratio: "640 / 488",
  },
  "/volunteer-leadership-team": {
    kind: "video", src: "/img/portfolio/chf-volunteer-leadership_preview.mp4", poster: "/img/thumbs/portfolio/chf-volunteer-leadership_preview-poster.webp", label: "Volunteer Leadership Team landing page preview",
    shape: "wide",
  },
  "/35-day-generosity-challenge": {
    kind: "video", src: "/img/portfolio/chf-35-day-generosity_preview-v2.mp4", poster: "/img/thumbs/portfolio/chf-35-day-generosity_preview-v2-poster.webp", label: "35-Day Generosity Challenge landing page preview",
    shape: "wide",
  },
  // The brand's story (logo → YouTube → merchandise → Apple Podcasts → the website), crossfading like Grace Stream.
  "/truth-matters": {
    kind: "slideshow", label: "Truth Matters Podcast brand, from logo to merchandise and the website",
    images: [
      "/img/portfolio/truth-matters_logo.jpg",
      "/img/portfolio/thumb_truth-matters-youtube-square.jpg",
      "/img/portfolio/truth-matters_merch-cap.jpg",
      "/img/portfolio/truth-matters_merch-stickers.jpg",
      "/img/portfolio/truth-matters_merch-mug.jpg",
      "/img/portfolio/thumb_truth-matters-podcast-2.jpg",
      "/img/portfolio/thumb_truth-matters-website-square.jpg",
    ],
    interval: 1250, fade: 600,
    shape: "square",
  },
  "/gty-blog-graphics": {
    kind: "slideshow", label: "GTY blog graphics",
    images: BLOG_SLIDES,
    interval: 667, fade: 600,
    shape: "wide",
  },
  "/gty-dashboard": {
    kind: "slideshow", label: "GTY Dashboard screens",
    images: [
      "/img/portfolio/gty-dashboard-1b.jpg",
      "/img/portfolio/gty-dashboard-2a.jpg",
      "/img/portfolio/gty-dashboard-2b.jpg",
      "/img/portfolio/gty-dashboard-3.jpg",
      "/img/portfolio/gty-dashboard-4.jpg",
      "/img/portfolio/gty-dashboard-5.jpg",
    ],
    interval: 667, fade: 600,
    shape: "wide",
  },
  "/gty-social-media-graphics": {
    kind: "slideshow", label: "GTY social media graphics",
    images: SOCIAL_SLIDES,
    interval: 667, fade: 600,
    shape: "square",
  },
  // The released app playing on a phone in 3D perspective (GSAP).
  "/the-study-bible-app": {
    kind: "phone3d", src: "/img/portfolio/tsba_released-app.mp4", poster: "/img/thumbs/portfolio/tsba_released-app-poster.webp", label: "The MacArthur Study Bible app, playing on a phone",
    shape: "wide",
  },
  "/gty-resources": {
    kind: "slideshow", label: "GTY resource graphics",
    images: RESOURCE_BANNERS,
    interval: 667, fade: 600,
    shape: "wide",
  },
  "/sekihmentis": {
    kind: "image", src: "/img/portfolio/thumb_sekihmentis.jpg", alt: "Thumb - SekihMentis", kenBurns: true,
    shape: "long",
  },
  // The logo's story (iterations → final logo → on the phone), crossfading like Grace Stream.
  "/the-study-bible-app-logo": {
    kind: "slideshow", label: "The Study Bible App logo, from iterations to the app",
    images: [
      "/img/portfolio/thumb_study-bible-iterations-square.jpg",
      "/img/portfolio/thumb_study-bible-logo-square.jpg",
      "/img/portfolio/thumb_study-bible-app-logo-2.jpg",
    ],
    interval: 1250, fade: 600,
    shape: "square",
  },
  // The identity's versions and care items, dark and light alternating, ending on the logo presentation; crossfading like Grace Stream.
  "/patricia-macarthur-pastoral-care-fund": {
    kind: "slideshow", label: "The Patricia MacArthur Pastoral Care Fund logo versions, care items and presentation",
    images: [
      "/img/portfolio/thumb_patricia-macarthur-pastoral-fund.jpg",
      "/img/portfolio/patricia-macarthur_merch-card.jpg",
      "/img/portfolio/thumb_patricia-macarthur-portrait-square.jpg",
      "/img/portfolio/patricia-macarthur_merch-care-box.jpg",
      "/img/portfolio/thumb_patricia-macarthur-light-square.jpg",
      "/img/portfolio/patricia-macarthur_merch-tote.jpg",
      "/img/portfolio/thumb_patricia-macarthur-presentation-square.jpg",
    ],
    interval: 1250, fade: 600,
    shape: "square",
  },
  "/he-took-my-place": {
    kind: "image", src: "/img/portfolio/thumb_he-took-my-place.jpg", alt: "Thumb - He Took My Place", kenBurns: true,
    shape: "square",
  },
};

// Renders a project's thumbnail media (video loop, slideshow or image).
// `sizes` = display-width hint for image thumbnails.
const TileMedia = ({ slug, sizes = SIZES_HINT.gridTile }) => {
  const m = TILE_MEDIA[slug];
  if (!m) return null;
  if (m.kind === "video") return <GridVideo src={m.src} poster={m.poster} label={m.label} />;
  if (m.kind === "phone3d") return <GridPhone3D src={m.src} poster={m.poster} label={m.label} />;
  if (m.kind === "slideshow") return <GridSlideshow images={m.images} label={m.label} interval={m.interval} fade={m.fade} />;
  const img = <img {...imageProps(m.src, sizes)} alt={m.alt} loading="lazy" decoding="async" />;
  return m.kenBurns ? <span className="cyril-ken-burns">{img}</span> : img;
};

export default TileMedia;
