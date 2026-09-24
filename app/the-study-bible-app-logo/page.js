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
  CaseQuote,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "research", label: "Research" },
  { id: "ideation", label: "Ideation" },
  { id: "iterations", label: "Iterations" },
  { id: "final-design", label: "Final Design" },
  { id: "color-typography", label: "Color & Type" },
  { id: "outcome", label: "Outcome" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'thestudybibleapplogo');
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
    const projectId = 'thestudybibleapplogo'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Branding"
            detail="Visual Identity"
            title="The Study Bible App Logo"
            summary="Creating a visual identity for The Study Bible app: a simple, versatile logo that communicates usability, clarity, and a sense of illumination."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Logo/Brand Designer" },
              { label: "Deliverables", value: "Logo & Wordmark" },
            ]}
            image="/img/portfolio/main_the-study-bible-app-logo.jpg"
            imageAlt="The Study Bible App Logo - Main"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>As a designer at Grace to You, I was tasked with creating a visual identity for The Study Bible app. The goal was to design a logo that communicates usability, clarity, and a sense of illumination, while remaining simple and versatile for digital use.</p>
            </CaseSection>

            {/* 02 — Research */}
            <CaseSection id="research" number={2} title="Research and Concept Development">
              <p>I began by researching existing Bible and study-related app logos to identify common visual themes—open books, crosses, rays of light, and bookmarks. My aim was to create a design that felt familiar yet distinct, balancing tradition with modern minimalism.</p>
            </CaseSection>

            {/* 03 — Ideation */}
            <CaseSection id="ideation" number={3} title="Ideation and Exploration">
              <p>I sketched multiple concepts, focusing on the core idea of an open book, which universally symbolizes learning and accessibility. I experimented with different elements:</p>
              <ul className="cyril-case-list">
                <li>Rays of light to suggest inspiration and enlightenment</li>
                <li>Crosses to signify faith in Christ</li>
                <li>Bookmarks and pens to represent study and engagement</li>
              </ul>
            </CaseSection>

            {/* 04 — Design Iterations */}
            <CaseSection id="iterations" number={4} title="Design Iterations">
              <p>I then developed a grid of logo variations. Each icon was tested for clarity at small sizes and adaptability across backgrounds. I explored different compositions, such as:</p>
              <ul className="cyril-case-list">
                <li>Books with radiating lines for a sense of revelation</li>
                <li>Closed and open Bibles to convey both authority and approachability</li>
                <li>Integrated crosses and bookmarks for subtle devotional cues</li>
              </ul>
              <CaseFigure src="/img/portfolio/the-study-bible-logo-iterations.jpg" alt="The Study Bible Logo Iterations" caption="Logo Iterations" />
            </CaseSection>

            {/* 05 — Final Design Selection */}
            <CaseSection id="final-design" number={5} title="Final Design Selection">
              <p>After reviewing the options with the Digital Platforms Coordinator and stakeholders, we agreed on the final design. This logo features:</p>
              <ul className="cyril-case-list">
                <li>The Bible, the source of truth</li>
                <li>A pen in the center, reinforcing the idea of active engagement and personal growth</li>
                <li>A semi-circle backdrop, evoking a rising sun, which suggests light and illumination</li>
              </ul>
              <CaseFigure src="/img/portfolio/the-study-bible-app-logo.jpg" alt="The Study Bible Logo" caption="The Study Bible Logo" />
            </CaseSection>

            {/* 06 — Color Palette & Typography */}
            <CaseSection id="color-typography" number={6} title="Color Palette & Typography">
              <p>The color palette is a muted blue, chosen for its calm, trustworthy, and timeless qualities. And for the wordmark, I selected a clean, sans-serif font. The hierarchy emphasizes "STUDY BIBLE" in bold, with "THE" in a lighter weight above, ensuring readability and balance.</p>
            </CaseSection>

            {/* 07 — Outcome and Reflection */}
            <CaseSection id="outcome" number={7} title="Outcome and Reflection">
              <CaseQuote>
                The combination of book, pen, and rising sun encapsulates the app&apos;s mission: to encourage a deeper study with the digital version of the MacArthur Bible.
              </CaseQuote>
              <p>The final logo is simple, memorable, and effective across the mobile platforms. The combination of book, pen, and rising sun encapsulates the app's mission: to encourage a deeper study with the digital version of the MacArthur Bible. The iterative process, from broad exploration to focused refinement, ensured that the final mark met both the user's needs and the brand's vision.</p>
              <CaseFigure src="/img/portfolio/the-study-bible-app-logo_on-gty-homepage.jpg" alt="The Study Bible App Logo" caption="Logo on GTY Homepage" />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/sekihmentis"
            title="SekihMentis"
            category="Illustration"
            image="/img/portfolio/main_sekihmentis.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
