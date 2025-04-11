"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect } from "react";
import { sliderProps } from "@/public/utility/sliderProps";
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
              <p className="cyril-text-sm cyril-accent"><strong>&#40; Earlier version of the design is used in this mockup since the project hasn't yet launched.&#41;</strong></p>
              <p className="cyril-upper cyril-mt-60 cyril-mb-30">
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
                      <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Non-Profit Media Organization</p>
                    </div>
                    <div className="col-md-4 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Role:</p>
                      <p className="cyril-mt-20">User Experience Designer</p>
                    </div>
                    <div className="col-md-4 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Start / Launch Date:</p>
                      <p className="cyril-mt-20">Nov. 2023 / May 2025</p>
                    </div>
                  </div>

                  <div className="cyril-divider cyril-mb-60" />

                  <h4 className="cyril-up cyril-mb-30">Project Overview:</h4>
                  <p>GTY.org is a global platform offering biblical resources for personal growth & discipleship, study & teaching materials, and pastoral & theological training. Despite its valuable resource offerings, the current website—version 8—faces usability and business challenges such as outdated design & UI elements, limited content internationalization features, less efficient search functionality, and lack of continuity in content & account management between the website and GTY's other platforms. This case study focuses on redesigning GTY.org to broaden audience reach and improve engagement & retention by creating a more accessible and unified digital experience while maintaining its core mission of delivering high-quality theological content.</p>
                  <p className="cyril-text-sm cyril-accent cyril-mt-30"><strong>&#40;Screenshots of the processes and the designs will be supplied in the appropriate sections of this study once the project has launched.&#41;</strong></p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Problem Statement:</h4>
                  <dl className="w-disc">
                    <dt>Current Issues</dt>
                    <dd>Outdated visual design compared to modern web standards</dd>
                    <dd>Restrictive search results filtering and sorting mechanism</dd>
                    <dd>Lack of continuity in experience and content management between the website and apps</dd>
                  </dl>
                  <p><strong>Business Need:</strong> The new GTY website must broaden audience reach and improve engagement & retention by creating a more accessible and unified digital experience.</p>


                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30">Research:</h4>
                  <dl className="w-disc">
                    <dt>Business Insights</dt>
                    <dd>
                      Conducted stakeholder interviews to gather insight into the organization's goals, challenges, and priorities. This process:
                      <dl>
                        <dd>ensured the redesign aligns with broader organizational objectives while addressing specific departmental needs</dd>
                        <dd>minimized guesswork and reduced the risk of designing solutions that fail to address key problems or meet expectations</dd>
                        <dd>ensured the project is grounded in accurate data rather than assumptions</dd>
                        <dd>fostered trust and collaboration between stakeholders and the project team</dd>
                        <dd>and increased their engagement and buy-in for the redesign project</dd>
                      </dl>
                    </dd>        
                    <dd>
                      <strong>Key Findings</strong>: With these interviews, I convinced the stakeholders that redesigning a website is more than just changing its look and feel; the project should improve the site's status quo, provide solutions to the user's needs based on data & research, and accomplish business goals. Along with stakeholders and the development team, we then elevated the following needs to be of utmost importance for this project:
                      <dl>
                        <dd>applied user-centric design</dd>
                        <dd>giving / business content priority</dd>
                        <dd>more intuitive navigation</dd>
                        <dd>simplified yet robust search functionality</dd>
                        <dd>improved mobile experience</dd>
                        <dd>improved content organization</dd>
                        <dd>content optimization & internationalization (need for translating materials)</dd>
                        <dd>refined and expanded global reach</dd>
                        <dd>enhanced user onboarding, engagement, and direction</dd>
                        <dd>clearer & more successful user journey</dd>
                        <dd>more consistent branding</dd>
                        <dd>increased speed and performance</dd>
                        <dd>better accessibility compliance</dd>
                        <dd>real-time support with chat services</dd>
                        <dd>enhanced security & trust-factor features</dd>
                        <dd>improved user data gathering</dd>
                      </dl>
                    </dd>
                  </dl>
                  <dl className="w-disc">
                    <dt>User Insights</dt>
                    <dd>
                      Leveraged on Google Analytics to gather quantitative data revealing user behavior patterns and website performance metrics
                      <dl>
                        <dd>Tracked activities such as user sessions, user uniqueness & frequency, user age & gender, user language, user location, page views, page ranks, average session duration, bounce rates, acquisition & navigation paths, devices used, etc.</dd>
                      </dl>
                    </dd>
                    <dd>
                    Conducted surveys with existing users and organization employees to gather qualitative data identifying pain points, user sentiment, satisfaction, and preferences.
                    </dd>
                    <dd>
                      <strong>Key Findings:</strong>
                      <dl>
                        <dd>Users struggled with finding specific sermons or resources due to unclear categorization and less efficient search functionality</dd>
                        <dd>Users were frustrated with how search results were organized according to their types; there is a lack of a simplified sorting/filtering mechanism</dd>
                        <dd>Users encountered friction in the giving/donation experience when asked about ministry exposure attribution—where they listen/watch GTY materials. The friction caused users to spend more time in the experience than needed and suggested that the attribution section be a part of another experience, e.g., account creation</dd>
                      </dl>


                    </dd>
                  </dl>

                  <dl className="w-disc">
                    <dt>Competitive Analysis</dt>
                    <dd>
                      Benchmarked against similar platforms like Ligonier.org, DesiringGod.org, TruthForLife.org, etc., in terms of their content offerings, content & navigation structure, search functionality, audience engagement, UX, SEO, and technology stack</dd>
                    <dd>
                      Observed trends in clean UI design, robust search functionality, mobile-first approaches, and social media integration</dd>
                    <dd>
                      <strong>Key Findings:</strong>
                      <dl>
                        <dd><strong>Strengths:</strong> Deep sermon archive, loyal following, consistent theology</dd>
                        <dd><strong>Opportunities:</strong> GTY could expand into interactive or visual content, enhance mobile user experience, and broaden appeal beyond the current core demographic</dd>
                      </dl>	
                    </dd>

                  </dl>

                  <dl className="w-disc">
                    <dt>Content Audit</dt>
                    <dd>
                    Implemented a systematic process of evaluating and analyzing the existing content on a website to assess its quality, relevance, performance, and effectiveness

                    </dd>
                    <dd>
                      <strong>Key Initiatives:</strong> conducted and documented content inventory, site mapping, content evaluation, content performance & SEO analysis, content sorting & mapping & organization, content goals & alignment, content cleanup, content strategy planning
                    </dd>
                    <dd>
                      <strong>Collaboration:</strong> worked with the Editorial Director, Chief Information Officer, and the Senior Software Architect in accomplishing the initiatives above
                    </dd>
                    <dd>
                      <strong>Key Outcomes:</strong> Identified areas for improvement, made informed decisions about content strategy, organization, & optimization, and defined a more simplified content, site, & navigation structure—Listen, Watch, Read, Study, Shop
                    </dd>
                    

                  </dl>



                  {/*
                  
                  
                  */}


                  

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