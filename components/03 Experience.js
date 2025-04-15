import { sliderProps } from "@/public/utility/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

const Experience = () => {
  return (
    <div className="cyril-section cyril-op-space-90">
      <div
        className="cyril-bg-item"
        style={{ top: 0, right: "15%", transform: "rotate(-25deg)" }}
      />
      <div
        className="cyril-bg-item"
        style={{ bottom: "15%", left: "-5%", transform: "rotate(-25deg)" }}
      />
      <div className="container">
        <p className="cyril-upper cyril-mb-20 subheader">
        &#91; My <span className="cyril-accent">career</span> in <span className="cyril-accent">18 years</span> &#93;
        </p>
        <h2 className="cyril-up">Experience</h2>

        <div className="row">

          <div className="col-xl-1">

          </div>

          <div className="col-xl-11">

            <div className="row cyril-mb-10">

              <div className="col-xl-12">
                <Swiper
                  {...sliderProps.experienceSlider}
                  className="swiper-container cyril-timeline-slider-2"
                >

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">Freelance</p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          <span className="cyril-accent">today</span>
                        </p>
                        <p>
                          Exploring the market while experimenting with new AI tools and technologies.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">
                          UX Designer &amp; Web Developer
                        </p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          Dec 2014 &mdash; Feb 2024 &#40;<span className="cyril-accent">10 years</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://www.gty.org" target="_blank"><strong>Grace to You</strong></a>, a Christian multimedia ministry in Santa Clarita, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">Product Designer</p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          Oct 2014 &mdash; Nov 2014 &#40;<span className="cyril-accent">2 months</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://www.scorpion.co" target="_blank"><strong>Scorpion Design</strong></a>, a design and marketing agency in Santa Clarita, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">
                          Web Designer &amp; Developer
                        </p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          Jan. 2011 &mdash; Oct. 2014 &#40;<span className="cyril-accent">3 years</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://www.digitalroominc.com" target="_blank"><strong>Digital Room, Inc.</strong></a>, a printing company in Van Nuys, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">
                          Senior Web Designer
                        </p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          Aug 2011 &mdash; Dec 2011  &#40;<span className="cyril-accent">4 months</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://www.printrunner.com" target="_blank"><strong>PrintRunner</strong></a>, a printing company in Van Nuys, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">
                          Web Designer
                        </p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          Apr 2009 &mdash; June 2011 &#40;<span className="cyril-accent">2 years</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://www.latimes.com/archives/la-xpm-2010-sep-22-la-fi-mighty-net-20100922-story.html" target="_blank"><strong>Mighty Net, Inc.</strong></a> &#40;now <a className="cyril-text-underline" href="https://www.experian.com/" target="_blank"><strong>Experian</strong></a>&#41;, a financial institution in Calabasas, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">
                          Junior Web Designer
                        </p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          June 2008 &mdash; Dec 2008  &#40;<span className="cyril-accent">6 months</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://www.crunchbase.com/organization/eqal" target="_blank"><strong>EQAL, Inc.</strong></a>, an entertainment company in Sherman Oaks, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">
                          Junior Front-End Developer
                        </p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          June 2007 &mdash; June 2008  &#40;<span className="cyril-accent">1 year</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://www.linkedin.com/company/whittmanhart-interactive" target="_blank"><strong>Whittman-Hart Interactive</strong></a>, a design agency in Century City, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">
                          Junior Web Designer
                        </p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          Oct 2006 &mdash; May 2007  &#40;<span className="cyril-accent">7 months</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://studiosystem.com" target="_blank"><strong>Baseline Studio System</strong></a>, an entertainment industry database company in Santa Monica, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide className="swiper-slide">
                    <div className="cyril-icon-box cyril-type-2">
                      <div className="cyril-box-text">
                        <p className="cyril-upper cyril-text-lg cyril-mb-15">
                        Quality Assurance Tester &amp; Graphic Designer
                        </p>
                        <p className="cyril-upper cyril-mb-30 cyril-text-normal">
                          Mar 2006 &mdash; Oct 2006  &#40;<span className="cyril-accent">7 months</span>&#41;
                        </p>
                        <p>
                          <a className="cyril-text-underline" href="https://www.linkedin.com/company/infospace" target="_blank"><strong>Infospace, Inc.</strong></a>, a multimedia company in Santa Monica, CA.
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>

                </Swiper>
              </div>

            </div>

          </div>

        </div>

        <div className="row">
          <div className="col-lg-6">
            &nbsp;
          </div>
          <div className="col-lg-6">
            <div className="cyril-timeline-nav-2">
              <div className="cyril-timeline-2-pagination cyril-upper cyril-mb-30" />
              <div className="cyril-slider-nav cyril-mb-30">
                <div className="cyril-prev cyril-timeline-2-prev">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
                <div className="cyril-next cyril-timeline-2-next">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
export default Experience;
