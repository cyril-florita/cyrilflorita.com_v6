"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    const projectId = 'sekihmentis'; // This is the current project
    
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

              <h2 className="cyril-mt-60">SekihMentis</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Illustration</span>
              </p>

            </div>
            {/* dend of top banner */}

            {/* main content */}
            <div className="row cyril-mb-60">

              <div className="cyril-project-content">

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-mb-30 cyril-text-center">A MySpace Profile Background Graphic</h4>
                <p>MySpace? Yes, it's been a minute since MySpace dominated the social media scene. But MySpace crawled, so that Facebook, Twitter, etc. could walk and run. Back then, if you could customize your profile page and make it look geat, you can set yourself apart from the rest of the profiles. And customization showcases not only your uniqueness and your design ;&#41; skillz, but also your HTML, CSS, and JavaScript chops&mdash;even if it's just for run.</p>
                <p className="cyril-mt-40">
                  So I designed this piece for my MySpace profile as the background graphic. "SekihMentis" was my screen name in those days, and being a big fan of Transformers and guns, I thought it would be cool to have a grungy "Transformers: Autobots Big Gun" theme. </p>
                <p className="cyril-mt-40">
                  I would always included this piece as part of my portfolio, even though it's not a professional one. It's a fun way to showcase my skills and creativity, especially when I was just a beginner learning layout, typography, color theory, and various design styles. It's also exhibits my ability to design using industry-standard tools&mdash;back then, Adobe Illustrator and Photoshop dominated the craft.
                </p>

                <img className="cyril-project-main-graphic" src="/img/portfolio/main_sekihmentis.jpg" alt="cover" />

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