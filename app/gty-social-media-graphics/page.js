"use client";

import SiteLayout from "@/layout/SiteLayout";
import { SOCIAL_GRAPHICS } from "@/components/data/socialGraphics";
import { cyrilUtility } from "@/public/utility/index";
import { onPreloaderHidden, wipeThen } from "@/components/Preloader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CaseHero,
  CaseLayout,
  CaseSection,
  CaseFigure,
  CaseGrid,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "visually-driving-engagement", label: "Engagement" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gtysocialmedia');
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
    const projectId = 'gtysocialmedia'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Marketing"
            detail="Social Media Graphics"
            title="GTY Social Media Graphics"
            summary="Quote graphics tailored for social media sharing, designed to drive engagement and direct traffic back to the Grace to You website."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
              { label: "Platform", value: "Social Media" },
            ]}
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Visually Driving Engagement */}
            <CaseSection id="visually-driving-engagement" number={1} title="Visually Driving Engagement">
              <p>These graphics are effective tools for driving engagement and directing traffic back to the Grace to You website. The consistent branding, with the &ldquo;Grace to You&rdquo; logo and the GTY.org URL prominently displayed, reinforces brand recognition. Each design clearly credits John MacArthur and specifies the source material, which is crucial for maintaining credibility and encouraging viewers to explore the original context of the quotes. The visual elements, such as the contrasting fonts and carefully selected photographs, are designed to capture attention and make the content easily digestible. The fonts are consistent with GTY's style guide, ensuring consistency and readability.</p>
              <p>These graphics are clearly tailored for social media sharing. The quotes are concise and impactful, perfect for capturing attention in a fast-scrolling environment. The strategic placement of the website address, GTY.org, ensures that viewers know exactly where to go for more information. By presenting thought-provoking quotes in visually appealing formats, these designs aim to spark conversations, encourage shares, and ultimately drive traffic to the GTY website, expanding the reach of their resources.</p>
              <CaseGrid layout="three">
                {SOCIAL_GRAPHICS.map(({ id, src, caption }) => (
                  <CaseFigure key={id} src={src} alt={caption} caption={caption} />
                ))}
              </CaseGrid>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty_v9"
            title="GTY Website, v.9"
            category="UX Design"
            image="/img/portfolio/main_gty9.png"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
