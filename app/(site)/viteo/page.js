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
} from "@/components/case/CaseStudy";
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";

// Viteo: a self-initiated concept (the live prototype is /lab/viteo/, outside the
// portfolio layout). Screenshots were captured from the built prototype in
// headless Chrome: desktop at 1440×900, tablet at 820×1180, phone at 390×844.

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "experience", label: "The Experience" },
  { id: "system", label: "Design System & Themes" },
  { id: "responsive", label: "Tablet & Mobile" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const P = "/img/portfolio/viteo_";
const URL = "cyrilflorita.com/lab/viteo";
const LIVE = "/lab/viteo/";

// Desktop screens in the browser frame; phone screens in the phone frame.
const Desktop = ({ name, caption, ratio, path = "" }) => (
  <CaseFigure src={`${P}desktop-${name}.jpg`} alt={`Viteo — ${caption}`} caption={caption} frame="browser" url={`${URL}/${path}`} ratio={ratio} />
);
const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
);
const Phone = ({ name, caption }) => (
  <CaseFigure src={`${P}mobile-${name}.jpg`} alt={`Viteo on a phone — ${caption}`} caption={caption} size="phone" ratio="390 / 844" />
);

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem("returnToProject", "viteo");
    cyrilUtility.tpInner();
    const unsubscribePreloader = onPreloaderHidden(() => {
      document.querySelector(".cyril-page")?.classList.add("cyril-active");
    });
    return () => unsubscribePreloader();
  }, []);

  const handleBackToPortfolio = () => {
    sessionStorage.setItem("returnToProject", "viteo");
    wipeThen(() => router.push("/"));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Product Design & Development"
            detail="Concept"
            title="Viteo"
            summary={CASE_SUMMARIES["/viteo"]}
            facts={[
              { label: "Project", value: "Self-initiated concept (Viteo is not a real company)" },
              { label: "Role", value: "Product Designer & Front-End Developer" },
              { label: "Platform & Tools", value: "Web — Desktop, Tablet, Mobile · Next.js, React, three.js, CSS" },
              { label: "Live Prototype", value: <a className="cyril-dark" href={LIVE} target="_blank" rel="noopener">cyrilflorita.com/lab/viteo</a> },
            ]}
            tile="/viteo"
          />

          <CaseLayout sections={SECTIONS} railAction={{ href: LIVE, label: "Try the prototype" }}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Vitamin subscriptions tend to fail people in the same three places, so I set myself a brief to design and build one that doesn&apos;t:</p>
              <ul className="cyril-case-list">
                <li><strong>Generic packs:</strong> Everyone gets the same bottle, whatever their diet, routine or days look like.</li>
                <li><strong>No &ldquo;why&rdquo;:</strong> Customers rarely know why something is in their pack, so they don&apos;t trust it, or stop taking it.</li>
                <li><strong>Hard to control:</strong> Skipping, pausing or changing a delivery is buried, and cancelling feels like a trap.</li>
              </ul>
              <p>Viteo answers each one: a two-minute quiz that builds a pack around how you live, a plan where every item says why it&apos;s there, and an account where skip, pause and swap are one tap each, with undo. I designed and built the whole product myself, from the brand and design system to a working, responsive front end.</p>
              <p>Two constraints shaped it from the start. It makes <strong>no health claims</strong> (the quiz suggests common supplements from lifestyle answers and keeps pointing people to a healthcare professional), and it takes <strong>no real payments</strong>: the payment step is a clearly labelled demo, and every page carries a &ldquo;concept project&rdquo; notice.</p>
              <p><a className="cyril-button" href={LIVE} target="_blank" rel="noopener">Open the live prototype <Arrow /></a></p>
              <Desktop name="landing" caption="Landing Page" />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>Viteo is a concept, so there are no live metrics to report, and I won&apos;t invent any. What it delivers is a complete, working prototype rather than a set of mockups: every flow can be clicked through on any device, the quiz really builds a pack from your answers, and the account really skips, pauses and undoes.</p>
              <p>If it launched, these are the numbers I&apos;d watch, because each one tests one of the three problems above:</p>
              <ul className="cyril-case-list">
                <li><strong>Quiz completion and quiz-to-checkout conversion:</strong> does a two-minute, eight-question quiz keep people going?</li>
                <li><strong>Edits on the plan page:</strong> do people trust the recommendation, or rebuild it?</li>
                <li><strong>Skips and pauses versus cancellations:</strong> does putting control up front keep subscribers who would otherwise leave?</li>
              </ul>
            </CaseSection>

            {/* 03 — The Experience */}
            <CaseSection id="experience" number={3} title="The Experience">
              <h3 className="cyril-case-subheading">A Product You Can Turn Over</h3>
              <p>The landing page opens on the product itself, in real 3D: the Viteo carton and all nine essentials, built with three.js. It follows the pointer, a soft light moves with it like a desk lamp, and while you&apos;re over the hero every piece turns slowly. The one call to action, take the two-minute quiz, sits beside it. On phones and tablets the same shot is a lightweight still, so they never download the 3D.</p>
              <Desktop name="landing" caption="Landing Page" />

              <h3 className="cyril-case-subheading">A Story Told by Scrolling</h3>
              <p>Scrolling turns the product into the page&apos;s guide. The carton tips toward you and opens, and its pills lift out and follow you down: three land in the How it works steps, then all nine settle into their Ingredients cards, which are already waiting for them. Scrolling back up plays it in reverse. The scene only draws while something is moving, so it costs nothing at rest.</p>
              <Desktop name="story" caption="The Pack Opens" />
              <CaseGrid layout="two">
                <Desktop name="steps" caption="Pills Land in the Steps" />
                <Desktop name="ingredients" caption="…Then in Their Ingredients" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">Every Ingredient, Up Close</h3>
              <p>Every ingredient card opens a close-up: the pill grows out of its card onto a dark stage and turns in 3D, beside its dose and form, the exact quiz answers that add it to a pack, and what it&apos;s often packed with (one tap swaps to that one). A plain &ldquo;not medical advice&rdquo; note sits under every one.</p>
              <Desktop name="closeup" caption="Ingredient Close-Up" />

              <h3 className="cyril-case-subheading">A Quiz That Builds Your Pack as You Answer</h3>
              <p>Eight short questions, one per screen, about how you eat, sleep and spend your days; questions that don&apos;t apply are skipped. Beside them, &ldquo;Your pack so far&rdquo; fills as you go: each answer that earns a pill drops it in with its reason, so cause and effect are visible. At the end the pills drop one by one into a pack printed with your name.</p>
              <CaseGrid layout="two">
                <Desktop name="quiz" caption="Your Pack So Far" path="quiz/" />
                <Desktop name="quiz-building" caption="Building Your Pack" path="quiz/" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">A Pack With Your Name On It</h3>
              <p>From the quiz on, the pack is yours: &ldquo;Victoria&apos;s Morning pack&rdquo; sits beside the pills on the plan, in the checkout summary and on the confirmation, and it glides from page to page as you move through. Every item in the plan says why it&apos;s there, and you can remove anything or add from the range. Checkout is four short steps with plain-language errors, a clearly labelled demo payment and a review you can edit.</p>
              <Desktop name="plan-full" caption="Your Plan" path="plan/" ratio="16 / 10" />
              <CaseGrid layout="two">
                <Desktop name="checkout-details" caption="Details" path="checkout/" />
                <Desktop name="checkout-delivery" caption="Delivery Date" path="checkout/" />
                <Desktop name="checkout-payment" caption="Demo Payment" path="checkout/" />
                <Desktop name="checkout-review" caption="Review" path="checkout/" />
              </CaseGrid>
              <Desktop name="checkout-confirmed" caption="Order Confirmed" path="checkout/" />

              <h3 className="cyril-case-subheading">An Account That Keeps People in Control</h3>
              <p>The account opens on the next delivery, with Skip and Pause right there. A timeline runs from today across the next few months, and a tiny pack slides along it when you skip or pause; every change has Undo. The daily check-in is a pill organizer: checking a day off drops one of your own pills into its compartment.</p>
              <Desktop name="account-full" caption="Account" path="account/" ratio="16 / 10" />
            </CaseSection>

            {/* 04 — Design System & Themes */}
            <CaseSection id="system" number={4} title="Design System & Themes">
              <p>Everything is built on one set of design tokens, so the whole product can change its look without touching a component. To prove it, Viteo ships with two themes, each with dark and light modes, switchable from the header:</p>
              <ul className="cyril-case-list">
                <li><strong>Aqua (default):</strong> a cool palette of Dark Knight, Laguna, Cold Blue and Dr. White, in Plus Jakarta Sans and Inter.</li>
                <li><strong>Grove:</strong> mint and leaf green, in Outfit and Figtree.</li>
              </ul>
              <CaseGrid layout="two">
                <Desktop name="landing" caption="Aqua · Dark" />
                <Desktop name="hero-aqua-light" caption="Aqua · Light" />
                <Desktop name="hero-grove-dark" caption="Grove · Dark" />
                <Desktop name="hero-grove-light" caption="Grove · Light" />
              </CaseGrid>
              <h3 className="cyril-case-subheading">A Living Design System Page</h3>
              <p>The design system page renders the real components from the same tokens (color swatches that update with the theme, type scale, buttons, forms, pills, cards and feedback states), so it can&apos;t drift from the product.</p>
              <Desktop name="design-system-full" caption="Design System" path="design-system/" ratio="16 / 10" />
              <h3 className="cyril-case-subheading">Details</h3>
              <ul className="cyril-case-list">
                <li><strong>Pills modelled in 3D:</strong> capsules, softgels, scored tablets and caplets are built from each product&apos;s colors and form; the hero, scroll story and close-ups render them live, and a script bakes the same models into images for every other screen, so a new product needs no new artwork.</li>
                <li><strong>Labels that don&apos;t look like buttons:</strong> sample content is stamped like a batch code on a bottle (&ldquo;Sample data · Lot 01&rdquo;), so it&apos;s clearly a label.</li>
                <li><strong>Motion with restraint:</strong> a short intro plays once per visit, sections fade and rise into place, the routine chart draws itself in, and every animation turns off for people who prefer reduced motion.</li>
                <li><strong>Accessible by default:</strong> every text color pair passes WCAG AA contrast in both themes and modes, form controls have visible boundaries, dialogs and the menu manage focus, and everything works with a keyboard.</li>
              </ul>
            </CaseSection>

            {/* 05 — Tablet & Mobile */}
            <CaseSection id="responsive" number={5} title="Tablet & Mobile">
              <p>On tablets and phones the product comes first on screen, the header folds into a hamburger that opens a full-screen menu with a circular wipe and staggered links, and the hamburger stays within reach as you scroll. The bento stacks into a single column, and every flow, including the quiz, the ingredient close-ups, checkout and account, works the same way on a phone.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}tablet-landing.jpg`} alt="Viteo on a tablet — landing page" caption="Tablet · Landing" ratio="820 / 1180" />
                <CaseFigure src={`${P}tablet-menu.jpg`} alt="Viteo on a tablet — menu" caption="Tablet · Menu" ratio="820 / 1180" />
              </CaseGrid>
              <CaseGrid layout="three">
                <Phone name="landing" caption="Landing" />
                <Phone name="ingredients" caption="Ingredients" />
                <Phone name="closeup" caption="Ingredient Close-Up" />
                <Phone name="quiz" caption="Quiz" />
                <Phone name="account" caption="Account" />
                <Phone name="landing-grove" caption="Grove · Light" />
              </CaseGrid>
            </CaseSection>

            {/* 06 — Learning & Next Steps */}
            <CaseSection id="learnings" number={6} title="Learning & Next Steps">
              <CaseLearnings
                learned={[
                  "Building the prototype instead of only drawing it surfaced the real decisions early: what happens when a quiz answer makes a question irrelevant, or when someone undoes a skip.",
                  "Driving every color from tokens made a second theme cheap, and it doubled as a test that no component had a hard-coded color.",
                  "Writing the copy as part of the design (the “why it’s here” lines, the demo labels, the plain-language errors) did as much for trust as any visual choice.",
                  "Premium motion is mostly restraint: the 3D scene only draws while something moves (an always-running canvas made the glass cards flicker), and scrolling stays native (taking it over in JavaScript made it feel laggy).",
                ]}
                next={[
                  "Run moderated usability tests on the quiz and plan pages, and see where people hesitate or edit.",
                  "Test the copy of the recommendations with people who already take supplements.",
                  "Add a cancellation flow that offers skip and pause first, and measure how often they're chosen instead.",
                ]}
              />
            </CaseSection>

            <div className="cyril-case-cta">
              <div>
                <h3 className="cyril-case-subheading">See it for yourself</h3>
                <p>Every flow works: take the quiz, open an ingredient, place a demo order and skip a delivery. Nothing is charged and nothing leaves your browser.</p>
              </div>
              <a className="cyril-button" href={LIVE} target="_blank" rel="noopener">Open the live prototype <Arrow /></a>
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
