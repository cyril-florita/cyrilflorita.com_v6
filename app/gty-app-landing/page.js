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
  CaseNext,
  CaseLearnings,
} from "@/components/case/CaseStudy";
import { BrandCrop } from "@/components/case/BrandGuide";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "approach", label: "Design and Development Approach" },
  { id: "learnings", label: "Learning and Reflection" },
];

// The walkthrough shows parts of the full-page screenshot, top to bottom.
// Crop boxes are [x, y, width, height] in the 1600 × 5871 original.
const SCREENSHOT = "/img/portfolio/gty-app-landing-screenshot.jpg";
const SCREENSHOT_SIZE = [1600, 5871];
const Shot = ({ box, caption }) => (
  <figure className="cyril-case-figure">
    <div className="cyril-cover">
      <BrandCrop src={SCREENSHOT} box={box} size={SCREENSHOT_SIZE} alt={caption} />
    </div>
    <figcaption className="cyril-upper">{caption}</figcaption>
  </figure>
);

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gtyapplanding');
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
    const projectId = 'gtyapplanding'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Design & Development"
            detail="Landing Page"
            title="GTY App Landing Page"
            summary="Improving the user experience of the Grace to You App landing page to create a more engaging, informative, and user-friendly experience that encourages users to download and utilize the app."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
              { label: "Platform & Tools", value: "Web — Desktop, Tablet, Mobile" },
            ]}
            image="/img/portfolio/main_gty-app-landing.jpg"
            imageAlt="GTY App Landing Page, first screen"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>The Grace to You App landing page was functional but didn&apos;t draw users in. As a designer and developer at Grace to You, I was tasked with improving its user experience so that more visitors download and use the app. Reviewing the page, I found three gaps:</p>
              <ul className="cyril-case-list">
                <li><strong>Visual Appeal:</strong> The design lacked the appeal to draw users in.</li>
                <li><strong>Information Hierarchy:</strong> The apps&apos; benefits weren&apos;t immediately apparent.</li>
                <li><strong>Call to Action:</strong> The download call to action needed more prominence.</li>
              </ul>
              <CaseVideo url="gty.org" src="/img/portfolio/gty-app-landing_min.mp4" caption="GTY App Landing Page" />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>The refreshed landing page is more visually appealing and easier to use, so visitors can quickly see the apps&apos; benefits and are encouraged to download them. The strategic content placement and clear call-to-action buttons carry that experience.</p>
            </CaseSection>

            {/* 03 — Design and Development Approach */}
            <CaseSection id="approach" number={3} title="Design and Development Approach">
              <p>I answered each gap directly:</p>
              <ul className="cyril-case-list">
                <li><strong>Modernized Visual Design:</strong> A cleaner, more contemporary design with better use of whitespace for readability, using high-quality images and icons to show the apps&apos; interfaces and features, and a font consistent with GTY&apos;s style guide.</li>
                <li><strong>Strategic Content Placement:</strong> Content reorganized to highlight the benefits of the apps, such as access to John MacArthur&apos;s teachings, convenient listening schedules, and devotionals.</li>
                <li><strong>Clear Call-to-Action:</strong> Prominent, visually distinct download buttons for each app.</li>
                <li><strong>Responsive Design:</strong> A fully responsive page across desktops, tablets, and smartphones.</li>
              </ul>

              <h3 className="cyril-case-subheading">Page Walkthrough</h3>
              <p>The page reads as one short story, told in alternating sage-green and white bands with slanted edges that keep the eye moving down the page.</p>

              <h3 className="cyril-case-subheading">The First Screen</h3>
              <p>Everything a visitor needs to decide is visible before scrolling: the headline &ldquo;The Brand-New Grace to You App,&rdquo; a one-sentence promise (&ldquo;Rebuilt from the ground up, our new app provides a fresh look and simpler navigation&rdquo;), a phone showing the app&apos;s real home screen, and both store buttons right beside it.</p>
              <Shot box={[0, 130, 1600, 970]} caption="First Screen" />
              <h3 className="cyril-case-subheading">What You Can Do</h3>
              <p>The next band answers &ldquo;what&apos;s in it for me?&rdquo; in plain language, next to the app on a tablet: search sermons by passage or topic, listen to the radio and television broadcasts on your own schedule, build a habit with a daily devotional, or tune into Grace Stream for nonstop Bible teaching.</p>
              <Shot box={[0, 1120, 1600, 1000]} caption="App Benefits on Tablet" />
              <h3 className="cyril-case-subheading">New Features</h3>
              <p>For people who used the previous app, a short list names what&apos;s new, beside a carousel of phone screens: a refreshed, cohesive design, more robust search, up-to-date account security, and a personalized account to track progress and save sermons for later.</p>
              <Shot box={[0, 2140, 1600, 880]} caption="New Features Carousel" />
              <h3 className="cyril-case-subheading">Questions, Answered</h3>
              <p>A relaunch raises practical questions, so the page answers them directly: whether existing gty.org and Study Bible app accounts carry over, what happens to activity from the old app, and why the change was made, which is a single GTY account across gty.org, the new app, and The Study Bible app.</p>
              <Shot box={[0, 3080, 1600, 960]} caption="Frequently Asked Questions" />
              <h3 className="cyril-case-subheading">One More Chance to Download</h3>
              <p>The page closes where it started: a &ldquo;Get the App Now&rdquo; band with both store buttons, so the download is one tap away at the top and at the bottom.</p>
              <Shot box={[0, 4170, 1600, 660]} caption="Closing Call to Action" />
              <CaseFigure src="/img/portfolio/gty-app-landing-screenshot.jpg" alt="GTY App Landing Page Screenshot" caption="Full Landing Page" ratio="3 / 4" />
            </CaseSection>

            {/* 04 — Learning and Reflection */}
            <CaseSection id="learnings" number={4} title="Learning and Reflection">
              <CaseLearnings
                learned={[
                "Naming three specific gaps up front (visual appeal, information hierarchy, call to action) kept every design decision tied to a problem worth solving.",
                "A relaunch raises practical questions about accounts and the old app, so I answer them on the page itself in an FAQ instead of leaving visitors to wonder.",
                "Placing the download buttons at both the top and the bottom of the page means the next step is always one tap away.",
                ]}
                reflection={
                  <p>This project highlighted the importance of a user-centric approach in web design and development, ensuring that the end product meets the needs and expectations of the target audience.</p>
                }
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-blog-graphics"
            title="GTY Blog Graphics"
            category="Marketing"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
