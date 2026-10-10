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
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "system", label: "Design System" },
  { id: "the-collection", label: "The Collection" },
  { id: "reflection", label: "Reflection" },
];

// Figures come from components/data/socialGraphics.js (the same files the My
// Work grid shows). Featured ones are picked by id per section; everything
// else lands in "The Collection", so each graphic appears once.
const BY_ID = Object.fromEntries(SOCIAL_GRAPHICS.map((g) => [g.id, g]));
const Fig = ({ id }) => {
  const g = BY_ID[`social-${id}`];
  return <CaseFigure src={g.src} alt={g.caption} caption={g.caption} />;
};
const FEATURED = {
  anatomy: ["light-of-gods-truth", "scriptures-absolute-inerrant-authority"],
  // each row is one layout used for two different quotes
  pairs: ["none-good-enough-none-so-evil", "obedience-is-the-hallmark", "only-message-with-the-power-to-save", "universe-and-god", "glory-of-god", "sons-of-the-king", "call-to-glory", "lordship-of-christ"],
  photo: ["humility-vs-pride", "sinners-vs-self-sufficient", "peoples-deepest-need", "true-worship", "know-christ-as-lord", "provides-for-what-he-demands", "truly-christlike-character", "slavery-to-christ"],
};
const SHOWN = new Set(Object.values(FEATURED).flat().map((id) => `social-${id}`));
const COLLECTION = SOCIAL_GRAPHICS.filter((g) => !SHOWN.has(g.id));

const Page = () => {

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
            summary={CASE_SUMMARIES["/gty-social-media-graphics"]}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
              { label: "Platform & Tools", value: "Social Media" },
            ]}
            image="/img/portfolio/gty-social_train-tracks---Light-of-God's-Truth.jpg"
            imageAlt="Light of God's Truth"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>These quote graphics are tailored for social media sharing: concise, impactful quotes built to capture attention in a fast-scrolling feed, with the GTY.org address placed so viewers know exactly where to go for more. By presenting thought-provoking quotes in visually appealing formats, they aim to spark conversations, encourage shares, and drive traffic to the GTY website, expanding the reach of its resources.</p>
              <p>Consistent branding, with the &ldquo;Grace to You&rdquo; logo and the GTY.org URL prominently displayed, reinforces brand recognition. Each design credits John MacArthur and specifies the source material, which maintains credibility and encourages viewers to explore the original context of the quotes.</p>
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>Each post could look fresh in the feed, yet every one credits its source and points back to GTY.org, turning a moment of scrolling into a path to the original teaching.</p>
            </CaseSection>

            {/* 03 — Design System */}
            <CaseSection id="system" number={3} title="Design System">
              <h3 className="cyril-case-subheading">Anatomy of a Quote</h3>
              <p>However the layout changes, every graphic carries the same four parts, always in the same order of importance:</p>
              <ul className="cyril-case-list">
                <li>The quote, given most of the square and set large enough to read on a phone</li>
                <li>&ldquo;John MacArthur,&rdquo; usually in small capitals, directly under the quote</li>
                <li>The source, a book title and often a page number, set small so it informs without competing</li>
                <li>The Grace to You logo with GTY.ORG in a corner, so a shared image always leads back home</li>
              </ul>
              <CaseGrid layout="two">
                {FEATURED.anatomy.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>

              <h3 className="cyril-case-subheading">Templates in Pairs</h3>
              <p>A feed needs variety, but a brand needs consistency. Rather than design every post from scratch, I built a set of about fifteen layouts, among them a framed print, a chalkboard, a sheet pinned to a concrete wall, and a black card over white architecture, and set two different quotes in each. A new quote could drop into a proven layout, and consecutive posts could vary in look while still reading as one series.</p>
              <CaseGrid layout="two">
                {FEATURED.pairs.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>

              <h3 className="cyril-case-subheading">Type &amp; Photography</h3>
              <p>Contrasting fonts and carefully selected photographs capture attention and keep the content easy to digest, with fonts consistent with GTY&apos;s style guide. Reflective quotes are set in a light serif or sentence case; declarative ones in widely spaced capitals. The photography sets a mood without illustrating the quote literally: two small birds for humility and self-sufficiency, a figure at a railing for a quote about the deepest human need, a kayak at sunset for God&apos;s provision. Soft duotones and dark overlays keep every photo quiet enough for the quote to sit on top.</p>
              <CaseGrid layout="two">
                {FEATURED.photo.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>
            </CaseSection>

            {/* 04 — The Collection */}
            <CaseSection id="the-collection" number={4} title="The Collection">
              <p>The rest of the series, each in one of the same layouts and carrying the same four parts.</p>
              <CaseGrid layout="three">
                {COLLECTION.map((g) => <CaseFigure key={g.id} src={g.src} alt={g.caption} caption={g.caption} />)}
              </CaseGrid>
            </CaseSection>

            {/* 05 — Reflection */}
            <CaseSection id="reflection" number={5} title="Reflection">
              <p>The series shows how far a small system can stretch: a fixed set of parts, a library of paired layouts, and a clear hierarchy of quote, name, source and logo.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-resources"
            title="GTY Resources"
            category="Marketing"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
