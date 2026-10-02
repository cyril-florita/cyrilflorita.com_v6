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
  CaseNext,
  CaseLearnings,
} from "@/components/case/CaseStudy";

// Final design screens (full pages); cropped to a framed top preview, the
// zoom viewer opens each one whole.
const FD = ({ name, caption }) => (
  <CaseFigure src={`/img/portfolio/gty9_fd_${name}.jpg`} alt={`Grace to You final design: ${caption}`} caption={caption} ratio="3 / 4" />
);

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "research", label: "Research & Insights" },
  { id: "design", label: "Design Process" },
  { id: "prototyping", label: "Prototyping & Handoff" },
  { id: "learnings", label: "Learning and Reflection" },
];

const Page = () => {

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
            title="Grace to You"
            summary="Redesigning GTY.org to broaden audience reach and improve engagement & retention through a more accessible and unified digital experience."
            result={{ value: "+50%", label: "Engaged sessions vs. v8" }}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "User Experience Designer" },
              { label: "Platform & Tools", value: <>{"Web — Mobile, Tablet, Desktop"}<br />{"Axure RP, Google Analytics"}</> },
              { label: "Deliverables", value: "Research, IA, Personas & Journeys, Wireframes, Prototypes" },
            ]}
            image="/img/portfolio/gty9_final-design_homepage_4x3.jpg"
            imageAlt="Grace to You final homepage design"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>GTY.org is a Christian platform offering biblical resources for personal growth and discipleship, study and teaching materials, and pastoral and theological training. Version 8 got in the way of those resources, with three core problems:</p>
              <ul className="cyril-case-list">
                <li>outdated visual design compared to modern web standards</li>
                <li>a restrictive search results filtering and sorting mechanism</li>
                <li>no continuity in experience, content presentation, and account management between GTY&apos;s website and its apps</li>
              </ul>
              <p>As the UX designer, I redesigned GTY.org (version 9) to meet the business need:</p>
              <ul className="cyril-case-list">
                <li>broaden audience reach and improve engagement and retention</li>
                <li>optimize the content architecture</li>
                <li>unify the experience across all of GTY&apos;s digital platforms</li>
                <li>keep the site&apos;s mission of delivering high-quality theological content</li>
              </ul>
              <CaseVideo src="/img/portfolio/gty9_preview.mp4" caption="Final design preview" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty9_problem-statement_min.mp4" caption="Problem statement" />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>The final designs bring the research, content structure, and design system together across the site, from the homepage to streaming, the store, giving, and the ministry&apos;s free offers. Compared with version 8:</p>
              <CaseStats items={[
                { value: "+50%", label: "Engaged sessions vs. v8" },
                { value: "+30%", label: "Sessions per visit vs. v8" },
              ]} />
              <p>Giving conversion also rose by about 50%. That period followed the passing of John MacArthur, GTY&apos;s founder and pastor, which likely drew more attention and giving, so I don&apos;t credit the increase to the design alone.</p>
              <CaseFigure src="/img/portfolio/gty9_fd_a-homepage.jpg" alt="Grace to You final design: homepage" caption="Homepage" ratio="3 / 4" size="text" />
              <p><strong>Stream, Listen, and Watch.</strong> John MacArthur&apos;s teaching, live and on demand, in one consistent media experience.</p>
              <CaseGrid layout="two">
                <FD name="b-stream-live" caption="Stream: live" />
                <FD name="b-stream-grace-stream" caption="Stream: Grace Stream" />
                <FD name="c-listen_1-main" caption="Listen" />
                <FD name="c-listen_2-broadcast" caption="Listen: broadcast" />
                <FD name="c-listen_3-sermons" caption="Listen: sermons" />
                <FD name="d-watch_1-main" caption="Watch" />
                <FD name="d-watch_2-tv-broadcast" caption="Watch: TV broadcast" />
              </CaseGrid>
              <p><strong>Shop.</strong> From browsing to the cart, the store follows the same design system as the rest of the site.</p>
              <CaseGrid layout="two">
                <FD name="e-shop_1-main" caption="Shop" />
                <FD name="e-shop_2-bibles" caption="Shop: Bibles" />
                <FD name="e-shop_3-a-product-page" caption="Product page" />
                <FD name="e-shop_3-b-added-to-cart" caption="Added to cart" />
                <FD name="e-shop_4-cart" caption="Cart" />
              </CaseGrid>
              <p><strong>Give.</strong> A simple giving flow, from choosing a gift to reviewing it and a thank-you.</p>
              <CaseGrid layout="two">
                <FD name="k-give_1-main" caption="Give" />
                <FD name="k-give_2-form" caption="Give: form" />
                <FD name="k-give_3-review" caption="Give: review" />
                <FD name="k-give_4-thank-you" caption="Give: thank you" />
              </CaseGrid>
              <p><strong>Search, offers, reading, and more.</strong> Site-wide search, free resources for newcomers, the blog, daily devotionals, and the story of the ministry.</p>
              <CaseGrid layout="two">
                <FD name="j-search-results" caption="Search results" />
                <FD name="f-free-offer" caption="Free offer" />
                <FD name="f-new-to-gty-offer" caption="New to GTY offer" />
                <FD name="g-blog" caption="Blog" />
                <FD name="h-devotional" caption="Devotional" />
                <FD name="i-about" caption="About" />
              </CaseGrid>
            </CaseSection>

            {/* 03 — Research & Insights */}
            <CaseSection id="research" number={3} title="Research &amp; Insights">
              <h3 className="cyril-case-subheading">Business Insights</h3>
              <p>Stakeholder interviews gathered the organization&apos;s goals, challenges, and priorities. They kept the redesign aligned with organizational objectives, grounded it in data rather than assumptions, and built the stakeholders&apos; trust and buy-in.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty9_redesign-overview.jpg" alt="redesign overview" caption="Redesign overview" />
                <CaseFigure src="/img/portfolio/gty9_project-requirements.jpg" alt="project requirements" caption="Project requirements" />
              </CaseGrid>
              <p><strong>Key Findings:</strong> I convinced the stakeholders that redesigning a website is more than changing its look and feel: the project should improve the site&apos;s status quo, answer users&apos; needs based on data and research, and accomplish business goals. With the stakeholders and the development team, we grouped sixteen needs into six priorities:</p>
              <ul className="cyril-case-list">
                <li>user-centric design, with clearer journeys and better onboarding and direction</li>
                <li>intuitive navigation, simplified yet robust search, and improved content organization</li>
                <li>a better mobile experience, with more speed and performance</li>
                <li>giving and business content priority, and improved user data gathering</li>
                <li>content optimization and internationalization, wider global reach, and more consistent branding</li>
                <li>accessibility compliance, real-time chat support, and enhanced security and trust-factor features</li>
              </ul>

              <h3 className="cyril-case-subheading">User Insights</h3>
              <p>Google Analytics gave me quantitative data on behavior and performance: sessions, user uniqueness and frequency, demographics, language and location, page views, session duration, bounce rates, acquisition and navigation paths, and devices. Surveys of existing users and employees added pain points, sentiment, and preferences.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty9_analytics.jpg" alt="analytics" caption="Analytics" />
                <CaseFigure src="/img/portfolio/gty9_interviews.jpg" alt="interviews" caption="Interviews" />
              </CaseGrid>
              <p><strong>Key Findings:</strong></p>
              <ul className="cyril-case-list">
                <li>Users struggled to find specific sermons or resources because of unclear categorization and less efficient search</li>
                <li>Users were frustrated that search results were organized by type, with no simple sorting or filtering mechanism</li>
                <li>Users hit friction in giving when asked about ministry exposure attribution (where they listen to or watch GTY), which made them spend more time than needed and suggested moving it to another experience, such as account creation</li>
              </ul>

              <h3 className="cyril-case-subheading">Competitive Analysis</h3>
              <p>I benchmarked GTY.org against similar platforms like Ligonier.org, DesiringGod.org, and TruthForLife.org on content, structure, search, engagement, UX, SEO, and technology stack, and saw trends toward clean UI, robust search, mobile-first approaches, and social media integration.</p>
              <CaseVideo src="/img/portfolio/gty9_tech-stack.mp4" caption="Tech stack" />
              <ul className="cyril-case-list">
                <li><strong>Strengths:</strong> GTY has a deep sermon archive, a loyal following, and consistent theology</li>
                <li><strong>Opportunities:</strong> GTY could expand into interactive or visual content, enhance the mobile experience, and broaden appeal beyond its current core demographic</li>
              </ul>

              <h3 className="cyril-case-subheading">Content Audit &amp; Information Architecture</h3>
              <p>I approached the redesign through information architecture, to improve not just the quality of the content but its structure and findability. I cataloged the whole site (sermons, devotionals, articles, videos, and radio archives), categorized each item by type, and mapped the current site map, noting each item&apos;s title, URL, type, topic hierarchy, metadata, and place in the navigation. I then assessed each for clarity, relevance, and engagement.</p>
              <CaseFigure src="/img/portfolio/gty9_content-inventory.jpg" alt="content inventory" caption="Content inventory" />
              <p>After an SEO analysis, I worked with stakeholders to decide what to update, merge, archive, or remove, and proposed a regular content review as ongoing governance. I redefined categories around user behavior and made labels more human and less internal.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty9_v8-sitemap.jpg" alt="sitemap" caption="GTY v8 sitemap" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_content-audit-meeting.jpg" alt="content audit" caption="Content audit" ratio="3 / 4" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/gty9_site-and-component-map.jpg" alt="site and component map" caption="Site & component map" />
              <p><strong>Key Outcome:</strong> A simpler content, site, and navigation structure&mdash;<strong>Listen, Watch, Read, Study, Shop.</strong></p>

              <h3 className="cyril-case-subheading">Personas, Journeys, and Stories</h3>
              <p>I created user personas to represent the wants, needs, and behavior patterns of GTY&apos;s audience, and used them from deciding which features to include to evaluating requirements. I then mapped user journeys across GTY&apos;s platforms (apps, social media, and more), from initial awareness to post-purchase and donation engagement, to show the team the user&apos;s needs, pain points, and decision-making.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty9_user-personas.jpg" alt="user personas" caption="User personas" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_user-journeys.jpg" alt="user journeys" caption="User journeys" ratio="3 / 4" />
              </CaseGrid>
              <p>I wrote user stories for GTY&apos;s Agile process, and worked with the Senior Software Architect and the development team to turn them into a prioritized backlog and an MVP list of user needs and stakeholder expectations that guided execution.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty9_user-stories.jpg" alt="user stories" caption="User stories" ratio="4 / 3" />
                <CaseFigure src="/img/portfolio/gty9_mvp.jpg" alt="project mvp" caption="Project MVP" ratio="4 / 3" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — Design Process */}
            <CaseSection id="design" number={4} title="Design Process">
              <p>With the development team, I identified UI elements that would make development more efficient and fit GTY&apos;s technology stack, which also prepared the ground for GTY&apos;s style guide and design system.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty9_homepage-components.jpg" alt="homepage components" caption="Homepage components" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_ui-inventory.jpg" alt="ui inventory" caption="UI inventory" ratio="3 / 4" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/gty9_design-system.jpg" alt="design system" caption="Design system" size="text" />
              <p>I brainstormed solutions around intuitive navigation, better search, and a mobile-first progressive web app approach, where the mobile site looks and feels like a native Apple or Android app, and validated them with the Senior Software Architect and the development team.</p>
              <CaseVideo src="/img/portfolio/gty9_progressive-web-app.mp4" caption="Progressive web app" />
              <p>I then designed four sets of homepage mockups to align the development team and stakeholders on layout, typography, and color before moving to wireframes and prototypes, and to head off misunderstandings later.</p>
              <CaseVideo src="/img/portfolio/gty9_hi-fi-mockups.mp4" caption="Hi-fi homepage mockups" />
              <p>The four homepage directions, each explored at full length:</p>
              <CaseGrid layout="two">
                <CaseVideo src="/img/portfolio/gty9_idea_v1-mobile.mp4" caption="Direction 1: mobile" size="phone" />
                <CaseFigure src="/img/portfolio/gty9_idea_v1-desktop.jpg" alt="Grace to You homepage direction 1, desktop" caption="Direction 1: desktop" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_idea_v2-light.jpg" alt="Grace to You homepage direction 2, light" caption="Direction 2: light" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_idea_v2-dark.jpg" alt="Grace to You homepage direction 2, dark" caption="Direction 2: dark" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_idea_v3.jpg" alt="Grace to You homepage direction 3" caption="Direction 3" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty9_idea_v4.jpg" alt="Grace to You homepage direction 4" caption="Direction 4" ratio="3 / 4" />
              </CaseGrid>
              <p>Wireframes came next. With the Senior Software Architect and the developers, I organized UI elements, components, pages, and journeys into wireframe requirements, which also fed GTY&apos;s design system.</p>
              <CaseFigure src="/img/portfolio/gty9_wireframe-requirements.jpg" alt="wireframe requirements" caption="Wireframe requirements" />
              <p>I then designed low-fidelity wireframes focused on the structure, functionality, and placement of key content, without colors, typography, or images. They gave the development team and stakeholders a shared view of content priority and how the UI would function before the detailed stages.</p>
              <CaseVideo src="/img/portfolio/gty9_wireframes.mp4" caption="Low-fidelity wireframes" />
            </CaseSection>

            {/* 05 — Prototyping & Handoff */}
            <CaseSection id="prototyping" number={5} title="Prototyping &amp; Handoff">
              <p>Once the stakeholders aligned on the hierarchy and presentation of content through the wireframes, I designed high-fidelity interactive prototypes for mobile, tablet, and laptop/desktop in Axure RP, to simulate interactions, test usability, and refine the design before development. They closely represented the final version, with detailed UI elements, functionality, typography, color, and animation, so stakeholders could visualize the result and approve with confidence.</p>
              <CaseVideo src="/img/portfolio/gty9_media-player.mp4" caption="Prototype: media player" url="gty.org" />
              <p><strong>Challenges:</strong> Balancing modern design with the traditional, clean aesthetic that GTY.org&apos;s core audience and stakeholders expect. Some stakeholders wanted the simplicity and minimalism of version 8 carried over, which I also saw as the best approach, so as not to frustrate users with a newer site.</p>
              <p>Once the stakeholders approved the high-fidelity prototypes, each screen, interaction, and animation closely mirroring the intended GTY v9 experience, I handed them to the development team, working with the Senior Software Architect, for a smooth start to the Agile build.</p>
            </CaseSection>

            {/* 06 — Learning and Reflection */}
            <CaseSection id="learnings" number={6} title="Learning and Reflection">
<CaseLearnings
                learned={[
                "Stakeholder interviews showed that a redesign is more than a new look and feel, so I start by grounding the project's priorities in the organization's goals and data rather than assumptions.",
                "Some stakeholders wanted version 8's simplicity carried over, which taught me to weigh modern design against the traditional, clean aesthetic a core audience expects.",
                "Research found that asking donors where they hear about GTY added friction to giving, a reminder that a single question can slow an entire flow.",
                ]}
                next={[
                "Keep tracking engagement, retention, and giving against the goals set at the start, using the analytics the process already builds in.",
                "Try moving the ministry exposure attribution question into account creation, as the research suggested, and check whether giving takes less time.",
                "Keep the design system and the content review process I proposed up to date as the site's content grows.",
                ]}
              />
              <p>As the UX designer for GTY v9, I learned that following a structured UX process rigorously is the foundation of design that resonates with users and with the organization&apos;s business goals. Iterative validation caught problems before development, documentation gave stakeholders and developers a shared language, a design system and style guide kept the experience consistent, and analytics tied design changes to measurable outcomes. Every wireframe, prototype, and interaction was built to present biblical content clearly, true to the ministry&apos;s commitment of &ldquo;Unleashing God&apos;s Truth, One Verse at a Time.&rdquo;</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/giving-tuesday"
            title="Giving Tuesday Campaign"
            category="Design, Development, & Campaign Performance Tracking"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
