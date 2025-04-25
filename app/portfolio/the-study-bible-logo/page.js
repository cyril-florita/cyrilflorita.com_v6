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
    const projectId = 'thestudybiblelogo'; // This is the current project

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
              <h2 className="cyril-mt-60">The Study Bible App</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Logo Design / Branding</span>
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
                    <p className="cyril-mt-20">Logo/Brand Designer</p>
                  </div>
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Start / Finish Date:</p>
                    <p className="cyril-mt-20">Jan 2016</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Project Overview</h4>
                <dl className="no-disc">
                  <dt></dt>
                  <dd>
                    As a designer at Grace to You, I was tasked with creating a visual identity for The Study Bible app. The goal was to design a logo that communicates usability, clarity, and a sense of illumination, while remaining simple and versatile for digital use.
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Research and Concept Development</h4>

                <dl className="no-disc">
                  <dd>
                    I began by researching existing Bible and study-related app logos to identify common visual themes—open books, crosses, rays of light, and bookmarks. My aim was to create a design that felt familiar yet distinct, balancing tradition with modern minimalism.
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Ideation and Exploration</h4>
                <dl className="no-disc">
                  <dd>
                    I sketched multiple concepts, focusing on the core idea of an open book, which universally symbolizes learning and accessibility. I experimented with different elements:
                  </dd>
                  <dd>
                    <dl className="w-disc">
                      <dd>Rays of light to suggest inspiration and enlightenment</dd>
                      <dd>Crosses to signify faith in Christ</dd>
                      <dd>Bookmarks and pens to represent study and engagement</dd>
                    </dl>
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Design Iterations</h4>
                <dl className="no-disc">
                  <dd>
                    I then developed a grid of logo variations. Each icon was tested for clarity at small sizes and adaptability across backgrounds. I explored different compositions, such as:
                  </dd>
                  <dd>
                    <dl className="w-disc">
                      <dd>Books with radiating lines for a sense of revelation</dd>
                      <dd>Closed and open Bibles to convey both authority and approachability</dd>
                      <dd>Integrated crosses and bookmarks for subtle devetional cues</dd>
                    </dl>
                  </dd>
                  <dd>
                    <img className="cyril-project-main-graphic" src="/img/portfolio/the-study-bible-logo-iterations.jpg" alt="The Study Bible Logo Iterations" />
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Final Design Selection</h4>
                <dl className="no-disc">
                  <dd>
                    After reviewing the options with the Digital Platforms Coordinator and stakeholders, we agreed on the final design. This logo features:
                  </dd>
                  <dd>
                    <dl className="w-disc">
                      <dd>The Bible, the source of truth</dd>
                      <dd>A pen in the center, reinforcing the idea of active engagement and personal growth</dd>
                      <dd>A semi-circle backdrop, evoking a rising sun, which suggests light and illumination</dd>
                    </dl>
                  </dd>
                  <dd>
                    <img className="cyril-project-main-graphic" src="/img/portfolio/the-study-bible-logo.jpg" alt="The Study Bible Logo" />
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Color Palette &amp; Typography</h4>
                <dl className="no-disc">
                  <dd>
                    The color palette is a muted blue, chosen for its calm, trustworthy, and timeless qualities. And for the wordmark, I selected a clean, sans-serif font. The hierarchy emphasizes "STUDY BIBLE" in bold, with "THE" in a lighter weight above, ensuring readability and balance.
                  </dd>
                </dl>
                <h4 className="cyril-up cyril-text-center">Outcome and Reflection</h4>
                <dl className="no-disc">
                  <dd>
                    The final logo is simple, memorable, and effective across the mobile platforms. The combination of book, pen, and rising sun encapsulates the app's mission: to encourage a deeper study with the digital version of the MacArthur Bible. The iterative process, from broad exploration to focused refinement, ensured that the final mark met both the user's needs and the brand's vision.
                  </dd>
                  <dd>
                    <img className="cyril-project-main-graphic" src="/img/portfolio/the-study-bible-main.jpg" alt="The Study Bible Logo" />
                  </dd>
                </dl>


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