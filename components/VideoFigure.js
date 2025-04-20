"use client";

import ReactPlayer from "react-player";

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
      <ReactPlayer
        url={url}
        width={width}
        height={height}
        controls={controls}
        playing={playing}
        loop={loop}
        muted={muted}
        playsinline={playsinline}
        config={{
          file: {
            attributes: {
              controlsList: "nodownload" 
            }
          },          
          youtube: {
            playerVars: { 
              showinfo: 0,
              rel: 0,
              modestbranding: 1 
            }
          }
        }}
        // Add wrapper for YouTube aspect ratio if needed
        // style={url.includes('youtube.com') || url.includes('youtu.be') ? { position: 'absolute', top: 0, left: 0 } : {}}
      />
      {/* Optional: Add wrapper div for YouTube aspect ratio if needed */}
      {/* { (url.includes('youtube.com') || url.includes('youtu.be')) && <div style={{ position: 'relative', paddingTop: '56.25%' }}></div> } */}
    </figure>
  );
};

export default VideoFigure;