"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect } from "react";
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
    const projectId = 'patriciamacarthur'; // This is the current project

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
              <h2 className="cyril-mt-60">
                <span>The</span> Patricia MacArthur <span>Pastoral Care Fund</span>               
              </h2>
              <h2 className="cyril-upper"></h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Illustration / Branding</span>
              </p>

            </div>
            {/* dend of top banner */}

            {/* main content */}
            <div className="row cyril-mb-60">

              <div className="cyril-project-content">

              <div className="cyril-divider cyril-mb-60" />

                <div className="row cyril-mb-20">
                  <div className="col-md-8 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Employer:</p>
                    <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Non-Profit Media Organization</p>
                  </div>
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Role:</p>
                    <p className="cyril-mt-20">Logo Designer</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Crafting Stewardship and Care</h4>
                <p>
                  As a designer at Grace to You, my approach to the Patricia MacArthur Pastoral Care Fund logo was to create a visual identity that feels both personal and nurturing, reflecting the fund's mission. The central motif&mdash;a pair of poppy flowers&mdash;was chosen for its symbolism of remembrance, care, and gentle strength. I used a continuous line drawing style to convey unity and ongoing support, while the circular frame reinforces a sense of wholeness and protection. The handwritten script for &ldquo;Patricia MacArthur&rdquo; adds a personal, human touch, making the logo feel approachable and heartfelt. The color variations&mdash;ranging from soft, natural hues on a white background to elegant gold on black&mdash;were developed to ensure the logo remains versatile and impactful across different settings and materials.
                </p>
                <p className="cyril-mt-40">
                  In the various logo adaptations, I focused on maintaining brand consistency while allowing for contextual flexibility. The full-color version with red and yellow poppies and a green base is vibrant and uplifting, ideal for print and digital use where warmth and visibility are needed. 
                </p>
                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Full-Color Version
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-light.jpg" alt="The Patricia MacArthur Pastoral Care Fund Logo - Light Version" />
                </div>
                <p className="cyril-mt-40">
                  The gold-on-black variant offers a sophisticated, timeless look suitable for formal events or commemorative materials.
                </p>
                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Gold on Black Version
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-dark-1.jpg" alt="The Patricia MacArthur Pastoral Care Fund Logo - Dark Version" />
                </div>
                <p className="cyril-mt-40">
                  Including Patricia MacArthur's portrait in one version personalizes the brand further, honoring her legacy and making the fund's purpose immediately clear.
                </p>
                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Portrait on Black Version
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-dark-2.jpg" alt="The Patricia MacArthur Pastoral Care Fund Logo - Portrait - Dark Version" />
                </div>
                <p className="cyril-mt-40">
                  Throughout, the balance of modern minimalism and classic script ensures the design feels both contemporary and enduring, resonating with a broad audience while conveying stewardship, and care.
                </p>                
                <div className="cyril-mt-40 cyril-mb-60">
                  <p className="cyril-upper cyril-text-sm cyril-mb-20 cyril-text-center">
                    Logo Presentation at the GTY Volunteer Appreciation Christmas Party
                  </p>
                  <img className="cyril-project-main-graphic" src="/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-light-presentation.jpg" alt="The Patricia MacArthur Pastoral Care Fund Logo Presentation" />
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