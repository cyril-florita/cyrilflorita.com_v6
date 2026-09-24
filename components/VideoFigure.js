"use client";
import { useEffect, useRef } from "react";
import VIDEO_SIZES from "@/components/data/videoSizes.json";

// Case-study video: shows a still poster and downloads nothing up front
// (preload="none"); plays (muted, looping) only while at least 40% of it is
// on screen, and pauses when it scrolls away. People who prefer reduced
// motion get the poster + controls and start it themselves. Posters and
// sizes come from components/data/videoSizes.json and
// public/img/thumbs/portfolio/<name>-poster.webp (grabbed from each video);
// the width/height let the browser reserve space before anything loads.
const posterFor = (url) =>
  url.replace("/img/portfolio/", "/img/thumbs/portfolio/").replace(/\.mp4$/i, "-poster.webp");

const VideoFigure = ({
  url,
  marginTop = "cyril-mt-40",
  marginBottom = "cyril-mb-40",
  controls = true,
  loop = true,
  muted = true,
  playsinline = true,
}) => {
  const ref = useRef(null);
  const size = VIDEO_SIZES[url];

  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.4) video.play().catch(() => {});
      else if (!video.paused) video.pause();
    }, { threshold: [0, 0.4] });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const figureClasses = `cyril-video-container ${marginTop} ${marginBottom}`;

  return (
    <figure className={figureClasses}>
      <video
        ref={ref}
        src={url}
        poster={size ? posterFor(url) : undefined}
        width={size?.[0]}
        height={size?.[1]}
        preload="none"
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline={playsinline}
      />
    </figure>
  );
};

export default VideoFigure;
