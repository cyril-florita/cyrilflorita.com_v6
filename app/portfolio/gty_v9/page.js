"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const VideoFigure = dynamic(() => import('@/components/VideoFigure'), {
  ssr: false,
  loading: () => <p>Loading video...</p> 
});

const page = () => {

  const router = useRouter();

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    cyrilUtility.tpInner();
    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);

    // Scroll Tracking
    cyrilUtility.trackScrollProgress(setScrollProgress);

  }, []);

  // Function to handle back navigation and save scroll position
  const handleBackToPortfolio = () => {
    // Get the project ID or identifier
    const projectId = 'gty9'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    router.push('/portfolio');
  };

  return (
    <SiteLayout>
      {/* Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '7px',
          width: `${scrollProgress}%`,
          backgroundColor: '#fa4729',
          zIndex: 1000,
          transition: 'width 0.1s ease-out'
        }}
      />
      <div>
        <div className="cyril-page cyril-project-page">

          {/* .container */}
          <div className="container">

            {/* top banner */}
            <div className="cyril-top-banner cyril-text-center">
              <img src="/img/portfolio/main_gty9.jpg" alt="Main Image for GTY v9" />
              <p className="cyril-text-sm cyril-accent"><strong>&#40;Earlier version of the design is used in this mockup since the project hasn't yet launched.&#41;</strong></p>

              <h2 className="cyril-mt-60">GTY Website, v.9</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">UX Design</span>
              </p>

            </div>
            {/* dend of top banner */}

            {/* main content */}
            <div className="row cyril-mb-60">

              <div className="cyril-project-content">

                <div className="cyril-divider cyril-mb-60" />

                <div className="row cyril-mb-20">
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Employer:</p>
                    <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</p>
                  </div>
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Role:</p>
                    <p className="cyril-mt-20">User Experience Designer</p>
                  </div>
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Start / Launch Date:</p>
                    <p className="cyril-mt-20">Nov. 2023 / Soon</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Project Overview</h4>
                <p>GTY.org is a Christian platform offering biblical resources for personal growth & discipleship, study & teaching materials, and pastoral & theological training. Despite its valuable resource offerings, the current website—version 8—faces usability and business challenges such as outdated design & UI elements, limited content internationalization features, less efficient search functionality, and lack of continuity in content & account management between the website and GTY's other platforms.
                </p>
                <p className="cyril-mt-40">
                  This case study focuses on redesigning GTY.org &#40;version 9&#41; to broaden audience reach and improve engagement & retention by creating a more accessible and unified digital experience while maintaining its core mission of delivering high-quality theological content.</p>
                <p className="cyril-text-sm cyril-accent cyril-mt-30"><strong>&#40;Screenshots of the processes and the designs will be supplied in the appropriate sections of this study once the project has launched.&#41;</strong></p>

                <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Problem Statement</h4>
                <p className="cyril-mb-20">The primary challenges identified for the redesign included:</p>
                <dl className="w-disc">
                  <dd>Outdated visual design compared to modern web standards</dd>
                  <dd>Restrictive search results filtering and sorting mechanism</dd>
                  <dd>
                    Lack of continuity in experience, content presentation, and account management between GTY's website and its apps
                    <VideoFigure url="/img/portfolio/gty9_problem-statement.mp4" />
                  </dd>
                </dl>

                <p className="cyril-mt-40">
                  <strong>Business Need:</strong> The new GTY website must broaden audience reach and improve engagement & retention, by optimizing its content architecture and unifying its user experience with all of GTY's digital platforms.
                </p>

                <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Research</h4>

                <dl className="no-disc">
                  <dt>Business Insights</dt>
                  <dd>
                    <a
                      href="/img/portfolio/gty9_redesign-overview.jpg"
                      className="cyril-project-figure float-right w-30 mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty9_redesign-overview.jpg" alt="redesign overview" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                    I conducted stakeholder interviews to gather insight into the organization's goals, challenges, and priorities. This process:
                    <dl className="w-disc">
                      <dd>ensured the redesign aligns with broader organizational objectives while addressing specific departmental needs</dd>
                      <dd>minimized guesswork and reduced the risk of designing solutions that fail to address key problems or meet expectations</dd>
                      <dd>ensured the project is grounded in accurate data rather than assumptions</dd>
                      <dd>fostered trust and collaboration between stakeholders and the project team</dd>
                      <dd>and increased their engagement and buy-in for the redesign project</dd>
                      <dd>
                      <a
                          href="/img/portfolio/gty9_project-requirements.jpg"
                          className="clearfix cyril-project-figure float-right w-30 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_project-requirements.jpg" alt="project requirements" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>

                        <strong>Key Findings</strong>: With these interviews, I convinced the stakeholders that redesigning a website is more than just changing its look and feel; the project should improve the site's status quo, provide solutions to the user's needs based on data & research, and accomplish business goals. Along with stakeholders and the development team, we then elevated the following needs to be of utmost importance for this project:

                        <dl className="w-disc">
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
                  </dd>
                </dl>

                <dl className="no-disc">
                  <dt>User Insights</dt>
                  <dd>
                    I leveraged Google Analytics to gather quantitative data revealing user behavior patterns and website performance metrics.
                    <dl className="w-disc">
                      <dd>
                        I tracked activities such as user sessions, user uniqueness &amp; frequency, user age & gender, user language, user location, page views, page ranks, average session duration, bounce rates, acquisition & navigation paths, devices used, etc.
                        
                        <a
                          href="/img/portfolio/gty9_analytics.jpg"
                          className="clearfix cyril-project-figure cyril-mt-40 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_analytics.jpg" alt="analytics" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </dd>
                      <dd>
                        I conducted surveys with existing users and organization employees to gather qualitative data identifying pain points, user sentiment, satisfaction, and preferences.
                        <a
                          href="/img/portfolio/gty9_interviews.jpge"
                          className="clearfix cyril-project-figure cyril-mt-40 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_interviews.jpg" alt="interviews" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </dd>
                      <dd>
                        <strong>Key Findings:</strong>
                        <dl className="w-disc">
                          <dd>Users struggled with finding specific sermons or resources due to unclear categorization and less efficient search functionality</dd>
                          <dd>Users were frustrated with how search results were organized according to their types; there is a lack of a simplified sorting/filtering mechanism</dd>
                          <dd>Users encountered friction in the giving/donation experience when asked about ministry exposure attribution—where they listen/watch GTY materials. The friction caused users to spend more time in the experience than needed and suggested that the attribution section be a part of another experience, e.g., account creation</dd>
                        </dl>
                      </dd>

                    </dl>
                  </dd>


                </dl>

                <dl className="no-disc">
                  <dt>Competitive Analysis</dt>
                  <dd>
                    I benchmarked GTY.org against similar platforms like Ligonier.org, DesiringGod.org, TruthForLife.org, etc., in terms of their content offerings, content & navigation structure, search functionality, audience engagement, UX, SEO, and technology stack.
                    <VideoFigure url="/img/portfolio/gty9_tech-stack.mp4" />
                  </dd>
                  <dd>
                    <dl className="w-disc">
                        <dd>
                        I then observed trends in clean UI design, robust search functionality, mobile-first approaches, and social media integration.</dd>
                      <dd>
                        <strong>Key Findings:</strong>
                        <dl className="w-disc cyril-mar">
                          <dd><strong>Strengths:</strong> GTY has deep sermon archive, loyal following, and consistent theology</dd>
                          <dd><strong>Opportunities:</strong> GTY could expand into interactive or visual content, enhance mobile user experience, and broaden appeal beyond the current core demographic</dd>
                        </dl>
                      </dd>
                    </dl>
                  </dd>
                  

                </dl>

                <dl className="no-disc">
                  <dt>Content Audit &amp; Information Architecture</dt>
                  <dd>
                    
                    <dl className="w-disc">
                      <dd>
                        <strong>Mapping the Content Landscape: </strong>I approached the redesign through the lens of Information Architecture &#40;IA&#41; to ensure not just the quality of the content, but its structure, findability, and overall usability.
                      </dd>
                      <dd>
                        <strong>Key Initatives:</strong> I started by cataloging the entire site and content ecosystem&mdash;sermons, devotionals, articles, videos, and radio archives. I categorized all the content by their type&mdash;page, audio, video, image, and product. I also laid the current site map for to see and show the team how content and pages are interconnected in the site's ecosystem. For each content item, I noted key details: title, URL, content type, topic hierarchy, metadata, and how it fit within the existing navigation. This gave me a birds-eye view of what was there, what was working, and what wasn't.
                        <a
                          href="/img/portfolio/gty9_content-inventory.jpg"
                          className="cyril-project-figure cyril-mt-40 cyril-mb-40 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_content-inventory.jpg" alt="content inventory" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                        <a
                          href="/img/portfolio/gty9_v8-sitemap.jpg"
                          className="cyril-project-figure cyril-mt-40 cyril-mb-40 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_v8-sitemap.jpg" alt="sitemap" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                        Doing these allowed me to visualize the current information structure and begin reshaping it into something more intuitive. It wasn't just about what content existed—it was about how it was organized and how users could logically navigate through it.
                      </dd>
                      <dd>
                    <strong>Evaluating Content Through a UX Lens:</strong> From there, I assessed each piece of content for clarity, relevance, and engagement. Was it still accurate? Was it performing well? Did it actually meet user needs?
                    <dl>
                      <dd>
                        <strong>Collaboration:</strong> After I conducted an SEO Analysis, I worked with key stakeholders to determine what should be updated, merged, archived, or even removed. This wasn't just a cleanup exercise—it was about aligning content with the mental models of real users and supporting their journeys through the site.<br /><br />
                        I laid the groundwork for ongoing content governance. I proposed a system where content could be regularly reviewed and restructured as needed, with IA guiding the progressive development of site content alongside user needs.<br /><br />
                        My goal was to create a content ecosystem that was not only clean and accessible now but could adapt and scale with the ministry's growth over time.
                        <a
                          href="/img/portfolio/gty9_content-audit-meeting.jpg"
                          className="cyril-project-figure w-50 mx-auto cyril-mt-40 cyril-mb-40 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_content-audit-meeting.jpg" alt="content audit" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </dd>
                    </dl>

                  </dd>

                  <dd>
                    <strong>Restructuring for Discoverability</strong>: Applying IA principles, I began shaping a clearer hierarchy and navigation system. I redefined categories based on user behavior and logical groupings, ensuring that pathways to content felt natural and easy to predict.
                    <br /><br />
                    I also refined labeling across the board—using language that was more human, less technical or internal. Moreover, I started identifying possible UI components that would solve how different content are presented. This step was crucial in improving not only the navigation and the search, but also GTY design system, while reducing friction for first-time users and longtime visitors alike.
                    <a
                      href="/img/portfolio/gty9_site-and-component-map.jpg"
                      className="cyril-project-figure cyril-mt-40 cyril-mb-40 mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty9_site-and-component-map.jpg" alt="site and component map" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>

                  </dd>

                  <dd>
                    <strong>Key Outcomes:</strong> Integrating IA into the content audit gave me a more strategic, user-centered framework to work from. It turned what could have been a backend cleanup into a critical UX touchpoint&mdash;ensuring that every piece of content had purpose, place, and value within the larger experience.<br /><br />
                    Working with the team and key stakeholders, I identified areas for improvement, made informed decisions about content strategy, organization, & optimization, and defined a more simplified content, site, & navigation structure&mdash;<strong>Listen, Watch, Read, Study, Shop.</strong>
                  </dd>
                    </dl>
                    
                  </dd>

                  
                </dl>

                <div className="cyril-divider cyril-mt-60 cyril-mb-60 clearfix" />

                <h4 className="cyril-up cyril-text-center">Design Process</h4>
                <dl className="w-disc">
                  <dt>User Personas, Journeys, and Stories</dt>
                  <dd>
                    I created user personas to represent the wants, needs, and behavior patterns of GTY's target audience.
                    <dl>
                      <dd>These personas were used throughout the design and development process—from deciding on features to include in the design, to evaluating feature requirements—to ensure we're making intelligent, practical, and usable design and development solutions.</dd>
                    </dl>
                    <a
                      href="/img/portfolio/gty9_user-personas.jpg"
                      className="cyril-project-figure cyril-mt-40 cyril-mb-40 w-70 mx-auto mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty9_user-personas.jpg" alt="user personas" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </dd>
                  <dd>
                    I then mapped user journeys to visualize the user's interactions across GTY's multiple platforms &#40;apps, social media, etc.&#41; and over an extended period of time, from initial awareness to post-purchase/donation engagement.
                    <dl>
                      <dd>These journeys helped GTY understand the user's needs, pain points, and decision-making process so they can have an optimized experience that will increase content consumption and drive conversions or business success.</dd>
                    </dl>
                    <a
                      href="/img/portfolio/gty9_user-journeys.jpg"
                      className="cyril-project-figure cyril-mt-40 cyril-mb-40 w-70 mx-auto mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty9_user-journeys.jpg" alt="user journeys" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </dd>
                  <dd>
                    I wrote user stories to express requirements in GTY's Agile software development and to describe features told from the perspective of the person&mdash;usually a user or a stakeholder&mdash;who desires a feature on a website so that they would be easily understandable to both developers and stakeholders.
                    <dl>
                      <dd>
                        <strong>Key Initiatives:</strong> I used these user stories as the basis for discussions, planning, and prioritization in GTY's agile development processes and as the basis for the project goals and principles.
                        <a
                          href="/img/portfolio/gty9_user-stories.jpg"
                          className="cyril-project-figure cyril-mt-40 cyril-mb-40 w-70 mx-auto mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_user-stories.jpg" alt="user stories" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </dd>
                      <dd>
                        <strong>Collaboration:</strong> I worked with the Senior Software Architect and the development team to write the project backlogs—a prioritized list of features and tasks based on their importance, value to the user base & stakeholders, and business goals—out of these user stories. The backlog acts as a tool for translating high-level visions into actionable details—MVP &#40;Minimum Viable Product&#41; list of user needs and stakeholder expectations, influencing the team through the execution phase to achieve the project's goals efficiently.
                        <a
                          href="/img/portfolio/gty9_mvp.jpg"
                          className="cyril-project-figure cyril-mt-40 cyril-mb-40 w-70 mx-auto mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_mvp.jpg" alt="project mvp" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </dd>
                    </dl>
                  </dd>
                </dl>

                <dl className="w-disc">
                  <dt>Ideation</dt>
                  <dd>
                    I collaborated with the development team to identify UI elements that would make the development process more efficient and more aligned with the GTY's technology stack. This collaboration also prepared the project team for the creation and development of the GTY's style guide and design system.
                    <div className="row">
                      <div className="offset-md-2 col-md-8">
                        <a
                          href="/img/portfolio/gty9_homepage-components.jpg"
                          className="cyril-project-figure cyril-mt-40 cyril-mb-20 w-80 mx-auto mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_homepage-components.jpg" alt="homepage components" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className="col-md-6">
                        <a
                          href="/img/portfolio/gty9_ui-inventory.jpg"
                          className="cyril-project-figure cyril-mt-40 cyril-mb-20 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_ui-inventory.jpg" alt="ui inventory" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className="col-md-6">
                        <a
                          href="/img/portfolio/gty9_design-system.jpg"
                          className="cyril-project-figure cyril-mt-40 cyril-mb-20 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_design-system.jpg" alt="design system" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </dd>
                  <dd>
                    I brainstormed and researched solutions focusing on intuitive navigation, improved search functionality, and mobile-first / progressive web application design approach where the mobile version of the site will look and feel like a native Apple or Android app. I then presented these ideas to the Senior Software Architect and the development team to validate my ideas.
                    <VideoFigure url="/img/portfolio/gty9_progressive-web-app.mp4" />
                  </dd>
                  <dd>
                    Having clearer insights and strategies for information architecture, UI/UX, and technology stack, I then designed 3 sets of homepage mockups. These were aimed to facilitate collaboration and foster alignment with the development team and stakeholders&mdash;to establish the design direction, especially in terms of layout, typography, and color. This step was necessary to ensure that the design and development process were moving in the same direction, and also to prepare and avoid any misunderstandings from the stakeholders about the next process of creating low-fidelity wireframes and prototypes.
                    <VideoFigure url="/img/portfolio/gty9_hi-fi-mockups.mp4" />
                  </dd>
                </dl>

                <dl className="w-disc">
                  <dt>Wireframes</dt>
                  <dd>
                    <strong>Collaboration:</strong> I worked closely with the Senior Software Architect and the development team to definine and organize UI elements, components, pages, journeys into wireframe requirements, preparing and serving as the basis for the further development of GTY's design system.
                    <a
                      href="/img/portfolio/gty9_wireframe-requirements.jpg"
                      className="cyril-project-figure cyril-mt-40 mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty9_wireframe-requirements.jpg" alt="wireframe requirements" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>                   
                  </dd>
                  <dd>
                    I then designed low-fidelity wireframes focusing on the structure, functionality, and placement of key content and elements without delving into visual details like colors, typography, or images. These wireframes served as blueprints for the design, helping the development team and stakeholders visualize the flow and hierarchy of content before moving into more detailed stages of providing mockups and prototypes.
                    <VideoFigure url="/img/portfolio/gty9_wireframes.mp4" />
                  </dd>
                  <dd>
                    <strong>Key Outcomes:</strong> The wireframes helped the development team and the stakeholders reach a common understanding by clearly communicating the prioritization and placement of specific resources and content and how UIs will function.
                  </dd>
                </dl>

                <dl className="w-disc">
                  <dt>Prototyping</dt>
                  <dd>After getting alignment from the stakeholders about the hierarchy and presentation of the content on the homepage and other important pages via the wireframes, I designed high-fidelity interactive prototypes for mobile, tablet, laptop/desktop screens using Axure RP to simulate user interactions, test usability, and refine designs before development.
                    <dl>
                      <dd>These prototypes closely represented what would be the final version of the design, including detailed UI elements &amp; functionality, typography, color schemes, and animations.</dd>
                      <dd>
                        Stakeholders then would be able to visualize the final project more clearly, which facilitated approvals and alignment.                        
                      </dd>
                    </dl>
                  </dd>
                  <dd>
                    <strong>Challenges:</strong> Balancing modern design with the traditional & clean aesthetic expected by GTY.org's core audience and stakeholders presented a challenge. Specific stakeholders wanted the simplicity and minimalism of the current site &#40;version 8&#41; to be carried over to this new version. To this UX Designer, this would be the best approach to the redesign project so as not to frustrate users when introduced to a newer site version.
                  </dd>
                  <dd>
                    <strong>Design Handoff:</strong> Working closely with the Senior Software Architect, and as the stakeholders would approve of the high-fidelity prototypes&mdash;each screen, interaction, and animation closely mirroring the intended GTY v9 experience&mdash I would hand them off to development team to ensure a smooth transition to the development phase of our Agile process.
                  </dd>
                </dl>

                <p className="cyril-text-sm cyril-accent"><strong>&#40;Video/screenshots of the high-fidelity prototypes will provided once the project launches.&#41;</strong></p>

                <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Reflection</h4>

                <dl className="no-disc">
                  <dd>As the UX designer for GTY v9, I've learned that rigorously following a structured UX process isn't just a &ldquo;nice to have&rdquo;&mdash;it's the very foundations of delivering design solutions that truly resonate with the users and the organization's business goals:
                    <dl className="w-disc">
                      <dd>
                        <strong>It Ensures User-Centered Clarity: </strong> By starting every project with discovery &#40;user research, competitive audits, stakeholder interviews&#41;, I grounded decisions in real needs rather than assumptions. This kept the team focused on solving the right problems from day one.
                      </dd>
                      <dd>
                        <strong>It Reduces Risk and Rework:</strong> Iterative validation—through wireframes, prototypes, and usability testing—catches misunderstandings long before development begins. That early feedback loop prevents costly late-stage pivots and scope creep.
                      </dd>
                      <dd>
                        <strong>It Aligns Cross-Functional Teams:</strong> A well-documented process &#40;personas, journey maps, annotated prototypes&#41; creates a shared language among stakeholders and the development team. Handoffs become seamless when everyone sees the “why” behind UI and content interactions, and expectations stay realistic.
                      </dd>
                      <dd>
                        <strong>It Drives Consistency at Scale:</strong> Producing and maintaining a design system and a style guide within the UX process means components, patterns, and behaviors remain uniform across features and platforms. That consistency builds user trust and simplifies future enhancements.
                      </dd>
                      <dd>
                        <strong>It Delivers Measurable Impact: </strong>Embedding analytics and success metrics into every phase—from validating problem statements to post-launch monitoring—ensures we can prove how design changes improve key KPIs &#40;engagement, retention, conversion&#41;. It turns UX from an art into a data-backed investment.
                      </dd>
                    </dl>

                  </dd>
                  <dd>
                    By adhering to this process end-to-end, I not only championed better experiences for GTY users but also helped the team to work more efficiently, innovate confidently, and ultimately deliver design solutions that drive real project value. More importantly, every wireframe, prototype, and interaction was purposely built to present biblical content in clear and engaging ways&mdash;staying true to the ministry's commitment of &ldquo;Unleashing God's Truth, One Verse at a Time.&rdquo;
                  </dd>
                </dl>

                
                {/* pagination */}
                <div className="cyril-pagination-panel cyril-mt-60">
                  <button
                    onClick={handleBackToPortfolio}
                    className="cyril-button cyril-type-2 cyril-mb-30"
                  >
                    <svg className="cyril-prev" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    Back to Portfolio
                  </button>
                </div>
                {/* end of pagination */}

              </div>
              {/* end of <div className="offset-lg-1-custom col-lg-9"> */}

            </div>
            {/* end of .row */}
            {/* end of main content */}

          </div>
          {/* end of .container */}

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;