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

  useEffect(() => {
    cyrilUtility.tpInner();
    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);
  }, []);

  // Function to handle back navigation and save scroll position
  const handleBackToPortfolio = () => {
    // Get the project ID or identifier
    const projectId = 'gtydashboard'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    router.push('/portfolio');
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page">
          {/* .container */}
          <div className="container">

            {/* top banner */}
            <div className="cyril-top-banner cyril-text-center">
              <h2 className="cyril-mt-60">GTY Dashboard</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">UI Design &amp; Front-End</span>
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
                    <p className="cyril-mt-20">Jun / Aug 2017</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Real-Time TV Dashboard to Visualize the Global Impact of Grace to You</h4>
                <p>
                  As a web designer and developer at Grace to You, I was commissioned to design and build TV dashboard system. The objective was to create a TV-optimized dashboard interface for use in the office. The dashboard needed to cycle through screens such as weather updates, streaming activity, TV & radio broadcast schedules, live website user activities & stats, global engagement, event photos, and ministry activities in a visually engaging, easy-to-read format from a distance.
                </p>
                <p className="cyril-mt-40">
                  The TV dashboard is now prominently displayed in volunteer room and the hallways of the Grace to You office, providing volunteers, staff, and visitors with immediate insight into key metrics and activities of the website and apps. It improved internal awareness and coordination during live events and boosted morale by visually reinforcing the ministry's global reach. Team feedback emphasized how easy it was to &ldquo;just glance at the screen and know what's going on.&rdquo;
                </p>
                
                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Live Weather v1
                  </p>
                  <VideoFigure url="/img/portfolio/gty-dashboard.mp4" />
                </div>

                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Live Weather v2
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/gty-dashboard-1b.jpg" alt="GTY Dashaboard - Screen 1B" />
                </div>

                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Ministry Activities v1
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/gty-dashboard-2a.jpg" alt="GTY Dashaboard - Screen 2A" />
                </div>

                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Ministry Activities v2
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/gty-dashboard-2b.jpg" alt="GTY Dashaboard - Screen 2B" />
                </div>

                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Website Usage Activities
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/gty-dashboard-3.jpg" alt="GTY Dashaboard - Screen 3" />
                </div>
                
                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Website Global Usage Activities
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/gty-dashboard-4.jpg" alt="GTY Dashaboard - Screen 4" />
                </div>

                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Ministry Photo Slideshow
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/gty-dashboard-5.jpg" alt="GTY Dashaboard - Screen 5" />
                </div>

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