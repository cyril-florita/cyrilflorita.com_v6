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
  { id: "mobile-first", label: "Mobile-First" },
  { id: "experience", label: "The Experience" },
  { id: "three", label: "Built in Real 3D" },
  { id: "system", label: "Design System & Themes" },
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
              { label: "Project", value: "Design & dev pitch: a direct-to-consumer vitamin subscription, ready to build into a business" },
              { label: "Role", value: "Product Designer & Front-End Developer" },
              { label: "Platform & Tools", value: "Web — Desktop, Tablet, Mobile · Next.js, React, three.js, CSS" },
              { label: "Try It Live", value: <a className="cyril-dark" href={LIVE} target="_blank" rel="noopener">cyrilflorita.com/pitch/viteo</a> },
            ]}
            tile="/viteo"
          />

          <CaseLayout sections={SECTIONS} railAction={{ href: LIVE, label: "Try Viteo live" }}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Vitamin subscriptions tend to lose people in the same three places. Viteo is my pitch for one that doesn&apos;t:</p>
              <ul className="cyril-case-list">
                <li><strong>Generic packs:</strong> Everyone gets the same bottle, whatever their diet, routine or days look like.</li>
                <li><strong>No &ldquo;why&rdquo;:</strong> Customers rarely know why something is in their pack, so they don&apos;t trust it, or stop taking it.</li>
                <li><strong>Hard to control:</strong> Skipping, pausing or changing a delivery is buried, and cancelling feels like a trap.</li>
              </ul>
              <p>Viteo answers each one: a two-minute quiz that builds a pack around how you live, a plan where every item says why it&apos;s there, and an account where skip, pause and swap are one tap each, with undo. I designed and built the whole product myself, from the brand and design system to a working, responsive front end.</p>
              <p>Two constraints shaped it from the start. It makes <strong>no health claims</strong> (the quiz suggests common supplements from lifestyle answers and keeps pointing people to a healthcare professional), and it takes <strong>no real payments</strong>: the payment step is a clearly labelled preview, and every page carries a &ldquo;Design and Dev Pitch&rdquo; notice. Everything else is launch-ready: specific product details, a real FAQ and the standard supplement disclaimer.</p>
              <p><a className="cyril-button" href={LIVE} target="_blank" rel="noopener">Try Viteo live <Arrow /></a></p>
              <Desktop name="landing" caption="Landing Page" />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>Viteo hasn&apos;t launched yet, so the result to show is what&apos;s built, not market numbers (and I won&apos;t invent any): a complete, working product rather than a set of mockups. Every flow can be clicked through on any device, the quiz really builds a pack from your answers, and the account really skips, pauses, undoes and tracks your routine.</p>
              <h3 className="cyril-case-subheading">Measured on the Live Site</h3>
              <CaseStats items={[
                { value: "95", label: "Performance (desktop)" },
                { value: "100", label: "Accessibility" },
                { value: "100", label: "Best practices" },
                { value: "100", label: "SEO" },
              ]} />
              <p>Lighthouse 12 scores for the live landing page, 3D scene and all. The first audit found three fixes: the server wasn&apos;t compressing its files, the headline was hidden until the intro ran, and the page blocked pinch-zoom. Fixing them took desktop performance from 72 to 95 (the largest element now paints in 0.9 seconds) and accessibility from 94 to 100. On a simulated mid-range phone over slow 4G, performance went from 58 to 64, with no layout shift. Separately, every text color pair passes WCAG AA in all three themes, light and dark, on every page.</p>
              <h3 className="cyril-case-subheading">What to Measure at Launch</h3>
              <p>These are the metrics to track from day one, because each one tests one of the three problems above:</p>
              <ul className="cyril-case-list">
                <li><strong>Quiz completion and quiz-to-checkout conversion:</strong> does a two-minute, eight-question quiz keep people going?</li>
                <li><strong>Edits on the plan page:</strong> do people trust the recommendation, or rebuild it?</li>
                <li><strong>Skips and pauses versus cancellations:</strong> does putting control up front keep subscribers who would otherwise leave?</li>
              </ul>
            </CaseSection>

            {/* 03 — Mobile-First */}
            <CaseSection id="mobile-first" number={3} title="Mobile-First, Enhanced Upward">
              <p>Viteo was designed for a phone first and then enhanced, layer by layer, as the screen and the device allow. Taking a quiz, checking off today&apos;s pack and skipping a delivery are things people do on their phone, so the phone gets the complete product, not a cut-down one. Bigger screens and better hardware earn extras on top, and nothing on a phone waits on them.</p>
              <h3 className="cyril-case-subheading">The Layers</h3>
              <ul className="cyril-case-list">
                <li><strong>The base, everywhere:</strong> statically rendered pages with real content, pill images baked from the 3D models, and a CSS-only product shot. With reduced motion turned on, everything is simply there, with no animation.</li>
                <li><strong>Phones (the default layout):</strong> one column with the product first, a sticky &ldquo;Take the quiz&rdquo; bar once the hero&apos;s button has scrolled away, swipe rows for ingredients and reviews, a full-screen quiz, ingredient close-ups as bottom sheets you drag down to close, and an app-style tab bar in the account. Touch targets are at least 44px, and a tighter rhythm cut the landing page from about 4,600px to 3,800px.</li>
                <li><strong>Tablets:</strong> two columns, a full-screen menu that opens with a circular wipe, and account cards that fill the grid without gaps.</li>
                <li><strong>Installable:</strong> on any device Viteo can be added to the home screen as an app, with its own icon, a full-screen window and a branded offline screen (a web app manifest and a small service worker, scoped to Viteo).</li>
                <li><strong>Desktop with a mouse:</strong> the header tab, hover states, a light that follows the pointer, mouse-drag on the reviews carousel, and the live three.js scene with its scroll story and 3D close-ups.</li>
              </ul>
              <h3 className="cyril-case-subheading">How the Enhancements Are Gated</h3>
              <p>Each layer checks for what it needs instead of guessing from screen size alone. The 3D and pointer effects run only where <code>(hover: hover) and (pointer: fine)</code> and a desktop width match, WebGL is available, and reduced motion is off. three.js is loaded with a dynamic import inside that check, so phones and tablets never download it. GSAP is the one animation library every device loads, for the landing intro and the quiz finale, and both timelines are skipped under reduced motion. Where a check fails, the page keeps the layer below: the CSS product shot, the baked pill images and native scrolling.</p>
              <CaseGrid layout="three">
                <Phone name="landing" caption="Landing" />
                <Phone name="ingredients" caption="Swipe Rows" />
                <Phone name="closeup" caption="Close-Up as a Bottom Sheet" />
                <Phone name="quiz" caption="Full-Screen Quiz" />
                <Phone name="account" caption="Account with a Tab Bar" />
                <Phone name="landing-peach" caption="Peach · Light" />
              </CaseGrid>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}tablet-landing.jpg`} alt="Viteo on a tablet — landing page" caption="Tablet · Landing" ratio="820 / 1180" />
                <CaseFigure src={`${P}tablet-menu.jpg`} alt="Viteo on a tablet — menu" caption="Tablet · Menu" ratio="820 / 1180" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — The Experience */}
            <CaseSection id="experience" number={4} title="The Experience">
              <h3 className="cyril-case-subheading">A Product You Can Turn Over</h3>
              <p>The landing page opens on the product itself, in real 3D: the Viteo carton and all nine essentials, built with three.js. It follows the pointer, a soft light moves with it like a desk lamp, and while you&apos;re over the hero every piece turns slowly. The one call to action, take the two-minute quiz, sits beside it. Each time the page loads, the carton drops in first and the pills follow one by one, each at its own speed. On phones and tablets the same shot is a lightweight still, so they never download the 3D.</p>
              <Clip name="intro" caption="The Intro: a Preloader, Then the Product Lands Piece by Piece" />

              <h3 className="cyril-case-subheading">A Story Told by Scrolling</h3>
              <p>Scrolling turns the product into the page&apos;s guide. The carton tips toward you and opens, and its pills lift out and follow you down: three land in the How it works steps, then all nine settle into their Ingredients cards, which are already waiting for them. Scrolling back up plays it in reverse. The scene only draws while something is moving, so it costs nothing at rest.</p>
              <Clip name="scroll-story" caption="The Scroll Story" />
              <CaseGrid layout="two">
                <Desktop name="steps" caption="Pills Land in the Steps" />
                <Desktop name="ingredients" caption="…Then in Their Ingredients" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">Every Ingredient, Up Close</h3>
              <p>Every ingredient card opens a close-up: the pill grows out of its card onto a lit stage and turns in 3D, beside its dose and form, the exact quiz answers that add it to a pack, and what it&apos;s often packed with (one tap swaps to that one). A plain &ldquo;not medical advice&rdquo; note sits under every one.</p>
              <Desktop name="closeup" caption="Ingredient Close-Up" />

              <h3 className="cyril-case-subheading">A Quiz That Builds Your Pack as You Answer</h3>
              <p>Eight short questions, one per screen, about how you eat, sleep and spend your days; questions that don&apos;t apply are skipped. Beside them, &ldquo;Your pack so far&rdquo; fills as you go: each answer that earns a pill drops it in with its reason, so cause and effect are visible. At the end the pills drop one by one into a pack printed with your name.</p>
              <CaseGrid layout="two">
                <Desktop name="quiz" caption="Your Pack So Far" path="quiz/" />
                <Desktop name="quiz-building" caption="Building Your Pack" path="quiz/" />
              </CaseGrid>
              <Clip name="quiz-finale" caption="The Finale: Each Pill Drops Into Your Pack" path="quiz/" />

              <h3 className="cyril-case-subheading">A Pack With Your Name On It</h3>
              <p>From the quiz on, the pack is yours: &ldquo;Victoria&apos;s Morning pack&rdquo; sits beside the pills on the plan, in the checkout summary and on the confirmation, and it glides from page to page as you move through. Every item in the plan says why it&apos;s there, and you can remove anything or add from the range. Checkout is four short steps with plain-language errors, a clearly labelled payment preview and a review you can edit.</p>
              <Desktop name="plan-full" caption="Your Plan" path="plan/" ratio="16 / 10" />
              <CaseGrid layout="two">
                <Desktop name="checkout-details" caption="Details" path="checkout/" />
                <Desktop name="checkout-delivery" caption="Delivery Date" path="checkout/" />
                <Desktop name="checkout-payment" caption="Payment (Preview)" path="checkout/" />
                <Desktop name="checkout-review" caption="Review" path="checkout/" />
              </CaseGrid>
              <Desktop name="checkout-confirmed" caption="Order Confirmed" path="checkout/" />

              <h3 className="cyril-case-subheading">An Account That Keeps People in Control</h3>
              <p>The account opens on the next delivery, with Skip and Pause right there. A timeline runs from today across the next few months, and a marker with the date slides along it when you skip or pause; every change has Undo. The daily check-in is a pill organizer: checking a day off drops one of your own pills into its compartment, and the routine tracker charts the days you took your pack, month by month (the month in progress is dashed and labelled &ldquo;so far&rdquo;, so it never reads as a drop). The address is edited in a modal that hands focus back when it closes.</p>
              <Desktop name="account-full" caption="Account" path="account/" ratio="16 / 10" />

              <h3 className="cyril-case-subheading">Cancelling Without the Trap</h3>
              <p>Cancelling is a plain link in the delivery settings, and it takes at most three short steps, each with a way straight through. An optional reason leads to one alternative that fits it: delivering every 3 months to save, skipping the next box, pausing, or retaking the quiz. It applies in one tap, with &ldquo;Continue to cancel&rdquo; right beside it. The confirmation says plainly what happens, keeping and cancelling carry equal weight, and a cancelled account keeps the pack and history for a one-tap restart.</p>
              <Desktop name="cancel" caption="An Alternative That Fits the Reason" path="account/" />

              <h3 className="cyril-case-subheading">Beyond the Store</h3>
              <p>A real subscription business doesn&apos;t end at checkout, so the pitch covers what&apos;s around it too:</p>
              <ul className="cyril-case-list">
                <li><strong>Batch results:</strong> the lot code on every box looks up that batch&apos;s independent lab results (identity, potency, heavy metals, microbials). Testing is a promise most brands make; publishing it is a reason to trust this one.</li>
                <li><strong>For professionals:</strong> a partner program for trainers, dietitians and nutritionists, with an earnings calculator, a give-back option that passes the commission to clients, a dashboard preview and clear guidelines on disclosure and claims.</li>
                <li><strong>Messages between visits:</strong> a shipping reminder with the same one-tap Skip, Pause and Edit as the account, an order confirmation that explains every pill, and a daily reminder text you can reply to.</li>
              </ul>
              <CaseGrid layout="two">
                <Desktop name="lot" caption="Batch Results" path="lot/" />
                <Desktop name="partners" caption="For Professionals" path="partners/" />
              </CaseGrid>
              <Desktop name="emails-full" caption="Emails and Messages" path="emails/" ratio="16 / 10" />
            </CaseSection>

            {/* 05 — Built in Real 3D */}
            <CaseSection id="three" number={5} title="Built in Real 3D">
              <p>The product shot, the scroll story and the ingredient close-ups are real 3D, built with three.js, with GSAP timelines for the choreographed moments. The aim was a product you feel you could pick up, without the 3D ever making the page slower or harder to use.</p>
              <h3 className="cyril-case-subheading">One Canvas, Mapped to the Layout</h3>
              <p>The landing page draws everything on a single transparent WebGL canvas fixed over the viewport, which ignores the pointer so the page underneath stays fully clickable. A perspective camera is placed so that one unit in the 3D world equals one CSS pixel at depth zero. That means the layout stays the source of truth: the carton and each pill are positioned straight from the measured spots of their CSS counterparts in the hero, and of their &ldquo;docks&rdquo; further down the page, with no separate coordinate system to keep in sync.</p>
              <h3 className="cyril-case-subheading">Modelled From the Catalog</h3>
              <ul className="cyril-case-list">
                <li><strong>Pills from data:</strong> each product&apos;s colors and form in the catalog become geometry. Capsules are two lathed halves, softgels are ellipsoids, round tablets are bevelled extrusions with the score carved in through a face texture and bump map (so it can&apos;t drift when the tablet spins), and caplets are flattened capsule geometry.</li>
                <li><strong>Materials:</strong> physically based materials with clearcoat and sheen, lit by an environment map so highlights look like glossy coatings, and Neutral tone mapping so the brand colors stay true.</li>
                <li><strong>The carton:</strong> a rounded box with a hinged lid. Its artwork (logo, wordmark, the customer&apos;s pack name) is painted onto canvas textures from the page&apos;s own fonts and theme colors, and repainted when the theme changes.</li>
                <li><strong>One source of truth:</strong> the same model code runs in a headless-browser script that bakes every pill into an image for the rest of the site, so the flat images and the live 3D always match.</li>
              </ul>
              <h3 className="cyril-case-subheading">Choreography</h3>
              <ul className="cyril-case-list">
                <li><strong>The intro:</strong> the carton lands, then each pill tumbles in with its own delay, speed, drop height, bounce and spin. It&apos;s one GSAP timeline (more on that below), and each object&apos;s tween drives both the live 3D and the CSS fallback, so the two can&apos;t drift apart.</li>
                <li><strong>The scroll story:</strong> scrolling away tips the carton about 45° toward you and opens its lid, while it lags behind the scroll so the open top stays in view. Each pill flies along an arc to its dock, three into the How it works steps and all nine into their Ingredients cards, with its progress driven by where that dock sits on screen. Scrolling back reverses it exactly.</li>
                <li><strong>Hand-off to the page:</strong> when a pill lands, the 3D copy hides and the card&apos;s own baked image appears in the same pose, so landed pills cost nothing and keep their CSS hover animation.</li>
                <li><strong>Close-ups:</strong> the card&apos;s pill morphs onto the dialog&apos;s stage with the View Transitions API, then a small dedicated scene takes over and turns it slowly, leaning toward the pointer.</li>
              </ul>
              <h3 className="cyril-case-subheading">Performance</h3>
              <ul className="cyril-case-list">
                <li><strong>Loaded on demand:</strong> three.js is imported dynamically, only on desktops with a mouse, WebGL and motion allowed.</li>
                <li><strong>Warmed up behind a preloader:</strong> the first build of the scene (painting the carton&apos;s artwork, compiling the shaders, uploading the textures) used to land in the middle of the intro and make it stutter. Now a branded preloader, the logo&apos;s capsules spinning, covers the page while the scene compiles its shaders and uploads its textures ahead of time; the intro starts only once that&apos;s done, so its frames stay clean. The textures were also resized to what the carton needs on screen.</li>
                <li><strong>No idle frames:</strong> the scene renders only while something moves (scrolling, the pointer, hover or the intro), and hides itself when nothing is on screen. An always-running canvas made the glass cards behind it flicker, so this fixed a visual bug as well as saving battery.</li>
                <li><strong>Kept light:</strong> the pixel ratio is capped for the full-screen canvas, and every geometry, texture and material is disposed of when you leave the page.</li>
                <li><strong>Fallbacks:</strong> without WebGL, on touch devices or with reduced motion, the CSS product shot and baked images take its place.</li>
              </ul>
              <h3 className="cyril-case-subheading">GSAP for the Choreographed Moments</h3>
              <p>Two moments are sequences rather than single transitions, so they&apos;re built as GSAP timelines: the landing intro and the quiz&apos;s finale. A timeline places every tween on one clock with position parameters, gives each its own ease, and reports when it&apos;s done, which CSS keyframes chained by delays can&apos;t do cleanly.</p>
              <ul className="cyril-case-list">
                <li><strong>One tween, two renderers:</strong> in the intro, each object gets a single tween on a small proxy value with its own <code>back.out</code> bounce. On every update it writes CSS custom properties for the DOM hero and a shared state object that the three.js scene reads each frame. The live 3D and the CSS fallback play exactly the same motion from one source.</li>
                <li><strong>Animating without fighting transforms:</strong> the timeline animates custom properties (<code>--iy</code>, <code>--ir</code>, <code>--is</code>, <code>--io</code>), which CSS maps to the individual translate, rotate, scale and opacity properties only while the intro runs. The pills keep their tilt, the box its 3D turn and the parallax its offset.</li>
                <li><strong>Interruptible:</strong> any click, key or scroll kills the timeline and snaps everything to its resting state, so the intro never stands between someone and the page.</li>
                <li><strong>Driven by completion, not timers:</strong> in the quiz finale each pill falls under gravity (<code>power2.in</code>) with its own drift and spin, shrinks into the pack, and the pack squashes slightly to catch it (a yoyo tween from its base). The move to the plan page fires on the timeline&apos;s <code>onComplete</code>, so it waits for the last pill instead of guessing a delay.</li>
                <li><strong>Off for reduced motion:</strong> neither timeline runs; the page is simply there, and the quiz moves straight on.</li>
              </ul>
              <p>Everything else stays on the platform: CSS transitions with individual transform properties, the View Transitions API for page changes (the printed pack glides between pages), native scroll-snap for the swipe rows and carousel, and small <code>requestAnimationFrame</code> loops that ease the pointer effects.</p>
              <Desktop name="story" caption="The Scroll Story, Mid-Flight" />
            </CaseSection>

            {/* 06 — Design System & Themes */}
            <CaseSection id="system" number={6} title="Design System & Themes">
              <p>Everything is built on one set of design tokens, so the whole product can change its look without touching a component. To prove it, Viteo ships with three themes, each with dark and light modes, switchable from the header:</p>
              <ul className="cyril-case-list">
                <li><strong>Aqua (default):</strong> a cool palette of Dark Knight, Laguna, Cold Blue and Dr. White, in Plus Jakarta Sans and Inter.</li>
                <li><strong>Grove:</strong> mint and leaf green, in Outfit and Figtree.</li>
                <li><strong>Peach:</strong> a peach bento with complementary periwinkle and analogous apricot-gold blocks on navy ink, in Fraunces and DM Sans.</li>
              </ul>
              <CaseGrid layout="two">
                <Desktop name="landing" caption="Aqua · Dark" />
                <Desktop name="hero-aqua-light" caption="Aqua · Light" />
                <Desktop name="hero-grove-dark" caption="Grove · Dark" />
                <Desktop name="hero-grove-light" caption="Grove · Light" />
                <Desktop name="hero-peach-dark" caption="Peach · Dark" />
                <Desktop name="hero-peach-light" caption="Peach · Light" />
              </CaseGrid>
              <h3 className="cyril-case-subheading">A Living Design System Page</h3>
              <p>The design system page renders the real components from the same tokens, so it can&apos;t drift from the product: the brand, color swatches that update with the theme, type, buttons, one square spec for every icon button, forms, surfaces and glass, pills, charts, the accordion and carousel, dialogs and the close-up, labels, feedback, and the foundations (radius, spacing and motion).</p>
              <Desktop name="design-system-full" caption="Design System" path="design-system/" ratio="16 / 10" />
              <h3 className="cyril-case-subheading">Details</h3>
              <ul className="cyril-case-list">
                <li><strong>Pills modelled in 3D:</strong> capsules, softgels, scored tablets and caplets are built from each product&apos;s colors and form; the hero, scroll story and close-ups render them live, and a script bakes the same models into images for every other screen, so a new product needs no new artwork.</li>
                <li><strong>Labels that don&apos;t look like buttons:</strong> sample content is stamped like a batch code on a bottle (&ldquo;Sample data · Lot 01&rdquo;), so it&apos;s clearly a label.</li>
                <li><strong>Motion with restraint:</strong> a short intro plays each time the landing page loads, sections fade and rise into place, the routine chart draws itself in, and every animation turns off for people who prefer reduced motion.</li>
                <li><strong>Accessible by default:</strong> every text color pair passes WCAG AA contrast in every theme and mode, form controls have visible boundaries, dialogs and the menu manage focus, and everything works with a keyboard.</li>
              </ul>
            </CaseSection>

            {/* 07 — Learning & Next Steps */}
            <CaseSection id="learnings" number={7} title="Learning & Next Steps">
              <CaseLearnings
                learned={[
                  "Building the product instead of only drawing it surfaced the real decisions early: what happens when a quiz answer makes a question irrelevant, or when someone undoes a skip.",
                  "Driving every color and font from tokens made new themes cheap (Peach, with its own colors and type, needed no component changes), and each one doubled as a test that nothing was hard-coded.",
                  "Writing the copy as part of the design (the “why it’s here” lines, the preview labels, the plain-language errors) did as much for trust as any visual choice.",
                  "Premium motion is mostly restraint: the 3D scene only draws while something moves (an always-running canvas made the glass cards flicker), and scrolling stays native (taking it over in JavaScript made it feel laggy).",
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
