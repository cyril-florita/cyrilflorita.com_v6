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
  CaseQuote,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "modular-page", label: "Built in Modules" },
  { id: "conversion", label: "Tuned to Convert" },
  { id: "banner", label: "Homepage Banner" },
  { id: "tracking", label: "Measuring Everything" },
  { id: "link-plan", label: "One Link Plan" },
  { id: "dashboard", label: "Campaign Dashboard" },
  { id: "responsive", label: "Every Screen" },
  { id: "impact", label: "Impact" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to All Work" buttons.
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
            category="Design, Development, & Marketing Campaign Performance Tracking"
            detail="Campaign Page & Analytics"
            title="Hunger Action Month"
            summary="A rebuilt campaign page for Children's Hunger Fund with analytics designed in from day one: every channel tagged, every key interaction measured, and every donation traceable to where it came from."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://childrenshungerfund.org" target="_blank">Children&apos;s Hunger Fund</a>&mdash;A Christian Non-Profit Ministry</> },
              { label: "Role", value: "Designer, Developer & Analytics (sole developer)" },
              { label: "Platform", value: "WordPress" },
              { label: "Tools", value: "PHP, SASS, JavaScript, Google Tag Manager, Google Analytics 4" },
              { label: "Deliverables", value: "Landing page, homepage banner, event tracking, link-tagging plan, campaign dashboard" },
            ]}
            image="/img/portfolio/chf-hunger-action-month_main.jpg"
            imageAlt="Hunger Action Month landing page"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>Every September, Hunger Action Month calls attention to hunger, and it&apos;s one of Children&apos;s Hunger Fund&apos;s key campaigns. This year it became the ministry&apos;s first campaign with end-to-end analytics built in from the very beginning.</p>
              <p>Beyond the landing page and homepage banner, I built a complete event-tracking layer, wrote the plan that governs how every inbound link is tagged across all channels, and built an internal dashboard to follow the campaign in real time.</p>
              <CaseVideo src="/img/portfolio/chf-hunger-action-month_preview.mp4" caption="Landing page preview" url="childrenshungerfund.org" />
              <CaseStats items={[
                { value: "10", label: "Modular page sections" },
                { value: "9", label: "Tracked events, donations included" },
                { value: "17", label: "Tagged campaign links" },
                { value: "8", label: "Channels, one tracking plan" },
              ]} />
            </CaseSection>

            {/* 02 — Built in Modules */}
            <CaseSection id="modular-page" number={2} title="Rebuilt in Modules">
              <p>I rebuilt the existing campaign page from a single monolithic template into ten numbered, self-contained sections: hero, &ldquo;Why September&rdquo;, giving form, ways to take action, stories, monthly giving, a social share toolkit, trust signals, and footer. Each section can be edited, reordered, or reused in future campaigns without touching the rest, and all tracking lives in one consolidated script, so no interaction is ever counted twice.</p>
              <p>Along the way I refreshed the page against the campaign brief and the web style guide:</p>
              <ul className="cyril-case-list">
                <li>simplified the messaging by removing meal goals</li>
                <li>replaced two older action cards with a single, clearer volunteer call to action</li>
                <li>brought a new embedded giving form above the fold</li>
                <li>updated type and elements to match the style guide</li>
                <li>fixed the heading hierarchy so the campaign name is the page&apos;s primary heading</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-hunger-action-month_give.jpg" alt="Hunger Action Month giving section" caption="Giving section" />
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_share-toolkit.jpg" alt="Hunger Action Month social share toolkit" caption="Social share toolkit" />
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_trust.jpg" alt="Hunger Action Month trust signals" caption="Trust signals" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/chf-hunger-action-month_impact-stats.jpg" alt="Hunger Action Month impact numbers" caption="Impact numbers" />
            </CaseSection>

            {/* 03 — Tuned to Convert */}
            <CaseSection id="conversion" number={3} title="Tuned to Convert">
              <p>Working from the paid-ads strategist&apos;s recommendations, I made a second, conversion-focused pass: removing the top navigation (the logo alone links home, the same pattern I used on Giving Tuesday) and cutting competing sections and buttons, so every path leads toward giving.</p>
              <p>When a trademark question came up about the campaign&apos;s name, I implemented proper attribution on the page, keeping the name in the headings rather than removing it, which protected the page&apos;s search visibility.</p>
            </CaseSection>

            {/* 04 — Homepage Banner */}
            <CaseSection id="banner" number={4} title="Homepage Banner">
              <p>I designed and built the campaign&apos;s homepage banner, refining the call to action with the Executive Director from a generic &ldquo;Deliver Hope&rdquo; to the more active &ldquo;Take Action!&rdquo;, supported by one clear line: &ldquo;Help local churches deliver food and hope to children in need.&rdquo; Its link was tagged for attribution, its donations were coded to credit the campaign, and it was scheduled to go live on September 1.</p>
            </CaseSection>

            {/* 05 — Measuring Everything */}
            <CaseSection id="tracking" number={5} title="Measuring Everything">
              <p>The centerpiece of the campaign was a complete event-tracking layer built in Google Tag Manager and Google Analytics 4, documented in a formal implementation report for the communications team.</p>
              <ul className="cyril-case-list">
                <li><strong>Built on what was there.</strong> Instead of adding a parallel setup, I aligned with the site&apos;s existing tracking pattern, one flexible tag that sends many events, so each new interaction only needed a few new variables.</li>
                <li><strong>Seven custom events,</strong> from page views and primary call-to-action clicks to trust-badge clicks, share-graphic downloads, caption copies, and newsletter sign-up starts and completions, all reported through ten custom dimensions.</li>
                <li><strong>Donations as ecommerce.</strong> Checkout starts and completed donations from the embedded giving form, tracked as standard ecommerce events purely through tag configuration, with no changes to the form itself.</li>
                <li><strong>Clean data.</strong> I separated donations from other purchase events on the site, corrected data-type mismatches that would have silently dropped donation values, and avoided double-counting a conversion that another tag already reported.</li>
                <li><strong>Privacy by default.</strong> Donors&apos; personal details are never passed into analytics.</li>
                <li><strong>Verified, not assumed.</strong> Every decision was based on real captured data rather than documentation, and all nine events were confirmed end to end in debug tools.</li>
              </ul>
            </CaseSection>

            {/* 06 — One Link Plan */}
            <CaseSection id="link-plan" number={6} title="One Link Plan for Every Channel">
              <p>I wrote the tracking plan that governs every inbound link to the campaign: 17 tagged links across eight channels, from email, social, and paid ads to search, print, QR codes, and internal site placements.</p>
              <ul className="cyril-case-list">
                <li>defined the approved source and medium pairs for each channel</li>
                <li>wrote implementation notes for each team that owns a channel</li>
                <li>gave internal site links their own medium, so they no longer overwrite a visitor&apos;s original source</li>
                <li>built every link through one shared link generator, validated against the plan</li>
              </ul>
              <p>It was the ministry&apos;s first unified link-tracking plan across every marketing channel for a single campaign.</p>
            </CaseSection>

            {/* 07 — Campaign Dashboard */}
            <CaseSection id="dashboard" number={7} title="A Campaign Dashboard">
              <p>To follow the campaign as it happened, I built a private, internal analytics dashboard. Its data is gathered in the background on a fixed schedule and served from a local cache, so the dashboard loads instantly and never slows the public site down.</p>
            </CaseSection>

            {/* 08 — Every Screen */}
            <CaseSection id="responsive" number={8} title="Designed for Every Screen">
              <CaseGrid layout="three">
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_desktop.jpg" alt="Hunger Action Month on desktop" caption="Desktop" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_tablet.jpg" alt="Hunger Action Month on tablet" caption="Tablet" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-hunger-action-month_mobile.jpg" alt="Hunger Action Month on mobile" caption="Mobile" ratio="3 / 5" />
              </CaseGrid>
            </CaseSection>

            {/* 09 — Impact */}
            <CaseSection id="impact" number={9} title="Impact">
              <CaseQuote>
                Every email, paid ad, social post, QR code, and web placement was tagged and traceable&mdash;from first click to completed donation.
              </CaseQuote>
              <p>Hunger Action Month was the ministry&apos;s first campaign with full-funnel, cross-channel attribution from day one, connecting on-page behavior and completed donations back to the channels that drove them. The tracking foundation built here became the reusable template for the campaigns that followed, including the year-end push.</p>
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
