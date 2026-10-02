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
  CaseVideo,
  CaseStats,
  CaseLink,
  CaseNext,
  CaseLearnings,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "plan", label: "The Plan" },
  { id: "dashboard", label: "The Dashboard" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to My Work" buttons.
    sessionStorage.setItem('returnToProject', 'hamdashboard');
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
    sessionStorage.setItem('returnToProject', 'hamdashboard');
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Design, Development, & Campaign Performance Tracking"
            detail="Campaign Dashboard & Tracking Plan"
            title="Hunger Action Month Campaign Dashboard"
            summary="A live campaign dashboard for Children's Hunger Fund, and the tracking plan underneath it: the ministry's first analytics governance, turned into an internal tool that shows leadership how the campaign is doing, as it happens."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://childrenshungerfund.org" target="_blank" rel="noopener noreferrer">Children&apos;s Hunger Fund</a>&mdash;A Christian Non-Profit Ministry</> },
              { label: "Role", value: "Designer, Developer & Analytics (sole developer)" },
              { label: "Platform & Tools", value: <>{"WordPress (custom plugin)"}<br />{"PHP, JavaScript, Google Analytics 4, Google Tag Manager"}</> },
              { label: "Deliverables", value: "Tracking infrastructure plan, implementation backlog, campaign dashboard" },
              { label: "Related", value: <CaseLink href="/hunger-action-month" className="cyril-dark">Hunger Action Month campaign page</CaseLink> },
            ]}
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Hunger Action Month was the first Children&apos;s Hunger Fund campaign measured end to end. The analytics tools were already installed, but no one had checked what they actually tracked, and the numbers sat where only technical users could find them. The <CaseLink href="/hunger-action-month">campaign page</CaseLink> produced the data; this project made that data trustworthy and put it in front of the people who needed it.</p>
              <p>It had two parts that depend on each other:</p>
              <ul className="cyril-case-list">
                <li><strong>A tracking plan</strong> that set the rules for what the ministry measures and how.</li>
                <li><strong>A live dashboard,</strong> built as a WordPress plugin, that turned those numbers into a view anyone on the team could read without opening an analytics tool.</li>
              </ul>
              <CaseVideo src="/img/portfolio/chf-ham-dashboard_preview.mp4" caption="Campaign dashboard preview (figures blurred)" size="text" />
              <CaseStats items={[
                { value: "113", label: "Completed donations in view" },
                { value: "92", label: "Distinct donors, 9 of them monthly" },
                { value: "2.7×", label: "Email\u2019s value per donation vs. paid social" },
                { value: "37", label: "Checkout form errors surfaced" },
              ]} />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>The ministry now has its first documented, governed analytics framework, and Hunger Action Month became the first campaign where leadership could answer &ldquo;which channel raised the money?&rdquo; with confidence. The dashboard gave non-technical staff live visibility into the campaign, and its background-and-cache design became the pattern for the internal reporting tools that followed.</p>
              <p>It paid off in the campaign month itself. One view of giving (from Classy) and behavior (from Google Analytics 4) made three patterns visible that no single tool showed:</p>
              <ul className="cyril-case-list">
                <li><strong>Channel value, not just volume.</strong> Email&apos;s donations were each worth roughly 2.7 times a paid-social donation, even though paid social sent most of the traffic.</li>
                <li><strong>Friction in the giving flow.</strong> 142 checkout starts against 113 completed donations, with the address fields behind the most common form errors. That&apos;s exactly what the Donor Care Director needs when deciding whether to keep the donation platform, look for another, or build one in-house: it shows where donors drop off today, and whether the fix is a setting on the current platform or a limit of the platform itself.</li>
                <li><strong>Where monthly giving fell short.</strong> Monthly was selected 45 times against 21 for one-time, but only 9 donors ended up recurring.</li>
              </ul>
              <p>The full breakdown is in the <CaseLink href="/hunger-action-month"><strong>Hunger Action Month</strong></CaseLink> case study.</p>
            </CaseSection>

            {/* 03 — The Plan */}
            <CaseSection id="plan" number={3} title="The Plan">
              <p>Before building anything, I wrote the ministry&apos;s first tracking infrastructure plan, which became the reference for all of its marketing analytics:</p>
              <ul className="cyril-case-list">
                <li><strong>A verified baseline.</strong> An audit of the whole tracking stack across ten platforms, from analytics and giving forms to email and event registration. I tested every layer with debug tools and live test donations, and mapped what each team relies on analytics for.</li>
                <li><strong>Four questions.</strong> Every tag has to serve one of them, in priority order: which channels raise money, how the giving funnel performs, how the list grows, and how programs are used. A tag that serves none is a candidate for removal.</li>
                <li><strong>One standard for links,</strong> built on the link-tagging definitions and generator I created, and a single, versioned home for every tag on the site.</li>
                <li><strong>A prioritized backlog</strong> of sixteen fixes, ranked by severity and sequenced so the data could be trusted before anything was built on top of it.</li>
              </ul>
              <p>Most of the highest-priority fixes were resolved within the first month, including keeping sessions intact across the main site and the giving site, tracking where each call to action was clicked, and cleaning out duplicate and legacy tags.</p>
            </CaseSection>

            {/* 04 — The Dashboard */}
            <CaseSection id="dashboard" number={4} title="The Dashboard">
              <p>With the plan in place, I designed and built a private campaign dashboard as a custom WordPress plugin, on a password-protected page for internal staff. It brings the numbers into one readable view: donations and recurring gifts, one-time versus monthly giving, audiences and devices, the channels that drove them, and how visitors engaged with each part of the campaign page.</p>
              <p>I built it around one rule: the website never waits on an outside service.</p>
              <ul className="cyril-case-list">
                <li><strong>Fetched in the background.</strong> Analytics data is gathered on a schedule, outside of anyone&apos;s visit.</li>
                <li><strong>Served from a cache.</strong> The dashboard only reads data that&apos;s already been saved, so it loads instantly and can&apos;t tie up the site.</li>
                <li><strong>Last good numbers, not downtime.</strong> If the analytics service is slow or unavailable, the dashboard shows slightly older numbers and logs the failure quietly, and the website stays up.</li>
              </ul>
            </CaseSection>

            {/* 05 — Learning & Next Steps */}
            <CaseSection id="learnings" number={5} title="Learning &amp; Next Steps">
              <CaseLearnings
                learned={[
                  "Agreeing on what to measure and how to validate it before building anything meant the dashboard could show numbers people could trust.",
                  "Reading only cached data traded a little freshness for reliability, so a slow analytics service can never take the website down.",
                ]}
                next={[
                  "Show checkout starts, completions, and the leading form errors side by side, so friction is visible while a campaign is still running.",
                  "Report value per donation by channel next to traffic, so the gap between email and paid social is visible without a calculation.",
                  "Reuse the background-and-cache pattern for further internal reporting tools.",
                ]}
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/the-study-bible-app"
            title="The Study Bible App"
            category="App Design & Prototyping"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
