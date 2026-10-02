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
  CaseNext,
  CaseLearnings,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "building", label: "Building the Page" },
  { id: "day-of", label: "Day-Of & After" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to My Work" buttons.
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
            category="Design, Development, & Campaign Performance Tracking"
            detail="Campaign Landing Page"
            title="Giving Tuesday Campaign"
            summary="A single-purpose donation page for Children's Hunger Fund's biggest giving day of the year: rebuilt for conversion, re-engineered overnight for a corporate match, and run live, hour by hour."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://childrenshungerfund.org" target="_blank">Children&apos;s Hunger Fund</a>&mdash;A Christian Non-Profit Ministry</> },
              { label: "Role", value: "Designer & Developer (sole developer)" },
              { label: "Platform & Tools", value: <>{"WordPress"}<br />{"PHP, SASS, JavaScript/jQuery, embedded giving forms"}</> },
              { label: "Deliverables", value: "Landing page, live donation tracker, post-campaign page" },
            ]}
            result={{ value: "$150K+", label: "Raised on Giving Tuesday" }}
            image="/img/portfolio/chf-giving-tuesday_main.jpg"
            imageAlt="Giving Tuesday landing page"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Giving Tuesday is Children&apos;s Hunger Fund&apos;s largest single-day fundraising push of the year, and every channel pointed to one place. A 20+ email drip campaign, paid social and search ads, and organic social posts all sent donors to the campaign&apos;s landing page, which then handed off to the year-end giving season. That put the whole day&apos;s effort on a single page.</p>
              <p>As the sole developer, I owned that page end to end, designing directly in code with no mockup handed to me, across four phases:</p>
              <ul className="cyril-case-list">
                <li>a conversion-focused rebuild</li>
                <li>a corporate gift-match version with a live donation tracker</li>
                <li>hourly updates on the day itself</li>
                <li>a post-campaign page that kept giving momentum alive</li>
              </ul>
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <CaseStats items={[
                { value: "$150K+", label: "Raised on Giving Tuesday" },
                { value: "1.2M", label: "Meals provided" },
              ]} />
              <p>The landing page was the single conversion destination for every email, ad, and social post in the campaign. The distraction-free, single-ask design pointed the entire donor journey toward one action, the live tracker kept donors engaged and coming back throughout the day, and the post-campaign redirect turned leftover traffic into year-end gifts instead of dead ends.</p>
            </CaseSection>

            {/* 03 — Building the Page */}
            <CaseSection id="building" number={3} title="Building the Page">
              <h3 className="cyril-case-subheading">Built to Convert</h3>
              <p>With the timeline too tight for a design comp, I rebuilt the page straight from the content strategy, making every UX decision in code with one goal in mind: turn visitors into donors.</p>
              <ul className="cyril-case-list">
                <li><strong>No exits.</strong> A custom page template stripped out the site&apos;s header navigation, footer links, and sidebar; the logo was the only way out.</li>
                <li><strong>The form comes first.</strong> The donation form sits above the fold, embedded and sized to work at every screen width, so donors arriving from inboxes, social feeds, and search could give on a phone as easily as on a desktop.</li>
                <li><strong>One ask.</strong> A story-driven layout carries emotive copy below the fold, with a single primary call to action and just enough supporting content to keep undecided visitors reading.</li>
                <li><strong>A resource to share.</strong> A downloadable &ldquo;Stories of Hope&rdquo; PDF, hosted on the site with a trackable link for the email campaign.</li>
              </ul>

              <h3 className="cyril-case-subheading">The Match and the Live Tracker</h3>
              <p>When a corporate gift-match was confirmed mid-November, the page needed a new story. I built an entirely new version within a week:</p>
              <ul className="cyril-case-list">
                <li><strong>A live progress tracker</strong> showing donations climbing toward each match milestone throughout the day, turning giving into a shared goal and adding real urgency.</li>
                <li><strong>Milestone cards</strong> marking each threshold, from the match itself to the final stretch goal, each one unlocking as the total rose.</li>
                <li><strong>A timed launch.</strong> The match version was scheduled to go live the night before, so it was ready when the first morning email reached inboxes. A lighter teaser update bridged the gap in the days before.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-giving-tuesday_milestones.jpg" alt="Giving Tuesday milestone tracker and cards" caption="Milestone tracker & cards" />
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/chf-giving-tuesday_progress.jpg" alt="Giving Tuesday live tracker page on desktop" caption="Live tracker — Desktop" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-giving-tuesday_mobile.jpg" alt="Giving Tuesday live tracker page on mobile" caption="Live tracker — Mobile" ratio="3 / 5" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — Day-Of & After */}
            <CaseSection id="day-of" number={4} title="Day-Of &amp; After">
              <h3 className="cyril-case-subheading">Giving Tuesday, Live</h3>
              <p>On the day itself, I updated the page every hour, from the first email to the last: moving the tracker forward as totals climbed, refreshing the copy, and celebrating each milestone as it fell. I worked in real time with the communications and executive team to adjust urgency messaging to the pace of giving, and made sure every update reached visitors the moment it was published.</p>

              <h3 className="cyril-case-subheading">After the Day</h3>
              <p>Once the campaign ended, the page still had traffic, and every visitor who arrived ready to give was an opportunity. So I designed and built a post-campaign version:</p>
              <ul className="cyril-case-list">
                <li><strong>From urgency to gratitude.</strong> The page became a thank-you, celebrating what donors made possible.</li>
                <li><strong>No dead ends.</strong> The Giving Tuesday form was retired, and a popup caught anyone still trying to give and pointed them to the year-end campaign, so no donation intent was lost.</li>
                <li><strong>On time.</strong> Scheduled to go live at 6 AM the morning after, bridging straight into the year-end season.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-giving-tuesday_post-campaign.jpg" alt="Giving Tuesday post-campaign thank-you page" caption="Post-campaign page" />
            </CaseSection>

            {/* 05 — Learning & Next Steps */}
            <CaseSection id="learnings" number={5} title="Learning &amp; Next Steps">
<CaseLearnings
                learned={[
                  "With the timeline too tight for a design comp, I learned that building straight from the content strategy in code can work when every decision serves one goal.",
                  "When the corporate gift-match was confirmed mid-November, I had to build a new version within a week, which showed me the value of a page structured so a new story can be swapped in quickly.",
                  "Retiring the form after the day and catching late visitors with a popup taught me to plan for the traffic that arrives after a campaign ends.",
                ]}
                next={[
                  "Reuse the live tracker and milestone cards for future matched giving campaigns, as I already adapted the tracker for the 35-Day Generosity Challenge.",
                  "Use the trackable links to compare how the single-ask, no-exit template performs against other campaign pages.",
                  "Carry the thank-you page and popup pattern into other campaigns so no donation intent is lost afterward.",
                ]}
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty_v8"
            title="Grace to You (v.8)"
            category="UX Design & Front-End Development"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
