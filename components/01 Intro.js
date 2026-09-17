"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Banner = ( { bgImage = "/img/cyril-profile-serious-lolz.png" } ) => {
  const pathname = usePathname();
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
                  <span className="cyril-accent">Hello!</span>&nbsp;I&apos;m 
                </p>
                <h1 className="cyril-up cyril-mb-20 glitch" data-text="Cyril Florita">Cyril Florita</h1>
                <div className="cyril-short intro">
                  <p className="cyril-mb-30">
                    <strong><span className="cyril-accent">Designer</span></strong> and <strong><span className="cyril-accent">Developer</span></strong>
                  </p>
                  <div className="cyril-buttons-frame">
                    <Link href="/" className="cyril-button" onClick={(e) => {
                        e.preventDefault();

                        if (pathname === '/') {
                          document.getElementById('intro')?.classList.add('cyril-hero-exit');
                          document.getElementById('portfolio-start')?.scrollIntoView({ behavior: 'smooth' });
                          return;
                        }

                        document.body.classList.add('page-exit');
                        sessionStorage.setItem('scrollToPortfolio', 'true');
                        setTimeout(() => {
                          window.location.href = '/';
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
            <div className="cyril-about-person cyril-hero-mobile-photo cyril-mb-30">
              <img src="/img/cyril-profile-serious-lolz.png" alt="Cyril Florita" className="cyril-avatar" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Banner;