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
  CaseStats,
  CaseVideo,
} from "@/components/case/CaseStudy";
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";

// Hearthside: a design & dev pitch (the live site is /pitch/hearthside/,
// outside the portfolio layout). Screenshots were captured from the prototype
// in headless Chrome: desktop at 1440×900, tablet at 820×1180, phone at
// 390×844; the clips with CDP screencast (see CLAUDE.md).

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "approach", label: "Design Approach" },
  { id: "engineering", label: "Engineering" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const P = "/img/portfolio/hearthside_";
const URL = "cyrilflorita.com/pitch/hearthside";
const LIVE = "/pitch/hearthside/";

// Desktop screens in the browser frame; phone screens in the phone frame.
const Desktop = ({ name, caption, ratio, path = "" }) => (
  <CaseFigure src={`${P}desktop-${name}.jpg`} alt={`Hearthside — ${caption}`} caption={caption} frame="browser" url={`${URL}/${path}`} ratio={ratio} />
);
const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
);
// Motion recordings of the live build (desktop, in the browser frame).
const Clip = ({ name, caption, path = "" }) => (
  <CaseVideo src={`${P}${name}.mp4`} caption={caption} url={`${URL}/${path}`} />
);
const Phone = ({ name, caption }) => (
  <CaseFigure src={`${P}mobile-${name}.jpg`} alt={`Hearthside on a phone — ${caption}`} caption={caption} size="phone" ratio="390 / 844" />
);

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem("returnToProject", "hearthside");
    cyrilUtility.tpInner();
    const unsubscribePreloader = onPreloaderHidden(() => {
      document.querySelector(".cyril-page")?.classList.add("cyril-active");
    });
    return () => unsubscribePreloader();
  }, []);

  const handleBackToPortfolio = () => {
    sessionStorage.setItem("returnToProject", "hearthside");
    wipeThen(() => router.push("/"));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Product Design & Development"
            detail="Design & Dev Pitch"
            title="Hearthside"
            summary={CASE_SUMMARIES["/hearthside"]}
            facts={[
              { label: "Project", value: "A website and intake system for a skilled home health agency, designed and built end to end as a design and dev pitch to agency owners" },
              { label: "Role", value: "Product Designer & Front-End Developer" },
              { label: "Platform & Tools", value: "Web — Desktop, Tablet, Mobile · Next.js, React, CSS" },
              { label: "Try It Live", value: <a className="cyril-dark" href={LIVE} target="_blank" rel="noopener">cyrilflorita.com/pitch/hearthside</a> },
            ]}
            tile="/hearthside"
          />

          <CaseLayout sections={SECTIONS} railAction={{ href: LIVE, label: "Try Hearthside live" }}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Home health agencies win or lose patients in the hours after a hospital discharge, and that&apos;s where their tools let them down:</p>
              <ul className="cyril-case-list">
                <li><strong>Families can&apos;t tell what fits:</strong> home health, home care, and hospice blur together, and coverage rules read like fine print.</li>
                <li><strong>Referrals arrive by fax and voicemail:</strong> discharge planners send them and hear nothing back.</li>
                <li><strong>Intake runs on inboxes:</strong> nobody can see who owns a referral, what&apos;s missing, or what&apos;s overdue.</li>
              </ul>
              <p>Hearthside Home Health is my pitch for an agency serving the San Fernando and Santa Clarita Valleys: a public website and the intake system behind it, working together. As product designer and front-end developer, I took it from brand to working product, solo, with three goals:</p>
              <ul className="cyril-case-list">
                <li>make a stressful decision calm, with plain answers and one obvious next step</li>
                <li>give referral partners a fast, trustworthy way to send a patient and follow it</li>
                <li>show an owner every referral, from first call to first visit, on one screen</li>
              </ul>
              <h3 className="cyril-case-subheading">What&apos;s Built</h3>
              <ul className="cyril-case-list">
                <li><strong>Public website</strong> for families: services, how care begins, the clinicians who visit, coverage guidance, and FAQ</li>
                <li><strong>&ldquo;Which kind of care fits?&rdquo;</strong> a short guide that explains and routes, but never decides eligibility</li>
                <li><strong>Service area map</strong> with a ZIP check that lights up the towns served</li>
                <li><strong>Referral partner page</strong> with a document checklist and a secure referral form, in preview mode</li>
                <li><strong>Referral status page</strong> a partner can share, with progress and no health details</li>
                <li><strong>Careers page and a request-a-call form</strong> that opens in a modal from any page, both with short, minimal fields</li>
                <li><strong>Intake board:</strong> every open referral by stage, with routing by ZIP, owners, and overdue flags</li>
                <li><strong>Referral record:</strong> the next action, documents, details, and an activity log</li>
                <li><strong>Tasks, partners, reports, and rules</strong> screens, with ⌘K search across all of it</li>
                <li><strong>Design system</strong> with two color schemes, each in light and dark (Shore dark is the default)</li>
              </ul>
              <p>It makes no clinical or coverage decisions and stores nothing outside your browser; the copy is written as if the agency opened tomorrow.</p>
              <div className="cyril-case-cta cyril-case-cta-inline">
                <div>
                  <h3 className="cyril-case-subheading">See it for yourself</h3>
                  <p>Send a sample referral, then watch it arrive on the intake board and get routed to a coordinator. Nothing is sent and nothing leaves your browser.</p>
                </div>
                <a className="cyril-button" href={LIVE} target="_blank" rel="noopener">Try Hearthside live <Arrow /></a>
              </div>
              <Clip name="hero" caption="The home page: the headline rises in, then the photo closes in on the nurse and patient as you scroll" />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>Hearthside is a pitch, not a live agency, so there are no patient or referral numbers, and I won&apos;t invent any. What it delivers is a complete, working product, fast and accessible on the live site:</p>
              <CaseStats items={[
                { value: "98", label: "Performance (mobile)" },
                { value: "100", label: "Accessibility" },
                { value: "100", label: "Best practices" },
                { value: "100", label: "SEO" },
              ]} />
              <p>PageSpeed Insights scores for the live home page on a phone; on desktop, Lighthouse scores it 99 to 100 for performance, and the referral and intake pages 100. A mobile pass (smaller photos for phones, no hero preload on other pages, and the photo shown straight away instead of after an opening animation) took mobile performance from 83 into the 90s; the latest run scores 98, even after the richer design that followed. An automated axe audit (WCAG A and AA, plus best practices) of all 14 public and intake pages, in light and dark mode, finds no violations. Body text passes AAA everywhere: at least 7.9:1 on the page and 7.1:1 on the tinted sections, in both color schemes and both modes, with links and labels above 7:1 too. Buttons are 52px tall, every control works by keyboard, and every animation stops under reduced motion. At launch, the numbers to watch are time from referral to first call, referrals stalled by missing documents, and calls requested from the website.</p>

              <Desktop name="home" caption="Home" />
              <p><strong>A calm first screen.</strong> One warm photo, one headline set in a soft serif, and the actions in order of urgency: call now, request a call, or refer a patient. Below it, the agency&apos;s credentials read as four large figures, and its referral partners as a quiet row of marks.</p>
              <p><strong>Two audiences, two paths.</strong> &ldquo;How can we help?&rdquo; splits families from professionals right away, and each path says what happens next.</p>
              <Desktop name="paths" caption="How can we help?" />
              <p><strong>A page with a rhythm.</strong> Instead of the same section over and over, the home page has loud and quiet moments: one line set huge, a photo that runs edge to edge, a sand chapter for what families say, and a dark one for the system behind the site. Headings rise in word by word as they arrive.</p>
              <CaseGrid layout="two">
                <Desktop name="statement" caption="One statement, set huge" />
                <Desktop name="services-row" caption="What we do" />
                <Desktop name="quotes" caption="In their words" />
                <Desktop name="bts" caption="Behind the scenes" />
              </CaseGrid>
              <p><strong>How care begins, as a story.</strong> On a desktop, the four steps play through in one pinned frame as you scroll: each photo opens through the leaf, the step&apos;s number and text rise in, and a rail fills as you go. Phones and tablets get a swipe row instead.</p>
              <Clip name="steps" caption="How care begins, pinned as you scroll" />
              <p><strong>People, not stock photos.</strong> The clinicians who visit are introduced by name, with where they visit and the languages they speak, so families know who&apos;s coming before the doorbell rings. Point at one and they say, in their own words, what a visit is like.</p>
              <Desktop name="team" caption="The people who visit" />
              <p><strong>A light left on.</strong> The brand&apos;s idea, made literal with one warm accent used twice: the first-visit dot in the hero, and the closing band, where the H in the logo flickers on like a porch light and a warm glow spreads from it as you arrive.</p>
              <Desktop name="band" caption="The closing band, lit" />

              <p><strong>Answers that guide, never decide.</strong> The services and getting-started pages explain what home health covers in plain language, link to Medicare for the rules, and end every section with a person to call. The service area map lights up as you type a ZIP code.</p>
              <CaseGrid layout="two">
                <Desktop name="services" caption="Services" path="services/" />
                <Desktop name="getting-started" caption="Getting started" path="getting-started/" />
                <Desktop name="service-area" caption="Service area" path="service-area/" />
                <Desktop name="careers" caption="Careers" path="careers/" />
              </CaseGrid>

              <p><strong>Watch a referral travel.</strong> A discharge planner sends a referral from the partner page. In the preview, the patient is a generated sample in read-only fields, so no real health information can ever be entered. The referral then lands on the intake board, glows, and is routed to the coordinator for its ZIP code, while the system reports the rule it used, the first-call task it created, and any missing documents.</p>
              <Clip name="referral" caption="From the referral form to the intake board" path="referrals/" />
              <Desktop name="referrals" caption="The secure referral form, in preview mode" path="referrals/" />

              <p><strong>One screen for the whole pipeline.</strong> The board shows every open referral by stage, who owns it, and what&apos;s overdue. A referral&apos;s record leads with its next action, then documents, details, and an activity log.</p>
              <Desktop name="intake" caption="Intake board" path="intake/" />
              <CaseGrid layout="two">
                <Desktop name="intake-arrive" caption="A new referral, routed by ZIP" path="intake/" />
                <Desktop name="intake-record" caption="Referral record" path="intake/referral/" />
                <Desktop name="intake-tasks" caption="Tasks" path="intake/tasks/" />
                <Desktop name="intake-reports" caption="Reports" path="intake/reports/" />
              </CaseGrid>
              <p><strong>Find anything in a keystroke.</strong> ⌘K searches referrals by ID, patient, town, or coordinator, and jumps to any screen or action.</p>
              <Clip name="palette" caption="⌘K search" path="intake/" />
            </CaseSection>

            {/* 03 — Design Approach */}
            <CaseSection id="approach" number={3} title="Design Approach">
              <h3 className="cyril-case-subheading">Calm, Editorial, and Warm</h3>
              <p>People land on a home health site during a hard week, so the design does less: generous space, a label column beside every section, and large, plain type, broken by a few full-width chapters so the page has a pace. One shape ties it together: the leaf, two corners swept wide and two kept tight, which frames every photo and forms the logo, and photos open through it as they appear. A soft serif carries the warm words (the headline, quotes, the clinicians&apos; own lines) beside a plain sans for everything else. Every photo gets the same cool, softly faded grade, so pictures from different sources read as one set.</p>
              <h3 className="cyril-case-subheading">Phone-First</h3>
              <p>Families search on their phones, often from a hospital hallway. On a phone, each page opens with its photo and headline, the nav becomes a strip you swipe sideways, lists of like things become swipe rows, and &ldquo;How can we help?&rdquo; becomes a two-way switch, so both choices fit on one screen. A call bar appears once the page&apos;s own buttons scroll away, and stays within reach. The intake system becomes an app with a bottom tab bar and one board stage per screen.</p>
              <CaseGrid layout="three">
                <Phone name="home" caption="Home" />
                <Phone name="services-row" caption="Swipe rows" />
                <Phone name="steps" caption="How care begins" />
                <Phone name="services" caption="Services" />
                <Phone name="intake" caption="Intake board" />
                <Phone name="intake-record" caption="Referral record" />
              </CaseGrid>
              <CaseVideo src={`${P}switch.mp4`} caption="How can we help? on a phone" size="phone" />
              <CaseGrid layout="two">
                <CaseFigure src={`${P}tablet-home.jpg`} alt="Hearthside on a tablet — home page" caption="Tablet · Home" ratio="820 / 1180" />
                <CaseFigure src={`${P}tablet-services.jpg`} alt="Hearthside on a tablet — services" caption="Tablet · Services" ratio="820 / 1180" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">One System, Two Schemes</h3>
              <p>Every color and font comes from tokens, so an agency can take on its own look without touching a component. Two schemes prove it: Shore (warm ink on navy, the default in dark mode) and Tide (cool blue), each in light and dark, and switching between them crossfades instead of flickering. The design system page renders the real components and computes every contrast ratio from the same tokens, so it can&apos;t drift from the product.</p>
              <CaseGrid layout="two">
                <Desktop name="home" caption="Shore · Dark (the default)" />
                <Desktop name="home-shore" caption="Shore · Light" />
                <Desktop name="home-dark" caption="Tide · Dark" />
                <Desktop name="home-tide" caption="Tide · Light" />
              </CaseGrid>
              <Desktop name="design-system-full" caption="Design system" path="design-system/" ratio="16 / 10" />
            </CaseSection>

            {/* 04 — Engineering */}
            <CaseSection id="engineering" number={4} title="Engineering">
              <p>Built with Next.js and React as a static site, with motion in CSS.</p>
              <ul className="cyril-case-list">
                <li><strong>One store, three views:</strong> the referral form, the status page, and the intake app share one store in the browser, so a referral sent on the public site really does appear on the board and in its status link.</li>
                <li><strong>Rules as data:</strong> stages, time limits, ZIP routing, and required documents are plain data, so the board, tasks, and reports all follow the same rules, and changing a rule needs no code.</li>
                <li><strong>View transitions:</strong> the referral card travels between columns, pages hand over in sequence, and the phone switch slides its cards, all with the browser&apos;s View Transitions API and no animation library.</li>
                <li><strong>Scroll-driven motion in CSS:</strong> the home photo closes in on the nurse and patient as you scroll, with no JavaScript on the scroll path. Everywhere else photos hold still, and ease in only when you point at the button beside them.</li>
                <li><strong>Motion that stays calm:</strong> headings reveal word by word, the steps story picks its step from scroll progress with a little hysteresis so it never flips back and forth, and hover effects wait for the mouse to actually move, so cards sliding under a still cursor don&apos;t flash.</li>
                <li><strong>Private by design:</strong> public forms ask only what&apos;s needed to call back, the referral form can only send a generated sample, and the status page never shows health details.</li>
                <li><strong>Accessible throughout:</strong> audited with axe, AAA body text in every scheme, native dialogs with focus management, keyboard search, and reduced motion respected everywhere.</li>
              </ul>
            </CaseSection>

            {/* 05 — Learning & Next Steps */}
            <CaseSection id="learnings" number={5} title="Learning & Next Steps">
              <CaseLearnings
                learned={[
                  "Designing the website and the intake system together made the hand-off the product: the moment a referral leaves one and lands in the other is what an owner remembers.",
                  "Writing guidance that never decides (coverage, eligibility, which kind of care) took as much care as the layout, and it's what keeps a site like this trustworthy.",
                  "Building phone-first changed the content, not just the layout: swipe rows and the two-way switch forced every card to say less, and the desktop got better for it.",
                ]}
                next={[
                  "Connect intake to the agency's real systems: a HIPAA-compliant backend under a business associate agreement, e-fax intake, and the clinical record.",
                  "Test the referral form and status page with discharge planners, and the home page with family caregivers.",
                  "Measure time from referral to first call, and how often missing documents stall a referral, then tune the routing rules.",
                  "Add the agency's own photos and team, and translate the family pages into Spanish.",
                ]}
              />
            </CaseSection>

            <div className="cyril-case-cta">
              <div>
                <h3 className="cyril-case-subheading">See it for yourself</h3>
                <p>Send a sample referral, then watch it arrive on the intake board and get routed to a coordinator. Nothing is sent and nothing leaves your browser.</p>
              </div>
              <a className="cyril-button" href={LIVE} target="_blank" rel="noopener">Try Hearthside live <Arrow /></a>
            </div>

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
