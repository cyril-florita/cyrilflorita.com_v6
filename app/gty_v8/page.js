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
  { id: "information-architecture", label: "Information Architecture" },
  { id: "design-process", label: "Design Process" },
  { id: "development", label: "Development" },
  { id: "feature-enhancements", label: "Features" },
  { id: "results", label: "Results" },
  { id: "reflection", label: "Reflection" },
];

const page = () => {

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
            category="UX Design & Web Development"
            detail="Responsive Web"
            title="GTY Website, v.8"
            summary="Enhancing the user experience of GTY.org, the digital home for John MacArthur's teaching ministry, through the UX design and front-end development strategies that shaped version 8 of GTY's website."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
              { label: "Platform", value: "Responsive Web — Mobile & Desktop" },
              { label: "Team", value: "Digital Platforms Coordinator, Software Engineer, Software Developer" },
              { label: "Tools", value: "Visual Studio Code, Google's Material Design System, HandlebarsJS" },
            ]}
            image="/img/portfolio/gty8_design_0 - init.gif"
            imageAlt="GTY Website, v8"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>GTY.org &#40;Grace to You&#41; serves as the digital home for John MacArthur's teaching ministry, offering sermons, articles, and resources to a global audience. The ministry began in 1969 as a small tape ministry and has since evolved into a comprehensive media organization distributing biblical teaching through multiple channels.</p>
              <p>Despite its valuable resource offerings, GTY's previous website&mdash;version 7&mdash;faced usability challenges such as outdated design & UI elements and not being mobile-friendly. My role was to enhance the user experience while maintaining the trust of long-time users and strengthening the ministry's mission of &ldquo;Unleashing God's Truth, One Verse at a Time.&rdquo; This case study then examines the UX design and front-end development strategies that shaped version 8 of GTY's website.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty7_screenshot.jpg" alt="GTY 7 Screenshot" caption="Before" ratio="4 / 3" />
                <CaseFigure src="/img/portfolio/gty8_screenshot.jpg" alt="GTY 8 Screenshot" caption="After" ratio="4 / 3" />
              </CaseGrid>
            </CaseSection>

            {/* 02 — Problem */}
            <CaseSection id="problem" number={2} title="Problem Statement">
              <p>The primary challenges identified for the redesign included:</p>
              <ul className="cyril-case-list">
                <li><strong>Creating a mobile-responsive platform</strong> to accommodate more than 50% of visitors accessing the site from mobile devices</li>
                <li><strong>Improving content organization, navigation, and search functionality</strong> to enhance the discoverability of thousands of sermons and resources, which includes providing a topical index of all resources and materials</li>
                <li><strong>Developing a cross-device compatible media player with a playlist feature</strong> to replace an outdated Flash-based system, which would provide a seamless listening/watching experience even while navigating the site, and which would increase usage time and retention</li>
                <li><strong>Providing a 24/7 continuous streaming</strong> of John MacArthur's verse-by-verse teaching through the New Testament so users can tune in whenever they want, and listen for as long as they want, which would also increase usage time and retention</li>
                <li><strong>Designing a frictionless donation and product purchase process and experience</strong> that would increase customer satisfaction and ministry revenue</li>
                <li><strong>Developing personalized features and an account management system</strong> that would provide ways to increase engagement and synchronization</li>
              </ul>
            </CaseSection>

            {/* 03 — Research */}
            <CaseSection id="research" number={3} title="Research">

              <h3 className="cyril-case-subheading">Discovery &amp; UX Strategy</h3>
              <p>With the leadership of the Digital Platforms Coordinator, I started with a deep dive into user behavior—analyzing user demographics, traffic source & patterns, device usage, content consumption, bounce rates, and feedback from the customer service team. GTY has a loyal audience, many of whom aren't tech-savvy. That meant the new experience needed to feel intuitive, lightweight, and content-focused.</p>
              <p>Here's what I concentrated on during this phase:</p>
              <ul className="cyril-case-list">
                <li><strong>Accessibility & Responsiveness:</strong> The previous experience wasn't WCAG-compliant, especially for elderly users. Moreover, it wasn't mobile-friendly.</li>
                <li><strong>Content Organization and Findability:</strong> With decades of sermons and resources, the information architecture needed a major overhaul.</li>
                <li><strong>Aesthetic Sophistication and Simplicity:</strong> The brand is built on depth and clarity—this had to extend to the interface.</li>
                <li><strong>Performance:</strong> The previous site was sluggish, making streaming or reading difficult in low-bandwidth areas.</li>
              </ul>

              <h3 className="cyril-case-subheading">Competitive Analysis</h3>
              <p>I benchmarked GTY.org against similar platforms like Ligonier.org, DesiringGod.org, TruthForLife.org, etc., in terms of their content offerings, content & navigation structure, search functionality, audience engagement, UX, SEO, and technology stack.</p>
              <p>I then observed that, compared to other ministries and to set itself apart, GTY.org needed:</p>
              <ul className="cyril-case-list">
                <li>a <strong>single-page app</strong> experience</li>
                <li>a <strong>mobile-first</strong> content presentation and experience</li>
                <li>a persistent <strong>media player</strong></li>
                <li>a <strong>clean UI</strong> design</li>
                <li>an accessible <strong>topical index</strong></li>
                <li>a <strong>robust search</strong> functionality</li>
                <li>and better <strong>social media integration</strong></li>
              </ul>
            </CaseSection>

            {/* 04 — Information Architecture */}
            <CaseSection id="information-architecture" number={4} title="Information Architecture">

              <h3 className="cyril-case-subheading">Site Nav</h3>
              <p>Anchoring my efforts and decisions to analytics and user feedback, I worked with key stakeholders and the Digital Platforms Coordinator to clearly define the top-level navigation structure and content taxonomy:</p>
              <ul className="cyril-case-list">
                <li><strong>About:</strong> Information about Grace to You, John MacArthur, offices, and contact information</li>
                <li><strong>Broadcasts:</strong> Radio and television content, including shorter radio features and podcasts</li>
                <li><strong>Resources:</strong> Free teaching materials available in video, audio, reading, and print formats</li>
                <li><strong>Store:</strong> Purchasable materials, including Bibles, books, commentaries, and CDs</li>
                <li><strong>Apps:</strong> other platforms to enjoy the consumption of GTY content and resources</li>
                <li><strong>Blog:</strong> one of the most popular and engaging content on the site</li>
                <li><strong>Devotionals:</strong> the source of daily and consistent traffic</li>
                <li><strong>Sermons:</strong> the bread and butter of the site</li>
                <li><strong>Donate:</strong> makes giving readily accessible, like most ministries do</li>
              </ul>
              <p>This organization represents a strategic simplification, helping users quickly locate content based on their needs and interests.</p>
              <CaseFigure src="/img/portfolio/gty8_site-nav.jpg" alt="GTY 8 Site Nav" caption="Site Nav" />

              <h3 className="cyril-case-subheading">Site Tree</h3>
              <p>Mapping out the site tree was one of the most critical steps in aligning content structure with user intent. My goal wasn't just to reorganize&mdash;I wanted to make the vast library of biblical resources from GTY intuitive and discoverable, especially for users who might not know exactly what they're looking for.</p>
              <p>GTY is content-rich: thousands of sermons, articles, Q&As, devotionals, books, and more. But without a clear and intuitive structure, even the best content can get buried. So I treated the site tree as a content strategy blueprint—where information architecture met user experience.</p>
              <CaseFigure src="/img/portfolio/gty8_site-tree.jpg" alt="GTY 8 Site Tree" caption="Site Tree" />
            </CaseSection>

            {/* 05 — Design Process */}
            <CaseSection id="design-process" number={5} title="Design Process">

              <h3 className="cyril-case-subheading">UI Inventory</h3>
              <p>Based on the Site Nav and the Site Tree, I conducted a comprehensive UI inventory. This process was critical for understanding the existing interface landscape, identifying redundancies, and aligning our new design system with actual user needs and organizational goals. This was important. Before diving into wireframes or visual concepts, I wanted to make sure we had a complete grasp of what was already on the site.</p>
              <p>GTY had evolved over time with many departments contributing content, and as a result, the interface had grown organically—sometimes inconsistently. A UI inventory allowed me to take stock of every component, interaction, and user-facing feature currently in use.</p>
              <CaseGrid layout="three">
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-1.jpg" alt="GTY 8 UI Inventory" caption="UI Inventory 1" />
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-2.jpg" alt="GTY 8 UI Inventory 2" caption="UI Inventory 2" />
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-3.jpg" alt="GTY 8 UI Inventory 3" caption="UI Inventory 3" />
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-4.jpg" alt="GTY 8 UI Inventory 4" caption="UI Inventory 4" />
                <CaseFigure src="/img/portfolio/gty8_ui-inventory-5.jpg" alt="GTY 8 UI Inventory 5" caption="UI Inventory 5" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">User Stories</h3>
              <p>I grounded the entire GTY redesign process in user-centered thinking. Working with the Digital Platforms Coordinator, I gathered user stories to use as the tool to capture real-world behaviors, goals, and contexts of our audience. These weren't hypothetical personas&mdash;they were distilled from actual usage data, support requests, and internal ministry insights.</p>
              <p>GTY's audience is diverse: pastors, laypeople, new believers, long-time followers, Spanish speakers, students, and more. User stories helped unify that complexity into clear, actionable narratives that guided everything from page layouts to content hierarchy to UI components.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty8_user-stories-1.jpg" alt="GTY 8 User Stories 1" caption="User Stories 1" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty8_user-stories-2.jpg" alt="GTY 8 User Stories 2" caption="User Stories 2" ratio="3 / 4" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/gty8_user-stories-3.jpg" alt="GTY 8 User Stories 3" caption="User Stories 3" />

              <h3 className="cyril-case-subheading">Producing Mockups</h3>
              <p>As the web designer and developer, creating mockups was one of the most exciting and foundational stages of the project. It's where the team's carefully planned ideas began to take visual shape. I ensured that design and function started working in harmony. And here's what I aimed for:</p>
              <ul className="cyril-case-list">
                <li><strong>Project Team and Stakeholder Alignment:</strong> By producing mockups, I prioritized alignment with the stakeholders—managers, content creators, and the engineering team. With the Digital Platforms Coordinator's supervision, I held collaborative sessions where we clarified the project's goals, user needs, and brand voice. This helped me avoid unnecessary revisions down the road, ensuring everyone felt seen and heard from the start.</li>
                <li><strong>Clean, Minimal, yet Sophisticated Theming and Design:</strong> I wanted the theme to communicate depth and sophistication. And so I designed the UI to feel intuitive and elegant. I wanted every element to have a purpose and so I eliminated any clutter. Though minimalistic in my approach, I didn't want the site to be bland. I wanted the user to focus on interacting with the content while subtly being guided by the layout, navigation, and everything else in the platform.</li>
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

              <h3 className="cyril-case-subheading">Visual Direction—Font, Color, and Layout Choices</h3>
              <p>Working with GTY's design agency partner—WeKreative—I proposed font choices that they immediately loved and approved. Those fonts were carefully picked for legibility and clarity across platforms, whether on digital materials or print. For the serif font, I picked Google's Lora, which would be used for long-format content such as blog posts, articles, transcripts, and devotionals. And for the sans-serif font, I picked Lato, which would be used for titles and short-format copy. For the color palette, WeKreative provided it so that the website would be aligned with GTY's brand, which had been consistent with the print materials that WeKreative had been producing.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty8_fonts.jpg" alt="GTY 8 Fonts" caption="Fonts" ratio="3 / 4" />
                <CaseFigure src="/img/portfolio/gty8_colors.jpg" alt="GTY 8 Colors" caption="Colors" ratio="3 / 4" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">Style Guide Preparation and Creation</h3>
              <p>Once the design language was solidified, I compiled a detailed style guide to document all visual and functional components. This included typography rules, color palette, spacing systems, and interaction patterns. It became the single source of truth for the entire team, ensuring consistency across pages, devices, and future iterations. It was a creative and strategic tool—crucial for scaling design efficiently.</p>
              <CaseFigure src="/img/portfolio/gty8_style-guide-creation.jpg" alt="GTY 8 Style Guide Creation" caption="Style Guide Creation" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 06 — Software Architecture and Development Process */}
            <CaseSection id="development" number={6} title="Software Architecture and Development Process">
              <p>As the web designer and developer, I played a key role in shaping the visual and functional aspects of GTY version 8. With the leadership of and working closely with the Digital Platforms Coordinator, I helped:</p>
              <ul className="cyril-case-list">
                <li>translate high-level business goals into clear technical requirements and user-centric design solutions</li>
              </ul>
              <p>We collaborated to:</p>
              <ul className="cyril-case-list">
                <li>define feature scopes</li>
                <li>prioritize enhancements</li>
                <li>ensure the user experience aligned with the overall vision for the project</li>
              </ul>
              <p>On the technical side, I worked closely with the Software Engineer and the Software Developer to design a scalable and modular software architecture. While the Engineer and the Developer handled data modeling, API development, server-side logic, and programming, I focused on:</p>
              <ul className="cyril-case-list">
                <li>front-end web development&mdash;ensuring seamless integration of the UI with back-end services through APIs and efficient state management</li>
              </ul>
              <p>Together, we enhanced existing features and introduced new ones, iterating based on user feedback, performance metrics, and stakeholder decisions. Our joint effort ensured the platform was visually appealing, robust, maintainable, and future-proof.</p>

              <h3 className="cyril-case-subheading">Mobile-First Responsive Design &amp; Development Principles</h3>
              <p>Prior to this version 8 overhaul, more than 50% of visitors accessed the site via mobile devices despite lacking proper mobile optimization. As a team, we prioritized responsive web design principles, ensuring content rendering in beautiful harmony with the user's particular device and screen size. This technical achievement involved:</p>
              <ul className="cyril-case-list">
                <li>fluid grid layouts adapting to viewport dimensions</li>
                <li>flexible images scaling proportionally across devices</li>
                <li>media queries serving optimized CSS for different breakpoints</li>
                <li>touch-friendly interface elements replacing desktop-centric controls</li>
              </ul>
              <p>The responsive approach eliminated pinch-zooming and horizontal scrolling issues that previously hindered mobile users. By embracing mobile-first principles, the ministry acknowledged shifting user behavior patterns while maintaining full functionality for desktop visitors.</p>

              <h3 className="cyril-case-subheading">Technology Stack</h3>
              <p>As the development team, we wanted to ensure the website would be a modern, high-performing platform. We wanted to use an application that would offer scalability and robust architecture. We wanted it to be a responsive, accessible, and SEO-friendly website with reusable UI components. And so we made informed decisions to use:</p>
              <ul className="cyril-case-list">
                <li><strong>ASP.NET Core MVC (Model-View-Controller)</strong> as the application framework and solution that will enable GTY.org to be a modern, robust, and high-performing platform that it needs to be</li>
                <li><strong>Google's Material Design System</strong> which implements modern HTML5, CSS3, and JavaScript practices for SEO optimization, accessibility, mobile-friendly & responsive layouts, consistent & modern design, and customizable and reusable UI components with pleasing micro-interactions</li>
                <li><strong>Modern JavaScript frameworks and libraries</strong> for interactive elements, particularly the custom media player</li>
                <li><strong>APIs</strong> for integrating with podcast systems and other distribution channels</li>
              </ul>

              <h3 className="cyril-case-subheading">Code Prototyping</h3>
              <p>Due to resource and time constraints, and with the approval of the Digital Platforms Coordinator, I decided to design the high-fidelity prototypes on the browser by coding in Visual Studio Code, making the prototypes production-ready. Because we already had a defined information architecture, I leveraged <strong>Google's Material Design System</strong> and started prototyping the site's MVPs on the browser.</p>
              <ul className="cyril-case-list">
                <li>With several windows in various screen sizes opened, I started <strong>code-designing</strong> the global components such as the navigation, footer, media player layer, search layer, cart and wishlist layer, and registration and sign-in layer.</li>
              </ul>
              <CaseVideo src="/img/portfolio/gty8_code-prototyping_mobile.mp4" caption="Code Prototyping — Mobile" size="phone" />
              <ul className="cyril-case-list">
                <li>I then tackled the homepage, about pages, resource pages, giving pages, the store, product pages, checkout page, and account pages.</li>
              </ul>
              <CaseVideo src="/img/portfolio/gty8_homepage.mp4" caption="Homepage" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_about.mp4" caption="About Pages" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_resources.mp4" caption="Resource Pages" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_giving.mp4" caption="Giving Pages" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_store.mp4" caption="Store, Product & Checkout Pages" url="gty.org" />
              <CaseVideo src="/img/portfolio/gty8_account.mp4" caption="Account Pages" url="gty.org" />
              <ul className="cyril-case-list">
                <li>I used HandlebarsJS to mock up and template the data and content so that I could freely and more efficiently design and develop without unnecessarily burdening and interfering with the back-end side of the development. This allowed the Software Engineer and the Software Developer to focus on the back-end side of the development at the same time as I would progress with cutting up the pages.</li>
                <li><strong>Subtle, yet Pleasing UI Micro-interactions:</strong> To make the user's journey and experience more delightful, I added micro-interactions&mdash;elements such as button animations, hover effects, and component and page transitions.</li>
              </ul>
              <CaseVideo src="/img/portfolio/gty8_micro-interactions.mp4" caption="Micro-interactions" url="gty.org" />
            </CaseSection>

            {/* 07 — Feature Enhancements */}
            <CaseSection id="feature-enhancements" number={7} title="Feature Enhancements">

              <h3 className="cyril-case-subheading">Custom Media Player with Smart Transcript</h3>
              <p>One of this project's most significant technical achievements was the development of a custom-built media player to replace the previous Flash-based one. The new player offers:</p>
              <ul className="cyril-case-list">
                <li><strong>Cross-device compatibility</strong> where iOS and Android devices would not be a problem</li>
                <li><strong>Background playback continuity</strong> where the playback of audio or video persists when navigating between pages or switching browser tabs</li>
                <li><strong>Playlist functionality</strong> allowing users to queue multiple sermons</li>
                <li><strong>Smart Transcript feature</strong>, which synchronizes transcripts with their corresponding audio, highlighting phrases as they are spoken. This allows users to easily read along while listening to the sermon. Users can also start the audio at any point in the transcript by clicking on any word.</li>
                <li><strong>YouTube and Podcast distribution systems</strong> integration</li>
                <li><strong>Sermon downloads</strong> in MP3 or MP4 format</li>
              </ul>
              <p>This player is a cornerstone feature, directly supporting the ministry's primary mission of distributing biblical teaching.</p>

              <h3 className="cyril-case-subheading">Enhanced Content Search and Discoverability</h3>
              <p>Beyond structural changes, we improved content retrieval through:</p>
              <ul className="cyril-case-list">
                <li><strong>Predictive Search:</strong> Context-aware suggestions for biblical passages and topics</li>
                <li><strong>Featured Content Modules/Slides:</strong> Editorial curation of popular and current blog series, timely and free resources, discounted products, and important announcements</li>
                <li><strong>Taxonomic Filtering:</strong> Sermon browsing by book, chapter, verse, or topic</li>
                <li><strong>Related Content Suggestions:</strong> Curated recommendations based on current page context</li>
              </ul>
              <p>These features work synergistically to help both new visitors and longtime followers locate relevant materials efficiently. The search functionality particularly benefits users seeking specific exegetical studies, reflecting John MacArthur's verse-by-verse teaching methodology.</p>

              <h3 className="cyril-case-subheading">User Account Ecosystem</h3>
              <p>To create more and new ways for engagement, we personalized the following features:</p>
              <ul className="cyril-case-list">
                <li><strong>Progress Tracking:</strong> Resume playback across sessions via session and authenticated access</li>
                <li><strong>Content Playlists:</strong> User-specific sermon collections persisting across devices</li>
                <li><strong>Notification Preferences:</strong> Customizable alerts for new content releases</li>
                <li><strong>Cross-Device Synchronization:</strong> Seamless transition between web and mobile app experiences</li>
              </ul>
              <p>Account system development required secure OAuth implementation and GDPR-compliant data practices, including clear privacy policy disclosures and granular consent management, especially in the EU. These features foster long-term user engagement while respecting evolving data protection regulations.</p>

              <h3 className="cyril-case-subheading">Accessibility and Compliance</h3>
              <p>We addressed multiple accessibility concerns and requirements:</p>
              <ul className="cyril-case-list">
                <li><strong>WCAG 2.1 Compliance:</strong> Improved contrast ratios and keyboard navigation support</li>
                <li><strong>GDPR Adherence:</strong> EU user data protections implemented ahead of 2018 deadlines</li>
                <li><strong>Semantic HTML:</strong> Proper heading hierarchies and ARIA labels for screen readers</li>
                <li><strong>Alternative Media Delivery:</strong> Transcript availability alongside audio/video content</li>
              </ul>
              <p>These considerations expanded the ministry's reach to users with disabilities while mitigating legal risks in international markets. The GDPR implementation involved substantial backend modifications, including data encryption at rest and in transit.</p>

              <h3 className="cyril-case-subheading">Multimedia Resource Hub</h3>
              <p>The website functions as a centralized distribution point for diverse content formats:</p>
              <ul className="cyril-case-list">
                <li><strong>Sermon Archives:</strong> 50+ years of sermon recordings in downloadable MP3 and MP4 format</li>
                <li><strong>Video Library:</strong> Studio-quality productions of conference messages and Q&A sessions</li>
                <li><strong>Textual Resources:</strong> Printable PDF manuscripts and blog-style articles</li>
                <li><strong>Live Streaming:</strong> Real-time broadcast capabilities for special events</li>
              </ul>
              <p>Resource diversification accommodates varied learning preferences while maintaining consistent theological messaging. The technical infrastructure supports scalable media storage and content delivery network (CDN) integration for global performance.</p>

              <h3 className="cyril-case-subheading">Integrated Content Ecosystem Strategy</h3>
              <p>While primarily a web property, we designed and developed the platform to connect to broader ministry initiatives:</p>
              <ul className="cyril-case-list">
                <li><strong>Mobile App Syncing:</strong> Shared authentication with iOS/Android applications</li>
                <li><strong>Podcast Distribution:</strong> RSS feed generation for third-party platform syndication</li>
                <li><strong>E-Commerce Integration:</strong> Secure checkout system for physical and digital product sales</li>
                <li><strong>Email Newsletter System:</strong> Content updates and devotional series delivery</li>
                <li><strong>Social Media Platforms Integration:</strong> Seamless content sharing and engagement through integrations with Facebook, Instagram, X (formerly Twitter), Vimeo, and YouTube</li>
              </ul>
              <p>This ecosystem approach creates multiple entry points for user engagement while maintaining centralized content management. The decision to sunset legacy apps and favor unified web technologies demonstrates an ongoing commitment to platform coherence.</p>

              <h3 className="cyril-case-subheading">Performance Considerations</h3>
              <p>Performance optimization was crucial for a content-rich site with extensive media resources. We then employed techniques such as:</p>
              <ul className="cyril-case-list">
                <li>Lazy loading of images and media content</li>
                <li>Progressive enhancement for varying connection speeds</li>
                <li>Caching strategies for frequently accessed content</li>
                <li>Optimized media delivery formats</li>
                <li>Minified code by reducing CSS/JS payload sizes through build processes</li>
              </ul>
              <p>These techniques help maintain sub-3-second load times despite complex page compositions.</p>
            </CaseSection>

            {/* 08 — Results */}
            <CaseSection id="results" number={8} title="Results">
              <p>The Grace to You website redesign successfully serves its loyal and new audience while perpetuating the ministry's 50+ year legacy through:</p>
              <CaseStats items={[
                { value: "+38%", label: "Engagement, mobile users" },
                { value: "50%", label: "More usage time, desktop" },
                { value: "~25%", label: "Monthly lift in sermon plays & downloads" },
                { value: "27%", label: "Faster page loads" },
              ]} />
              <ul className="cyril-case-list">
                <li><strong>Improved user engagement across devices</strong>, particularly a <strong>+38% increase</strong> for mobile users and a <strong>50% increase in usage time</strong> for desktop users</li>
                <li><strong>Monthly increase of ~25% in sermon plays and downloads</strong> through the enhanced media player since its launch</li>
                <li><strong>Greater exposure and accessibility of promoted and featured content</strong>, such as blog posts, free resource offers, and product sales, as evidenced by Google Analytics and heatmaps</li>
                <li><strong>User donation and product purchase experience and satisfaction are up</strong>, based on email feedback, calls, and support tickets</li>
                <li><strong>27% faster page loads</strong> across the board</li>
                <li><strong>Significantly improved accessibility scores</strong>, with Lighthouse ratings over 90</li>
              </ul>
              <p>But more than metrics, the site now reflects the clarity, simplicity, quality, and timelessness of John MacArthur's preaching and teaching. It's a testament to the ministry's commitment to providing high-quality, timeless content that resonates with the audience.</p>
            </CaseSection>

            {/* 09 — Reflection */}
            <CaseSection id="reflection" number={9} title="Reflection">
              <CaseQuote>
                The best UX isn&apos;t necessarily flashy&mdash;it&apos;s subtle and almost invisible.
              </CaseQuote>
              <p>Working on version 8 of GTY.org reminded me that the best UX isn't necessarily flashy—it's subtle and almost invisible. It gets out of the way so people can engage with the platform successfully and deeply, and that's exactly what we achieved here.</p>
              <p>Working with a small team, while we all juggle other projects and responsibilities, I'm privileged to have contributed significantly to the craftsmanship, well-thought-out information architecture, user-centric decisions, and technological improvements that have made this platform more responsive, accessible, usable, and modern while staying true to the ministry's commitment of &ldquo;Unleashing God's Truth, One Verse at a Time.&rdquo;</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-dashboard"
            title="GTY Dashboard"
            category="UI Design & Front-End"
            image="/img/portfolio/thumb_gty-dashboard.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
