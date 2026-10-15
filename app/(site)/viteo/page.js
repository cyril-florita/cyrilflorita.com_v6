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

// Viteo: a design & dev pitch (the live product is /pitch/viteo/, outside the
// portfolio layout). Screenshots were captured from the built prototype in
// headless Chrome: desktop at 1440×900, tablet at 820×1180, phone at 390×844.

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "approach", label: "Design Approach" },
  { id: "engineering", label: "Engineering" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const P = "/img/portfolio/viteo_";
const URL = "cyrilflorita.com/pitch/viteo";
const LIVE = "/pitch/viteo/";

// Desktop screens in the browser frame; phone screens in the phone frame.
const Desktop = ({ name, caption, ratio, path = "" }) => (
  <CaseFigure src={`${P}desktop-${name}.jpg`} alt={`Viteo — ${caption}`} caption={caption} frame="browser" url={`${URL}/${path}`} ratio={ratio} />
);
const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
);
// Motion recordings of the live build (desktop, in the browser frame).
const Clip = ({ name, caption, path = "" }) => (
  <CaseVideo src={`${P}${name}.mp4`} caption={caption} url={`${URL}/${path}`} />
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
            detail="Design & Dev Pitch"
            title="Viteo"
            summary={CASE_SUMMARIES["/viteo"]}
            facts={[
              { label: "Project", value: "A personalized vitamin subscription, designed and built end to end as a design and dev pitch to an entrepreneur" },
              { label: "Role", value: "Product Designer & Front-End Developer" },
              { label: "Platform & Tools", value: "Web — Desktop, Tablet, Mobile · Next.js, React, three.js, CSS" },
              { label: "Try It Live", value: <a className="cyril-dark" href={LIVE} target="_blank" rel="noopener">cyrilflorita.com/pitch/viteo</a> },
            ]}
            tile="/viteo"
          />

          <CaseLayout sections={SECTIONS} railAction={{ href: LIVE, label: "Try Viteo live" }}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Vitamin subscriptions lose customers in the same three places:</p>
              <ul className="cyril-case-list">
                <li><strong>Generic packs:</strong> everyone gets the same bottle, whatever their diet or routine.</li>
                <li><strong>No &ldquo;why&rdquo;:</strong> people don&apos;t know why something is in their pack, so they stop taking it.</li>
                <li><strong>Hard to control:</strong> skipping or pausing is buried, and cancelling feels like a trap.</li>
              </ul>
              <p>Viteo is my pitch for a direct-to-consumer subscription that fixes all three. As product designer and front-end developer, I took it from brand to working product, solo, with three goals:</p>
              <ul className="cyril-case-list">
                <li>personalize every pack, and explain every pill in it</li>
                <li>put customers in control, so retention is earned rather than trapped</li>
                <li>make it launch-ready, so a founder could build a business on it</li>
              </ul>
              <h3 className="cyril-case-subheading">What&apos;s Built</h3>
              <ul className="cyril-case-list">
                <li><strong>Landing page</strong> with a real-time 3D product and a scroll story that carries the pills down the page</li>
                <li><strong>Two-minute quiz</strong> that builds the pack live as you answer</li>
                <li><strong>Personalized plan</strong>, every item with the reason it&apos;s there</li>
                <li><strong>Checkout</strong> in four steps, with simulated Apple Pay / Google Pay and test-card payments, including a declined card</li>
                <li><strong>Passwordless sign-in</strong> by email link or passkey, and sign-out</li>
                <li><strong>Account:</strong> skip, pause, swap and undo; a daily check-in; a routine tracker</li>
                <li><strong>Honest cancellation</strong> that offers one fitting alternative, never a maze</li>
                <li><strong>Ingredient close-ups</strong> in 3D, with dose, form and when the quiz adds each one</li>
                <li><strong>Batch results:</strong> independent lab results by lot code</li>
                <li><strong>Partner program</strong> for trainers, dietitians and nutritionists, whose suggested packs open for clients with their notes and a first-box discount</li>
                <li><strong>Lifecycle messages:</strong> shipping reminder, order confirmation, daily text</li>
                <li><strong>Installable app</strong> with an offline screen</li>
                <li><strong>Design system</strong> with three themes, each in light and dark</li>
              </ul>
              <p>It makes no health claims and takes no real payments; everything else is written as if it launched tomorrow.</p>
              <div className="cyril-case-cta cyril-case-cta-inline">
                <div>
                  <h3 className="cyril-case-subheading">See it for yourself</h3>
                  <p>Every flow works: take the quiz, open an ingredient, place an order and skip a delivery. Nothing is charged and nothing leaves your browser.</p>
                </div>
                <a className="cyril-button" href={LIVE} target="_blank" rel="noopener">Try Viteo live <Arrow /></a>
              </div>
              <Clip name="intro" caption="The intro: the product lands piece by piece" />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>Viteo hasn&apos;t launched, so there are no market numbers, and I won&apos;t invent any. What it delivers is a complete, working product rather than mockups, measured on the live site:</p>
              <CaseStats items={[
                { value: "95", label: "Performance (desktop)" },
                { value: "100", label: "Accessibility" },
                { value: "100", label: "Best practices" },
                { value: "100", label: "SEO" },
              ]} />
              <p>Lighthouse scores, 3D scene included. Fixing what the first audit found took desktop performance from 72 to 95 and accessibility from 94 to 100, and it holds at 95 with the moving background and page preloaders added since. A mobile pass (WebP renders, fonts and analytics off the critical path, page-only CSS split out) then took mobile from 62 to 79. Every text color passes WCAG AA in all three themes, light and dark. At launch, the metrics to watch are quiz-to-checkout conversion, edits on the plan page, and skips and pauses against cancellations.</p>

              <Desktop name="landing" caption="Landing page" />
              <p><strong>Depth under the pointer.</strong> On desktop, the pack is the pivot of the hero: near pills follow the cursor, far ones drift the other way, and the box turns far enough to show its side, then springs back into place.</p>
              <Clip name="parallax" caption="Depth parallax under the pointer" />
              <p><strong>A story told by scrolling.</strong> The carton tips open and its pills fly down the page, landing in the steps and then their ingredient cards. Scrolling back reverses it.</p>
              <Clip name="scroll-story" caption="The scroll story" />
              <CaseGrid layout="two">
                <Desktop name="steps" caption="Pills land in the steps" />
                <Desktop name="ingredients" caption="…then in their ingredients" />
              </CaseGrid>
              <Desktop name="story" caption="The scroll story, mid-flight" />

              <p><strong>Every ingredient, up close.</strong> A card opens a 3D close-up with dose, form, the quiz answers that add it, and what it&apos;s often packed with.</p>
              <Desktop name="closeup" caption="Ingredient close-up" />

              <p><strong>A quiz that builds as you answer.</strong> Each answer that earns a pill drops it into &ldquo;Your pack so far&rdquo; with its reason, and the finale fills a pack printed with your name.</p>
              <CaseGrid layout="two">
                <Desktop name="quiz" caption="Your pack so far" path="quiz/" />
                <Desktop name="quiz-building" caption="Building your pack" path="quiz/" />
              </CaseGrid>
              <Clip name="quiz-finale" caption="The finale: each pill drops into your pack" path="quiz/" />

              <p><strong>Plan, checkout and payment.</strong> Every item says why it&apos;s there and can be removed or swapped. Checkout is four short steps with plain-language errors. Payment is fully prototyped but safe by design: a wallet sheet, and a card form locked to public test cards, so no real card can ever be entered. A declined test card shows the error path.</p>
              <Desktop name="plan-full" caption="Your plan" path="plan/" ratio="16 / 10" />
              <CaseGrid layout="two">
                <Desktop name="checkout-details" caption="Details" path="checkout/" />
                <Desktop name="checkout-delivery" caption="Delivery date" path="checkout/" />
                <Desktop name="checkout-payment" caption="Payment: wallet or locked test card" path="checkout/" />
                <Desktop name="checkout-review" caption="Review" path="checkout/" />
              </CaseGrid>
              <CaseGrid layout="two">
                <Desktop name="checkout-wallet" caption="Simulated Apple Pay sheet" path="checkout/" />
                <Desktop name="checkout-confirmed" caption="Order confirmed" path="checkout/" />
              </CaseGrid>

              <p><strong>An account that keeps people in control.</strong> Sign-in is passwordless: an email link (it arrives as an on-screen notification in the preview) or a passkey. Skip and Pause sit on the next delivery, every change has Undo, and a routine tracker charts the days you took your pack. Cancelling offers one alternative that fits the reason, with &ldquo;Continue to cancel&rdquo; right beside it.</p>
              <CaseGrid layout="two">
                <Desktop name="signin" caption="Passwordless sign-in" path="sign-in/" />
                <Desktop name="account" caption="Signed in" path="account/" />
              </CaseGrid>
              <Desktop name="account-full" caption="Account" path="account/" ratio="16 / 10" />
              <Desktop name="cancel" caption="Cancelling: an alternative that fits the reason" path="account/" />

              <p><strong>Beyond the store.</strong> Lab results by lot code, a partner program for professionals, and the messages people get between visits.</p>
              <CaseGrid layout="two">
                <Desktop name="lot" caption="Batch results" path="lot/" />
                <Desktop name="partners" caption="For professionals" path="partners/" />
              </CaseGrid>
              <Desktop name="emails-full" caption="Emails and messages" path="emails/" ratio="16 / 10" />
            </CaseSection>

            {/* 03 — Design Approach */}
            <CaseSection id="approach" number={3} title="Design Approach">
              <h3 className="cyril-case-subheading">Mobile-First, Enhanced Upward</h3>
              <p>People take quizzes and check off their pack on their phones, so the phone gets the complete product: one column, a sticky quiz bar, swipe rows, a full-screen quiz, bottom sheets and an app-style tab bar. Tablets add two columns. Desktops with a mouse add hover, a pointer-led light, the moving background and the live 3D. Each layer checks what the device can do before it loads, so phones never download the 3D, and with reduced motion everything is simply there.</p>
              <CaseGrid layout="three">
                <Phone name="landing" caption="Landing" />
                <Phone name="ingredients" caption="Swipe rows" />
                <Phone name="closeup" caption="Close-up as a bottom sheet" />
                <Phone name="quiz" caption="Full-screen quiz" />
                <Phone name="account" caption="Account with a tab bar" />
                <Phone name="landing-peach" caption="Peach · Light" />
              </CaseGrid>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}tablet-landing.jpg`} alt="Viteo on a tablet — landing page" caption="Tablet · Landing" ratio="820 / 1180" />
                <CaseFigure src={`${P}tablet-menu.jpg`} alt="Viteo on a tablet — menu" caption="Tablet · Menu" ratio="820 / 1180" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">One Design System, Three Brands</h3>
              <p>Every color and font comes from tokens, so the product can change its whole look without touching a component. Three themes prove it: Aqua (the default), Grove and Peach, each with its own palette and type, in light and dark. A living design system page renders the real components, so it can&apos;t drift from the product.</p>
              <CaseGrid layout="two">
                <Desktop name="landing" caption="Aqua · Dark" />
                <Desktop name="hero-aqua-light" caption="Aqua · Light" />
                <Desktop name="hero-grove-dark" caption="Grove · Dark" />
                <Desktop name="hero-grove-light" caption="Grove · Light" />
                <Desktop name="hero-peach-dark" caption="Peach · Dark" />
                <Desktop name="hero-peach-light" caption="Peach · Light" />
              </CaseGrid>
              <Desktop name="design-system-full" caption="Design system" path="design-system/" ratio="16 / 10" />
            </CaseSection>

            {/* 04 — Engineering */}
            <CaseSection id="engineering" number={4} title="Engineering">
              <p>Built with Next.js and React as a static site, with three.js for the 3D and GSAP for the choreographed moments.</p>
              <ul className="cyril-case-list">
                <li><strong>3D mapped to the layout:</strong> one transparent WebGL canvas where a 3D unit equals a CSS pixel, so the carton and pills are placed straight from the page layout, with nothing extra to keep in sync.</li>
                <li><strong>Modelled from the catalog:</strong> each product&apos;s color and form generate its pill. The same code bakes the images used everywhere else, so a new product needs no new artwork.</li>
                <li><strong>One GSAP timeline, two renderers:</strong> each object in the intro has one tween that drives both the 3D scene and the CSS fallback. Any click or scroll skips it, and the quiz finale moves on when its timeline completes, not on a guessed timer.</li>
                <li><strong>A living background:</strong> a WebGPU shader (falling back to WebGL2) sweeps a slow, pulsing silk ribbon of the theme&apos;s light behind every page. It draws at a third of the screen&apos;s resolution at 30fps, pauses when the tab is hidden, and stays off on phones and for reduced motion. Text can land anywhere on it, so in dark mode the shader caps its own brightness at the level where every text pair still passes AA, checked on every page as the light moves.</li>
                <li><strong>Fast by design:</strong> three.js loads only on capable desktops, warms up behind a branded preloader so the intro never stutters, and draws only while something moves.</li>
                <li><strong>Prototyped, not faked:</strong> sign-in, payment and cancellation are complete flows with loading, success and error states. Nothing is sent or charged, and the card form is locked to public test cards so it can never collect a real card.</li>
                <li><strong>Accessible throughout:</strong> keyboard support, focus management in every dialog, pinch-zoom, and reduced motion respected everywhere.</li>
              </ul>
            </CaseSection>

            {/* 05 — Learning & Next Steps */}
            <CaseSection id="learnings" number={5} title="Learning & Next Steps">
              <CaseLearnings
                learned={[
                  "Building the product instead of only drawing it surfaced the real decisions early: what happens when a quiz answer makes a question irrelevant, or when someone undoes a skip.",
                  "Driving every color and font from tokens made new themes cheap (Peach, with its own colors and type, needed no component changes), and each one doubled as a test that nothing was hard-coded.",
                  "Writing the copy as part of the design (the “why it’s here” lines, the preview labels, the plain-language errors) did as much for trust as any visual choice.",
                ]}
                next={[
                  "Connect the commerce layer: subscriptions and payments (for example Shopify or Stripe Billing), real accounts, and reminder emails and texts.",
                  "Run moderated usability tests on the quiz and plan pages, and see where people hesitate or edit.",
                  "Test the copy of the recommendations with people who already take supplements.",
                  "Measure how often each cancellation alternative is taken, and tune the offers by reason.",
                ]}
              />
            </CaseSection>

            <div className="cyril-case-cta">
              <div>
                <h3 className="cyril-case-subheading">See it for yourself</h3>
                <p>Every flow works: take the quiz, open an ingredient, place an order and skip a delivery. Nothing is charged and nothing leaves your browser.</p>
              </div>
              <a className="cyril-button" href={LIVE} target="_blank" rel="noopener">Try Viteo live <Arrow /></a>
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
