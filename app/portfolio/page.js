"use client";
import SiteLayout from "@/layout/SiteLayout";
import dynamic from "next/dynamic";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect } from "react";

const PortfolioIsotope = dynamic(
  () => import("@/components/PortfolioIsotope"),
  {
    ssr: false,
  }
);

const PortfolioPage = () => {
  useEffect(() => {
    // Check if we're returning to a specific project
    const returnToProject = sessionStorage.getItem('returnToProject');
    
    if (returnToProject) {
      // Clear the storage
      sessionStorage.removeItem('returnToProject');

      const projectElement = document.getElementById(returnToProject) || 
                              document.querySelector(`[data-project="${returnToProject}"]`);
        
        if (projectElement) {
          // Scroll to the element
          projectElement.scrollIntoView({ behavior: 'smooth' });
        }
      
      // Wait for the DOM to be fully loaded and isotope to initialize
     
    }
    
    cyrilUtility.tpInner();
    
    // Enable smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);
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
                A selection of my projects to showcase my experience and skills.
              </p>
            </div>
          </div>
          
          <PortfolioIsotope />
        </div>
      </div>
    </SiteLayout>
  );
};

export default PortfolioPage;