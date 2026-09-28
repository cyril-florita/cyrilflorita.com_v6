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
  CaseQuote,
  CaseLink,
  CaseNext,
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "tracking-plan", label: "A Plan First" },
  { id: "dashboard", label: "The Dashboard" },
  { id: "never-wait", label: "Built to Never Wait" },
  { id: "layers", label: "One System" },
  { id: "impact", label: "Impact" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to All Work" buttons.
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
              { label: "Platform", value: "WordPress (custom plugin)" },
              { label: "Tools", value: "PHP, JavaScript, Google Analytics 4, Google Tag Manager" },
              { label: "Deliverables", value: "Tracking infrastructure plan, implementation backlog, campaign dashboard" },
              { label: "Related", value: <CaseLink href="/hunger-action-month" className="cyril-dark">Hunger Action Month campaign page</CaseLink> },
            ]}
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>Hunger Action Month was the first Children&apos;s Hunger Fund campaign measured end to end. The <CaseLink href="/hunger-action-month">campaign page</CaseLink> produced the data; this project made that data trustworthy and put it in front of the people who needed it.</p>
              <p>It had two parts that depend on each other: a tracking plan that set the rules for what the ministry measures and how, and a live dashboard, built as a WordPress plugin, that turned those numbers into a view anyone on the team could read, without opening an analytics tool.</p>
              <CaseVideo src="/img/portfolio/chf-ham-dashboard_preview.mp4" caption="Campaign dashboard preview (figures blurred)" size="text" />
              <CaseStats items={[
                { value: "10", label: "Platforms audited" },
                { value: "4", label: "Questions every tag must answer" },
                { value: "16", label: "Prioritized backlog items" },
                { value: "3", label: "Layers, one system" },
              ]} />
            </CaseSection>

            {/* 02 — A Plan First */}
            <CaseSection id="tracking-plan" number={2} title="A Plan Before a Dashboard">
              <p>The tools were already installed, but no one had checked what they actually tracked, whether donation data arrived intact, or whether campaign links were tagged the same way across channels. So before building anything, I wrote the ministry&apos;s first tracking infrastructure plan, which became the reference for all of its marketing analytics:</p>
              <ul className="cyril-case-list">
                <li><strong>A verified baseline.</strong> An audit of the whole tracking stack across ten platforms, from analytics and the giving forms to email and event registration.</li>
                <li><strong>Four questions.</strong> Every tag has to serve one of them, in priority order: which channels raise money, how the giving funnel performs, how the list grows, and how programs are used. A tag that serves none is a candidate for removal.</li>
                <li><strong>A way to test every layer,</strong> from debug tools to live test donations and form submissions, so nothing is assumed to work.</li>
                <li><strong>Who uses what.</strong> A map of what each team relies on analytics for, so the data is shaped around real decisions.</li>
                <li><strong>One standard for links,</strong> built on the link-tagging definitions and generator I created, and a single, versioned home for every tag on the site.</li>
                <li><strong>A prioritized backlog</strong> of sixteen fixes, ranked by severity and sequenced so the data could be trusted before anything was built on top of it.</li>
              </ul>
              <p>Most of the highest-priority fixes were resolved within the first month, including keeping sessions intact across the main site and the giving site, tracking where each call to action was clicked, and cleaning out duplicate and legacy tags.</p>
            </CaseSection>

            {/* 03 — The Dashboard */}
            <CaseSection id="dashboard" number={3} title="The Dashboard">
              <p>With the plan in place, I designed and built a private campaign dashboard as a custom WordPress plugin, on a password-protected page for internal staff. It brings the campaign&apos;s numbers into one readable view: donations and recurring gifts, one-time versus monthly giving, the audiences and devices people came from, the channels that drove them, and how visitors engaged with each part of the campaign page, from calls to action to downloaded graphics and copied captions.</p>
              <p>Where two sources report differently, the dashboard says so plainly, so the team knows which number to trust for which question.</p>
            </CaseSection>

            {/* 04 — Built to Never Wait */}
            <CaseSection id="never-wait" number={4} title="Built to Never Wait">
              <p>I built the plugin around one rule: the website never waits on an outside service.</p>
              <ul className="cyril-case-list">
                <li><strong>Fetched in the background.</strong> The analytics data is now gathered on a schedule, outside of anyone&apos;s visit.</li>
                <li><strong>Served from a cache.</strong> The dashboard only ever reads data that&apos;s already been saved, so it loads instantly and can&apos;t tie up the site, however long it stays open.</li>
                <li><strong>Stale beats down.</strong> If the analytics service is slow or unavailable, the dashboard shows the last good numbers instead of taking the website with it.</li>
                <li><strong>Quiet failures.</strong> A failed update is logged without breaking the page or the next scheduled run.</li>
              </ul>
              <CaseQuote>
                If the data source is slow, the dashboard shows slightly older numbers&mdash;and the website stays up.
              </CaseQuote>
            </CaseSection>

            {/* 05 — One System */}
            <CaseSection id="layers" number={5} title="Three Layers, One System">
              <p>The plan, the tracking, and the dashboard work as one stack:</p>
              <ul className="cyril-case-list">
                <li><strong>Governance</strong>&mdash;the tracking plan&mdash;defines what to measure, why, how to validate it, and who owns it.</li>
                <li><strong>Implementation</strong>&mdash;the event tracking and link plan built for the <CaseLink href="/hunger-action-month">Hunger Action Month campaign page</CaseLink>&mdash;produces the data.</li>
                <li><strong>Reporting</strong>&mdash;the dashboard&mdash;puts that data in front of the people who make decisions.</li>
              </ul>
              <p>Without the plan, there&apos;s no agreement on what the numbers mean. Without the tracking, there are no numbers. Without the dashboard, they sit where only technical users can find them.</p>
            </CaseSection>

            {/* 06 — Impact */}
            <CaseSection id="impact" number={6} title="Impact">
              <p>The ministry now has its first documented, governed analytics framework, and Hunger Action Month became the first campaign where leadership could answer &ldquo;which channel raised the money?&rdquo; with confidence. The dashboard gave non-technical staff live visibility into the campaign, and its background-and-cache design became the pattern for internal reporting tools that followed.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty_v9"
            title="Grace to You"
            category="UX Design"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
