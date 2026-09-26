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

const SECTIONS = [
  { id: "myspace-profile-background", label: "Profile Background" },
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
            summary="A grungy &ldquo;Transformers: Autobots Big Gun&rdquo; themed background graphic designed for my MySpace profile."
            facts={[
              { label: "Platform", value: "MySpace" },
              { label: "Tools", value: "Adobe Illustrator, Photoshop" },
            ]}
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — A MySpace Profile Background Graphic */}
            <CaseSection id="myspace-profile-background" number={1} title="A MySpace Profile Background Graphic">
              <p>MySpace? Yes, it's been a minute since MySpace dominated the social media scene. But MySpace crawled, so that Facebook, Twitter, etc. could walk and run. Back then, if you could customize your profile page and make it look great, you could set yourself apart from the rest of the profiles. And customization showcases not only your uniqueness and your design skillz ;&#41; ... but also your HTML, CSS, and JavaScript chops&mdash;even if it's just for fun.</p>
              <p>So I designed this piece for my MySpace profile as the background graphic. &ldquo;SekihMentis&rdquo; was my screen name in those days, and being a big fan of Transformers and guns, I thought it would be cool to have a grungy &ldquo;Transformers: Autobots Big Gun&rdquo; theme.</p>
              <p>I would always include this piece as part of my portfolio, even though it's not a professional one. It's a fun way to showcase my skills and creativity, especially when I was just a beginner learning layout, typography, color theory, and various design styles. It also exhibits my ability to design using industry-standard tools&mdash;back then, Adobe Illustrator and Photoshop dominated the craft.</p>
              <CaseFigure src="/img/portfolio/main_sekihmentis.jpg" alt="SekihMentis MySpace Profile Background Illustration" caption="SekihMentis MySpace Profile Background" />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/he-took-my-place"
            title="He Took My Place"
            category="Illustration"
            image="/img/portfolio/main_he-took-my-place.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
