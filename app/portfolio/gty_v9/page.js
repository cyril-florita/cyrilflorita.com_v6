"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const VideoFigure = dynamic(() => import('@/components/VideoFigure'), {
  ssr: false,
  // Optional: You can add a loading component here if needed
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
              <img src="/img/portfolio/main_gty9.jpg" alt="cover" />
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
                      href="/img/portfolio/gty9_redesign-overview..jpg"
                      className="cyril-project-figure float-right w-30 mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty9_redesign-overview.jpg" alt="cover" />
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
                            <img src="/img/portfolio/gty9_project-requirements.jpg" alt="cover" />
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
                        <VideoFigure url="/img/portfolio/gty9_google-analytics.mp4" />
                      </dd>
                      <dd>
                        I conducted surveys with existing users and organization employees to gather qualitative data identifying pain points, user sentiment, satisfaction, and preferences.
                        <VideoFigure url="/img/portfolio/gty9_interviews.mp4" />
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
                            <img src="/img/portfolio/gty9_content-inventory.jpg" alt="cover" />
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
                            <img src="/img/portfolio/gty9_v8-sitemap.jpg" alt="cover" />
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
                        <strong>Collaboration:</strong> After I conducted an SEO Analysis, I worked with the Chief Information Officer and the Editorial Manager to determine what should be updated, merged, archived, or even removed. This wasn't just a cleanup exercise—it was about aligning content with the mental models of real users and supporting their journeys through the site.<br /><br />
                        I laid the groundwork for ongoing content governance. I proposed a system where content could be regularly reviewed and restructured as needed, with IA guiding the progressive development of site content alongside user needs.<br /><br />
                        My goal was to create a content ecosystem that was not only clean and accessible now but could adapt and scale with the ministry's growth over time.
                        <a
                          href="/img/portfolio/gty9_content-audit-meeting.jpg"
                          className="cyril-project-figure w-50 mx-auto cyril-mt-40 cyril-mb-40 mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_content-audit-meeting.jpg" alt="cover" />
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
                        <img src="/img/portfolio/gty9_site-and-component-map.jpg" alt="cover" />
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
                        <img src="/img/portfolio/gty9_user-personas.jpg" alt="cover" />
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
                        <img src="/img/portfolio/gty9_user-journeys.jpg" alt="cover" />
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
                            <img src="/img/portfolio/gty9_user-stories.jpg" alt="cover" />
                            <div className="cyril-hover-link">
                              <i className="fa fa-search-plus" />
                            </div>
                          </div>
                        </a>
                      </dd>
                      <dd>
                        <strong>Collaboration:</strong> I worked with the Senior Software Architect and the development team to write the project backlogs—a prioritized list of features and tasks based on their importance, value to the user base & stakeholders, and business goals—out of these user stories. The backlog acts as a tool for translating high-level visions into actionable details—MVP &#40;Minimum Viable Product&#40; list of user needs and stakeholder expectations, influencing the Senior Software Architect / Project Manager and the development team through the execution phase to achieve the project's goals efficiently.
                        <a
                          href="/img/portfolio/gty9_mvp.jpg"
                          className="cyril-project-figure cyril-mt-40 cyril-mb-40 w-70 mx-auto mfp-image"
                          data-effect="mfp-zoom-in"
                        >
                          <div className="cyril-cover">
                            <img src="/img/portfolio/gty9_mvp.jpg" alt="cover" />
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
                            <img src="/img/portfolio/gty9_homepage-components.jpg" alt="cover" />
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
                            <img src="/img/portfolio/gty9_ui-inventory.jpg" alt="cover" />
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
                            <img src="/img/portfolio/gty9_design-system.jpg" alt="cover" />
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
                    <VideoFigure url="/img/portfolio/gty9_wireframes-requirements.mp4" />
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
                      <dd>Stakeholders then would be able to visualize the final project more clearly, which facilitated approvals and alignment.</dd>
                    </dl>
                  </dd>
                  <dd>
                    <strong>Time and Resource:</strong> Creating high-fidelity prototypes required significantly more effort than low-fidelity wireframes. This caused specific stakeholders to misunderstand and underappreciate the importance of this stage of the UX process in terms of project completion and timeline. And so, the stakeholders set a new but tighter deadline. As a response, the Senior Software Architect thought of outsourcing the design and development of the e-commerce aspect of the site, and also decided to bypass the UX process and the UX Designer for some of the key homepage elements&mdash;like the media player with playlist functionality&mdash;by having the Front-End Developer develop the designs on the fly.
                  </dd>
                  <dd>
                    <strong>Challenges:</strong> Balancing modern design with the traditional & clean aesthetic expected by GTY.org's core audience and stakeholders presented a challenge. Specific stakeholders wanted the simplicity and minimalism of the current site &#40;version 8&#41; to be carried over to this new version. To this UX Designer, this would be the best approach to the redesign project so as not to frustrate users when introduced to a newer site version. The Senior Software Architect, however, thought that the minimalistic direction looked like a low-fidelity design, and so decided to bypass the UX process and delegated the design to the Front-End developer. Moreover, at this point in the design process, the ministry partnered with a creative agency that focused more on branding and aesthetics rather than usability and functionality. The agency functioned as the authority over the originally implemented UX process and agile project & development process.
                  </dd>
                </dl>

                <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Reflection</h4>

                <dl className="w-disc">
                  <dt>The Role of Time in UX Projects</dt>
                  <dd>Time is a pivotal factor in UX design. Rushing or bypassing essential stages like prototyping and testing can lead to suboptimal outcomes. </dd>
                  <dd>When time is not managed effectively, design decisions may rely on assumptions rather than user data, resulting in usability issues that require costly post-launch fixes.</dd>
                  <dd>Investing time upfront in research, prototyping, and testing ensures that usability problems are identified early, reducing rework and improving the final product's quality.</dd>
                </dl>

                <dl className="w-disc">
                  <dt>Possible Consequences of Abandoning the UX Process</dt>
                  <dd>Skipping critical UX steps—such as thorough prototyping and testing can result in designs that fail to meet user needs or align with organizational goals.</dd>
                  <dd>This case study illustrates how abandoning the UX process led to confusion, inefficiencies, and delays. For instance:
                    <dl>
                      <dd>
                        The Senior Software Architect bypassed the UX designer's input, delegating design tasks directly to a Front-End developer.</dd>
                      <dd>
                        Another project member disrupting the workload and process of the rest of the team.
                      </dd>
                    </dl>
                  </dd>
                  <dd>These decisions not only compromised the design's functionality but also strained team dynamics and timelines.</dd>
                </dl>

                <dl className="w-disc">
                  <dt>The Importance of a Dedicated Project Manager</dt>
                  <dd>In this case, the absence of a project manager led to poor task prioritization and misaligned expectations. The Senior Software Architect and this UX Designer had to juggle project management responsibilities for the redesign alongside their core tasks and providing support and solutions to various departments, which further strained resources.</dd>
                  <dd>In fairness to the stakeholders, they tried to provide a project manager / coordinator. However, the provision was not technically and experientially qualified. This resulted in confusion and strain among the project team regarding what or which work gets prioritized. Furthermore, another team member &#40;developer&#41; was causing disruption to the workflow and workload of the front-end devleoper by directly working with certain stakeholders to deliver mini projects instead of consulting with the Senior Software Architect first. This team member did not deliver because of overpromising, leaving the mini project to be re-assigned to the rest of the team. </dd>
                  <dd>The lack of clear leadership resulted in delays and ultimately led stakeholders to make reactive decisions, such as letting go of this UX Designer&mdash;someone had to bear the blame for the supposed “delay” of the completion of the project.</dd>
                </dl>

                <dl className="w-disc">
                  <dt>Balancing Stakeholder Expectations</dt>
                  <dd>The project revealed tensions between modern design principles and stakeholder preferences for minimalism. Misunderstandings about design fidelity &#40;e.g., mistaking minimalism for low-fidelity work&#41; created friction that could have been mitigated through better communication and leadership.</dd>
                </dl>

                <dl className="w-disc">
                  <dt>Broader Takeaways</dt>
                  <dd>
                    <strong>Adherence to Process:</strong> Skipping or altering established UX processes can derail projects by introducing inefficiencies and compromising user-centered outcomes.
                  </dd>
                  <dd>
                    <strong>Leadership Matters:</strong> A skilled project manager ensures that all team members remain aligned with goals and timelines while mitigating risks like scope creep or stakeholder interference.
                  </dd>
                  <dd>
                    <strong>Time Management:</strong> A well-managed UX project ensures that resources are allocated efficiently, avoiding overburdening team members or delaying critical milestones.
                  </dd>

                </dl>

                <p className="cyril-mt-40 cyril-mb-100">
                  This reflection emphasizes that successful UX projects depend on careful planning, adherence to process, effective time management, and strong leadership. When these elements are neglected or disrupted, it can lead to delays, suboptimal designs, and strained team dynamics. By investing in qualified personnel and respecting the UX process, organizations can achieve better outcomes while fostering a collaborative environment that prioritizes both user satisfaction and business goals.
                </p>

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