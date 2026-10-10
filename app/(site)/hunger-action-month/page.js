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
  CaseVideo,
  CaseGrid,
  CaseStats,
  CaseLink,
  CaseNext,
  CaseLearnings,
} from "@/components/case/CaseStudy";
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "page", label: "The Page" },
  { id: "tracking", label: "Tracking & Attribution" },
  { id: "data", label: "What the Data Showed" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to My Work" buttons.
    sessionStorage.setItem('returnToProject', 'hungeractionmonth');
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
    sessionStorage.setItem('returnToProject', 'hungeractionmonth');
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Design, Development, & Campaign Performance Tracking"
            detail="Campaign Page & Analytics"
            title="Hunger Action Month"
            summary={CASE_SUMMARIES["/hunger-action-month"]}
            result={{ value: "113", label: "Donations completed in the campaign month" }}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://childrenshungerfund.org" target="_blank">Children&apos;s Hunger Fund</a>&mdash;A Christian Non-Profit Ministry</> },
              { label: "Role", value: "Designer, Copywriter, Developer & Analytics (sole developer)" },
              { label: "Platform & Tools", value: <>{"WordPress"}<br />{"PHP, SASS, JavaScript, Google Tag Manager, Google Analytics 4"}</> },
              { label: "Deliverables", value: "Landing page, homepage banner, event tracking, link-tagging plan, campaign dashboard" },
              { label: "Related", value: <CaseLink href="/hunger-action-month-dashboard" className="cyril-dark">Campaign dashboard case study</CaseLink> },
              { label: "Website", value: <a className="cyril-dark" href="https://childrenshungerfund.org/hungeractionmonth/" target="_blank" rel="noopener noreferrer">childrenshungerfund.org/hungeractionmonth</a> },
            ]}
            image="/img/portfolio/chf-hunger-action-month_main.jpg"
            imageAlt="Hunger Action Month landing page"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Every September, Hunger Action Month is one of Children&apos;s Hunger Fund&apos;s key campaigns. The old campaign page was a single monolithic template, and the ministry couldn&apos;t trace a donation back to the channel that produced it.</p>
              <p>I rebuilt the page and its homepage banner, wrote the copy, built the event tracking and link-tagging plan behind it, and built a live dashboard to follow results during the month.</p>
              <p><strong>The page had three jobs:</strong></p>
              <ul className="cyril-case-list">
                <li>drive one-time and monthly (&ldquo;Hope Partner&rdquo;) donations through an on-page giving widget</li>
                <li>build trust with new visitors and give supporters shareable graphics and captions</li>
                <li>give stakeholders one view of results, with live and daily-snapshot data kept separate</li>
              </ul>
              <CaseVideo src="/img/portfolio/chf-hunger-action-month_preview.mp4" caption="Landing page preview" url="childrenshungerfund.org" />
              <CaseStats items={[
                { value: "92", label: "Distinct donors, 9 of them monthly" },
                { value: "3.7%", label: "Donation conversion rate" },
                { value: "164", label: "\u201cGive a Meal\u201d clicks" },
                { value: "49.2%", label: "Engagement rate" },
              ]} />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>The dashboard&apos;s snapshot of the campaign month shows 113 completed donations from 92 donors across 3,805 page views, with giving figures from Classy and behavior from Google Analytics 4.</p>
              <p>It was the ministry&apos;s first campaign with full-funnel, cross-channel attribution from day one. Every email, paid ad, social post, QR code, and web placement was traceable from first click to completed donation, and the tracking foundation became the reusable template for later campaigns, including the year-end push.</p>              
              <p>See the <a className="cyril-accent" href="https://childrenshungerfund.org/hungeractionmonth/" target="_blank" rel="noopener noreferrer"><strong>Hunger Action Month campaign page</strong></a> live.</p>
            </CaseSection>

            {/* 03 — The Page */}
            <CaseSection id="page" number={3} title="The Page">
              <p>I rebuilt the page from one monolithic template into ten self-contained sections, so each can be edited, reordered, or reused in future campaigns without touching the rest. I also wrote the copy, turning the campaign brief into headlines, calls to action, and section text in the ministry&apos;s voice, so the words and the layout were shaped together.</p>
              <p>A second pass focused on conversion, so every visitor has one clear path to giving:</p>
              <ul className="cyril-case-list">
                <li><strong>No exits.</strong> I removed the top navigation, leaving only the logo, the same distraction-free pattern I established on Giving Tuesday.</li>
                <li><strong>Fewer competing asks.</strong> I cut a secondary actions section and an extra button, replaced two older action cards with one volunteer call to action, and brought the new embedded giving form above the fold.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-hunger-action-month_give.jpg" alt="Hunger Action Month giving section" caption="Giving section" />
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_share-toolkit.jpg" alt="Hunger Action Month social share toolkit" caption="Social share toolkit" />
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_trust.jpg" alt="Hunger Action Month trust signals" caption="Trust signals" />
              </CaseGrid>
              <p>For the homepage banner, I worked with the Executive Director to sharpen the call to action from a generic &ldquo;Deliver Hope&rdquo; to the more active &ldquo;Take Action!&rdquo;, with one supporting line: &ldquo;Help local churches deliver food and hope to children in need.&rdquo; It went live when the campaign began, with a tagged link and donations coded to credit the campaign.</p>
              <CaseFigure src="/img/portfolio/chf-hunger-action-month_homepage-banner.jpg" alt="Hunger Action Month banner on the Children's Hunger Fund homepage" caption="Homepage banner" />
              <CaseGrid layout="three">
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_desktop.jpg" alt="Hunger Action Month on desktop" caption="Desktop" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_tablet.jpg" alt="Hunger Action Month on tablet" caption="Tablet" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_mobile.jpg" alt="Hunger Action Month on mobile" caption="Mobile" ratio="3 / 5" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — Tracking & Attribution */}
            <CaseSection id="tracking" number={4} title="Tracking & Attribution">
              <p>The centerpiece was a complete event-tracking layer in Google Tag Manager and Google Analytics 4, documented in an implementation report for the communications team, plus the plan for how every inbound link is tagged.</p>
              <ul className="cyril-case-list">
                <li><strong>Built on what was there.</strong> I aligned with the site&apos;s existing one-tag pattern, so each new interaction needed only a few new variables.</li>
                <li><strong>Seven custom events, and donations as ecommerce.</strong> Events cover page views, call-to-action clicks, trust-badge clicks, graphic downloads, caption copies, and newsletter sign-ups. Checkout starts and completed donations are tracked through tag configuration alone, with no changes to the giving form.</li>
                <li><strong>One link plan for every channel.</strong> 17 tagged links across eight channels, from email, social, and paid ads to search, print, QR codes, and internal placements, each with approved source and medium pairs, implementation notes for its owner, and one shared link generator validated against the plan.</li>
                <li><strong>Clean and verified.</strong> Donors&apos; personal details never reach analytics, donations are kept apart from other purchases, and all nine events were confirmed end to end in debug tools.</li>
              </ul>
              <p>To follow the campaign live, I also built a private dashboard. Read about it in the <CaseLink href="/hunger-action-month-dashboard"><strong>Hunger Action Month Campaign Dashboard</strong></CaseLink> case study.</p>
            </CaseSection>

            {/* 05 — What the Data Showed */}
            <CaseSection id="data" number={5} title="What the Data Showed">
              <p>Because every step was measured, the dashboard showed where giving worked and where it stalled:</p>
              <ul className="cyril-case-list">
                <li><strong>Email beat paid social per donation.</strong> Paid social carried the traffic (2,313 visits, about 74% of the total, against 515 for email) and produced 78 donations to email&apos;s 7. But each email donation was worth roughly 2.7 times a paid-social one.</li>
                <li><strong>Mobile did the giving.</strong> 74% of visits and 83 of the 96 donations GA4 tracked came from mobile, which backed the mobile-first build.</li>
                <li><strong>Giving stalled at checkout and on monthly.</strong> 142 visitors started checkout and 113 completed. Monthly was selected 45 times against 21 for one-time, yet only 9 donors became recurring. Of 37 form errors, the most common was &ldquo;Enter a state&rdquo; (9), pointing at the address fields.</li>
                <li><strong>Trust badges and the newsletter barely got used.</strong> Badge clicks totaled 8, and the newsletter sign-up saw 117 starts but only 4 completions, so visitors converted without them.</li>
              </ul>
            </CaseSection>

            {/* 06 — Learning & Next Steps */}
            <CaseSection id="learnings" number={6} title="Learning &amp; Next Steps">
              <CaseLearnings
                learned={[
                  "Measure value, not just volume: email sent far less traffic and was worth far more per donation.",
                  "Interest isn't completion: monthly giving drew interest but few completions, so that flow needs testing.",
                  "The page earned trust without the badges or the newsletter, so those elements deserve a rethink.",
                ]}
                next={[
                  "Test the monthly-giving flow and fix the state and address-field errors.",
                  "Move the newsletter sign-up and trust signals, or rethink them.",
                  "Invest more in email, and reduce dependence on a single paid-social channel.",
                ]}
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/giving-tuesday"
            title="Giving Tuesday Campaign"
            category="Design, Development, & Campaign Performance Tracking"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
