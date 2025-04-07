"use client";
import Isotope from "isotope-layout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";

const PortfolioIsotope = () => {
  // Isotope
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");

  useEffect(() => {
    setTimeout(() => {
      isotope.current = new Isotope(".cyril-portfolio-grid", {
        itemSelector: ".cyril-grid-item",
        percentPosition: true,
        masonry: {
          columnWidth: ".cyril-grid-item",
        },
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });
    }, 500);
  }, []);

  useEffect(() => {
    if (isotope.current) {
      filterKey === "*"
        ? isotope.current.arrange({ filter: `*` })
        : isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey]);
  const handleFilterKeyChange = (key) => () => {
    setFilterKey(key);
  };

  const activeBtn = (value) => (value === filterKey ? "cyril-current" : "");

  return (

    <Fragment>

      <div className="cyril-filter">
        <div className="container">
          <ul className="cyril-filter-links cyril-mb-30">

            <li>
              <a
                href="#"
                className={`c-pointer ${activeBtn("*")}`}
                onClick={handleFilterKeyChange("*")}
              >
                All
              </a>
            </li>

            <li>
              <a
                href="#"
                data-filter=".fil-uix"
                className={`c-pointer ${activeBtn("fil-uix")}`}
                onClick={handleFilterKeyChange("fil-uix")}
              >
                Web/App/UI/UX
              </a>
            </li>

            <li>
              <a
                href="#"
                data-filter=".fil-branding"
                className={`c-pointer ${activeBtn("fil-branding")}`}
                onClick={handleFilterKeyChange("fil-branding")}
              >
                Branding
              </a>
            </li>

            <li>
              <a
                href="#"
                data-filter=".fil-marketing"
                className={`c-pointer ${activeBtn("fil-marketing")}`}
                onClick={handleFilterKeyChange("fil-marketing")}
              >
                Marketing
              </a>
            </li>

            <li>
              <a
                href="#"
                data-filter=".fil-illustration"
                className={`c-pointer ${activeBtn("fil-illustration")}`}
                onClick={handleFilterKeyChange("fil-illustration")}
              >
                Illustration
              </a>
            </li>
          </ul>
        </div>
      </div>{/* end of .cyril-filter */}

      <div className="container">
        <div className="cyril-portfolio-grid">

          <div className="grid-sizer" />

          {/* long . gty v.9 */}
          <div className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty9.jpg" alt="cover" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UX Design</p>
                  <h4 className="cyril-up">GTY Website, v.9</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . truth matters podcast */}
          <div className="cyril-grid-item fil-branding">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_truth-matters-podcast.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding</p>
                  <h4 className="cyril-up">Truth Matters Podcast</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . gty v8 */}
          <div className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio/gtyweb8">
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty8.jpg" alt="cover" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Web Design & Front-End</p>
                  <h4 className="cyril-up">GTY Website, v.8</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . the study bible app */}
          <div className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_the-study-bible-app.jpg" alt="cover" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">App Design</p>
                  <h4 className="cyril-up">The Study Bible App</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty dashboard */}
          <div className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-dashboard.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UI Design &amp; Front-End</p>
                  <h4 className="cyril-up">GTY Dashboard</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty v8 prototye */}
          <div className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty8-prototype.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Prototyping</p>
                  <h4 className="cyril-up">GTY Website, v.8</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . sekihmentis */}
          <div className="cyril-grid-item fil-illustration">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_sekihmentis.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Illustration</p>
                  <h4 className="cyril-up">SekihMentis</h4>
                </div>
              </div>
            </Link>
          </div>
          
          {/* wide . gty app . */}
          <div className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-app-landing.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Web Design &amp; Front-End</p>
                  <h4 className="cyril-up">GTY App Landing Page</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . blog graphics */}
          <div className="cyril-grid-item fil-marketing">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-blog.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Blog Graphics</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . gracestream */}
          <div className="cyril-grid-item fil-branding">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_grace-stream.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding</p>
                  <h4 className="cyril-up">Grace Stream</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . patricia macarthur */}
          <div className="cyril-grid-item fil-branding">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_patricia-macarthur-pastoral-fund.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding</p>
                  <h4 className="cyril-up">The Patricia MacArthur Pastoral Care Fund</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . illustration . he took my place */}
          <div className="cyril-grid-item fil-illustration">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_he-took-my-place.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Illustration</p>
                  <h4 className="cyril-up">He Took My Place</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . (branding) study bible app */}
          <div className="cyril-grid-item fil-branding">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_study-bible-app-logo.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding</p>
                  <h4 className="cyril-up">The Study Bible App</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . social media graphics */}
          <div className="cyril-grid-item fil-marketing">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-social-media.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Social Media Graphics</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . gty resources */}
          <div className="cyril-grid-item fil-marketing">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-resources.jpg" alt="cover" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Marketing</p>
                  <h4 className="cyril-up">GTY Resources</h4>
                </div>
              </div>
            </Link>
          </div>

        </div>{/* end of .cyril-portfolio-grid */}
      </div>{/* end of .container */}

    </Fragment>

  );
};
export default PortfolioIsotope;