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
  CaseGrid,
  CaseNext,
  CaseLearnings,
} from "@/components/case/CaseStudy";
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "building", label: "Building the Page" },
  { id: "releases", label: "Releases & Content" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to My Work" buttons.
    sessionStorage.setItem('returnToProject', 'generositychallenge');
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

  const handleBackToPortfolio = () => {
    sessionStorage.setItem('returnToProject', 'generositychallenge');
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Design, Development, & Campaign Performance Tracking"
            detail="Campaign Landing Page"
            title="35-Day Generosity Challenge"
            summary={CASE_SUMMARIES["/35-day-generosity-challenge"]}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://childrenshungerfund.org" target="_blank">Children&apos;s Hunger Fund</a>&mdash;A Christian Non-Profit Ministry</> },
              { label: "Role", value: "Designer & Developer (sole developer)" },
              { label: "Platform & Tools", value: <>{"WordPress"}<br />{"PHP, SASS, JavaScript/jQuery"}</> },
              { label: "Deliverables", value: "Landing page, 5 weekly updates, 5 blog posts, downloadable resource" },
            ]}
            image="/img/portfolio/chf-35-day-generosity_main.jpg"
            imageAlt="35-Day Generosity Challenge landing page"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Children&apos;s Hunger Fund wanted to deepen its relationships with donors and supporters, and the 35-Day Generosity Challenge was a five-week engagement campaign built for that. Daily devotional emails needed somewhere to send people, so a landing page worked together with the emails and weekly blog posts, with each week centered on one of the ministry&apos;s five core values:</p>
              <ul className="cyril-case-list">
                <li>Prioritize the Gospel</li>
                <li>Elevate the Church</li>
                <li>Impact the Next Generation</li>
                <li>Pursue Relationships</li>
                <li>Strive for Integrity</li>
              </ul>
              <p>As the sole developer, I owned the campaign&apos;s entire web presence, from the page&apos;s UX and visual design to its build and every weekly release.</p>
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results &amp; Impact">
              <p>The landing page became the central hub for more than 35 daily devotional emails, bringing recipients back to a living web experience that changed every week. The five blog posts gave engaged readers somewhere to go deeper, tying email, web, and content into one cohesive story.</p>
            </CaseSection>

            {/* 03 — Building the Page */}
            <CaseSection id="building" number={3} title="Building the Page">
              <h3 className="cyril-case-subheading">Designed in Code</h3>
              <p>There was no mockup to build from, so I designed directly in HTML and CSS. I adapted the milestone tracker from the Giving Tuesday campaign into a five-step weekly challenge, making layout, spacing, hierarchy, and interaction decisions as I built. The initial build went through a month of review with four stakeholders across communications, leadership, production, and design, and more than 20 rounds of feedback before launch.</p>
              <CaseFigure src="/img/portfolio/chf-35-day-generosity_progress.jpg" alt="35-Day Generosity Challenge progress tracker" caption="Challenge progress tracker" />
              <CaseFigure src="/img/portfolio/chf-35-day-generosity_weekly-challenge.jpg" alt="This week's challenge card" caption="This week's challenge" />

              <h3 className="cyril-case-subheading">A Page That Changes Every Week</h3>
              <p>The centerpiece is a set of five tiles, one for each week, that together tell the story of the journey:</p>
              <ul className="cyril-case-list">
                <li><strong>Three states per tile.</strong> Upcoming weeks stay muted and locked, the current week is highlighted with its challenge, and completed weeks get a checkmark while staying readable.</li>
                <li><strong>A rotating hero.</strong> The top of the page swaps each week to that week&apos;s focus, challenge, and imagery, built as its own module so it could change without touching the rest of the layout.</li>
                <li><strong>A growing content hub.</strong> Each tile links to its week&apos;s blog post as it goes live.</li>
                <li><strong>One-week surprises.</strong> Week two added interactive flip cards for pastor appreciation notes, built with CSS 3D transforms.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-35-day-generosity_weekly-tiles.jpg" alt="Weekly challenge tiles" caption="Weekly tiles: completed, current & upcoming" ratio="4 / 3" />

              <h3 className="cyril-case-subheading">Designed for Every Screen</h3>
              <p>With most supporters arriving from their inboxes, the page had to feel just as considered on a phone as on a desktop.</p>
              <CaseGrid layout="three">
                <CaseFigure src="/img/portfolio/chf-35-day-generosity_desktop.jpg" alt="35-Day Generosity Challenge on desktop" caption="Desktop" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-35-day-generosity_tablet.jpg" alt="35-Day Generosity Challenge on tablet" caption="Tablet" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-35-day-generosity_mobile.jpg" alt="35-Day Generosity Challenge on mobile" caption="Mobile" ratio="3 / 5" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — Releases & Content */}
            <CaseSection id="releases" number={4} title="Releases &amp; Content">
              <h3 className="cyril-case-subheading">Monday 5 AM Releases</h3>
              <p>After launch, I shipped a new version of the page every week on a strict schedule:</p>
              <ul className="cyril-case-list">
                <li><strong>Build ahead.</strong> Each update was prepared as an unpublished revision, so stakeholders could review it through a private preview without touching the live page.</li>
                <li><strong>Advance the journey.</strong> The previous week was marked complete, the new week activated, and the hero swapped.</li>
                <li><strong>Sign-off.</strong> Every update cleared a formal three-person approval before it was scheduled.</li>
                <li><strong>Release on the dot.</strong> Updates went live automatically at 5 AM every Monday, timed to meet the first email of the new week, with zero downtime.</li>
              </ul>

              <h3 className="cyril-case-subheading">Content and Resources</h3>
              <p>I also prepared and published five weekly blog posts, formatting each for the site, coordinating custom banner art with the Creative Director, and scheduling each to go live at the start of its week. For the email campaign, I set up hosting and a trackable download link for a designed PDF, a favorite cookie recipe from the ministry&apos;s co-founder, reusing the pattern I established on Giving Tuesday.</p>
            </CaseSection>

            {/* 05 — Learning & Next Steps */}
            <CaseSection id="learnings" number={5} title="Learning & Next Steps">
              <CaseLearnings
                learned={[
                  "Adapting the Giving Tuesday milestone tracker into a five-step weekly challenge taught me how much a proven pattern speeds up a build with no mockup.",
                  "A month of review across four stakeholders and more than 20 rounds of feedback showed me that designing in code means the review process needs to be part of the build.",
                  "Building the hero as its own module and preparing each week as an unpublished revision taught me to structure a page so it can change weekly without touching the rest of the layout or the live page.",
                ]}
                next={[
                  "Reuse the weekly tile states and rotating hero module for other multi-week campaigns.",
                  "Measure return visits to the page across the five weeks to see whether the tile progression encouraged them.",
                  "Keep the build-ahead, approve, and scheduled Monday release routine as the template for future timed updates.",
                ]}
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/grace-stream"
            title="Grace Stream"
            category="Branding, Design, & Development"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
