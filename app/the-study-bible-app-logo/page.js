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
  BrandLogos,
  BrandClearSpace,
  BrandSwatches,
  BrandLettering,
  BrandUsage,
  BrandCrop,
} from "@/components/case/BrandGuide";
import { thumbFor } from "@/components/imageProps";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "research", label: "Research" },
  { id: "ideation", label: "Ideation" },
  { id: "iterations", label: "Iterations" },
  { id: "final-design", label: "Final Design" },
  { id: "logo-suite", label: "Logo Suite" },
  { id: "color", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "usage", label: "Usage" },
  { id: "outcome", label: "Outcome" },
];

// Brand guide data. The blue is sampled from the delivered artwork; crop
// boxes are [x, y, width, height] in the 1600 × 1067 original.
const LOGO = "/img/portfolio/the-study-bible-app-logo.jpg";
const LOGO_SIZE = [1600, 1067];
const HOMEPAGE = "/img/portfolio/the-study-bible-app-logo_on-gty-homepage.jpg";
const MARK_BOX = [456, 223, 692, 452];
const WORDMARK_BOX = [594, 719, 416, 121];

const LOGOS = [
  { src: LOGO, name: "Lockup", ground: "White", use: "The default: app store pages, splash screens and announcements." },
  { src: LOGO, box: MARK_BOX, size: LOGO_SIZE, fit: "58%", name: "Mark", ground: "White", use: "Small and square spaces where the wordmark can\u2019t be read, like the app icon." },
  { src: LOGO, box: WORDMARK_BOX, size: LOGO_SIZE, fit: "50%", name: "Wordmark", ground: "White", use: "Text-led places, such as headers and credits, where the mark already appears nearby." },
];

const COLORS = [
  { name: "Muted Blue", hex: "#3E5D71", rgb: "62 93 113", role: "The mark and the wordmark. Calm, trustworthy and timeless; 6.9:1 on white, so it works for text too." },
  { name: "White", hex: "#FFFFFF", rgb: "255 255 255", role: "The ground, and the open pages of the book cut out of the sun." },
];

const TYPE = [
  { name: "\u201cThe\u201d \u2014 Light", box: [735, 719, 132, 50], fit: "29%", role: "A lighter weight, tracked out, set above the name so it reads first but quietly." },
  { name: "\u201cStudy Bible\u201d \u2014 Bold", box: [594, 784, 416, 56], fit: "90%", role: "The name in bold capitals, carrying the lockup. A clean sans-serif keeps it readable at app sizes." },
];

const CLEAR_SPECS = [
  { label: "Clear space", value: "One eighth of the logo\u2019s width (x), about a quarter of the sun\u2019s height, on every side." },
  { label: "Minimum size", value: "Lockup 160px wide on screen, 1 in (25 mm) in print. Below that, use the mark alone, down to 32px." },
  { label: "Placement", value: "Centered, with the sun resting on its flat edge. Never rotated." },
];

const art = (className) => <img className={className} src={thumbFor(LOGO)} alt="" loading="lazy" decoding="async" />;

const USAGE = [
  { ok: true, label: "Use the lockup in muted blue on white.", visual: art() },
  { ok: true, label: "Use the mark alone where space is small.", visual: <div className="cyril-brand-fitbox"><BrandCrop src={LOGO} box={MARK_BOX} size={LOGO_SIZE} alt="" style={{ width: "46%" }} /></div> },
  { ok: false, label: "Stretch, squash or skew the logo.", visual: art("cyril-brand-stretch") },
  { ok: false, label: "Change the blue to another color.", visual: art("cyril-brand-recolor") },
  { ok: false, label: "Put the white-ground artwork on a dark background.", visual: <div className="cyril-brand-onblack">{art()}</div> },
  { ok: false, label: "Place it over busy imagery.", visual: <div className="cyril-brand-onphoto" style={{ backgroundImage: `url(${thumbFor(HOMEPAGE)})` }}>{art()}</div> },
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

            {/* 06 — Logo Suite */}
            <CaseSection id="logo-suite" number={6} title="Logo Suite">
              <p>The logo works as a full lockup, and its two parts can stand alone: the mark for small, square spaces and the wordmark where text leads.</p>
              <BrandLogos items={LOGOS} />
              <h3 className="cyril-case-subheading">Clear Space &amp; Size</h3>
              <p>The sun needs room to rise. Keep the space around it clear, and switch to the mark alone before the wordmark gets too small to read.</p>
              <BrandClearSpace src={LOGO} box={[440, 207, 724, 649]} size={LOGO_SIZE} specs={CLEAR_SPECS} />
            </CaseSection>

            {/* 07 — Color */}
            <CaseSection id="color" number={7} title="Color">
              <p>The color palette is a muted blue, chosen for its calm, trustworthy, and timeless qualities. It&apos;s used as a single flat color, with the book&apos;s pages cut out in white.</p>
              <BrandSwatches colors={COLORS} />
            </CaseSection>

            {/* 08 — Typography */}
            <CaseSection id="typography" number={8} title="Typography">
              <p>For the wordmark, I selected a clean, sans-serif font. The hierarchy emphasizes &ldquo;STUDY BIBLE&rdquo; in bold, with &ldquo;THE&rdquo; in a lighter weight above, ensuring readability and balance.</p>
              <BrandLettering src={LOGO} size={LOGO_SIZE} items={TYPE} />
            </CaseSection>

            {/* 09 — Usage */}
            <CaseSection id="usage" number={9} title="Usage">
              <p>A few rules keep the logo clear and consistent across app stores, devices and the GTY website.</p>
              <BrandUsage items={USAGE} />
            </CaseSection>

            {/* 10 — Outcome and Reflection */}
            <CaseSection id="outcome" number={10} title="Outcome and Reflection">
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
