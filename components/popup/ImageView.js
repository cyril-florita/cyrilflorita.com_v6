import { Fragment, useEffect, useState } from "react";
import useClickOutside from "../../public/utility/useClickOutside";

const ImgViews = ({ close, src }) => {
  let domNode = useClickOutside(() => {
    close(false);
  });

  // Add effect to disable scrolling when popup is open
  useEffect(() => {

    // Save the current overflow value
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle;
    };

  }, []);

  return (
    <Fragment>
      <div className="mfp-bg mfp-ready" onClick={() => close(false)}></div>
      <div
        className="mfp-wrap mfp-close-btn-in mfp-auto-cursor mfp-ready"
        tabIndex={-1}
        style={{ position: "fixed" }}
      >
        <div
          className={`mfp-container mfp-s-ready mfp-iframe-holder mfp-img-container`}
        >
          <div className="mfp-content" ref={domNode}>
            <div className="mfp-iframe-scaler" style={{ paddingTop: 0, height: "auto" }}>
              <img className="mfp-img" src={src} style={{ position: "static", top: "auto", transform: "none" }} />
            </div>
            <button
              title="Close (Esc)"
              type="button"
              onClick={() => close(false)}
              className="cyril-close-lightbox"
              style={{
                transition: "box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0px 0px 0 0 rgba(255, 255, 255, 0.2)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "6px 6px 0 0 rgba(255, 255, 255, 0.2)";
              }}
            >
              ×
            </button>
          </div>
          <div className="mfp-preloader">Loading...</div>
        </div>
      </div>
    </Fragment>
  );
};

const ImageView = () => {
  const [img, setImg] = useState(false);
  const [imgValue, setImgValue] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      const a = document.querySelectorAll("a");
      a.forEach((a) => {
        if (a.href.includes("/img")) {
          if (a.getAttribute("download") === null) {
            a.addEventListener("click", (e) => {
              e.preventDefault();
              setImgValue(a.href);
              setImg(true);
            });
          }
        }
      });
    }, 1500);
  }, []);
  return (
    <Fragment>
      {img && <ImgViews close={() => setImg(false)} src={imgValue} />}
    </Fragment>
  );
};

export default ImageView;