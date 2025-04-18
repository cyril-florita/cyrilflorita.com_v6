"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    const projectId = 'gty8'; // This is the current project

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
              <img src="/img/portfolio/main_gty8.jpg" alt="cover" />
              <h2 className="cyril-mt-60">Grace to You Website, v.8</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">UX Design & Front-End Development</span>
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
                      <p className="cyril-mt-20">Web Designer & Developer</p>
                    </div>
                    <div className="col-md-4 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Start / Launch Date:</p>
                      <p className="cyril-mt-20">Feb. 2015 / Feb. 2017</p>
                    </div>
                  </div>

                  <div className="cyril-divider cyril-mb-60" />

                  <h4 className="cyril-up cyril-mb-30 cyril-text-center">Project Overview</h4>
                  <p>GTY.org &#40;Grace to You&#41; serves as the digital home for John MacArthur's teaching ministry, offering sermons, articles, and resources to a global audience. The ministry began in 1969 as a small tape ministry and has since evolved into a comprehensive media organization distributing biblical teaching through multiple channels.</p>
                  <p className="cyril-mt-40">
                    This case study examines the UX design and front-end development strategies that shaped version 8 of GTY's website. When I joined the organization, version 7 was content-rich but was visually dated, not mobile-responsive, and functionally fragmented across platforms. My job was to elevate the user experience and modernize its front-end architecture without compromising the trust and familiarity that long-time users valued while strengthening the ministry's mission of &ldquo;Unleashing God's Truth, One Verse at a Time.&ldquo;
                  </p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Problem Statement</h4>
                  <dl className="w-disc">
                    <dt>The primary challenges identified for the redesign included:</dt>
                    <dd><strong>Creating a mobile-responsive platform</strong> to accommodate more than 50% of visitors accessing the site from mobile devices</dd>
                    <dd><strong>Improving content organization, navigation, and search functionality</strong> to enhance the discoverability of thousands of sermons and resources, which includes providing a topical index of all resources and materials</dd>
                    <dd>
                      <strong>Developing a cross-device compatible media player with a playlist feature</strong> to replace an outdated Flash-based system, which would provide a seamless listening/watching experience even while navigating the site, and which would increase usage time and retention
                    </dd>
                    <dd>
                      <strong>Providing a 24/7 continuous streaming</strong> of John MacArthur's verse-by-verse teaching through the New Testament so users can tune in whenever they want, and listen for as long as they want, which would also increase usage time and retention
                    </dd>
                    <dd>
                      <strong>Designing a frictionless donation and product purchase process and experience</strong> that would increase customer satisfaction and ministry revenue
                    </dd>
                    <dd>
                      <strong>Developing personalized features and an account management system</strong> that would provide ways to increase engagement and synchronization
                    </dd>
                  </dl>
                  
                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Research</h4>

                  <dl className="no-disc">
                    <dt>Discovery & UX Strategy</dt>
                    <dd>
                      With the help of the Internet Ministry Coordinator, I started with a deep dive into user behavior—analyzing user demographics, traffic source & patterns, device usage, content consumption, bounce rates, and feedback from the support team. GTY has a loyal audience, many of whom aren't tech-savvy. That meant the new experience needed to feel intuitive, lightweight, and content-focused.<br /><br />
                      Here's what I concentrated on during this phase:
                      <dl className="w-disc">
                        <dd><strong>Accessibility & Responsiveness:</strong> The previous experience wasn't WCAG-compliant, especially for elderly users. Moreover, it wasn't mobile-friendly.</dd>
                        <dd><strong>Content Organization and Findability:</strong> With decades of sermons and resources, the information architecture needed a major overhaul.</dd>
                        <dd><strong>Aesthetic Sophistication and Simplicity:</strong> The brand is built on depth and clarity—this had to extend to the interface</dd>
                        <dd><strong>Performance:</strong> The previous site was sluggish, making streaming or reading difficult in low-bandwidth areas.</dd>
                      </dl>
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Competitive Analysis</dt>
                    <dd>
                      I benchmarked GTY.org against similar platforms like Ligonier.org, DesiringGod.org, TruthForLife.org, etc., in terms of their content offerings, content & navigation structure, search functionality, audience engagement, UX, SEO, and technology stack.
                    </dd>
                    <dd>
                      I then observed that GTY.org needed a clean UI design, an accessible topical index, a robust search functionality, a mobile-first content presentation and experience, and better social media integration.
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Information Architecture</dt>
                    <dd>
                      Anchoring my efforts and decisions to analytics and user feedback, I worked with key stakeholders and the Internet Ministry Coordinator to clearly define the top-level navigation structure and content taxonomy:
                      <dl className="w-disc">
                        <dd><strong>About:</strong> Information about Grace to You, John MacArthur, offices, and contact information</dd>
                        <dd><strong>Broadcasts:</strong> Radio and television content, including shorter radio features and podcasts</dd>
                        <dd><strong>Resources:</strong> Free teaching materials available in video, audio, reading, and print formats</dd>
                        <dd><strong>Store:</strong> Purchasable materials, including Bibles, books, commentaries, and CDs</dd>
                        <dd><strong>Apps:</strong> other platforms to enjoy the consumption GTY content and resources</dd>
                        <dd><strong>Blog:</strong> one of the most popular and engaging content on the site</dd>
                        <dd><strong>Devotionals:</strong> the source of daily and consistent traffic</dd>
                        <dd><strong>Sermons:</strong> the bread and butter of the site</dd>
                        <dd><strong>Donate:</strong> makes giving readily accessible, like most ministries do</dd>
                      </dl>
                    </dd>
                    <dd>
                      This organization represents a strategic simplification, helping users quickly locate content based on their needs and interests.
                    </dd>
                  </dl>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Software Architecture and Feature Enhancements</h4>
                  <p>
                    As the web designer and developer, I played a key role in shaping the visual and functional aspects of GTY version 8. Working closely with the Internet Ministry Coordinator, I helped translate high-level business goals into clear technical requirements and user-centric design solutions. We collaborated to define feature scopes, prioritize enhancements, and ensure the user experience aligned with the overall project vision.
                  </p>
                  <p className="cyril-mt-40">
                    On the technical side, I worked closely with the Software Engineer and the Software Developer to design a scalable and modular software architecture. While the Engineer and the Developer handled data modeling, API development, server-side logic, and programming, I focused on front-end implementation—ensuring seamless integration with back-end services through APIs and efficient state management.
                  </p>
                  <p className="cyril-mt-40">
                    Together, we enhanced existing features and introduced new ones, iterating based on user feedback, performance metrics, and stakeholder decisions. Our joint effort ensured the platform was visually appealing, robust, maintainable, and future-proof.
                  </p>

                  <dl className="no-disc cyril-mt-40">
                    <dt>Technology Stack</dt>
                    <dd>
                      The project team made informed decisions to use:
                      <dl className="w-disc">
                        <dd><strong>ASP.NET Core MVC (Model-View-Controller)</strong> as the application framework and solution that will enable GTY.org to be a modern, robust, and high-performing platform that it needs to be</dd>
                        <dd><strong>Google's Material Design System</strong> which implements modern HTML5, CSS3, and JavaScript practices for SEO optimization, accessibility, mobile-friendly & responsive layouts, consistent & modern design, and customizable and reusable UI components with pleasing micro-interactions.</dd>
                        <dd><strong>Modern JavaScript frameworks and libraries</strong> for interactive elements, particularly the custom media player</dd>
                        <dd><strong>APIs</strong> for integrating with podcast systems and other distribution channels</dd>
                      </dl>
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Mobile-First Responsive Design</dt>
                    <dd>
                      Prior to the 2017 overhaul, more than 50% of visitors accessed the site via mobile devices despite lacking proper mobile optimization. As a team, we prioritized responsive web design principles, ensuring content rendering in beautiful harmony with the user's particular device and screen size. This technical achievement involved:
                      <dl className="w-disc">
                        <dd>Fluid grid layouts adapting to viewport dimensions</dd>
                        <dd>Flexible images scaling proportionally across devices</dd>
                        <dd>Media queries serving optimized CSS for different breakpoints</dd>
                        <dd>Touch-friendly interface elements replacing desktop-centric controls</dd>
                      </dl>
                    </dd>
                    <dd>
                      The responsive approach eliminated pinch-zooming and horizontal scrolling issues that previously hindered mobile users. By embracing mobile-first principles, the ministry acknowledged shifting user behavior patterns while maintaining full functionality for desktop visitors.
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Custom Media Player with Smart Transcript</dt>
                    <dd>
                      One of this project's most significant technical achievements was the development of a custom-built media player to replace the previous Flash-based one. The new player offers:
                      <dl className="w-disc">
                        <dd><strong>Cross-device compatibility</strong> where iOS and Android devices would not be a problem</dd>
                        <dd><strong>Background playback continuity</strong> where the playback of audio or video persists when navigating between pages or switching browser tabs</dd>
                        <dd><strong>Playlist functionality</strong> allowing users to queue multiple sermons</dd>
                        <dd><strong>Smart Transcript feature</strong>, which synchronizes transcripts with their corresponding audio, highlighting phrases as they are spoken. This allows users to easily read along while listening to the sermon. Users can also start the audio at any point in the transcript by clicking on any word.</dd>
                        <dd><strong>YouTube and Podcast distribution systems</strong> integration</dd>
                        <dd><strong>Sermon downloads</strong> in MP3 or MP4 format</dd>
                      </dl>
                    </dd>
                    <dd>
                      This player is a cornerstone feature, directly supporting the ministry's primary mission of distributing biblical teaching.
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Enhanced Content Search and Discoverability</dt>
                    <dd>
                      Beyond structural changes, we improved content retrieval through:
                      <dl className="w-disc">
                        <dd><strong>Predictive Search:</strong> Context-aware suggestions for biblical passages and topics</dd>
                        <dd><strong>Featured Content Modules/Slides:</strong> Editorial curation of popular and current blog series, timely and free resources, discounted products, and important announcements</dd>
                        <dd><strong>Taxonomic Filtering:</strong> Sermon browsing by book, chapter, verse, or topic</dd>
                        <dd><strong>Related Content Suggestions:</strong> Curated recommendations based on current page context</dd>
                      </dl>
                    </dd>
                    <dd>
                      These features work synergistically to help both new visitors and longtime followers locate relevant materials efficiently. The search functionality particularly benefits users seeking specific exegetical studies, reflecting John MacArthur's verse-by-verse teaching methodology
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>User Account Ecosystem</dt>
                    <dd>
                      To create more and new ways for engagement, we personalized the following features:
                      <dl className="w-disc">
                        <dd><strong>Progress Tracking:</strong> Resume playback across sessions via session and authenticated access</dd>
                        <dd><strong>Content Playlists:</strong> User-specific sermon collections persisting across devices</dd>
                        <dd><strong>Notification Preferences:</strong> Customizable alerts for new content releases</dd>
                        <dd><strong>Cross-Device Synchronization:</strong> Seamless transition between web and mobile app experiences</dd>
                      </dl>
                    </dd>
                    <dd>
                      Account system development required secure OAuth implementation and GDPR-compliant data practices, including clear privacy policy disclosures and granular consent management, especially in the EU. These features foster long-term user engagement while respecting evolving data protection regulations.
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Accessibility and Compliance</dt>
                    <dd>
                      We addressed multiple accessibility concerns and requirements:
                      <dl className="w-disc">
                        <dd><strong>WCAG 2.1 Compliance:</strong> Improved contrast ratios and keyboard navigation support</dd>
                        <dd><strong>GDPR Adherence:</strong> EU user data protections implemented ahead of 2018 deadlines</dd>
                        <dd><strong>Semantic HTML:</strong> Proper heading hierarchies and ARIA labels for screen readers</dd>
                        <dd><strong>Alternative Media Delivery:</strong> Transcript availability alongside audio/video content</dd>
                      </dl>
                    </dd>
                    <dd>
                      These considerations expanded the ministry's reach to users with disabilities while mitigating legal risks in international markets. The GDPR implementation involved substantial backend modifications, including data encryption at rest and in transit.
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Multimedia Resource Hub</dt>
                    <dd>
                      The website functions as a centralized distribution point for diverse content formats:
                      <dl className="w-disc">
                        <dd><strong>Sermon Archives:</strong> 50+ years of sermon recordings in downloadable MP3 and MP4 format</dd>
                        <dd><strong>Video Library:</strong> Studio-quality productions of conference messages and Q&A sessions</dd>
                        <dd><strong>Textual Resources:</strong> Printable PDF manuscripts and blog-style articles</dd>
                        <dd><strong>Live Streaming:</strong> Real-time broadcast capabilities for special events</dd>
                      </dl>
                    </dd>
                    <dd>
                      Resource diversification accommodates varied learning preferences while maintaining consistent theological messaging. The technical infrastructure supports scalable media storage and content delivery network (CDN) integration for global performance.
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Integrated Content Ecosystem Strategy</dt>
                    <dd>
                      While primarily a web property, we designed and developed the platform to connect to broader ministry initiatives:
                      <dl className="w-disc">
                        <dd><strong>Mobile App Syncing:</strong> Shared authentication with iOS/Android applications</dd>
                        <dd><strong>Podcast Distribution:</strong> RSS feed generation for third-party platform syndication</dd>
                        <dd><strong>E-Commerce Integration:</strong> Secure checkout system for physical and digital product sales</dd>
                        <dd><strong>Email Newsletter System:</strong> Content updates and devotional series delivery</dd>
                        <dd><strong>Social Media Platforms Integration:</strong> Seamless content sharing and engagement through integrations with Facebook, Instagram, X (formerly Twitter), Vimeo, and YouTube</dd>
                      </dl>
                    </dd>
                    <dd>
                      This ecosystem approach creates multiple entry points for user engagement while maintaining centralized content management. The decision to sunset legacy apps and favor unified web technologies demonstrates an ongoing commitment to platform coherence.
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Performance Considerations</dt>
                    <dd>
                      Performance optimization was crucial for a content-rich site with extensive media resources. We then employed techniques such as:
                      <dl className="w-disc">
                        <dd>Lazy loading of images and media content</dd>
                        <dd>Progressive enhancement for varying connection speeds</dd>
                        <dd>Caching strategies for frequently accessed content</dd>
                        <dd>Optimized media delivery formats</dd>
                        <dd>Minified code by reducing CSS/JS payload sizes through build processes</dd>
                      </dl>
                    </dd>
                    <dd>
                      These techniques help maintain sub-3-second load times despite complex page compositions.
                    </dd>
                  </dl>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Design and Development Process</h4>
                  
                  <dl className="no-disc">
                    <dt>Producing Mockups and Prototypes</dt>
                    <dd>
                      As the web designer and developer, creating mockups and prototypes were the most exciting and foundational stages of the project. It's where the team's carefully planned ideas began to take visual shape, and I ensured that design and function started working in harmony. Here's what I aimed for:
                      <dl className="w-disc">
                        <dd>
                          <strong>Project Team and Stakeholder Alignment:</strong> By producing mockups, I prioritized alignment with the stakeholders—managers, content creators, and the engineering team. With the Internet Ministry Coordinator's supervision, I held collaborative sessions where we clarified the project's goals, user needs, and brand voice. This helped me avoid unnecessary revisions down the road, ensuring everyone felt seen and heard from the start.
                        </dd>
                        <dd>
                          <strong>Clean, Minimal, yet Sophisticated Theming and Design:</strong> My design approach leaned heavily on simplicity without sacrificing depth and sophistication. I strived to design interfaces that felt intuitive and elegant—where every element had a purpose, and clutter was eliminated. To me, minimal design doesn't mean bland; it means the user's focus is guided exactly where it needs to be, with subtle layers of refinement that elevate the experience.
                        </dd>
                        <dd>
                          <strong>Visual Direction—Font, Color, and Layout Choices:</strong> Working with GTY's design agency partner—WeKreative—I proposed font choices that they immediately loved and approved. Those fonts were carefully picked for legibility and clarity across platforms, whether on digital materials or print. For the serif font, I picked Google's Lora, which would be used for long-format content such as blog posts, articles, transcripts, and devotionals. And for the san-serif font, I picked Lato, which would be used for titles and short-format copy. For the color palette, WeKreative provided it so that the website would be aligned with GTY's brand, which had been consistent with the print materials that WeKreative had producing.
                        </dd>
                        <dd>
                          <strong>Subtle, yet Pleasing UI Micro-interactions:</strong> This is where the experience really comes alive. I incorporated micro-interactions—like button animations, hover effects, and component and page transitions—to bring a joyful and pleasant experience to the user's journey on the website. These small touches may go unnoticed when done right, but they make the interface feel polished and professional. I always think about how these interactions to enhance usability while adding delight.
                        </dd>
                        <dd>
                          <strong>Style Guide Preparation and Creation:</strong> Once the design language is solidified, I compile a detailed style guide to document all visual and functional components. This includes typography rules, color palette, spacing systems, and interaction patterns. It becomes the single source of truth for the entire team, ensuring consistency across pages, devices, and future iterations. It was a creative and strategic tool—crucial for scaling design efficiently.
                        </dd>
                      </dl>
                    </dd>
                  </dl>

                  <dl className="no-disc">
                    <dt>Designing on the Browser</dt>
                    <dd>
                      Due to resource and time constraints, and with the approval of the Digital Platforms Coordinator, I decided to design and develop the high-fidelity version of the pages on the browser.
                    </dd>
                    <dd>
                      With defined information architecture, while leveraging <strong>Google's Material Design System</strong> and taking a <strong>mobile-first approach</strong>, I designed and developed the site's MVPs. With several windows in various screen sizes opened, I started <strong>code-designing</strong> the global components such as the navigation, footer, media player layer, search layer, cart and wishlist layer, and registration and sign-in layer.
                    </dd>
                    <dd>
                      I then tackled the homepage, about pages, resource pages, giving pages, the store, product pages, checkout page, and account pages.
                    </dd>
                    <dd>
                      I used HandlebarsJS to mock up and template the data and content so that I could freely and more efficiently design and develop without unnecessarily burdening and interfering with the back-end side of the development. This allowed the Software Engineer and the Software Developer to focus on the back-end side of the development at the same time as I would progress with cutting up the pages.
                    </dd>
                  </dl>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Results</h4>
                  <p className="cyril-mb-20">
                    The Grace to You website redesign successfully serves its loyal and new audience while perpetuating the ministry's 50+ year legacy through:
                  </p>
                  <dl className="w-disc">
                    <dd><strong>Improved user engagement across devices</strong>, particularly a <strong>+38% increase</strong> for mobile users and a <strong>50% increase in usage time</strong> for desktop users</dd>
                    <dd><strong>Monthly increase of ~25% in sermon plays and downloads</strong> through the enhanced media player since its launch</dd>
                    <dd><strong>Greater exposure and accessibility of promoted and featured content</strong>, such as blog posts, free resource offers, and product sales, as evidenced by Google Analytics and heatmaps</dd>
                    <dd><strong>User donation and product purchase experience and satisfaction are up</strong>, based on email feedback, calls, and support tickets</dd>
                    <dd><strong>27% faster page loads</strong> across the board</dd>
                    <dd><strong>Significantly improved accessibility scores</strong>, with Lighthouse ratings over 90</dd>
                  </dl>
                  <p className="cyril-mt-30">
                    But more than metrics, the site now reflects the clarity, simplicity, quality, and timelessness of John MacArthur's preaching and teaching
                  </p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Reflection</h4>
                  <p>
                    Working on version 8 of GTY.org reminded me that the best UX isn't necessarily flashy—it's subtle and almost invisible. It gets out of the way so people can engage with the platform successfully and deeply, and that's exactly what we achieved here.
                  </p>
                  <p className="cyril-mt-40">
                    I'm privileged to have contributed significantly to the craftsmanship, well-thought-out information architecture, user-centric decisions, and technological improvements that have made this platform more responsive, accessible, usable, and modern while staying true to the ministry's commitment of &ldquo;Unleashing God's Truth, One Verse at a Time.&rdquo;
                  </p>

                  {/* pagination */}
                  <div className="cyril-pagination-panel cyril-mt-60">
                    <button
                      onClick={handleBackToPortfolio}
                      className="cyril-button cyril-type-2 cyril-mb-30"
                    >
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