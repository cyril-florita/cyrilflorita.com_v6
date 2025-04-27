"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const VideoFigure = dynamic(() => import('@/components/VideoFigure'), {
  ssr: false,
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
    const projectId = 'gtyapplanding'; // This is the current project

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
              <h2 className="cyril-mt-60">GTY App Landing Page</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Web Design &amp; Front-End</span>
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
                    <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</p>
                  </div>
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Role:</p>
                    <p className="cyril-mt-20">Web Designer & Developer</p>
                  </div>
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Start / Launch Date:</p>
                    <p className="cyril-mt-20">Dec 2024</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Project Overview</h4>
                <p>
                As a designer and developer at Grace to You, I was tasked with improving the user experience of the Grace to You App landing page. The goal was to create a more engaging, informative, and user-friendly experience, encouraging users to download and utilize the app.
                </p>
                <div className="cyril-mt-40 cyril-mb-60">
                  <VideoFigure url="/img/portfolio/gty-app-landing.mp4" />
                </div>

                <h4 className="cyril-up cyril-text-center">Initial Assessment</h4>
                <dl className="no-disc">
                  <dd>Upon reviewing the landing page, I identified several key areas for improvement:</dd>
                  <dd>
                    <dl className="w-disc">
                      <dd>
                        <strong>Visual Appeal:</strong> The page was functional but lacked a visually compelling design to draw users in.
                      </dd>
                      <dd>
                        <strong>Information Hierarchy:</strong> Key information about the apps and their benefits wasn't immediately apparent.
                      </dd>
                      <dd>
                        <strong>Call to Action:</strong> The call to action to download and explore the apps could be more prominent.
                      </dd>
                    </dl>
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Design and Development Approach</h4>
                <dl className="no-disc">
                  <dd>To address these issues, I focused on the following strategies:</dd>
                  <dd>
                    <dl className="w-disc">
                      <dd>
                        <strong>Modernized Visual Design:</strong> Implementing a cleaner, more contemporary design with better use of whitespace to improve readability.
                      </dd>
                      <dd>
                        <strong>Strategic Content Placement:</strong> Reorganizing content to highlight the benefits of using the apps, such as access to John MacArthur's teachings, convenient listening schedules, and devotionals.
                      </dd>
                      <dd>
                        <strong>Clear Call-to-Action:</strong> Adding prominent, visually distinct download buttons for each app.
                      </dd>
                    </dl>
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Implementation</h4>
                <dl className="no-disc">                  
                  <dd>
                    <dl className="w-disc">                      
                      <dd>
                        <strong>Visual Elements:</strong> High-quality images and icons were incorporated to showcase the apps' interfaces and features. This helped users visualize the benefits of downloading the apps.
                      </dd>
                      <dd>
                        <strong>Typography and Readability:</strong> The font is consistent with GTY's style guide and so the readability and overall user experience are optimized.
                      </dd>
                      <dd>
                        <strong>Responsive Design:</strong> Ensuring the landing page is fully responsive, providing an optimal experience across various devices &#40;desktops, tablets, and smartphones&#41;.
                      </dd>
                      <dd>
                        <strong>Call-to-Action Buttons:</strong> Strategically placed and visually enhanced download buttons for each app, making it easier for users to take action.
                      </dd>
                    </dl>
                  </dd>
                  <dd>
                    <img className="cyril-project-main-graphic" src="/img/portfolio/gty-app-landing-screenshot.jpg" alt="GTY App Landing Page Screenshot" />
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Outcome and Reflection</h4>
                <p>
                  The refreshed landing page offers a more visually appealing and user-friendly experience, making it easier for visitors to understand the benefits of the apps and encouraging them to download and engage with the content. The strategic content placement, and clear call-to-action buttons, contribute to a better overall user experience. This project highlighted the importance of a user-centric approach in web design and development, ensuring that the end product meets the needs and expectations of the target audience.
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