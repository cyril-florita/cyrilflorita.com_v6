"use client";
import Isotope from "isotope-layout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import imagesLoaded from 'imagesloaded';

const PortfolioIsotope = () => {

  // Isotope
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");

    useEffect(() => {
      const grid = document.querySelector(".cyril-portfolio-grid");
      if (!grid) return;

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
        initLayout: false,
      });

      // Error handling for imagesLoaded
      imagesLoaded(".cyril-portfolio-grid")
        .on('done', function() {
          isotope.current.layout();
        })
        .on('fail', function() {
          console.error('Some images failed to load');
          isotope.current.layout(); // Layout anyway
        });

      // Cleanup
      return () => {
        if (isotope.current) {
          isotope.current.destroy();
        }
      };
    }, []);
 

  useEffect(() => {
    if (!isotope.current) return;
    
    try {
      const filter = filterKey === "*" ? "*" : `.${filterKey}`;
      isotope.current.arrange({ filter });
    } catch (error) {
      console.error('Error filtering items:', error);
    }
  }, [filterKey]);
  const handleFilterKeyChange = (key) => (e) => {
    e.preventDefault();
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
                data-filter=".fil-uix"
                className={`c-pointer ${activeBtn("fil-uix")}`}
                onClick={handleFilterKeyChange("fil-uix")}
              >
                App/Web/UI/UX
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
          <div id="gty9" data-project="gty9" className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio/gty_v9">
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty9.jpg" alt="Thumb - GTY Website, v.9" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                  {/* <div className="cyril-hover-link coming-soon">
                    <span className="cyril-upper">Coming Soon</span>
                  </div> */}
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UX Design</p>
                  <h4 className="cyril-up">GTY Website, v.9</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* wide . the study bible app */}
          <div id="thestudybible" data-project="thestudybible" className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover case-study-coming-soon">
                  <img src="/img/portfolio/thumb_the-study-bible-app.jpg" alt="Thumb - The Study Bible App" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link coming-soon">
                    <span className="cyril-upper">App Launching Soon</span>
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">App Design</p>
                  <h4 className="cyril-up">The Study Bible App</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* long . gty v8 */}
          <div id="gty8" data-project="gty8"  className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio/gty_v8">
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty8.jpg" alt="Thumb - GTY Website, v.8" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">UX Design &amp; Web Development</p>
                  <h4 className="cyril-up">GTY Website, v.8</h4>
                </div>
              </div>
            </Link>
          </div>

          

          {/* square . truth matters podcast */}
          <div id="truthmatters" data-project="truthmatters" className="cyril-grid-item fil-branding fil-uix">
            <Link legacyBehavior href="/portfolio/truth-matters">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover truth-matters">
                  <img src="/img/portfolio/thumb_truth-matters-podcast-2.jpg" alt="Thumb - Truth Matters Podcast" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding/UI/UX/Web</p>
                  <h4 className="cyril-up">Truth Matters Podcast</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . gracestream */}
          <div id="gracestream" data-project="gracestream" className="cyril-grid-item fil-branding fil-uix">
            <Link legacyBehavior href="/portfolio/grace-stream">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_grace-stream.jpg" alt="Thumb - Grace Stream" />
                  <h3>Case<br />Study</h3>
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Branding/UI/UX/Web</p>
                  <h4 className="cyril-up">Grace Stream</h4>
                </div>
              </div>
            </Link>
          </div>

          {/* square . (branding) study bible app */}
          <div id="thestudybiblelogo" data-project="thestudybiblelogo" className="cyril-grid-item fil-branding">
            <Link legacyBehavior href="/portfolio/the-study-bible-logo">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_study-bible-app-logo-2.jpg" alt="Thumb - The Study Bible App Logo" />
                  <h3>Case<br />Study</h3>
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

          {/* long . sekihmentis */}
          <div id="sekihmentis" data-project="sekihmentis" className="cyril-grid-item fil-illustration">
            <Link legacyBehavior href="/portfolio/sekihmentis">
              <div className="cyril-portfolio-item cyril-long-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_sekihmentis.jpg" alt="Thumb - SekihMentis" />
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

          {/* wide . gty dashboard */}
          <div id="gtydashboard" data-project="gtydashboard" className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio/gty-dashboard">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-dashboard.jpg" alt="Thumb - GTY Dashboard" />
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

          {/* wide . gty app . */}
          <div id="gtyapplanding" data-project="gtyapplanding" className="cyril-grid-item fil-uix">
            <Link legacyBehavior href="/portfolio/gty-app-landing">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-app-landing.jpg" alt="Thumb - GTY App Landing Page" />
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

          {/* square . illustration . he took my place */}
          <div id="hetookmyplace" data-project="hetookmyplace"  className="cyril-grid-item fil-illustration">
            <Link legacyBehavior href="/portfolio/he-took-my-place">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_he-took-my-place.jpg" alt="Thumb - He Took My Place" />
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
        
          
          
          

          

          {/* wide . marketing . blog graphics */}
          <div id="gtyblog" data-project="gtyblog" className="cyril-grid-item fil-marketing">
            <Link legacyBehavior href="/portfolio/gty-blog-graphics">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-blog.jpg" alt="Thumb - GTY Blog Graphics" />
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

          {/* wide . gty resources */}
          <div id="gtyresources" data-project="gtyresources" className="cyril-grid-item fil-marketing">
            <Link legacyBehavior href="/portfolio/gty-resources">
              <div className="cyril-portfolio-item cyril-wide-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-resources.jpg" alt="Thumb - GTY Resources" />
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

          {/* square . social media graphics */}
          <div id="gtysocialmedia" data-project="gtysocialmedia" className="cyril-grid-item fil-marketing">
            <Link legacyBehavior href="/portfolio/gty-social-media-graphics">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_gty-social-media.jpg" alt="Thumb - GTY Social Media Graphics" />
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

          {/* square . patricia macarthur */}
          <div id="patriciamacarthur" data-project="patriciamacarthur" className="cyril-grid-item fil-branding fil-illustration">
            <Link legacyBehavior href="/portfolio/patricia-macarthur-pastoral-care-fund">
              <div className="cyril-portfolio-item cyril-square-item cyril-mb-80">
                <div className="cyril-cover">
                  <img src="/img/portfolio/thumb_patricia-macarthur-pastoral-fund.jpg" alt="Thumb - The Patricia MacArthur Pastoral Care Fund Logo" />
                  <div className="cyril-hover-link">
                    <i className="fas fa-link" />
                  </div>
                </div>
                <div className="cyril-project-descr">
                  <p className="cyril-upper cyril-accent cyril-mb-10">Illustration/Branding</p>
                  <h4 className="cyril-up">The Patricia MacArthur Pastoral Care Fund</h4>
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