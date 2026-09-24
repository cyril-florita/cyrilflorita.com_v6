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
  { id: "crafting-stewardship-and-care", label: "Stewardship & Care" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'patriciamacarthur');
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
    const projectId = 'patriciamacarthur'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Illustration/Branding"
            detail="Logo Design"
            title="The Patricia MacArthur Pastoral Care Fund"
            summary="A logo for the Patricia MacArthur Pastoral Care Fund, designed as a visual identity that feels both personal and nurturing, reflecting the fund's mission."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Logo Designer" },
              { label: "Deliverables", value: "Full-Color, Gold on Black & Portrait Logo Versions" },
            ]}
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Crafting Stewardship and Care */}
            <CaseSection id="crafting-stewardship-and-care" number={1} title="Crafting Stewardship and Care">
              <p>As a designer at Grace to You, my approach to the Patricia MacArthur Pastoral Care Fund logo was to create a visual identity that feels both personal and nurturing, reflecting the fund's mission. The central motif&mdash;a pair of poppy flowers&mdash;was chosen for its symbolism of remembrance, care, and gentle strength. I used a continuous line drawing style to convey unity and ongoing support, while the circular frame reinforces a sense of wholeness and protection. The handwritten script for &ldquo;Patricia MacArthur&rdquo; adds a personal, human touch, making the logo feel approachable and heartfelt. The color variations&mdash;ranging from soft, natural hues on a white background to elegant gold on black&mdash;were developed to ensure the logo remains versatile and impactful across different settings and materials.</p>
              <p>In the various logo adaptations, I focused on maintaining brand consistency while allowing for contextual flexibility. The full-color version with red and yellow poppies and a green base is vibrant and uplifting, ideal for print and digital use where warmth and visibility are needed.</p>
              <CaseFigure src="/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-light.jpg" alt="The Patricia MacArthur Pastoral Care Fund Logo - Light Version" caption="Full-Color Version" />
              <p>The gold-on-black variant offers a sophisticated, timeless look suitable for formal events or commemorative materials.</p>
              <CaseFigure src="/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-dark-1.jpg" alt="The Patricia MacArthur Pastoral Care Fund Logo - Dark Version" caption="Gold on Black Version" />
              <p>Including Patricia MacArthur's portrait in one version personalizes the brand further, honoring her legacy and making the fund's purpose immediately clear.</p>
              <CaseFigure src="/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-dark-2.jpg" alt="The Patricia MacArthur Pastoral Care Fund Logo - Portrait - Dark Version" caption="Portrait on Black Version" />
              <p>Throughout, the balance of modern minimalism and classic script ensures the design feels both contemporary and enduring, resonating with a broad audience while conveying stewardship and care.</p>
              <CaseFigure src="/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-light-presentation.jpg" alt="The Patricia MacArthur Pastoral Care Fund Logo Presentation" caption="Logo Presentation at the GTY Volunteer Appreciation Christmas Party" />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-resources"
            title="GTY Resources"
            category="Marketing"
            image="/img/portfolio/thumb_gty-resources.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
