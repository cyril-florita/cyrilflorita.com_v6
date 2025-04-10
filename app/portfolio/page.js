"use client";
import SiteLayout from "@/layout/SiteLayout";
import dynamic from "next/dynamic";
import { cyrilUtility } from "@/utility/index";
import { useEffect } from "react";

const PortfolioIsotope = dynamic(
  () => import("@/components/PortfolioIsotope"),
  {
    ssr: false,
  }
);

const Page = () => {
  
  useEffect(() => {

    cyrilUtility.tpInner();
    
    // Enable smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);
  
    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page">
          <div
            className="cyril-bg-item"
            style={{ top: "3%", right: "15%", transform: "rotate(-45deg)" }}
          />
          <div className="container">
            <div className="cyril-top-banner">
              <p className="cyril-upper cyril-mb-20 subheader">
                &#91; My <span className="cyril-accent">select projects</span> &#93;
              </p>
              <h2 className="cyril-up cyril-mb-20">Portfolio</h2>
              <p className="cyril-left-offset">
                A selection of my projects to showcase my experience and skills.<br /><span className="cyril-accent"><strong>&#40;Project pages will be available as soon as I'm done writing a few case studies.&#41;</strong></span>
              </p>
            </div>
          </div>
          <PortfolioIsotope />
        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;