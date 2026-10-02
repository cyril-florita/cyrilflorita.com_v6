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

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "research", label: "Research & Information Architecture" },
  { id: "design-process", label: "Design Process" },
  { id: "development", label: "Development & Features" },
  { id: "learnings", label: "Learning and Reflection" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gty8');
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
    const projectId = 'gty8'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="UX Design & Front-End Development"
            detail="Responsive Web"
            title="Grace to You (v.8)"
            summary="Enhancing the user experience of GTY.org, the digital home for John MacArthur's teaching ministry, through the UX design and front-end development strategies that shaped version 8 of GTY's website."
            result={{ value: "+38%", label: "Engagement, mobile users" }}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "UX Designer & Front-End Developer" },
              { label: "Platform & Tools", value: <>{"Responsive Web — Mobile & Desktop"}<br />{"Visual Studio Code, Google's Material Design System, HandlebarsJS"}</> },
              { label: "Team", value: "Digital Platforms Coordinator, Software Engineer, Software Developer" },
            ]}
            image="/img/portfolio/gty8_screenshot_4x3.jpg"
            imageAlt="Grace to You (v.8)"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>GTY.org (Grace to You) is the digital home for John MacArthur&apos;s teaching ministry, which began in 1969 as a small tape ministry and now offers sermons, articles, and resources to a global audience. Its previous site, version 7, had outdated design and UI elements and wasn&apos;t mobile-friendly, even though more than 50% of its visitors were on mobile devices.</p>
              <p>My role was to enhance the user experience while keeping the trust of long-time users and supporting the ministry&apos;s mission of &ldquo;Unleashing God&apos;s Truth, One Verse at a Time.&rdquo; This case study covers the UX design and front-end development strategies that shaped version 8. The redesign had six challenges:</p>
              <ul className="cyril-case-list">
                <li><strong>A mobile-responsive platform</strong> for the majority of visitors on mobile devices</li>
                <li><strong>Better content organization, navigation, and search,</strong> including a topical index, so thousands of sermons and resources are discoverable</li>
                <li><strong>A cross-device media player with playlists,</strong> replacing an outdated Flash-based system, so listening and watching continue while navigating the site</li>
                <li><strong>24/7 continuous streaming</strong> of John MacArthur&apos;s verse-by-verse teaching through the New Testament, to increase usage time and retention</li>
                <li><strong>A frictionless donation and product purchase experience,</strong> to increase customer satisfaction and ministry revenue</li>
                <li><strong>Personalized features and account management,</strong> to increase engagement and synchronization</li>
              </ul>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty7_screenshot.jpg" alt="GTY 7 Screenshot" caption="Before" ratio="4 / 3" />
                <CaseFigure src="/img/portfolio/gty8_screenshot.jpg" alt="GTY 8 Screenshot" caption="After" ratio="4 / 3" />
              </CaseGrid>
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>The redesign serves the ministry&apos;s loyal and new audience while carrying its 50+ year legacy forward:</p>
              <CaseStats items={[
                { value: "+38%", label: "Engagement, mobile users" },
                { value: "50%", label: "More usage time, desktop" },
                { value: "~25%", label: "Monthly lift in sermon plays & downloads" },
                { value: "27%", label: "Faster page loads" },
              ]} />
              <ul className="cyril-case-list">
                <li><strong>Improved engagement across devices:</strong> a <strong>+38% increase</strong> for mobile users and a <strong>50% increase in usage time</strong> for desktop users</li>
                <li><strong>A monthly increase of ~25% in sermon plays and downloads</strong> through the enhanced media player since its launch</li>
                <li><strong>Greater exposure of promoted and featured content,</strong> such as blog posts, free resource offers, and product sales, as shown by Google Analytics and heatmaps</li>
                <li><strong>A better donation and product purchase experience,</strong> based on email feedback, calls, and support tickets</li>
                <li><strong>27% faster page loads</strong> across the board</li>
                <li><strong>Significantly improved accessibility,</strong> with Lighthouse ratings over 90</li>
              </ul>
              <p>More than metrics, the site now reflects the clarity, simplicity, quality, and timelessness of John MacArthur&apos;s preaching and teaching.</p>
            </CaseSection>

            {/* 03 — Research & Information Architecture */}
            <CaseSection id="research" number={3} title="Research &amp; Information Architecture">

              <h3 className="cyril-case-subheading">Discovery &amp; UX Strategy</h3>
              <p>Under the leadership of the Digital Platforms Coordinator, I started with a deep dive into user behavior: demographics, traffic sources and patterns, device usage, content consumption, bounce rates, and feedback from the customer service team. GTY has a loyal audience, many of whom aren&apos;t tech-savvy, so the new experience needed to feel intuitive, lightweight, and content-focused. I concentrated on four things:</p>
              <ul className="cyril-case-list">
                <li><strong>Accessibility &amp; Responsiveness:</strong> The previous experience wasn&apos;t WCAG-compliant, especially for elderly users, or mobile-friendly.</li>
                <li><strong>Content Organization and Findability:</strong> With decades of sermons and resources, the information architecture needed a major overhaul.</li>
                <li><strong>Aesthetic Sophistication and Simplicity:</strong> The brand is built on depth and clarity, and the interface had to match.</li>
                <li><strong>Performance:</strong> The previous site was sluggish, making streaming or reading difficult in low-bandwidth areas.</li>
              </ul>

              <h3 className="cyril-case-subheading">Competitive Analysis</h3>
              <p>I benchmarked GTY.org against Ligonier.org, DesiringGod.org, TruthForLife.org, and others on content, structure, search, engagement, UX, SEO, and technology stack. To set itself apart, GTY.org needed:</p>
              <ul className="cyril-case-list">
                <li>a <strong>single-page app</strong> experience</li>
                <li>a <strong>mobile-first</strong> content presentation and experience</li>
                <li>a persistent <strong>media player</strong></li>
                <li>a <strong>clean UI</strong> design</li>
                <li>an accessible <strong>topical index</strong></li>
                <li>a <strong>robust search</strong> functionality</li>
                <li>and better <strong>social media integration</strong></li>
              </ul>

              <h3 className="cyril-case-subheading">Site Nav</h3>
              <p>Anchoring my decisions to analytics and user feedback, I worked with key stakeholders and the Digital Platforms Coordinator to define a simplified top-level navigation and content taxonomy: <strong>About, Broadcasts, Resources, Store, Apps, Blog, Devotionals, Sermons,</strong> and <strong>Donate</strong>. The blog is one of the most engaging content on the site, devotionals are the source of daily and consistent traffic, sermons are the bread and butter, and Donate makes giving readily accessible, like most ministries do.</p>
              <CaseFigure src="/img/portfolio/gty8_site-nav.jpg" alt="GTY 8 Site Nav" caption="Site Nav" />

              <h3 className="cyril-case-subheading">Site Tree</h3>
              <p>GTY is content-rich, with thousands of sermons, articles, Q&amp;As, devotionals, and books. I treated the site tree as a content strategy blueprint, to make the library intuitive and discoverable, especially for users who don&apos;t know exactly what they&apos;re looking for.</p>
              <CaseFigure src="/img/portfolio/gty8_site-tree.jpg" alt="GTY 8 Site Tree" caption="Site Tree" />
            </CaseSection>

            {/* 04 — Design Process */}
            <CaseSection id="design-process" number={4} title="Design Process">

              <h3 className="cyril-case-subheading">UI Inventory</h3>
              <p>Based on the Site Nav and the Site Tree, I took stock of every component, interaction, and user-facing feature on the site before any wireframes or visual concepts. GTY had evolved over time with many departments contributing content, and the interface had grown organically, sometimes inconsistently. The inventory exposed the redundancies and aligned the new design system with actual user needs and organizational goals.</p>
              <CaseGrid layout="three">
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-1.jpg" alt="GTY 8 UI Inventory" caption="UI Inventory 1" />
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-2.jpg" alt="GTY 8 UI Inventory 2" caption="UI Inventory 2" />
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-3.jpg" alt="GTY 8 UI Inventory 3" caption="UI Inventory 3" />
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-4.jpg" alt="GTY 8 UI Inventory 4" caption="UI Inventory 4" />
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-5.jpg" alt="GTY 8 UI Inventory 5" caption="UI Inventory 5" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">User Stories</h3>
              <p>Working with the Digital Platforms Coordinator, I gathered user stories to capture the real-world behaviors, goals, and contexts of GTY&apos;s diverse audience: pastors, laypeople, new believers, long-time followers, Spanish speakers, and students. They weren&apos;t hypothetical personas but were distilled from actual usage data, support requests, and internal ministry insights, and they guided everything from page layouts to content hierarchy to UI components.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty8_user-stories-1.jpg" alt="GTY 8 User Stories 1" caption="User Stories 1" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty8_user-stories-2.jpg" alt="GTY 8 User Stories 2" caption="User Stories 2" ratio="3 / 4" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/gty8_user-stories-3.jpg" alt="GTY 8 User Stories 3" caption="User Stories 3" />

              <h3 className="cyril-case-subheading">Producing Mockups</h3>
              <p>Mockups were where the planned ideas began to take visual shape and where design and function started working in harmony. I aimed for two things:</p>
              <ul className="cyril-case-list">
                <li><strong>Project Team and Stakeholder Alignment:</strong> With the Digital Platforms Coordinator&apos;s supervision, I held collaborative sessions with managers, content creators, and engineers to clarify goals, user needs, and brand voice, which avoided unnecessary revisions later.</li>
                <li><strong>Clean, Minimal, yet Sophisticated Design:</strong> I designed the UI to feel intuitive and elegant, with every element having a purpose and no clutter. Minimal, but not bland, so users focus on the content while the layout and navigation subtly guide them.</li>
              </ul>
              <CaseFigure src="/img/portfolio/gty8_design_0 - init.gif" alt="GTY 8 Initial Mockups" caption="Initial Mockups" frame="browser" url="gty.org" />
              <CaseFigure src="/img/portfolio/gty8_design_rev-1.gif" alt="GTY 8 Revision 1" caption="Revision #1" frame="browser" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_design_rev-2.mp4" caption="Revision #2" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_design_rev-3.mp4" caption="Revision #3" url="gty.org" />
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty8_design_rev-4_1.jpg" alt="GTY 8 Revision 4.1" caption="Revision #4.1" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty8_design_rev-4_2.jpg" alt="GTY 8 Revision 4.2" caption="Revision #4.2" ratio="3 / 4" />
              </CaseGrid>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty8_design_rev-6_1.jpg" alt="GTY 8 Revision 6.1" caption="Revision #6.1" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty8_design_rev-6_2.jpg" alt="GTY 8 Revision 6.2" caption="Revision #6.2" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty8_design_rev-6_3.jpg" alt="GTY 8 Revision 6.3" caption="Revision #6.3" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty8_design_rev-6_4.jpg" alt="GTY 8 Revision 6.4" caption="Revision #6.4" ratio="3 / 4" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">Visual Direction&mdash;Font, Color, and Layout Choices</h3>
              <p>Working with GTY&apos;s design agency partner, WeKreative, I proposed fonts that they immediately loved and approved, chosen for legibility and clarity across digital and print: Google&apos;s Lora (serif) for long-format content such as blog posts, articles, transcripts, and devotionals, and Lato (sans-serif) for titles and short copy. WeKreative provided the color palette to keep the site aligned with GTY&apos;s print brand.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty8_fonts.jpg" alt="GTY 8 Fonts" caption="Fonts" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty8_colors.jpg" alt="GTY 8 Colors" caption="Colors" ratio="3 / 4" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">Style Guide</h3>
              <p>Once the design language was solid, I compiled a detailed style guide covering typography rules, color palette, spacing systems, and interaction patterns. It became the single source of truth for the team, ensuring consistency across pages, devices, and future iterations.</p>
              <CaseFigure src="/img/portfolio/gty8_style-guide-creation.jpg" alt="GTY 8 Style Guide Creation" caption="Style Guide Creation" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 05 — Development & Features */}
            <CaseSection id="development" number={5} title="Development &amp; Features">
              <p>Under the leadership of the Digital Platforms Coordinator, I helped translate business goals into technical requirements and user-centric design, define feature scopes, and prioritize enhancements. With the Software Engineer and the Software Developer, I designed a scalable, modular architecture: they handled data modeling, APIs, and server-side logic, while I focused on front-end development, integrating the UI with back-end services.</p>

              <h3 className="cyril-case-subheading">Mobile-First Responsive Design</h3>
              <p>Mobile visitors were the majority, so as a team we prioritized responsive design:</p>
              <ul className="cyril-case-list">
                <li>fluid grid layouts adapting to viewport dimensions</li>
                <li>flexible images scaling proportionally across devices</li>
                <li>media queries serving optimized CSS for different breakpoints</li>
                <li>touch-friendly interface elements replacing desktop-centric controls</li>
              </ul>
              <p>This eliminated the pinch-zooming and horizontal scrolling that hindered mobile users.</p>

              <h3 className="cyril-case-subheading">Technology Stack</h3>
              <p>We wanted a modern, scalable, accessible, SEO-friendly platform built from reusable UI components. We chose:</p>
              <ul className="cyril-case-list">
                <li><strong>ASP.NET Core MVC</strong> as the application framework</li>
                <li><strong>Google&apos;s Material Design System</strong> for consistent, accessible, responsive, reusable UI components with pleasing micro-interactions</li>
                <li><strong>Modern JavaScript</strong> for interactive elements, particularly the custom media player, and <strong>APIs</strong> for podcast systems and other distribution channels</li>
              </ul>

              <h3 className="cyril-case-subheading">Code Prototyping</h3>
              <p>Due to resource and time constraints, and with the approval of the Digital Platforms Coordinator, I designed the high-fidelity prototypes in the browser, coding in Visual Studio Code, which made them production-ready.</p>
              <ul className="cyril-case-list">
                <li>I <strong>code-designed</strong> the global components first: navigation, footer, and the media player, search, cart and wishlist, and sign-in layers.</li>
              </ul>
              <CaseVideo src="/img/portfolio/gty8_code-prototyping_mobile.mp4" caption="Code Prototyping — Mobile" size="phone" />
              <ul className="cyril-case-list">
                <li>I then built the homepage, about, resource, giving, store, product, checkout, and account pages.</li>
              </ul>
              <CaseVideo src="/img/portfolio/gty8_homepage_min.mp4" caption="Homepage" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_about.mp4" caption="About Pages" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_resources.mp4" caption="Resource Pages" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_giving.mp4" caption="Giving Pages" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_store.mp4" caption="Store, Product & Checkout Pages" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_account.mp4" caption="Account Pages" url="gty.org" />
              <ul className="cyril-case-list">
                <li>I used HandlebarsJS to mock up and template the data and content, so I could design and develop freely without interfering with the back-end work. The Software Engineer and Software Developer focused on the back end while I cut up the pages.</li>
                <li><strong>Subtle, yet Pleasing UI Micro-interactions:</strong> Button animations, hover effects, and component and page transitions make the user&apos;s journey more delightful.</li>
              </ul>
              <CaseVideo src="/img/portfolio/gty8_micro-interactions.mp4" caption="Micro-interactions" url="gty.org" />

              <h3 className="cyril-case-subheading">Custom Media Player with Smart Transcript</h3>
              <p>A custom-built player replaced the Flash-based one, a cornerstone feature that directly supports the ministry&apos;s mission of distributing biblical teaching:</p>
              <ul className="cyril-case-list">
                <li><strong>Cross-device compatibility,</strong> including iOS and Android</li>
                <li><strong>Background playback continuity,</strong> persisting when navigating between pages or switching browser tabs</li>
                <li><strong>Playlist functionality</strong> to queue multiple sermons</li>
                <li><strong>Smart Transcript,</strong> which highlights phrases as they are spoken so users can read along, and starts the audio from any word they click</li>
                <li><strong>YouTube and Podcast distribution systems</strong> integration</li>
                <li><strong>Sermon downloads</strong> in MP3 or MP4 format</li>
              </ul>

              <h3 className="cyril-case-subheading">Enhanced Content Search and Discoverability</h3>
              <ul className="cyril-case-list">
                <li><strong>Predictive Search:</strong> Context-aware suggestions for biblical passages and topics</li>
                <li><strong>Featured Content Modules/Slides:</strong> Editorial curation of popular blog series, timely free resources, discounted products, and important announcements</li>
                <li><strong>Taxonomic Filtering:</strong> Sermon browsing by book, chapter, verse, or topic</li>
                <li><strong>Related Content Suggestions:</strong> Recommendations based on current page context</li>
              </ul>

              <h3 className="cyril-case-subheading">User Account Ecosystem</h3>
              <ul className="cyril-case-list">
                <li><strong>Progress Tracking:</strong> Resume playback across sessions via session and authenticated access</li>
                <li><strong>Content Playlists:</strong> User-specific sermon collections persisting across devices</li>
                <li><strong>Notification Preferences:</strong> Customizable alerts for new content releases</li>
                <li><strong>Cross-Device Synchronization:</strong> Seamless transition between web and mobile app experiences</li>
              </ul>
              <p>The account system required secure OAuth and GDPR-compliant data practices, including granular consent management, which meant substantial back-end changes such as data encryption at rest and in transit.</p>

              <h3 className="cyril-case-subheading">Accessibility and Compliance</h3>
              <ul className="cyril-case-list">
                <li><strong>WCAG 2.1 Compliance:</strong> Improved contrast ratios and keyboard navigation support</li>
                <li><strong>GDPR Adherence:</strong> Data protections for EU users</li>
                <li><strong>Semantic HTML:</strong> Proper heading hierarchies and ARIA labels for screen readers</li>
                <li><strong>Alternative Media Delivery:</strong> Transcripts alongside audio and video content</li>
              </ul>

              <h3 className="cyril-case-subheading">Also in the Platform</h3>
              <ul className="cyril-case-list">
                <li><strong>Multimedia Resource Hub:</strong> 50+ years of sermon recordings in downloadable MP3 and MP4, a video library, printable PDF manuscripts, blog-style articles, and live streaming for special events, delivered through a CDN</li>
                <li><strong>Integrated Ecosystem:</strong> Shared sign-in with the iOS and Android apps, RSS feeds for podcasts, a secure e-commerce checkout, email newsletters, and sharing through Facebook, Instagram, X, Vimeo, and YouTube</li>
                <li><strong>Performance:</strong> Lazy loading, progressive enhancement, caching, optimized media formats, and minified code help maintain sub-3-second load times despite complex page compositions</li>
              </ul>
            </CaseSection>

            {/* 06 — Learning and Reflection */}
            <CaseSection id="learnings" number={6} title="Learning and Reflection">
<CaseLearnings
                learned={[
                "Mocking up data with HandlebarsJS let me design and cut up pages while the engineers built the back end, so I'd use mock data again to keep front-end and back-end work from blocking each other.",
                "Taking a full UI inventory before any wireframes showed what had grown inconsistently across departments, which is why I now start redesigns by taking stock of what already exists.",
                "The account system needed secure OAuth and GDPR-compliant data practices that meant substantial back-end changes, so compliance requirements are worth raising with the engineers at the start.",
                ]}
                reflection={
                  <p>Working on version 8 reminded me that the best UX isn&apos;t flashy&mdash;it&apos;s subtle and almost invisible. I&apos;m privileged to have contributed, on a small team juggling other projects, to the craftsmanship, information architecture, user-centric decisions, and technology that made this platform more responsive, accessible, usable, and modern, while staying true to the ministry&apos;s commitment of &ldquo;Unleashing God&apos;s Truth, One Verse at a Time.&rdquo;</p>
                }
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/35-day-generosity-challenge"
            title="35-Day Generosity Challenge"
            category="Design, Development, & Campaign Performance Tracking"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
