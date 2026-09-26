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
  CaseStats,
  CaseQuote,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "conversion", label: "Built to Convert" },
  { id: "live-tracker", label: "Match & Live Tracker" },
  { id: "day-of", label: "Day-Of" },
  { id: "after", label: "After the Day" },
  { id: "impact", label: "Impact" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to All Work" buttons.
    sessionStorage.setItem('returnToProject', 'givingtuesday');
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
    sessionStorage.setItem('returnToProject', 'givingtuesday');
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Design & Development"
            detail="Campaign Landing Page"
            title="Giving Tuesday Campaign"
            summary="A single-purpose donation page for Children's Hunger Fund's biggest giving day of the year: rebuilt for conversion, re-engineered overnight for a corporate match, and run live, hour by hour."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://childrenshungerfund.org" target="_blank">Children&apos;s Hunger Fund</a>&mdash;A Christian Non-Profit Ministry</> },
              { label: "Role", value: "Designer & Developer (sole developer)" },
              { label: "Platform", value: "WordPress" },
              { label: "Tools", value: "PHP, SASS, JavaScript/jQuery, embedded giving forms" },
              { label: "Deliverables", value: "Landing page, live donation tracker, post-campaign page" },
            ]}
            image="/img/portfolio/chf-giving-tuesday_main.jpg"
            imageAlt="Giving Tuesday landing page"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>Giving Tuesday is Children&apos;s Hunger Fund&apos;s largest single-day fundraising push of the year. Every channel pointed to one place: a 20+ email drip campaign, paid social and search ads, and organic social posts all sent donors to the campaign&apos;s landing page, which then handed off to the year-end giving season.</p>
              <p>As the sole developer, I owned that page end to end, designing directly in code with no mockup handed to me, across four phases: a conversion-focused rebuild, a corporate gift-match version with a live donation tracker, hourly updates on the day itself, and a post-campaign page that kept giving momentum alive.</p>
              <CaseStats items={[
                { value: "$150K+", label: "Raised on Giving Tuesday" },
                { value: "1.2M", label: "Meals provided" },
                { value: "20+", label: "Emails pointing to one page" },
                { value: "4", label: "Page versions, all scheduled" },
              ]} />
            </CaseSection>

            {/* 02 — Built to Convert */}
            <CaseSection id="conversion" number={2} title="A Page Built to Convert">
              <p>With the timeline too tight for a design comp, I rebuilt the page straight from the content strategy, making every UX decision in code with one goal in mind: turn visitors into donors.</p>
              <ul className="cyril-case-list">
                <li><strong>No exits.</strong> A custom page template stripped out the site&apos;s header navigation, footer links, and sidebar; the logo was the only way out.</li>
                <li><strong>The form comes first.</strong> The donation form sits above the fold, embedded and sized to work at every screen width.</li>
                <li><strong>One ask.</strong> A story-driven layout carries emotive copy below the fold, with a single primary call to action and just enough supporting content to keep undecided visitors reading.</li>
                <li><strong>A resource to share.</strong> A downloadable &ldquo;Stories of Hope&rdquo; PDF, hosted on the site with a trackable link for the email campaign.</li>
              </ul>
              <CaseQuote cite="The page's one rule">
                Give or abandon&mdash;zero distractions.
              </CaseQuote>
            </CaseSection>

            {/* 03 — Match & Live Tracker */}
            <CaseSection id="live-tracker" number={3} title="The Match and the Live Tracker">
              <p>When a corporate gift-match was confirmed mid-November, the page needed a new story. I built an entirely new version within a week:</p>
              <ul className="cyril-case-list">
                <li><strong>A live progress tracker</strong> showing donations climbing toward each match milestone throughout the day, turning giving into a shared goal and adding real urgency.</li>
                <li><strong>Milestone cards</strong> marking each threshold, from the match itself to the final stretch goal, each one unlocking as the total rose.</li>
                <li><strong>A timed launch.</strong> The match version was scheduled to go live the night before, so it was ready when the first morning email reached inboxes. A lighter teaser update bridged the gap in the days before.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-giving-tuesday_milestones.jpg" alt="Giving Tuesday milestone tracker and cards" caption="Milestone tracker & cards" />
              <CaseFigure src="/img/portfolio/chf-giving-tuesday_progress.jpg" alt="Giving Tuesday live tracker page" caption="Live tracker version (full page)" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 04 — Day-Of */}
            <CaseSection id="day-of" number={4} title="Giving Tuesday, Live">
              <p>On the day itself, I updated the page every hour, from the first email to the last: moving the tracker forward as totals climbed, refreshing the copy, and celebrating each milestone as it fell.</p>
              <p>I worked in real time with the communications and executive team to adjust urgency messaging to the pace of giving, and made sure every update reached visitors the moment it was published.</p>
            </CaseSection>

            {/* 05 — After the Day */}
            <CaseSection id="after" number={5} title="After the Day">
              <p>Once the campaign ended, the page still had traffic, and every visitor who arrived ready to give was an opportunity. So I designed and built a post-campaign version:</p>
              <ul className="cyril-case-list">
                <li><strong>From urgency to gratitude.</strong> The page became a thank-you, celebrating what donors made possible.</li>
                <li><strong>No dead ends.</strong> The Giving Tuesday form was retired, and a popup caught anyone still trying to give and pointed them to the year-end campaign, so no donation intent was lost.</li>
                <li><strong>On time.</strong> Scheduled to go live at 6 AM the morning after, bridging straight into the year-end season.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-giving-tuesday_post-campaign.jpg" alt="Giving Tuesday post-campaign thank-you page" caption="Post-campaign page" />
            </CaseSection>

            {/* 06 — Impact */}
            <CaseSection id="impact" number={6} title="Impact">
              <p>The landing page was the single conversion destination for every email, ad, and social post in the campaign. The distraction-free, single-ask design pointed the entire donor journey toward one action; the live tracker kept donors engaged and coming back throughout the day; and the post-campaign redirect turned leftover traffic into year-end gifts instead of dead ends.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/truth-matters"
            title="Truth Matters Podcast"
            category="Design, Development, & Branding"
            image="/img/portfolio/main_truth-matters-podcast.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
