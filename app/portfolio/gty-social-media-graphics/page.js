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
    const projectId = 'gtysocialmedia'; // This is the current project

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
                GTY Social Media Graphics
              </h2>
              <h2 className="cyril-upper"></h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Graphic Design</span>
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
                    <p className="cyril-mt-20">Web Designer &amp; Developer</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Visually Communicating Truth</h4>
                <p>
                  These graphics are effective tools for driving engagement and directing traffic back to the Grace to You website. The consistent branding, with the &ldquo;Grace to You&rdquo; logo and the GTY.org URL prominently displayed, reinforces brand recognition. Each design clearly credits John MacArthur and specifies the source material, which is crucial for maintaining credibility and encouraging viewers to explore the original context of the quotes. The visual elements, such as the contrasting fonts and carefully selected photographs, are designed to capture attention and make the content easily digestible. The fonts are consistent with GTY's style guide, ensuring consistency and readability.                
                </p>
                <p className="cyril-mt-40">
                  These graphics are clearly tailored for social media sharing. The quotes are concise and impactful, perfect for capturing attention in a fast-scrolling environment. The strategic placement of the website address, GTY.org, ensures that viewers know exactly where to go for more information. By presenting thought-provoking quotes in visually appealing formats, these designs aim to spark conversations, encourage shares, and ultimately drive traffic to the GTY website, expanding the reach of their resources.
                </p>

                <div className="row">

                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_black-frame---None-Good-Enough,-None-So-Evil.jpg" alt="gty-social_black-frame---None-Good-Enough,-None-So-Evil.jpg" />
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_black-frame---Obedience-is-the-Hallmark.jpg" alt="gty-social_black-frame---Obedience-is-the-Hallmark" />
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_masked-slant---Descent-Into-Apostasy.jpg" alt="gty-social_masked-slant---Descent-Into-Apostasy" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_masked-slant---Scriptures-Absolute,-Inerrant-Authority.jpg" alt="gty-social_masked-slant---Scriptures-Absolute,-Inerrant-Authority" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_semicursor---Genuine-Worship.jpg" alt="gty-social_semicursor---Genuine-Worship" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_semicursor---Shun-False-Teaching.jpg" alt="gty-social_semicursor---Shun-False-Teaching" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_slant---Advancing-His-Kingdom.jpg" alt="gty-social_slant---Advancing-His-Kingdom" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_slant---Christian-Husband.jpg" alt="gty-social_slant---Christian-Husband" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_sparrow---Humility-vs.-Pride.jpg" alt="gty-social_sparrow---Humility-vs.-Pride" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_sparrow---Sinners-vs.-Self-Sufficient.jpg" alt="gty-social_sparrow---Sinners-vs.-Self-Sufficient" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_train-tracks---Light-of-God's-Truth.jpg" alt="gty-social_train-tracks---Light-of-God's-Truth" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_train-tracks---Worry-Reveals.jpg" alt="gty-social_train-tracks---Worry-Reveals" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_wooden-frame---Only-Message-with-the-Power-to-Save.jpg" alt="gty-social_wooden-frame---Only-Message-with-the-Power-to-Save" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_wooden-frame---Universe-and-God.jpg" alt="gty-social_wooden-frame---Universe-and-God" />
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_asian---Peoples-Deepest-Need.jpg" alt="gty-social_asian---Peoples-Deepest-Need" />
                  </div>
                  

                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_asian---True-Worship.jpg" alt="gty-social_asian---True-Worship" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_california---To-Tell-the-Truth.jpg" alt="gty-social_california---To-Tell-the-Truth" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_california---Worry-is-the-Sin.jpg" alt="gty-social_california---Worry-is-the-Sin" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_circle---Free-Offer-of-the-Gospel.jpg" alt="gty-social_circle---Free-Offer-of-the-Gospel" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_circle---Unity-at-the-Expense-of-Truth.jpg" alt="gty-social_circle---Unity-at-the-Expense-of-Truth" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_clippers---Glory-of-God.jpg" alt="gty-social_clippers---Glory-of-God" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_clippers---Sons-of-the-King.jpg" alt="gty-social_clippers---Sons-of-the-King" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_hexagon---Justification-and-Sanctification.jpg" alt="gty-social_hexagon---Justification-and-Sanctification" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_hexagon---Know-Christ-As-Lord.jpg" alt="gty-social_hexagon---Know-Christ-As-Lord" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_layers---Christ-Is-Lord.jpg" alt="gty-social_layers---Christ-Is-Lord" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_layers---Provides-for-What-He-Demands.jpg" alt="gty-social_layers---Provides-for-What-He-Demands" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_stairs---Call-to-Glory.jpg" alt="gty-social_stairs---Call-to-Glory" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_stairs---Lordship-of-Christ.jpg" alt="gty-social_stairs---Lordship-of-Christ" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_tabbed---Truly-Christlike-Character.jpg" alt="gty-social_tabbed---Truly-Christlike-Character" />
                  </div>
                  
                  <div className="col-md-6 cyril-mt-40">
                    <img src="/img/portfolio/gty-social_tabbed--Slavery-to-Christ.jpg" alt="gty-social_tabbed--Slavery-to-Christ" />
                  </div>
                  
                </div>

                {/* end of .row */}

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