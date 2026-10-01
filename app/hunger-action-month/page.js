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
  CaseLink,
  CaseNext,
  CaseLearnings,
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
  { id: "audience", label: "Audience & Traffic" },
  { id: "giving", label: "How Visitors Gave" },
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
            summary="A rebuilt campaign page for Children's Hunger Fund with analytics designed in from day one: every channel tagged, every key interaction measured, and every donation traceable to where it came from."
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
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>Every September, Hunger Action Month calls attention to hunger, and it&apos;s one of Children&apos;s Hunger Fund&apos;s key campaigns. The existing campaign page was a single monolithic template, and the ministry had no way to trace a donation back to the channel that produced it.</p>
              <p>So beyond rebuilding the landing page and its homepage banner, I built a complete event-tracking layer, wrote the plan that governs how every inbound link is tagged across all channels, and built an internal dashboard to follow the campaign in real time.</p>
              <p>The page had four jobs:</p>
              <ul className="cyril-case-list">
                <li>drive one-time and monthly (&ldquo;Hope Partner&rdquo;) donations through an on-page giving widget</li>
                <li>build trust with visitors who didn&apos;t know the organization</li>
                <li>give supporters shareable assets: graphics and captions</li>
                <li>give stakeholders a single view of results, with live and daily-snapshot data kept separate</li>
              </ul>
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
              <p>I wrote the page&apos;s copy as well, turning the campaign brief into headlines, calls to action, and section text in the ministry&apos;s voice, so the words and the layout were shaped together rather than one poured into the other.</p>
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
              <p>Once the page was built, I made a second, conversion-focused pass to give every visitor one clear path to giving:</p>
              <ul className="cyril-case-list">
                <li><strong>No exits.</strong> I removed the top navigation, leaving only the logo linking home, the same distraction-free pattern I established on Giving Tuesday.</li>
                <li><strong>Fewer competing asks.</strong> I cut a secondary actions section and an extra button that pulled attention away from the primary give action.</li>
              </ul>
            </CaseSection>

            {/* 04 — Homepage Banner */}
            <CaseSection id="banner" number={4} title="Homepage Banner">
              <p>I designed and built the campaign&apos;s homepage banner, refining the call to action with the Executive Director from a generic &ldquo;Deliver Hope&rdquo; to the more active &ldquo;Take Action!&rdquo;, supported by one clear line: &ldquo;Help local churches deliver food and hope to children in need.&rdquo; Its link was tagged for attribution, its donations were coded to credit the campaign, and it was scheduled to go live on September 1.</p>
              <CaseFigure src="/img/portfolio/chf-hunger-action-month_homepage-banner.jpg" alt="Hunger Action Month banner on the Children's Hunger Fund homepage" caption="Homepage banner" />
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
            </CaseSection>

            {/* 07 — Campaign Dashboard */}
            <CaseSection id="dashboard" number={7} title="A Campaign Dashboard">
              <p>To follow the campaign as it happened, I built a private, internal analytics dashboard. Its data is gathered in the background on a fixed schedule and served from a local cache, so the dashboard loads instantly and never slows the public site down.</p>
              <p>Read the full story, from the tracking plan behind it to a design that keeps the website up no matter how slow the data source is, in the <CaseLink href="/hunger-action-month-dashboard"><strong>Hunger Action Month Campaign Dashboard</strong></CaseLink> case study.</p>
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
              <p>Hunger Action Month was the ministry&apos;s first campaign with full-funnel, cross-channel attribution from day one, and the tracking foundation built here became the reusable template for the campaigns that followed, including the year-end push.</p>
              <p>The dashboard&apos;s snapshot of the campaign month shows what that visibility captured, with giving figures from Classy and behavior from Google Analytics 4:</p>
              <CaseStats items={[
                { value: "113", label: "Completed donations" },
                { value: "92", label: "Distinct donors, 9 of them monthly" },
                { value: "3.7%", label: "Donation conversion rate" },
                { value: "164", label: "\u201cGive a Meal\u201d clicks" },
              ]} />
              <p>Across 3,805 page views, the engagement rate was 49.2%. Behavior numbers from GA4 can lag and won&apos;t sum to Classy&apos;s totals, which the dashboard says outright, so they&apos;re best read as comparisons between channels and sections rather than absolute rates.</p>
              <p>See the <a className="cyril-accent" href="https://childrenshungerfund.org/hungeractionmonth/" target="_blank" rel="noopener noreferrer"><strong>Hunger Action Month campaign page</strong></a> live.</p>
            </CaseSection>

            {/* 10 — Audience & Traffic */}
            <CaseSection id="audience" number={10} title="Audience & Traffic">
              <ul className="cyril-case-list">
                <li><strong>Paid social carried the traffic.</strong> It drove 2,313 visits, about 74% of the total. Email followed with 515, organic search brought 82, and AI-assistant referrals (ChatGPT) brought 5.</li>
                <li><strong>Mobile first was the right call.</strong> Visitors were 85.9% new and 74% were on mobile, and mobile dominated giving too: 83 of the 96 donations GA4 tracked.</li>
                <li><strong>Email was the higher-value channel.</strong> Paid social produced 78 donations and email 7, but each email donation was worth roughly 2.7 times a paid-social one, even though email sent far less traffic.</li>
              </ul>
            </CaseSection>

            {/* 11 — How Visitors Gave */}
            <CaseSection id="giving" number={11} title="How Visitors Gave">
              <p>Because every step was measured, the dashboard showed where giving held up and where it stalled:</p>
              <ul className="cyril-case-list">
                <li><strong>Checkout starts outnumbered completions.</strong> 142 visitors started checkout and 113 completed a donation.</li>
                <li><strong>Monthly was chosen more than it was completed.</strong> Visitors selected monthly giving 45 times against 21 for one-time, yet only 9 donors became recurring. One preset amount led clearly, selected 45 times against 20 and 15 for the next two.</li>
                <li><strong>Form errors pointed at the address fields.</strong> There were 37 in all; the most common were &ldquo;Enter a state&rdquo; (9) and &ldquo;Try again with another payment method&rdquo; (9), then incomplete card numbers (6). The state errors suggest the address fields can be improved.</li>
                <li><strong>Visitors converted without stopping to verify.</strong> Trust-badge clicks were rare (Candid 3, ECFA 2, MinistryWatch 2, Charity Navigator 1), and the newsletter sign-up saw 117 starts but only 4 completions.</li>
                <li><strong>Section views ranked the content.</strong> The giving module was seen by 15.7% of visitors, the Honduras story by 9.2%, monthly giving by 6.4%, the social share section by 5.1%, and trust signals by 3.2%.</li>
                <li><strong>Sharing tools saw modest use.</strong> 8 graphics were downloaded (the &ldquo;siblings&rdquo; graphic led with 5) and 5 captions were copied.</li>
              </ul>
            </CaseSection>

            {/* 12 — Learning & Next Steps */}
            <CaseSection id="learnings" number={12} title="Learning &amp; Next Steps">
              <CaseLearnings
                learned={[
                  "Interest in monthly giving far outran completion, so the choice to give monthly is where the page was losing the most.",
                  "Email sent much less traffic than paid social but brought in far more per donation, so traffic alone is the wrong way to judge a channel.",
                  "Visitors gave without checking the trust badges or finishing the newsletter sign-up, so the page earned trust without them.",
                ]}
                next={[
                  "Test the monthly-giving flow, since selection far outran completion.",
                  "Fix the state and address field errors.",
                  "Move the newsletter sign-up and trust signals, or rethink them.",
                  "Invest more in email, which had the highest value per donation.",
                  "Reduce dependence on a single paid social channel.",
                ]}
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/hunger-action-month-dashboard"
            title="Hunger Action Month Campaign Dashboard"
            category="Design, Development, & Campaign Performance Tracking"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
