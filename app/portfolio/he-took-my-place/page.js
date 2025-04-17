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
    const projectId = 'hetookmyplace'; // This is the current project

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

              <h2 className="cyril-mt-60">He Took My Place</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Illustration</span>
              </p>

            </div>
            {/* dend of top banner */}

            {/* main content */}
            <div className="row cyril-mb-60">

              <div className="cyril-project-content">

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-mb-30 cyril-text-center">A Desktop Wallpaper</h4>

                <p>Most of the time, your creativity is sparked by your passion. Whatever grips your heart tends to bleed through the works of your hand. And so I designed this piece as a desktop wallpaper for my Illustration class. I was in a period of my life when I was coming to grips with the reality of the gospel of the Lord and Savior Jesus Christ.</p>

                <p className="cyril-mt-40">
                  2 Corithians 5:21 states, &#8220;He [God the Father] made Him [Christ] who knew no sin to be sin on our behalf, so that we might become the righteousness of God [the Father] in Him [Christ].&#8221; This means that on the cross, Christ&mdash;though he was sinless, guiltless, and perfect&mdash;died the death that sinners deserve because of their sins. So in a personal way, Christ died in my place&mdash;<strong>He took my place</strong>. God accounts Christ's death on my behalf as righteousness so I can be made right with God.
                </p>

                <img className="cyril-project-main-graphic cyril-mt-40" src="/img/portfolio/main_he-took-my-place.jpg" alt="cover" />

                <p className="cyril-mt-40">
                  I would always included this piece as part of my portfolio, even though it's not a professional one. It's a great way to showcase my skills and creativity, especially when I was just a beginner learning layout, typography, color theory, and various design styles. It's also exhibits my ability to design using industry-standard tools&mdash;and back then, Adobe Illustrator and Photoshop dominated the craft.
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