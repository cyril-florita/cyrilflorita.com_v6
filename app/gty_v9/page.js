"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { onPreloaderHidden, wipeThen } from "@/components/Preloader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CaseHero,
  CaseLayout,
  CaseSection,
  CaseFigure,
  CaseVideo,
  CaseGrid,
  CaseStats,
  CaseQuote,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "research", label: "Research" },
  { id: "design-process", label: "Design Process" },
  { id: "reflection", label: "Reflection" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gty9');
    cyrilUtility.tpInner();
    // Wait for the preloader to actually finish hiding before starting this
    // page's own reveal, instead of racing it on a separate fixed timer.
    const unsubscribePreloader = onPreloaderHidden(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    });

    return () => unsubscribePreloader();
  }, []);

  // Function to handle back navigation and save scroll position
  const handleBackToPortfolio = () => {
    // Get the project ID or identifier
    const projectId = 'gty9'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="UX Design"
            detail="Web & Mobile"
            title="GTY Website, v.9"
            summary="Redesigning GTY.org to broaden audience reach and improve engagement & retention through a more accessible and unified digital experience."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "User Experience Designer" },
              { label: "Platform", value: "Web — Mobile, Tablet, Desktop" },
              { label: "Tools", value: "Axure RP, Google Analytics" },
              { label: "Deliverables", value: "Research, IA, Personas & Journeys, Wireframes, Prototypes" },
            ]}
            image="/img/portfolio/main_gty9.png"
            imageAlt="Main Image for GTY v9"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>GTY.org is a Christian platform offering biblical resources for personal growth & discipleship, study & teaching materials, and pastoral & theological training. Despite its valuable resource offerings, the current website—version 8—faces usability and business challenges such as outdated design & UI elements, limited content internationalization features, less efficient search functionality, and lack of continuity in content & account management between the website and GTY's other platforms.</p>
              <p>This case study focuses on redesigning GTY.org &#40;version 9&#41; to broaden audience reach and improve engagement & retention by creating a more accessible and unified digital experience while maintaining its core mission of delivering high-quality theological content.</p>
              <CaseStats items={[
                { value: "16", label: "Key needs prioritized" },
                { value: "3", label: "Homepage design directions" },
                { value: "5", label: "Content pillars" },
              ]} />
            </CaseSection>

            {/* 02 — Problem */}
            <CaseSection id="problem" number={2} title="Problem Statement">
              <p>The primary challenges identified for the redesign included:</p>
              <ul className="cyril-case-list">
                <li>Outdated visual design compared to modern web standards</li>
                <li>Restrictive search results filtering and sorting mechanism</li>
                <li>Lack of continuity in experience, content presentation, and account management between GTY's website and its apps</li>
              </ul>
              <CaseVideo src="/img/portfolio/gty9_problem-statement.mp4" caption="Problem statement" />
              <p><strong>Business Need:</strong> The new GTY website must broaden audience reach and improve engagement & retention by optimizing its content architecture and unifying its user experience with all of GTY's digital platforms.</p>
            </CaseSection>

            {/* 03 — Research */}
            <CaseSection id="research" number={3} title="Research">

              <h3 className="cyril-case-subheading">Business Insights</h3>
              <p>I conducted stakeholder interviews to gather insight into the organization's goals, challenges, and priorities. This process:</p>
              <ul className="cyril-case-list">
                <li>ensured the redesign aligns with broader organizational objectives while addressing specific departmental needs</li>
                <li>minimized guesswork and reduced the risk of designing solutions that fail to address key problems or meet expectations</li>
                <li>ensured the project is grounded in accurate data rather than assumptions</li>
                <li>fostered trust and collaboration between stakeholders and the project team</li>
                <li>and increased their engagement and buy-in for the redesign project</li>
              </ul>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty9_redesign-overview.jpg" alt="redesign overview" caption="Redesign overview" />
                <CaseFigure src="/img/portfolio/gty9_project-requirements.jpg" alt="project requirements" caption="Project requirements" />
              </CaseGrid>
              <p><strong>Key Findings</strong>: With these interviews, I convinced the stakeholders that redesigning a website is more than just changing its look and feel; the project should improve the site's status quo, provide solutions to the user's needs based on data & research, and accomplish business goals. Along with stakeholders and the development team, we then elevated the following needs to be of utmost importance for this project:</p>
              <ul className="cyril-case-list cyril-case-list-columns">
                <li>applied user-centric design</li>
                <li>giving / business content priority</li>
                <li>more intuitive navigation</li>
                <li>simplified yet robust search functionality</li>
                <li>improved mobile experience</li>
                <li>improved content organization</li>
                <li>content optimization & internationalization (need for translating materials)</li>
                <li>refined and expanded global reach</li>
                <li>enhanced user onboarding, engagement, and direction</li>
                <li>clearer & more successful user journey</li>
                <li>more consistent branding</li>
                <li>increased speed and performance</li>
                <li>better accessibility compliance</li>
                <li>real-time support with chat services</li>
                <li>enhanced security & trust-factor features</li>
                <li>improved user data gathering</li>
              </ul>
              <CaseQuote cite="Key finding, stakeholder interviews">
                Redesigning a website is more than just changing its look and feel.
              </CaseQuote>

              <h3 className="cyril-case-subheading">User Insights</h3>
              <p>I leveraged Google Analytics to gather quantitative data revealing user behavior patterns and website performance metrics.</p>
              <ul className="cyril-case-list">
                <li>I tracked activities such as user sessions, user uniqueness &amp; frequency, user age & gender, user language, user location, page views, page ranks, average session duration, bounce rates, acquisition & navigation paths, devices used, etc.</li>
                <li>I conducted surveys with existing users and organization employees to gather qualitative data identifying pain points, user sentiment, satisfaction, and preferences.</li>
              </ul>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty9_analytics.jpg" alt="analytics" caption="Analytics" />
                <CaseFigure src="/img/portfolio/gty9_interviews.jpg" alt="interviews" caption="Interviews" />
              </CaseGrid>
              <p><strong>Key Findings:</strong></p>
              <ul className="cyril-case-list">
                <li>Users struggled with finding specific sermons or resources due to unclear categorization and less efficient search functionality</li>
                <li>Users were frustrated with how search results were organized according to their types; there is a lack of a simplified sorting/filtering mechanism</li>
                <li>Users encountered friction in the giving/donation experience when asked about ministry exposure attribution—where they listen/watch GTY materials. The friction caused users to spend more time in the experience than needed and suggested that the attribution section be a part of another experience, e.g., account creation</li>
              </ul>

              <h3 className="cyril-case-subheading">Competitive Analysis</h3>
              <p>I benchmarked GTY.org against similar platforms like Ligonier.org, DesiringGod.org, TruthForLife.org, etc., in terms of their content offerings, content & navigation structure, search functionality, audience engagement, UX, SEO, and technology stack.</p>
              <CaseVideo src="/img/portfolio/gty9_tech-stack.mp4" caption="Tech stack" />
              <p>I then observed trends in clean UI design, robust search functionality, mobile-first approaches, and social media integration.</p>
              <p><strong>Key Findings:</strong></p>
              <ul className="cyril-case-list">
                <li><strong>Strengths:</strong> GTY has a deep sermon archive, loyal following, and consistent theology</li>
                <li><strong>Opportunities:</strong> GTY could expand into interactive or visual content, enhance mobile user experience, and broaden appeal beyond the current core demographic</li>
              </ul>

              <h3 className="cyril-case-subheading">Content Audit &amp; Information Architecture</h3>
              <p><strong>Mapping the Content Landscape: </strong>I approached the redesign through the lens of Information Architecture &#40;IA&#41; to ensure not just the quality of the content, but its structure, findability, and overall usability.</p>
              <p><strong>Key Initiatives:</strong> I started by cataloging the entire site and content ecosystem&mdash;sermons, devotionals, articles, videos, and radio archives. I categorized all the content by their type&mdash;page, audio, video, image, and product. I also laid out the current site map to see and show the team how content and pages are interconnected in the site's ecosystem. For each content item, I noted key details: title, URL, content type, topic hierarchy, metadata, and how it fit within the existing navigation. This gave me a bird's-eye view of what was there, what was working, and what wasn't.</p>
              <CaseFigure src="/img/portfolio/gty9_content-inventory.jpg" alt="content inventory" caption="Content inventory" />
              <p>Doing these allowed me to visualize the current information structure and begin reshaping it into something more intuitive. It wasn't just about what content existed—it was about how it was organized and how users could logically navigate through it.</p>
              <p><strong>Evaluating Content Through a UX Lens:</strong> From there, I assessed each piece of content for clarity, relevance, and engagement. Was it still accurate? Was it performing well? Did it actually meet user needs?</p>
              <p><strong>Collaboration:</strong> After I conducted an SEO Analysis, I worked with key stakeholders to determine what should be updated, merged, archived, or even removed. This wasn't just a cleanup exercise—it was about aligning content with the mental models of real users and supporting their journeys through the site.</p>
              <p>I laid the groundwork for ongoing content governance. I proposed a system where content could be regularly reviewed and restructured as needed, with IA guiding the progressive development of site content alongside user needs.</p>
              <p>My goal was to create a content ecosystem that was not only clean and accessible now but could adapt and scale with the ministry's growth over time.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty9_v8-sitemap.jpg" alt="sitemap" caption="GTY v8 sitemap" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_content-audit-meeting.jpg" alt="content audit" caption="Content audit" ratio="3 / 4" />
              </CaseGrid>
              <p><strong>Restructuring for Discoverability</strong>: Applying IA principles, I began shaping a clearer hierarchy and navigation system. I redefined categories based on user behavior and logical groupings, ensuring that pathways to content felt natural and easy to predict.</p>
              <p>I also refined labeling across the board—using language that was more human, less technical or internal. Moreover, I started identifying possible UI components that would solve how different content is presented. This step was crucial in improving not only the navigation and the search, but also GTY's design system, while reducing friction for first-time users and longtime visitors alike.</p>
              <CaseFigure src="/img/portfolio/gty9_site-and-component-map.jpg" alt="site and component map" caption="Site & component map" />
              <p><strong>Key Outcomes:</strong> Integrating IA into the content audit gave me a more strategic, user-centered framework to work from. It turned what could have been a backend cleanup into a critical UX touchpoint&mdash;ensuring that every piece of content had purpose, place, and value within the larger experience.</p>
              <p>Working with the team and key stakeholders, I identified areas for improvement, made informed decisions about content strategy, organization, & optimization, and defined a more simplified content, site, & navigation structure&mdash;<strong>Listen, Watch, Read, Study, Shop.</strong></p>
            </CaseSection>

            {/* 04 — Design Process */}
            <CaseSection id="design-process" number={4} title="Design Process">

              <h3 className="cyril-case-subheading">User Personas, Journeys, and Stories</h3>
              <p>I created user personas to represent the wants, needs, and behavior patterns of GTY's target audience.</p>
              <p>These personas were used throughout the design and development process—from deciding on features to include in the design, to evaluating feature requirements—to ensure we're making intelligent, practical, and usable design and development solutions.</p>
              <p>I then mapped user journeys to visualize the user's interactions across GTY's multiple platforms &#40;apps, social media, etc.&#41; and over an extended period of time, from initial awareness to post-purchase/donation engagement.</p>
              <p>These journeys helped GTY understand the user's needs, pain points, and decision-making process so they can have an optimized experience that will increase content consumption and drive conversions or business success.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty9_user-personas.jpg" alt="user personas" caption="User personas" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_user-journeys.jpg" alt="user journeys" caption="User journeys" ratio="3 / 4" />
              </CaseGrid>
              <p>I wrote user stories to express requirements in GTY's Agile software development and to describe features told from the perspective of the person&mdash;usually a user or a stakeholder&mdash;who desires a feature on a website so that they would be easily understandable to both developers and stakeholders.</p>
              <p><strong>Key Initiatives:</strong> I used these user stories as the basis for discussions, planning, and prioritization in GTY's agile development processes and as the basis for the project goals and principles.</p>
              <p><strong>Collaboration:</strong> I worked with the Senior Software Architect and the development team to write the project backlogs—a prioritized list of features and tasks based on their importance, value to the user base & stakeholders, and business goals—out of these user stories. The backlog acts as a tool for translating high-level visions into actionable details—MVP &#40;Minimum Viable Product&#41; list of user needs and stakeholder expectations, influencing the team through the execution phase to achieve the project's goals efficiently.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty9_user-stories.jpg" alt="user stories" caption="User stories" ratio="4 / 3" />
                <CaseFigure src="/img/portfolio/gty9_mvp.jpg" alt="project mvp" caption="Project MVP" ratio="4 / 3" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">Ideation</h3>
              <p>I collaborated with the development team to identify UI elements that would make the development process more efficient and more aligned with GTY's technology stack. This collaboration also prepared the project team for the creation and development of GTY's style guide and design system.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty9_homepage-components.jpg" alt="homepage components" caption="Homepage components" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_ui-inventory.jpg" alt="ui inventory" caption="UI inventory" ratio="3 / 4" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/gty9_design-system.jpg" alt="design system" caption="Design system" size="text" />
              <p>I brainstormed and researched solutions focusing on intuitive navigation, improved search functionality, and mobile-first / progressive web application design approach where the mobile version of the site will look and feel like a native Apple or Android app. I then presented these ideas to the Senior Software Architect and the development team to validate my ideas.</p>
              <CaseVideo src="/img/portfolio/gty9_progressive-web-app.mp4" caption="Progressive web app" />
              <p>Having clearer insights and strategies for information architecture, UI/UX, and technology stack, I then designed 3 sets of homepage mockups. These were aimed to facilitate collaboration and foster alignment with the development team and stakeholders&mdash;to establish the design direction, especially in terms of layout, typography, and color. This step was necessary to ensure that the design and development process were moving in the same direction, and also to prepare and avoid any misunderstandings from the stakeholders about the next process of creating low-fidelity wireframes and prototypes.</p>
              <CaseVideo src="/img/portfolio/gty9_hi-fi-mockups.mp4" caption="Hi-fi homepage mockups" />

              <h3 className="cyril-case-subheading">Wireframes</h3>
              <p><strong>Collaboration:</strong> I worked closely with the Senior Software Architect and the development team to define and organize UI elements, components, pages, journeys into wireframe requirements, preparing and serving as the basis for the further development of GTY's design system.</p>
              <CaseFigure src="/img/portfolio/gty9_wireframe-requirements.jpg" alt="wireframe requirements" caption="Wireframe requirements" />
              <p>I then designed low-fidelity wireframes focusing on the structure, functionality, and placement of key content and elements without delving into visual details like colors, typography, or images. These wireframes served as blueprints for the design, helping the development team and stakeholders visualize the flow and hierarchy of content before moving into more detailed stages of providing mockups and prototypes.</p>
              <CaseVideo src="/img/portfolio/gty9_wireframes.mp4" caption="Low-fidelity wireframes" />
              <p><strong>Key Outcomes:</strong> The wireframes helped the development team and the stakeholders reach a common understanding by clearly communicating the prioritization and placement of specific resources and content and how UIs will function.</p>

              <h3 className="cyril-case-subheading">Prototyping</h3>
              <p>After getting alignment from the stakeholders about the hierarchy and presentation of the content on the homepage and other important pages via the wireframes, I designed high-fidelity interactive prototypes for mobile, tablet, laptop/desktop screens using Axure RP to simulate user interactions, test usability, and refine designs before development.</p>
              <ul className="cyril-case-list">
                <li>These prototypes closely represented what would be the final version of the design, including detailed UI elements &amp; functionality, typography, color schemes, and animations.</li>
                <li>Stakeholders then would be able to visualize the final project more clearly, which facilitated approvals and alignment.</li>
              </ul>
              <p><strong>Challenges:</strong> Balancing modern design with the traditional & clean aesthetic expected by GTY.org's core audience and stakeholders presented a challenge. Specific stakeholders wanted the simplicity and minimalism of the current site &#40;version 8&#41; to be carried over to this new version. To this UX Designer, this would be the best approach to the redesign project so as not to frustrate users when introduced to a newer site version.</p>
              <p><strong>Design Handoff:</strong> Working closely with the Senior Software Architect, and as the stakeholders would approve of the high-fidelity prototypes&mdash;each screen, interaction, and animation closely mirroring the intended GTY v9 experience&mdash;I would hand them off to the development team to ensure a smooth transition to the development phase of our Agile process.</p>
            </CaseSection>

            {/* 05 — Reflection */}
            <CaseSection id="reflection" number={5} title="Reflection">
              <CaseQuote>
                Rigorously following a structured UX process isn&apos;t just a &ldquo;nice to have&rdquo;&mdash;it&apos;s the very foundation of delivering design solutions that truly resonate.
              </CaseQuote>
              <p>As the UX designer for GTY v9, I've learned that rigorously following a structured UX process isn't just a &ldquo;nice to have&rdquo;&mdash;it's the very foundation of delivering design solutions that truly resonate with the users and the organization's business goals:</p>
              <ul className="cyril-case-list">
                <li><strong>It Ensures User-Centered Clarity: </strong> By starting every project with discovery &#40;user research, competitive audits, stakeholder interviews&#41;, I grounded decisions in real needs rather than assumptions. This kept the team focused on solving the right problems from day one.</li>
                <li><strong>It Reduces Risk and Rework:</strong> Iterative validation—through wireframes, prototypes, and usability testing—catches misunderstandings long before development begins. That early feedback loop prevents costly late-stage pivots and scope creep.</li>
                <li><strong>It Aligns Cross-Functional Teams:</strong> A well-documented process &#40;personas, journey maps, annotated prototypes&#41; creates a shared language among stakeholders and the development team. Handoffs become seamless when everyone sees the “why” behind UI and content interactions, and expectations stay realistic.</li>
                <li><strong>It Drives Consistency at Scale:</strong> Producing and maintaining a design system and a style guide within the UX process means components, patterns, and behaviors remain uniform across features and platforms. That consistency builds user trust and simplifies future enhancements.</li>
                <li><strong>It Delivers Measurable Impact: </strong>Embedding analytics and success metrics into every phase—from validating problem statements to post-launch monitoring—ensures we can prove how design changes improve key KPIs &#40;engagement, retention, conversion&#41;. It turns UX from an art into a data-backed investment.</li>
              </ul>
              <p>By adhering to this process end-to-end, I not only championed better experiences for GTY users but also helped the team to work more efficiently, innovate confidently, and ultimately deliver design solutions that drive real project value. More importantly, every wireframe, prototype, and interaction was purposely built to present biblical content in clear and engaging ways&mdash;staying true to the ministry's commitment of &ldquo;Unleashing God's Truth, One Verse at a Time.&rdquo;</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/the-study-bible-app"
            title="The Study Bible App"
            category="App Design"
            image="/img/portfolio/main_the-study-bible-app.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
