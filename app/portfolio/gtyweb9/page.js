"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/utility/index";
import { useEffect } from "react";
import { sliderProps } from "@/utility/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

const page = () => {

  useEffect(() => {
    cyrilUtility.tpInner();
    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);
  }, []);

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page">

          {/* .container */}
          <div className="container">

            {/* top banner */}
            <div className="cyril-top-banner cyril-text-center">
              <img src="/img/portfolio/main_gty9.jpg" alt="cover" />
              <p className="cyril-upper cyril-mb-30">
                <span className="cyril-accent">UX Design</span>
              </p>
              <h2 className="cyril-mb-60">Grace to You Website, v.9</h2>
            </div>
            {/* dend of top banner */}

            {/* main content */}
            <div className="cyril-project cyril-mb-60">

              <div className="row cyril-mb-60">

                <div className="offset-lg-1-custom col-lg-9">

                  <div className="cyril-divider cyril-mb-60" />

                  <div className="row cyril-mb-20">
                    <div className="col-md-4 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Employer:</p>
                      <p className="cyril-text-sm"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Non-Profit Media Organization</p>
                    </div>
                    <div className="col-md-4 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Role:</p>
                      <p className="cyril-text-sm">User Experience Designer</p>
                    </div>
                    <div className="col-md-4 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Start / Launch Date:</p>
                      <p className="cyril-text-sm">Jan. 2015 / Jan. 2017</p>
                    </div>
                  </div>

                  <div className="cyril-divider cyril-mb-60" />

                  <h4 className="cyril-up cyril-mb-30">Project Overview:</h4>
                  <p>GTY.org is a comprehensive platform offering biblical resources, sermons, and theological content. Despite its valuable offerings, the website faces usability challenges such as outdated design elements, limited accessibility features, and a lack of intuitive navigation. This case study focuses on redesigning GTY.org to enhance user engagement and accessibility while maintaining its core mission of delivering high-quality theological content.</p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Problem Statement:</h4>
                  <dl className="w-disc">
                    <dt>Issues:</dt>
                    <dd>Outdated visual design compared to modern web standards</dd>
                    <dd>Navigation complexity leading to user frustration</dd>
                    <dd>Limited mobile responsiveness and accessibility compliance</dd>
                  </dl>
                  <p><strong>Business Need:</strong> Improve user retention and broaden audience reach by creating a more engaging and accessible digital experience</p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Research:</h4>
                  <dl className="w-disc">
                    <dt>User Insights:</dt>
                    <dd>Conducted surveys with existing users to identify pain points</dd>
                    <dd><strong>Key findings</strong>: Users struggled with finding specific sermons or resources due to unclear categorization</dd>
                  </dl>
                  <dl className="w-disc">
                    <dt>Competitive Analysis:</dt>
                    <dd>Benchmarked against similar platforms like BibleGateway.com</dd>
                    <dd>Observed trends in clean UI design, robust search functionality, and mobile-first approaches</dd>
                  </dl>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Design Process:</h4>
                  <dl className="w-disc">
                    <dt>Ideation:</dt>
                    <dd>Brainstormed solutions focusing on intuitive navigation, improved search functionality, and responsive design</dd>
                  </dl>
                  <dl className="w-disc">
                    <dt>Wireframes:</dt>
                    <dd>Created low-fidelity wireframes highlighting simplified menus and a prominent search bar</dd>
                  </dl>
                  <dl className="w-disc">
                    <dt>Prototyping:</dt>
                    <dd>Developed interactive prototypes for desktop and mobile versions using tools like Figma</dd>
                  </dl>

                  <div className="row cyril-mb-10">

                    <div className="col-xl-12">
                      <Swiper
                        {...sliderProps.projectSlider}
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
                                Oct 2014 &mdash; Nov 2014 &#40;<span className="cyril-accent">1 month</span>&#41;
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
                      
                      </Swiper>
                    </div>

                  </div>








                  <div className="row">
                    <div className="offset-lg-6 col-lg-6">
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



                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Solution:</h4>
                  <dl className="w-disc">
                    <dd>Redesigned the homepage with a clean, modern layout emphasizing key resources</dd>
                    <dd>Introduced a categorized search system with filters for sermons, books, and articles</dd>
                    <dd>Enhanced mobile responsiveness and implemented WCAG-compliant accessibility features</dd>
                  </dl>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Challenges:</h4>
                  <dl className="w-disc">
                    <dd>Balancing modern design with the traditional aesthetic expected by GTY.org's core audience</dd>
                    <dd>Ensuring seamless integration of new features without disrupting existing content</dd>
                  </dl>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Results:</h4>
                  <dl className="w-disc">
                    <dd>Increased user retention by 25% within three months post-launch</dd>
                    <dd>Positive feedback from users regarding ease of navigation and improved search functionality</dd>
                    <dd>Expanded mobile traffic by 40% due to enhanced responsiveness</dd>
                  </dl>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Reflection:</h4>
                  <p>This project highlighted the importance of aligning design solutions with both user needs and organizational goals. Future iterations could focus on incorporating personalization features like saved playlists or recommended content based on user preferences.</p>

                </div>
                {/* end of <div className="offset-lg-1-custom col-lg-9"> */}

                {/* pagination */}
                <div className="offset-lg-1-custom col-lg-9 cyril-mt-60">

                  <div className="cyril-pagination-panel">
                    <a href="#" className="cyril-button cyril-type-2 cyril-mb-30">
                      Previous Project
                    </a>
                    <a href="#" className="cyril-button cyril-mb-30">
                      Next Project
                    </a>
                  </div>

                </div>
                {/* end of pagination */}

              </div>
              {/* end of .row */}

            </div>
            {/* end of main content */}



          </div>
          {/* end of .container */}

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;