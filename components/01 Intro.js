import Link from "next/link";

const Banner = ( { bgImage = "img/cyril-profile-serious-lol.png" } ) => {
  return (
    <div className="cyril-section cyril-banner cyril-banner-right" id="intro">
      <div className="container-full">
        <div className="row no-gutters align-items-center justify-content-between">
          <div className="col-xl-7">
            <div className="cyril-p-120-120">
              <div
                className="cyril-banner-text"
                data-swiper-parallax-y={-600}
                data-swiper-parallax-duration={600}
              >
                <div
                  className="cyril-bg-title-boxed"
                  style={{ top: 0, left: "-82%" }}
                />
                <p className="cyril-upper cyril-mb-10 subheader">
                  <span className="cyril-accent">Hello!</span> I&apos;m 
                </p>
                <h1 className="cyril-up cyril-mb-20 glitch" data-text="Cyril Florita">Cyril Florita</h1>
                <div className="cyril-short intro">
                  <p className="cyril-mb-30">
                    <strong><span className="cyril-accent">Designer</span></strong> and <strong><span className="cyril-accent">Developer</span></strong>
                  </p>
                  <div className="cyril-buttons-frame">
                    <Link href="/portfolio" className="cyril-button" onClick={(e) => {
                        e.preventDefault();
                        document.body.classList.add('page-exit');
                        setTimeout(() => {
                          window.location.href = '/portfolio';
                        }, 400);
                      }}>
                      See My Work
                    </Link>
                    <Link href="mailto:cyril.florita@pm.me" className="cyril-button cyril-type-3">
                      Email Me
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-5">
            <img
              src={bgImage}
              alt="face"
              className="cyril-banner-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Banner;