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
  CaseStats,
  CaseQuote,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "designed-in-code", label: "Designed in Code" },
  { id: "weekly-journey", label: "A Weekly Journey" },
  { id: "releases", label: "Monday Releases" },
  { id: "content", label: "Content & Resources" },
  { id: "responsive", label: "Every Screen" },
  { id: "impact", label: "Impact" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to All Work" buttons.
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
            category="Design & Development"
            detail="Campaign Landing Page"
            title="35-Day Generosity Challenge"
            summary="A living landing page for a five-week, multi-channel campaign: one hub that evolved every Monday as supporters worked through a week-by-week journey of generosity."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://childrenshungerfund.org" target="_blank">Children&apos;s Hunger Fund</a>&mdash;A Christian Non-Profit Ministry</> },
              { label: "Role", value: "Designer & Developer (sole developer)" },
              { label: "Platform", value: "WordPress" },
              { label: "Tools", value: "PHP, SASS, JavaScript/jQuery" },
              { label: "Deliverables", value: "Landing page, 5 weekly updates, 5 blog posts, downloadable resource" },
            ]}
            image="/img/portfolio/chf-35-day-generosity_main.jpg"
            imageAlt="35-Day Generosity Challenge landing page"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>The 35-Day Generosity Challenge was a five-week engagement campaign designed to deepen relationships with Children&apos;s Hunger Fund&apos;s donors and supporters. Daily devotional emails, weekly blog posts, and a landing page worked together, with each week centered on one of the ministry&apos;s five core values: Prioritize the Gospel, Elevate the Church, Impact the Next Generation, Pursue Relationships, and Strive for Integrity.</p>
              <p>As the sole developer, I owned the campaign&apos;s entire web presence, from the page&apos;s UX and visual design to its build and every weekly release.</p>
              <CaseStats items={[
                { value: "5", label: "Weeks, one core value each" },
                { value: "35+", label: "Daily emails linking to the page" },
                { value: "5", label: "Scheduled page versions" },
                { value: "5", label: "Weekly blog posts" },
              ]} />
            </CaseSection>

            {/* 02 — Designed in Code */}
            <CaseSection id="designed-in-code" number={2} title="Designed in Code">
              <p>There was no mockup to build from, so I designed directly in HTML and CSS. I adapted the milestone tracker I had built for the Giving Tuesday campaign into a new format, a five-step weekly challenge, and made the layout, spacing, hierarchy, and interaction decisions as I built.</p>
              <CaseFigure src="/img/portfolio/chf-35-day-generosity_progress.jpg" alt="35-Day Generosity Challenge progress tracker" caption="Challenge progress tracker" />
              <CaseFigure src="/img/portfolio/chf-35-day-generosity_weekly-challenge.jpg" alt="This week's challenge card" caption="This week's challenge" />
              <p>The initial build went through a month of review with four stakeholders across communications, leadership, production, and design, and more than 20 rounds of feedback before launch.</p>
            </CaseSection>

            {/* 03 — A Weekly Journey */}
            <CaseSection id="weekly-journey" number={3} title="A Page That Changes Every Week">
              <p>The page was built to evolve. Its centerpiece is a set of five tiles, one for each week, that together tell the story of the journey:</p>
              <ul className="cyril-case-list">
                <li><strong>Three states per tile.</strong> Upcoming weeks stay muted and locked, the current week is highlighted with its challenge, and completed weeks get a checkmark while staying readable.</li>
                <li><strong>A rotating hero.</strong> The top of the page swaps each week to that week&apos;s focus, challenge, and imagery, built as its own module so it could change without touching the rest of the layout.</li>
                <li><strong>A growing content hub.</strong> Each tile links to its week&apos;s blog post as it goes live, so the page grows richer as the campaign goes on.</li>
                <li><strong>One-week surprises.</strong> Week two added interactive flip cards for pastor appreciation notes, built with CSS 3D transforms.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-35-day-generosity_weekly-tiles.jpg" alt="Weekly challenge tiles" caption="Weekly tiles: completed, current & upcoming" ratio="4 / 3" />
              <CaseQuote>
                The tile progression created a visual sense of journey completion that encouraged return visits.
              </CaseQuote>
            </CaseSection>

            {/* 04 — Monday Releases */}
            <CaseSection id="releases" number={4} title="Monday 5 AM Releases">
              <p>After launch, I shipped a new version of the page every week on a strict schedule, following the same routine each time:</p>
              <ul className="cyril-case-list">
                <li><strong>Build ahead.</strong> Each week&apos;s update was prepared as an unpublished revision, so stakeholders could review it through a private preview without touching the live page.</li>
                <li><strong>Advance the journey.</strong> The previous week was marked complete, the new week activated, and the hero swapped.</li>
                <li><strong>Sign-off.</strong> Every update cleared a formal three-person approval before it was scheduled.</li>
                <li><strong>Release on the dot.</strong> Updates went live automatically at 5 AM every Monday, timed to meet the first email of the new week, with zero downtime.</li>
              </ul>
            </CaseSection>

            {/* 05 — Content & Resources */}
            <CaseSection id="content" number={5} title="Content and Resources">
              <p>Alongside the page, I prepared and published five weekly blog posts, formatting each one for the site, coordinating custom banner art with the Creative Director, and scheduling each post to go live at the start of its week.</p>
              <p>I also set up hosting and delivery for a designed PDF, a favorite cookie recipe from the ministry&apos;s co-founder, with a trackable download link for the email campaign, reusing the pattern I established on Giving Tuesday.</p>
            </CaseSection>

            {/* 06 — Every Screen */}
            <CaseSection id="responsive" number={6} title="Designed for Every Screen">
              <p>With most supporters arriving from their inboxes, the page had to feel just as considered on a phone as on a desktop.</p>
              <CaseGrid layout="three">
                <CaseFigure src="/img/portfolio/chf-35-day-generosity_desktop.jpg" alt="35-Day Generosity Challenge on desktop" caption="Desktop" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-35-day-generosity_tablet.jpg" alt="35-Day Generosity Challenge on tablet" caption="Tablet" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-35-day-generosity_mobile.jpg" alt="35-Day Generosity Challenge on mobile" caption="Mobile" ratio="3 / 5" />
              </CaseGrid>
            </CaseSection>

            {/* 07 — Impact */}
            <CaseSection id="impact" number={7} title="Impact">
              <p>The landing page became the central hub for more than 35 daily devotional emails, bringing recipients back to a living web experience that changed every week. The five blog posts gave engaged readers somewhere to go deeper, and together they tied email, web, and content into one cohesive, five-week story.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/giving-tuesday"
            title="Giving Tuesday Campaign"
            category="Design & Development"
            image="/img/portfolio/chf-giving-tuesday_main.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
