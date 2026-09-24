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
  CaseQuote,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "tv-dashboard", label: "TV Dashboard" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gtydashboard');
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
    const projectId = 'gtydashboard'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="UI Design & Front-End"
            detail="TV Dashboard"
            title="GTY Dashboard"
            summary="A TV-optimized dashboard interface for the Grace to You office that cycles through weather updates, streaming activity, broadcast schedules, live website stats, global engagement, and ministry activities in a format easy to read from a distance."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
              { label: "Platform", value: "TV — Office Displays" },
            ]}
            image="/img/portfolio/gty-dashboard-1b.jpg"
            imageAlt="GTY Dashboard - Screen 1B"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — TV Dashboard */}
            <CaseSection id="tv-dashboard" number={1} title="Real-Time TV Dashboard to Visualize the Global Impact of Grace to You">
              <p>As a web designer and developer at Grace to You, I was commissioned to design and build a TV dashboard system. The objective was to create a TV-optimized dashboard interface for use in the office. The dashboard needed to cycle through screens such as weather updates, streaming activity, TV & radio broadcast schedules, live website user activities & stats, global engagement, event photos, and ministry activities in a visually engaging, easy-to-read format from a distance.</p>
              <p>The TV dashboard is now prominently displayed in the volunteer room and the hallways of the Grace to You office, providing volunteers, staff, and visitors with immediate insight into key metrics and activities of the website and apps. It improved internal awareness and coordination during live events and boosted morale by visually reinforcing the ministry's global reach. Team feedback emphasized how easy it was to &ldquo;just glance at the screen and know what's going on.&rdquo;</p>
              <CaseQuote cite="Team feedback">
                Just glance at the screen and know what&apos;s going on.
              </CaseQuote>
              <CaseVideo src="/img/portfolio/gty-dashboard.mp4" caption="Live Weather v1" />
              <CaseFigure src="/img/portfolio/gty-dashboard-1b.jpg" alt="GTY Dashboard - Screen 1B" caption="Live Weather v2" />
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty-dashboard-2a.jpg" alt="GTY Dashboard - Screen 2A" caption="Ministry Activities v1" />
                <CaseFigure src="/img/portfolio/gty-dashboard-2b.jpg" alt="GTY Dashboard - Screen 2B" caption="Ministry Activities v2" />
              </CaseGrid>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/gty-dashboard-3.jpg" alt="GTY Dashboard - Screen 3" caption="Website Usage Activities" />
                <CaseFigure src="/img/portfolio/gty-dashboard-4.jpg" alt="GTY Dashboard - Screen 4" caption="Website Global Usage Activities" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/gty-dashboard-5.jpg" alt="GTY Dashboard - Screen 5" caption="Ministry Photo Slideshow" />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-app-landing"
            title="GTY App Landing Page"
            category="Web Design & Front-End"
            image="/img/portfolio/thumb_gty-app-landing.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
