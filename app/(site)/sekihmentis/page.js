"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { onPreloaderHidden, wipeThen } from "@/components/Preloader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CaseHero,
  CaseLayout,
  CaseSection,
  CaseFigure,
  CaseNext,
} from "@/components/case/CaseStudy";
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "piece", label: "The Piece" },
  { id: "reflection", label: "Reflection" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'sekihmentis');
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
    const projectId = 'sekihmentis'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Illustration"
            detail="Profile Background Graphic"
            title="SekihMentis"
            summary={CASE_SUMMARIES["/sekihmentis"]}
            facts={[
              { label: "Platform & Tools", value: <>{"MySpace"}<br />{"Adobe Illustrator, Photoshop"}</> },
            ]}
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>MySpace? Yes, it&apos;s been a minute since MySpace dominated the social media scene. But MySpace crawled, so that Facebook, Twitter, etc. could walk and run. Back then, if you could customize your profile page and make it look great, you could set yourself apart from the rest. Customization showcased not only your uniqueness and your design skillz ;&#41; but also your HTML, CSS, and JavaScript chops&mdash;even if just for fun.</p>
              <p>So I designed this piece as the background graphic for my MySpace profile. &ldquo;SekihMentis&rdquo; was my screen name in those days, and being a big fan of Transformers and guns, I thought it would be cool to have a grungy &ldquo;Transformers: Autobots Big Gun&rdquo; theme.</p>
            </CaseSection>

            {/* 02 — The Piece */}
            <CaseSection id="piece" number={2} title="The Piece">
              <CaseFigure src="/img/portfolio/main_sekihmentis.jpg" alt="SekihMentis MySpace Profile Background Illustration" caption="SekihMentis MySpace Profile Background" />
            </CaseSection>

            {/* 03 — Reflection */}
            <CaseSection id="reflection" number={3} title="Reflection">
              <p>I would always include this piece as part of my portfolio, even though it&apos;s not a professional one. It&apos;s a fun way to showcase my skills and creativity from when I was just a beginner learning layout, typography, color theory, and various design styles, and it exhibits my ability to design with the industry-standard tools of the time, Adobe Illustrator and Photoshop.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/he-took-my-place"
            title="He Took My Place"
            category="Illustration"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
