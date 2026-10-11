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
              { label: "Platform & Tools", value: "Web — Desktop, Tablet, Mobile · Next.js, React, CSS" },
              { label: "Live Prototype", value: <a className="cyril-dark" href={LIVE} target="_blank" rel="noopener">cyrilflorita.com/lab/viteo</a> },
            ]}
            tile="/viteo"
          />

          <CaseLayout sections={SECTIONS}>

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
              <p><a className="cyril-button" href={LIVE} target="_blank" rel="noopener">Open the live prototype</a></p>
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
              <h3 className="cyril-case-subheading">A Landing Page That Shows the Product</h3>
              <p>The landing page is a bento layout inside a rounded frame. The hero is a product shot in real 3D (the carton and all nine essentials, built with three.js, spinning gently and following the pointer) next to one clear call to action: take the two-minute quiz. Below it, cards preview the account, the quiz length and the ingredients, then How it works, every ingredient with its dose and form, sample reviews and an FAQ.</p>
              <Desktop name="landing-full" caption="Full Landing Page" ratio="16 / 10" />

              <h3 className="cyril-case-subheading">A Quiz That Feels Like a Conversation</h3>
              <p>Eight short questions, one per screen, about how you eat, sleep and spend your days. Single answers advance on their own; questions that don&apos;t apply are skipped (vegetarians and vegans never see the fish question). A short &ldquo;building your pack&rdquo; moment shows the pills dropping in before the plan appears.</p>
              <CaseGrid layout="two">
                <Desktop name="quiz" caption="Quiz Question" path="quiz/" />
                <Desktop name="quiz-building" caption="Building Your Pack" path="quiz/" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">A Plan That Explains Itself</h3>
              <p>Every item in the pack comes with a plain &ldquo;why it&apos;s here&rdquo; tied to your answers, and you can remove anything or add from the rest of the range. Delivery frequency and a running price summary sit beside it, including the cost per day.</p>
              <Desktop name="plan-full" caption="Your Plan" path="plan/" ratio="16 / 10" />

              <h3 className="cyril-case-subheading">A Checkout With No Surprises</h3>
              <p>Four short steps (details, delivery date, payment, review) with plain-language errors right under each field. The payment step says outright that this prototype doesn&apos;t take payments, and the review step lets you jump back to edit anything before the demo order is placed.</p>
              <CaseGrid layout="two">
                <Desktop name="checkout-details" caption="Details" path="checkout/" />
                <Desktop name="checkout-delivery" caption="Delivery Date" path="checkout/" />
                <Desktop name="checkout-payment" caption="Demo Payment" path="checkout/" />
                <Desktop name="checkout-review" caption="Review" path="checkout/" />
              </CaseGrid>
              <Desktop name="checkout-confirmed" caption="Order Confirmed" path="checkout/" />

              <h3 className="cyril-case-subheading">An Account That Keeps People in Control</h3>
              <p>The account opens on the next delivery, with Skip and Pause right there. Every change shows a toast with Undo, and the pack, frequency, address and a daily check-in streak are all editable in place.</p>
              <Desktop name="account-full" caption="Account" path="account/" ratio="16 / 10" />
            </CaseSection>

            {/* 04 — Design System & Themes */}
            <CaseSection id="system" number={4} title="Design System & Themes">
              <p>Everything is built on one set of design tokens, so the whole product can change its look without touching a component. To prove it, Viteo ships with two themes, each with dark and light modes, switchable from the header:</p>
              <ul className="cyril-case-list">
                <li><strong>Aqua (default):</strong> navy ink on pastel teal, peach and lavender blocks, in Plus Jakarta Sans and Inter.</li>
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
                <li><strong>Pills modelled in 3D:</strong> capsules, softgels and tablets are built from each product&apos;s colors and form; the hero renders them live, and a script bakes the same models into images for every other screen, so a new product needs no new artwork.</li>
                <li><strong>Labels that don&apos;t look like buttons:</strong> sample content is stamped like a batch code on a bottle (&ldquo;Sample data · Lot 01&rdquo;), so it&apos;s clearly a label.</li>
                <li><strong>Motion with restraint:</strong> sections fade and rise into place as you scroll, and every animation turns off for people who prefer reduced motion.</li>
              </ul>
            </CaseSection>

            {/* 05 — Tablet & Mobile */}
            <CaseSection id="responsive" number={5} title="Tablet & Mobile">
              <p>On tablets and phones the header folds into a hamburger that opens a full-screen menu with a circular wipe and staggered links, and the hamburger stays within reach as you scroll. The bento stacks into a single column, and every flow, including the quiz, checkout and account, works the same way on a phone.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}tablet-landing.jpg`} alt="Viteo on a tablet — landing page" caption="Tablet · Landing" ratio="820 / 1180" />
                <CaseFigure src={`${P}tablet-menu.jpg`} alt="Viteo on a tablet — menu" caption="Tablet · Menu" ratio="820 / 1180" />
              </CaseGrid>
              <CaseGrid layout="three">
                <Phone name="landing" caption="Landing" />
                <Phone name="menu" caption="Menu" />
                <Phone name="quiz" caption="Quiz" />
                <Phone name="account" caption="Account" />
                <Phone name="checkout" caption="Checkout" />
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
                ]}
                next={[
                  "Run moderated usability tests on the quiz and plan pages, and see where people hesitate or edit.",
                  "Test the copy of the recommendations with people who already take supplements.",
                  "Add a cancellation flow that offers skip and pause first, and measure how often they're chosen instead.",
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
