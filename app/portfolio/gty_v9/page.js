"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect, useState } from "react";
import { sliderProps } from "@/public/utility/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

const page = () => {
  // Add state for scroll progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    cyrilUtility.tpInner();
    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);

    // Use the utility function for scroll tracking
    cyrilUtility.trackScrollProgress(setScrollProgress);

  }, []);

  return (
    <SiteLayout>
      {/* Add progress bar at the top of the page */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '7px',
          width: `${scrollProgress}%`,
          backgroundColor: '#fa4729', // You can change this to match your theme
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
              
              <h2 className="cyril-mt-60">Grace to You Website, v.9</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">UX Design</span>
              </p>

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

                  <h4 className="cyril-up cyril-mb-30 cyril-text-center">Project Overview</h4>
                  <p>GTY.org is a Christian platform offering biblical resources for personal growth & discipleship, study & teaching materials, and pastoral & theological training.</p>
                  <p>
                  Despite its valuable resource offerings, the current website—version 8—faces usability and business challenges such as outdated design & UI elements, limited content internationalization features, less efficient search functionality, and lack of continuity in content & account management between the website and GTY's other platforms. 
                  </p>
                  <p>This case study focuses on redesigning GTY.org to broaden audience reach and improve engagement & retention by creating a more accessible and unified digital experience while maintaining its core mission of delivering high-quality theological content.</p>
                  <p className="cyril-text-sm cyril-accent cyril-mt-30"><strong>&#40;Screenshots of the processes and the designs will be supplied in the appropriate sections of this study once the project has launched.&#41;</strong></p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Problem Statement</h4>
                  <dl className="w-disc">
                    <dt>Current Issues</dt>
                    <dd>Outdated visual design compared to modern web standards</dd>
                    <dd>Restrictive search results filtering and sorting mechanism</dd>
                    <dd>Lack of continuity in experience, content presentation, and account management between GTY's website and it apps</dd>
                  </dl>
                  <p><strong>Business Need:</strong> The new GTY website must broaden audience reach and improve engagement & retention by creating a more accessible and unified digital experience.</p>


                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Research</h4>
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
                      Leveraged Google Analytics to gather quantitative data revealing user behavior patterns and website performance metrics
                      <dl>
                        <dd>Tracked activities such as user sessions, user uniqueness & frequency, user age & gender, user language, user location, page views, page ranks, average session duration, bounce rates, acquisition & navigation paths, devices used, etc.</dd>
                      </dl>
                    </dd>
                    <dd>
                      Conducted surveys with existing users and organization employees to gather qualitative data identifying pain points, user sentiment, satisfaction, and preferences
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

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Design Process</h4>
                  <dl className="w-disc">
                    <dt>User Personas, Journeys, and Stories</dt>
                    <dd>
                      Created user personas to represent the wants, needs, and behavior patterns of GTY's target audience
                      <dl>
                        <dd>These personas were used throughout the design and development process—from deciding on features to include in the design, to evaluating feature requirements—to ensure we're making intelligent, practical, and usable design and development solutions.</dd>
                      </dl>
                    </dd>
                    <dd>
                      Mapped user journeys to visualize the user's interactions across GTY's multiple platforms (apps, social media, etc.) and over an extended period of time, from initial awareness to post-purchase/donation engagement
                      <dl>
                        <dd>These journeys helped GTY understand the user's needs, pain points, and decision-making process so they can have an optimized experience that will increase content consumption and drive conversions or business success.</dd>
                      </dl>
                    </dd>
                    <dd>
                      Wrote user stories to express requirements in GTY's Agile software development and to describe features told from the perspective of the person—usually a user or a stakeholder—who desires a feature on a website so that they would be easily understandable to both developers and stakeholders
                      <dl>
                        <dd><strong>Key Initiatives:</strong> These user stories were used as the basis for discussions, planning, and prioritization in GTY's agile development processes and as the basis for the project goals and principles.</dd>
                        <dd><strong>Collaboration:</strong> Worked with the Senior Software Architect and the development team to write the project backlogs—a prioritized list of features and tasks based on their importance, value to the user base & stakeholders, and business goals—out of these user stories. The backlog acts as a tool for translating high-level visions into actionable details—MVP (Minimum Viable Product) list of user needs and stakeholder expectations, influencing the Senior Software Architect / Project Manager and the development team through the execution phase to achieve the project's goals efficiently.</dd>
                      </dl>
                    </dd>
                  </dl>

                  <dl className="w-disc">
                    <dt>Ideation</dt>
                    <dd>Brainstormed solutions focusing on intuitive navigation, improved search functionality, and mobile-first / web app design approach</dd>
                    <dd>Designed 3 sets of homepage mockups &#40;with dark modes&#41; to facilitate collaboration and foster alignment with the development team and stakeholders to establish the design direction, especially in terms of color, typography, and layout</dd>
                    <dd>Collaborated with the development team to identify UI elements that would make the development process more efficient and more aligned with the GTY's technology stack. This collaboration also prepared the project team for the creation and development of the GTY's style guide and design system</dd>
                  </dl>

                  <dl className="w-disc">
                    <dt>Wireframes</dt>
                    <dd>Designed low-fidelity wireframes focusing on the structure, functionality, and placement of key content and elements without delving into visual details like colors, typography, or images
                      <dl>
                        <dd>These wireframes served as blueprints for the design, helping the development team and stakeholders visualize the flow and hierarchy of content before moving into more detailed stages of providing mockups and prototypes</dd>
                      </dl>
                    </dd>
                    <dd>
                      <strong>Key Outcomes:</strong> The wireframes helped the development team and the stakeholders reach a common understanding by clearly communicating the prioritization and placement of specific resources and content and how UIs will function
                    </dd>
                  </dl>

                  <dl className="w-disc">
                    <dt>Prototyping</dt>
                    <dd>Designed high-fidelity interactive prototypes for mobile, tablet, laptop/desktop screens using Axure RP to simulate user interactions, test usability, and refine designs before development
                      <dl>
                        <dd>These prototypes closely represented what would be the final version of the design, including detailed UI elements & functionality, typography, color schemes, and animations.</dd>
                        <dd>Stakeholders then would be able to visualize the final project more clearly, which facilitated approvals and alignment.</dd>
                      </dl>
                    </dd>                    
                    <dd>
                      <strong>Time and Resource:</strong> Creating high-fidelity prototypes required significantly more effort than low-fidelity wireframes. This caused specific stakeholders to misunderstand and underappreciate the importance of this stage of the UX process in terms of project completion and timeline. And so, the stakeholders set a new but tighter deadline. As a response, the Senior Software Architect and the development team thought of outsourcing the design and development of the e-commerce aspect of the site.
                    </dd>
                    <dd>
                      <strong>Challenges:</strong> Balancing modern design with the traditional & clean aesthetic expected by GTY.org's core audience and stakeholders presented a challenge. Specific stakeholders wanted the simplicity and minimalism of the current site &#40;version 8&#41; to be carried over to this new version. To this UX Designer, this would be the best approach to the redesign project so as not to frustrate users when introduced to a newer site version. Specific stakeholders, however, thought that the minimalistic direction looked like a low-fidelity design. Specific stakeholders decided then to bypass the UX process and delegated the design and prototyping to the Front-End developer, treating the developed design as close to the final version. Moreover, at this point in the design process, the ministry partnered with a creative agency that focused more on branding and aesthetics rather than usability and functionality. The agency functioned as the authority over the originally implemented UX process and agile project & development process.
                    </dd>
                  </dl>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Reflection</h4>

                  <p>
                  This project highlighted the importance of aligning design solutions with user needs and organizational goals. And time plays a critical role in completing UX design projects successfully. It impacts not only the final product's quality, but also the development process’s efficiency. When the UX process is abandoned or rushed, it could lead to significant setbacks in project outcomes. Skipping more prototyping and testing often results in design decisions based on assumptions rather than data. This could add stress and delays to the overall project timeline. It also could lead to suboptimal user experiences and reduced product success. Investing time upfront, effective time management strategies, and reasonable deadlines ensure project success while reducing post-launch rework and costly iterations, as usability issues are identified early.
                  </p>

                  <p className="cyril-mt-60">
                  Moreover, this project underscored the importance of having a dedicated project manager. A dedicated and qualified project manager is essential for ensuring the success of a UX project as their role goes beyond task management; they act as the orchestrator, aligning team efforts, stakeholder expectations, and project goals to deliver high-quality deliverables on time. They also allocate resources efficiently, allowing the UX designer and the developers to focus on their expertise rather than logistical concerns. So, due to the lack of project management, the project team suffered from a lack of direction and task management. Between trying to complete the project, maintaining current platforms, and supporting various departments in the organization—the Senior Software Architect and this UX Designer—tried their best to manage the project while delivering solutions to routine and ad-hoc work requests. The redesign project suffered from clear and defined leadership, ownership, and direction. But in fairness to the stakeholders, they tried to provide a project manager. However, it was one who was not technically and experientially qualified. And this resulted in confusion among the project team regarding what or which work gets prioritized, causing the stakeholders to make further decisions to let the UX Designer go—someone had to bear the blame for the “delay” of the completion of the project.
                    
                  </p>

                
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