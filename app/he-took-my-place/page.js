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
  { id: "desktop-wallpaper", label: "Desktop Wallpaper" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'hetookmyplace');
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
    const projectId = 'hetookmyplace'; // This is the current project

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
            detail="Desktop Wallpaper"
            title="He Took My Place"
            summary="A desktop wallpaper designed for my Illustration class, sparked by coming to grips with the reality of the gospel."
            facts={[
              { label: "Deliverables", value: "Desktop Wallpaper" },
              { label: "Tools", value: "Adobe Illustrator, Photoshop" },
            ]}
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — A Desktop Wallpaper */}
            <CaseSection id="desktop-wallpaper" number={1} title="A Desktop Wallpaper">
              <p>Most of the time, your creativity is sparked by your passion. Whatever grips your heart tends to bleed through the works of your hand. And so I designed this piece as a desktop wallpaper for my Illustration class. I was in a period of my life when I was coming to grips with the reality of the gospel of the Lord and Savior Jesus Christ.</p>
              <CaseQuote>
                Whatever grips your heart tends to bleed through the works of your hand.
              </CaseQuote>
              <p>2 Corinthians 5:21 states, &#8220;He [God the Father] made Him [Christ] who knew no sin to be sin on our behalf, so that we might become the righteousness of God [the Father] in Him [Christ].&#8221; This means that on the cross, Christ&mdash;though He was sinless, guiltless, and perfect&mdash;died the death that sinners deserve because of their sins. So in a personal way, Christ died in my place&mdash;<strong>He took my place</strong>. God accounts Christ's death on my behalf as righteousness so I can be made right with God.</p>
              <CaseFigure src="/img/portfolio/main_he-took-my-place.jpg" alt="He Took My Place Illustration" caption="He Took My Place Illustration" />
              <p>I would always include this piece as part of my portfolio, even though it's not a professional one. It's a great way to showcase my skills and creativity, especially when I was just a beginner learning layout, typography, color theory, and various design styles. It also exhibits my ability to design using industry-standard tools&mdash;and back then, Adobe Illustrator and Photoshop dominated the craft.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-blog-graphics"
            title="GTY Blog Graphics"
            category="Marketing"
            image="/img/portfolio/thumb_gty-blog.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
