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
  { id: "designed-in-code", label: "Designed in Code" },
  { id: "two-paths", label: "Two Paths In" },
  { id: "audience", label: "Built for Its Audience" },
  { id: "deadline", label: "Holding the Deadline" },
  { id: "responsive", label: "Every Screen" },
  { id: "impact", label: "Impact" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to All Work" buttons.
    sessionStorage.setItem('returnToProject', 'volunteerleadership');
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
    sessionStorage.setItem('returnToProject', 'volunteerleadership');
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Design & Development"
            detail="Recruitment Landing Page"
            title="Volunteer Leadership Team"
            summary="A new landing page recruiting Volunteer Leaders for Children's Hunger Fund's new North Texas facility: the one destination behind every printed flyer, event QR code, and staff conversation, launched ahead of an in-person Open House."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://childrenshungerfund.org" target="_blank">Children&apos;s Hunger Fund</a>&mdash;A Christian Non-Profit Ministry</> },
              { label: "Role", value: "Designer & Developer (sole developer)" },
              { label: "Platform", value: "WordPress" },
              { label: "Tools", value: "PHP, HTML & CSS, WPForms" },
              { label: "Deliverables", value: "Landing page, lead-capture form, event registration hand-off" },
            ]}
            image="/img/portfolio/chf-volunteer-leadership_main.jpg"
            imageAlt="Volunteer Leadership Team landing page"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>Children&apos;s Hunger Fund was opening a new facility in North Texas, and it needed people to help lead it: Volunteer Leaders who serve on a recurring basis alongside staff. The request came straight from the Executive Director, with a hard deadline set by a physical event&mdash;an Open House whose printed flyers were already in production.</p>
              <p>As the sole developer, I owned the page end to end, from its structure and visual design to the build, the lead-capture form, and launch.</p>
              <CaseVideo src="/img/portfolio/chf-volunteer-leadership_preview.mp4" caption="Landing page preview" url="childrenshungerfund.org" />
              <CaseStats items={[
                { value: "19", label: "Days from brief to launch" },
                { value: "2", label: "Calls to action, one goal" },
                { value: "20+", label: "Review threads resolved" },
                { value: "3", label: "Approvers signing off" },
              ]} />
            </CaseSection>

            {/* 02 — Designed in Code */}
            <CaseSection id="designed-in-code" number={2} title="Designed in Code">
              <p>The brief came with content and a page outline, but no design comp, so I designed directly in the browser, building a custom page template out of modular sections: hero, the case for serving, where you could fit, what&apos;s expected, next steps, and a form to get in touch.</p>
              <ul className="cyril-case-list">
                <li><strong>A legible hero.</strong> Full-bleed photography under a navy-to-transparent gradient. When leadership asked to remove the overlay, I showed that white text wouldn&apos;t hold up against the photo without it, and matched the treatment to the Hunger Action Month page instead, so the two campaigns read as one site.</li>
                <li><strong>The case for serving.</strong> Mission-focused copy on the role, the commitment, and why it matters, structured from the brief.</li>
                <li><strong>Room for everyone.</strong> Opportunities grouped into guest experience, operations and ministry support, and skilled roles, with an open invitation for anyone who doesn&apos;t see themselves listed.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-volunteer-leadership_why.jpg" alt="Why volunteer leadership section" caption="Why volunteer leadership" />
              <CaseFigure src="/img/portfolio/chf-volunteer-leadership_impact.jpg" alt="Tabbed story section: purpose, community, impact, growth, belonging" caption="Purpose, community, impact, growth & belonging" />
              <CaseFigure src="/img/portfolio/chf-volunteer-leadership_opportunities.jpg" alt="Volunteer opportunities by team" caption="Where could you make a difference?" />
            </CaseSection>

            {/* 03 — Two Paths In */}
            <CaseSection id="two-paths" number={3} title="Two Paths In">
              <p>Not every prospective leader is ready to commit on the spot, so the page offers two ways forward, repeated at the top and bottom of the page:</p>
              <ul className="cyril-case-list">
                <li><strong>Attend an Open House.</strong> A hand-off to the event&apos;s registration, for people who want to meet the team, hear the vision, and ask questions in person first.</li>
                <li><strong>Express Interest.</strong> A short form that sends each submission straight to the ministry team who follows up, replacing a loose, email-based intake with a structured pipeline.</li>
              </ul>
              <CaseFigure src="/img/portfolio/chf-volunteer-leadership_next-step.jpg" alt="Take the next step call to action" caption="Take the next step" />
              <CaseFigure src="/img/portfolio/chf-volunteer-leadership_form.jpg" alt="Express interest form" caption="Express interest form" ratio="4 / 3" size="text" />
            </CaseSection>

            {/* 04 — Built for Its Audience */}
            <CaseSection id="audience" number={4} title="Built for Its Audience">
              <p>Many of the people this page was written for are retirees with time and experience to give, so readability came first: the expectations section got larger type, and body text scales comfortably across screen sizes.</p>
              <p>It also had to feel like it belonged. The page reuses the button styles and gradient treatment I established on the ministry&apos;s giving and campaign pages, so it reads as part of one consistent site.</p>
              <CaseFigure src="/img/portfolio/chf-volunteer-leadership_expectations.jpg" alt="Is the Volunteer Leadership Team right for me? section" caption="Expectations, set clearly" />
            </CaseSection>

            {/* 05 — Holding the Deadline */}
            <CaseSection id="deadline" number={5} title="Holding the Deadline">
              <p>With the flyers already printed, the launch date couldn&apos;t move, even as pieces of the project did:</p>
              <ul className="cyril-case-list">
                <li><strong>A registration link that didn&apos;t exist yet.</strong> The brief called for an Open House button, but no registration had been set up. I flagged it early; after a week of cross-team follow-up, the button came off the page&mdash;and when the registration went live the next day, I had it back up and linked that same morning.</li>
                <li><strong>Launch now, backfill later.</strong> The volunteer story section was built with placeholder content and flagged, so the team could launch on time and add a real story afterward.</li>
                <li><strong>The right photo.</strong> When a reviewer noticed the original hero image prominently showed another organization&apos;s branding, I swapped in a photo centered on the ministry&apos;s own work.</li>
                <li><strong>Collaboration with conviction.</strong> When leadership and the designer felt the page read differently from the rest of the site, I adopted the designer&apos;s button styles while keeping the choices I could defend&mdash;like the oversized open-quote treatment, a pattern used on well-established sites.</li>
              </ul>
              <CaseQuote cite="Review process">
                Three approvers, twenty-plus comment threads, and one date that never moved.
              </CaseQuote>
            </CaseSection>

            {/* 06 — Every Screen */}
            <CaseSection id="responsive" number={6} title="Designed for Every Screen">
              <p>With most visitors arriving from a printed flyer&apos;s QR code, the page had to work first and best on a phone.</p>
              <CaseGrid layout="three">
                <CaseFigure src="/img/portfolio/chf-volunteer-leadership_desktop.jpg" alt="Volunteer Leadership Team page on desktop" caption="Desktop" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-volunteer-leadership_tablet.jpg" alt="Volunteer Leadership Team page on tablet" caption="Tablet" ratio="3 / 5" />
                <CaseFigure src="/img/portfolio/chf-volunteer-leadership_mobile.jpg" alt="Volunteer Leadership Team page on mobile" caption="Mobile" ratio="3 / 5" />
              </CaseGrid>
            </CaseSection>

            {/* 07 — Impact */}
            <CaseSection id="impact" number={7} title="Impact">
              <p>The page launched on schedule, ahead of the Open House, and became the single digital destination for the recruitment effort: every printed flyer, QR code scan, and staff conversation with a prospective Volunteer Leader pointed to it. Its interest form gave the new facility a structured pipeline for leads from day one.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-dashboard"
            title="GTY Dashboard"
            category="Design & Development"
            image="/img/portfolio/thumb_gty-dashboard.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
