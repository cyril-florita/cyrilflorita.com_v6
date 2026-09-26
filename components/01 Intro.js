"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cyrilUtility } from "@/public/utility/index";
import { Fragment } from "react";

const HEADLINE = "Cyril Florita";

// WebP (82 KB, keeps the transparency) instead of the 686 KB PNG original.
const Banner = ( { bgImage = "/img/cyril-florita-profile.webp" } ) => {
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
                {/* Pre-split into letters (the same markup splitChars()
                    builds for other titles) so the first-load entrance can
                    type it in — see scrambleInTitle / .cyril-split. */}
                <h1 className="cyril-up cyril-mb-20 glitch cyril-split" data-text={HEADLINE} aria-label={HEADLINE}>
                  {HEADLINE.split(' ').map((word, w, words) => (
                    <Fragment key={w}>
                      <span className="cyril-word" aria-hidden="true">
                        {word.split('').map((char, c) => (
                          <span key={c} className="cyril-char">{char}</span>
                        ))}
                      </span>
                      {w < words.length - 1 && ' '}
                    </Fragment>
                  ))}
                </h1>
                <div className="cyril-short intro">
                  <p className="cyril-mb-10">
                    <strong><span className="cyril-accent">Designer</span></strong> and <strong><span className="cyril-accent">Developer</span></strong>
                  </p>
                  {/* Scope line — sets the focus (web, brand, front-end) so the
                      headline doesn't read as UX/product design. */}
                  <p className="cyril-mb-30 cyril-hero-scope">
                    I design, build, and ship digital experiences that convert and <span style={{ whiteSpace: "nowrap" }}>perform&mdash;faster</span> and more efficiently with AI tools these days.
                  </p>
                  <div className="cyril-buttons-frame">
                    <Link href="/" className="cyril-button" onClick={(e) => {
                        e.preventDefault();

                        if (pathname === '/') {
                          document.getElementById('intro')?.classList.add('cyril-hero-exit');
                          document.getElementById('portfolio-start')?.scrollIntoView({ behavior: 'smooth' });
                          return;
                        }

                        sessionStorage.setItem('scrollToPortfolio', 'true');
                        cyrilUtility.handlePageTransition().then(() => {
                          window.location.href = '/';
                        });
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
              fetchPriority="high"
              alt="Cyril Florita"
              className="cyril-banner-image"
            />
            <div className="cyril-about-person cyril-hero-mobile-photo cyril-mb-30">
              <img src={bgImage} alt="Cyril Florita" className="cyril-avatar" fetchPriority="high" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Banner;