"use client";



const VideoFigure = ({ 
  url, 
  marginTop = "cyril-mt-40",
  marginBottom = "cyril-mb-40",
  controls = true, 
  playing = true, 
  loop = true, 
  muted = true, 
  playsinline = true,
  width = "100%",
  height = "auto"
}) => {
  
  const figureClasses = `cyril-video-container ${marginTop} ${marginBottom}`;

  return (
    <figure className={figureClasses}>
      <video
        src={url}
        width={width}
        height={height}
        controls={controls}
        autoPlay={playing}
        loop={loop}
        muted={muted}
        playsInline={playsinline}
      />
      {/* Optional: Add wrapper div for YouTube aspect ratio if needed */}
      {/* { (url.includes('youtube.com') || url.includes('youtu.be')) && <div style={{ position: 'relative', paddingTop: '56.25%' }}></div> } */}
    </figure>
  );
};

export default VideoFigure;