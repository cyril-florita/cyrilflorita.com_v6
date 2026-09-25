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
import {
  BrandClearSpace,
  BrandSwatches,
  BrandLettering,
  BrandUsage,
} from "@/components/case/BrandGuide";
import { thumbFor } from "@/components/imageProps";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "crafting-stewardship-and-care", label: "Stewardship & Care" },
  { id: "logo-versions", label: "Logo Versions" },
  { id: "clear-space", label: "Clear Space & Size" },
  { id: "color", label: "Color" },
  { id: "lettering", label: "Lettering" },
  { id: "usage", label: "Usage" },
  { id: "outcome", label: "Outcome" },
];

// Brand guide data. Colors are sampled from the delivered artwork; crop boxes
// are [x, y, width, height] in the 1600 × 1186 originals.
const LOGO_LIGHT = "/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-light.jpg";
const LOGO_GOLD = "/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-dark-1.jpg";
const LOGO_PORTRAIT = "/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-dark-2.jpg";
const PRESENTATION = "/img/portfolio/patricia-macarthur-pastoral-care-fund-logo-light-presentation.jpg";
const LOGO_SIZE = [1600, 1186];

const COLORS = [
  { name: "Poppy Red", hex: "#F16E50", rgb: "241 110 80", role: "The first poppy. A fill behind the line work, never text." },
  { name: "Poppy Yellow", hex: "#FDC82C", rgb: "253 200 44", role: "The second poppy, always beside the red." },
  { name: "Meadow Green", hex: "#7AC674", rgb: "122 198 116", role: "The ground the poppies grow from." },
  { name: "Memorial Gold", hex: "#F8BD63", rgb: "248 189 99", role: "The single color of both black versions. Only on black." },
  { name: "Ink", hex: "#121212", rgb: "18 18 18", role: "The continuous line and lettering; the black ground." },
  { name: "Paper", hex: "#FFFFFF", rgb: "255 255 255", role: "The full-color version's ground." },
];

const LETTERING = [
  { name: "Script Name", box: [430, 656, 716, 156], role: "\u201cPatricia MacArthur\u201d is hand-lettered, the personal touch at the heart of the lockup." },
  { name: "Serif Capitals", box: [540, 815, 515, 50], fit: "72%", role: "\u201cPastoral Care Fund\u201d in quiet geometric capitals that steady the script." },
  { name: "Sans Address", box: [680, 898, 240, 54], fit: "32%", role: "\u201cGTY.ORG\u201d small and tracked out, tying the fund back to Grace to You." },
];

const CLEAR_SPECS = [
  { label: "Clear space", value: "One eighth of the emblem\u2019s width (x) on every side." },
  { label: "Minimum size", value: "240px wide on screen, 2 in (51 mm) in print. The script and web address are fine lines." },
  { label: "Placement", value: "Centered or on its own, like a seal. One emblem per view." },
];

const USAGE = [
  { ok: true, label: "Use the full-color version on white.", visual: <img src={thumbFor(LOGO_LIGHT)} alt="" loading="lazy" decoding="async" /> },
  { ok: true, label: "Use the gold version on black for formal pieces.", visual: <img src={thumbFor(LOGO_GOLD)} alt="" loading="lazy" decoding="async" /> },
  { ok: false, label: "Stretch, squash or skew the emblem.", visual: <img className="cyril-brand-stretch" src={thumbFor(LOGO_LIGHT)} alt="" loading="lazy" decoding="async" /> },
  { ok: false, label: "Recolor the poppies or the line work.", visual: <img className="cyril-brand-recolor" src={thumbFor(LOGO_LIGHT)} alt="" loading="lazy" decoding="async" /> },
  { ok: false, label: "Put the full-color version on a dark ground.", visual: <div className="cyril-brand-onblack"><img src={thumbFor(LOGO_LIGHT)} alt="" loading="lazy" decoding="async" /></div> },
  { ok: false, label: "Place it over busy photography.", visual: <div className="cyril-brand-onphoto" style={{ backgroundImage: `url(${thumbFor(PRESENTATION)})` }}><img src={thumbFor(LOGO_LIGHT)} alt="" loading="lazy" decoding="async" /></div> },
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
            image="/img/portfolio/main_patricia-macarthur-pastoral-care-fund.jpg"
            imageAlt="The Patricia MacArthur Pastoral Care Fund logo, gold on black"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>As a designer at Grace to You, my approach to the Patricia MacArthur Pastoral Care Fund logo was to create a visual identity that feels both personal and nurturing, reflecting the fund's mission.</p>
            </CaseSection>

            {/* 02 — Crafting Stewardship and Care */}
            <CaseSection id="crafting-stewardship-and-care" number={2} title="Crafting Stewardship and Care">
              <p>Every element of the mark was chosen to carry part of that mission:</p>
              <ul className="cyril-case-list">
                <li>A pair of poppy flowers as the central motif, for their symbolism of remembrance, care, and gentle strength</li>
                <li>A continuous line drawing style to convey unity and ongoing support</li>
                <li>A circular frame that reinforces a sense of wholeness and protection</li>
                <li>A handwritten script for &ldquo;Patricia MacArthur&rdquo; that adds a personal, human touch, making the logo feel approachable and heartfelt</li>
              </ul>
            </CaseSection>

            {/* 03 — Logo Versions */}
            <CaseSection id="logo-versions" number={3} title="Logo Versions">
              <p>The color variations&mdash;ranging from soft, natural hues on a white background to elegant gold on black&mdash;were developed to ensure the logo remains versatile and impactful across different settings and materials. In the various logo adaptations, I focused on maintaining brand consistency while allowing for contextual flexibility.</p>
              <p>The full-color version with red and yellow poppies and a green base is vibrant and uplifting, ideal for print and digital use where warmth and visibility are needed.</p>
              <CaseFigure src={LOGO_LIGHT} alt="The Patricia MacArthur Pastoral Care Fund Logo - Light Version" caption="Full-Color Version" />
              <p>The gold-on-black variant offers a sophisticated, timeless look suitable for formal events or commemorative materials.</p>
              <CaseFigure src={LOGO_GOLD} alt="The Patricia MacArthur Pastoral Care Fund Logo - Dark Version" caption="Gold on Black Version" />
              <p>Including Patricia MacArthur's portrait in one version personalizes the brand further, honoring her legacy and making the fund's purpose immediately clear.</p>
              <CaseFigure src={LOGO_PORTRAIT} alt="The Patricia MacArthur Pastoral Care Fund Logo - Portrait - Dark Version" caption="Portrait on Black Version" />
            </CaseSection>

            {/* 04 — Clear Space & Size */}
            <CaseSection id="clear-space" number={4} title="Clear Space &amp; Size">
              <p>The emblem works like a seal. It needs room around it, and its finest lines (the script and the web address) set how small it can go.</p>
              <BrandClearSpace src={LOGO_LIGHT} box={[280, 80, 1018, 990]} size={LOGO_SIZE} specs={CLEAR_SPECS} />
            </CaseSection>

            {/* 05 — Color */}
            <CaseSection id="color" number={5} title="Color">
              <p>Color comes from the poppies and the ground they grow from, laid as soft discs behind the line work. On black, everything turns to a single memorial gold.</p>
              <BrandSwatches colors={COLORS} />
            </CaseSection>

            {/* 06 — Lettering */}
            <CaseSection id="lettering" number={6} title="Lettering">
              <p>Three voices make up the name, from most personal to most practical. The lockup is fixed artwork: the name is never retyped or rearranged.</p>
              <BrandLettering src={LOGO_LIGHT} size={LOGO_SIZE} items={LETTERING} />
            </CaseSection>

            {/* 07 — Usage */}
            <CaseSection id="usage" number={7} title="Usage">
              <p>A few rules keep the emblem gentle and recognizable wherever it appears.</p>
              <BrandUsage items={USAGE} />
            </CaseSection>

            {/* 08 — Outcome */}
            <CaseSection id="outcome" number={8} title="Outcome and Reflection">
              <CaseQuote>
                The balance of modern minimalism and classic script ensures the design feels both contemporary and enduring.
              </CaseQuote>
              <p>Throughout, the balance of modern minimalism and classic script ensures the design feels both contemporary and enduring, resonating with a broad audience while conveying stewardship and care. The logo was presented at the GTY Volunteer Appreciation Christmas Party.</p>
              <CaseFigure src={PRESENTATION} alt="The Patricia MacArthur Pastoral Care Fund Logo Presentation" caption="Logo Presentation at the GTY Volunteer Appreciation Christmas Party" />
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
