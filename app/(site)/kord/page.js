"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { onPreloaderHidden, wipeThen } from "@/components/Preloader";
import { session } from "@/components/safeStorage";
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

// Kord: a design & dev pitch, an online-only road-bike brand (the live site is /pitch/kord/,
// outside the portfolio layout; see its README). Stills were captured from a production build in
// headless Chrome with the GPU on: desktop at 1440×900 @2x, phone at 390×844 @2x; the clips with
// CDP screencast at 1280×800 (the tile at 1600×900), encoded with ffmpeg.

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "approach", label: "Design Approach" },
  { id: "engineering", label: "Engineering" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const P = "/img/portfolio/kord_";
const URL = "cyrilflorita.com/pitch/kord";
const LIVE = "/pitch/kord/";

const Desktop = ({ name, caption, path = "/" }) => (
  <CaseFigure src={`${P}desktop-${name}.jpg`} alt={`Kord — ${caption}`} caption={caption} frame="browser" url={`${URL}${path}`} />
);
const Clip = ({ name, caption, path = "/" }) => (
  <CaseVideo src={`${P}${name}.mp4`} caption={caption} url={`${URL}${path}`} />
);
const Phone = ({ name, caption }) => (
  <CaseFigure src={`${P}mobile-${name}.jpg`} alt={`Kord on a phone — ${caption}`} caption={caption} size="phone" ratio="390 / 844" />
);
const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
);

const Cta = ({ inline }) => (
  <div className={`cyril-case-cta${inline ? " cyril-case-cta-inline" : ""}`}>
    <div>
      <h3 className="cyril-case-subheading">Try it yourself</h3>
      <p>Drag the bike around, change its paint, and scroll to take it apart. Then answer four questions to find your bike, build one, and check out (nothing is charged: payments are switched off). Best with a mouse, and it works on a phone too.</p>
    </div>
    <div className="cyril-case-cta-actions">
      <a className="cyril-button" href={LIVE} target="_blank" rel="noopener noreferrer">Try Kord live <Arrow /></a>
      <a className="cyril-button cyril-type-2" href={`${LIVE}design-system/`} target="_blank" rel="noopener noreferrer">See the design system <Arrow /></a>
    </div>
  </div>
);

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    session.set("returnToProject", "kord");
    cyrilUtility.tpInner();
    const unsubscribePreloader = onPreloaderHidden(() => {
      document.querySelector(".cyril-page")?.classList.add("cyril-active");
    });
    return () => unsubscribePreloader();
  }, []);

  const handleBackToPortfolio = () => {
    session.set("returnToProject", "kord");
    wipeThen(() => router.push("/"));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="E-commerce Design & Development"
            detail="Design & Dev Pitch"
            title="Kord"
            summary={CASE_SUMMARIES["/kord"]}
            facts={[
              { label: "Target Clients", value: "Direct-to-consumer brands" },
              { label: "Role", value: "Brand, Product Designer & Front-End Developer" },
              { label: "Platform & Tools", value: "Web — Desktop, Tablet, Mobile · Next.js, three.js, Blender" },
              { label: "Try It Live", value: <a className="cyril-dark" href={LIVE} target="_blank" rel="noopener noreferrer">The site</a> },
            ]}
            tile="/kord"
          />

          <CaseLayout sections={SECTIONS} railAction={{ href: LIVE, label: "Try Kord live" }}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>A good road bike costs as much as a used car, and more of them are sold online every year. Buying one from a website is still a leap:</p>
              <ul className="cyril-case-list">
                <li><strong>You can&apos;t see it:</strong> a few product photos show one side of a bike you&apos;ll ride for years, and the parts that set one model apart are buried in a spec sheet.</li>
                <li><strong>You can&apos;t tell which one is yours:</strong> aero, climbing, endurance, and all-road bikes look alike in a grid, and the differences are in geometry tables most riders can&apos;t read.</li>
                <li><strong>You can&apos;t be fitted:</strong> in a shop, someone checks your size and sets the bike up; online, you guess a frame size and hope.</li>
              </ul>
              <p>Kord is my answer, built as a pitch: an online-only road-bike brand with four bikes, designed and built end to end, from the name and the logo to the 3D bike and the checkout. I did all of it on my own, with four goals:</p>
              <ul className="cyril-case-list">
                <li>let people look at the bike the way they would in a shop: turn it, pick a color, and see what it&apos;s made of</li>
                <li>help them choose the right bike and size in under a minute, in their own words</li>
                <li>make the price, weight, and delivery date clear at every step of building one</li>
                <li>design for the phone first, with the same 3D bike on every screen</li>
              </ul>
              <h3 className="cyril-case-subheading">What&apos;s Built</h3>
              <ul className="cyril-case-list">
                <li><strong>A 3D bike you can turn</strong> by dragging, with momentum, or with the arrow keys, in a dark studio with a light that follows the pointer</li>
                <li><strong>Five paints</strong> on a rail down the right edge, each repainting the bike, and every bike comes in every one</li>
                <li><strong>Hotspots</strong> on the frame, wheels, drivetrain, and cockpit that open a card on hover or tap</li>
                <li><strong>A scroll story</strong> that turns the bike side-on and takes it apart into its labeled parts</li>
                <li><strong>Help me choose:</strong> four questions about where you ride, how far, what matters most, and how tall you are, in a dialog that opens from any page, answered with a bike, a size, the reasons, and the bike in 3D</li>
                <li><strong>A builder</strong> with five choices (bike, size, paint, groupset, wheels) and a live price, weight, and ship date, each one shown on the 3D bike</li>
                <li><strong>Compare, cart, and checkout:</strong> the four bikes side by side in any paint, with their frames drawn over each other in the size you pick, a cart that remembers your builds, and a checkout with a fit call (payments are switched off)</li>
                <li><strong>A virtual fit:</strong> five measurements in, a frame size, saddle height, crank, stem, and bar width out</li>
                <li><strong>The Kord® Guarantee:</strong> a page of its own with the full terms of a 30-day ride, a lifetime frame warranty, crash replacement, and a year of fit adjustments, how a return works, and a table comparing Kord with a typical online store and a bike shop</li>
                <li><strong>A brand:</strong> the name, a mark, and a stretched wordmark that&apos;s also printed on the bike&apos;s down tube</li>
                <li><strong>A preloader and text motion:</strong> the mark&apos;s arc turns like a pedal stroke while each page gets ready, and fades back in when you move to another page, so leaving and arriving read as one move; then the page comes in, and headings and copy rise into view as you scroll</li>
                <li><strong>A design system page</strong> with every token, component, and the 3D studio, all live</li>
              </ul>
              <p>Kord is a concept brand: every bike, price, and order in it is sample content, and nothing can be bought.</p>
              <Cta inline />
              <Clip name="intro" caption="The preloader hands over to the hero" />
              <Clip name="turn" caption="Turning the bike, a hotspot, and the five paints" />
              <CaseVideo src={`${P}glance.mp4`} caption="Every screen at a glance" frame={false} />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>Kord hasn&apos;t launched, so there are no sales or conversion numbers, and I won&apos;t make any up. What it delivers is a complete, working store that&apos;s accessible and light enough to load a 3D bike on a phone:</p>
              <CaseStats items={[
                { value: "100", label: "Accessibility" },
                { value: "100", label: "Best practices" },
                { value: "95", label: "Performance, desktop" },
                { value: "0", label: "Accessibility violations" },
              ]} />
              <p>Lighthouse 12.8 on the live site: desktop scores 95 on the landing, 94 on the Guarantee page, and 96 on Compare, and a throttled phone 88 on the landing, 81 on the Guarantee page, and 85 on Compare, with 100 for accessibility and best practices on every page. An axe audit (WCAG A and AA, plus best practices) of every page at desktop and phone widths, with the phone menu open too, finds no violations, and everything works by keyboard and with reduced motion. Each model is its own 3D bike, about 820 KB with its baked shading, and phones get a version a third lighter. Once it runs, the numbers to watch are how many people finish Find your bike, how many go from a match to the builder, and how many builds reach the cart.</p>

              <Desktop name="landing" caption="The landing" />
              <p><strong>A bike you can walk around.</strong> The Arc™ stands in a dark studio, its name huge on the wall behind it. Drag it and it turns and carries on a little when you let go. A soft light on the wall follows the pointer, the way a lamp would. Four hotspots open short cards about the frame, the wheels, the drivetrain, and the cockpit.</p>
              <p><strong>Pick a color.</strong> The paint rail runs down the right edge. Each swatch repaints the frame, and the KORD on the down tube takes the paint&apos;s own decal color. All five paints are matte, because a glossy coat read as glare under the studio lights. Paint isn&apos;t part of a model: every bike comes in every paint, so the range cards, Compare, and the builder each have their own swatches, and every bike has a studio photo in every paint.</p>
              <CaseGrid layout="two">
                <Desktop name="volt" caption="Volt" />
                <Desktop name="cobalt" caption="Cobalt" />
                <Desktop name="glacier" caption="Glacier" />
                <Desktop name="ember" caption="Ember" />
              </CaseGrid>
              <Desktop name="range" caption="The range: four bikes, one for every road, each in any paint" />

              <p><strong>Take it apart.</strong> Scrolling past the hero turns the bike side-on, then pulls it apart: wheels out, cranks down, cockpit and saddle up, each part with a label that says what it is and what it weighs. The wheels and cranks roll with the scroll. Scroll back and it comes together again.</p>
              <Clip name="story" caption="The scroll story" />
              <Desktop name="story" caption="Inside the Arc™" />

              <p><strong>Help me choose.</strong> A dialog that opens from any page, with four questions, one at a time: where you ride, how long a big day is, what matters most, and how tall you are. The answer is a bike and a size, with the reasons in your own words (&ldquo;You ride hills and mountains, and at 6.8 kg with a 10–36 cassette, it&apos;s built to climb&rdquo;), the bike in 3D in its own paint and your size, and links to build it or compare it with the runner-up. Answers are remembered, a result can be shared as a link, and the result fits the dialog on every screen without scrolling.</p>
              <Clip name="find" caption="Help me choose: four questions to a match" />
              <CaseGrid layout="two">
                <Desktop name="find-ask" caption="One question at a time" />
                <Desktop name="find" caption="The match, in 3D" />
              </CaseGrid>

              <p><strong>Build it.</strong> Five choices beside the bike: the model, a size with its height range, the paint, the groupset, and the wheels. The price, the weight, and a ship date update with every choice, and the 3D bike shows them: it turns in again in its new paint, the frame grows or shrinks to the size (a 49 sits low and compact between its wheels, a 58 stands tall over them, while the wheels stay the same, as on real bikes), the cranks, derailleurs, and brakes take the groupset&apos;s finish (black, gunmetal, or titanium), and the rims deepen or slim down to the wheels you pick. A build can be added to the cart or shared as a link.</p>
              <Clip name="build" caption="Building a Meridian™: the size, the paint, then the deep wheels and the Pro groupset on the bike" path="/build/" />
              <Desktop name="build" caption="The builder" path="/build/" />

              <p><strong>Everything around it.</strong> Compare puts the four bikes side by side as cards, in whichever paint you pick, from weight and gearing to where each one is happiest, then draws their frames over each other in the size you choose, so the differences in geometry are shapes rather than numbers in a table. The cart keeps every build with its options, and checkout books a 20-minute fit call before the bike ships. The virtual fit turns five tape-measure measurements into a starting fit and carries the size into the builder.</p>
              <CaseGrid layout="two">
                <Desktop name="compare" caption="Compare" path="/compare/" />
                <Desktop name="cart" caption="The cart" path="/cart/" />
                <Desktop name="checkout" caption="Checkout, with a fit call" path="/checkout/" />
                <Desktop name="fit" caption="The virtual fit" path="/fit/" />
              </CaseGrid>
            </CaseSection>

            {/* 03 — Design Approach */}
            <CaseSection id="approach" number={3} title="Design Approach">
              <h3 className="cyril-case-subheading">A Product Shoot, on a Page</h3>
              <p>The look comes from studio product photography: a near-black room, light only where the bike is, a floor that fades into the dark, and a soft shadow under the tires. One bright chartreuse marks everything you can act on. The wall and floor share a faint mottled texture, the wall has a fine grain that&apos;s one screen pixel per speck, and the bike&apos;s shadow is baked from an overhead light so it&apos;s darkest where the tires meet the floor.</p>
              <p>The brand is built around one stretched typeface. The logo is Archivo Expanded Black, stretched to twice its width, beside a mark drawn as a crank&apos;s circle with a chartreuse arc, the stroke of a pedal turn. The same stretched KORD is printed on every down tube, and each model&apos;s name, with its ™ (Arc™, Crest™, Atlas™), runs across the front of its head tube in a color picked to stand out on each paint; the Meridian™, too long to read at that size, carries its initial. Headings are uppercase, and section labels sit under their headings in small green mono caps.</p>
              <CaseGrid layout="two">
                <Desktop name="design-system" caption="The design system" path="/design-system/" />
                <Desktop name="ds-choices" caption="Every choice is a live radio group" path="/design-system/" />
              </CaseGrid>
              <h3 className="cyril-case-subheading">Phone First</h3>
              <p>On a phone the bike sits on top, full width, with the paints in a row under it and the copy below. In the scroll story, the part labels shrink to numbered dots with a legend under the bike, and the builder&apos;s summary stays pinned to the bottom of the screen. A menu opens every page in a full-screen panel.</p>
              <CaseGrid layout="three">
                <Phone name="landing" caption="The landing" />
                <Phone name="story" caption="The parts, numbered" />
                <Phone name="find" caption="A match" />
                <Phone name="build" caption="The builder" />
                <Phone name="compare" caption="Compare" />
                <Phone name="menu" caption="The menu" />
              </CaseGrid>
              <h3 className="cyril-case-subheading">What If It&apos;s Wrong?</h3>
              <p>Buying a bike you&apos;ve never ridden is the leap, so the guarantee answers the worry behind it: what happens if it&apos;s wrong. The landing shows the four promises in big outlined figures and links to a page of their own, where the 3D bike stands beside them and each one carries its full terms: what&apos;s refunded and what isn&apos;t, who&apos;s covered, and what it costs. Three steps explain a return, and a table sets Kord beside a typical online store and a bike shop, row by row.</p>
              <CaseGrid layout="two">
                <Desktop name="guarantee" caption="The Kord® Guarantee, a page of its own" path="/guarantee/" />
                <Desktop name="compares" caption="How it compares" path="/guarantee/" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — Engineering */}
            <CaseSection id="engineering" number={4} title="Engineering">
              <p>Built with Next.js and React as a static site, with the 3D bike in three.js, loaded after the first paint.</p>
              <ul className="cyril-case-list">
                <li><strong>A bike built by script:</strong> a Blender script assembles it. The frame, fork, cockpit, saddle, pedals, and tires come from a licensed model (&ldquo;Road Bike&rdquo; by tanity, CC BY 4.0); the wheels, drivetrain, disc brakes, and decals are modeled in code, down to a chain resampled link by link around the rings and jockey wheels. One script builds all four models: each gets its own wheelbase and chainstays, rim depth, and tire width from its spec sheet, a taller front end (the Meridian™ and Atlas™) or a compact rear triangle (the Crest™), and its name across the head tube. The wheels and chain are built at each model&apos;s axles, and the licensed frame is stretched to meet them, so the Atlas™ is 40 mm longer than the Arc™.</li>
                <li><strong>Shading that ships small:</strong> ambient occlusion is baked in Blender and shipped in the model&apos;s texture-coordinate channel, which the Draco compressor quantizes (vertex colors would have added 430 KB). Each model&apos;s floor shadow is baked too, from a camera looking straight down.</li>
                <li><strong>One scene, three places:</strong> the hero, Find your bike, and the builder share one studio module (lights, materials, floor, shadow), and each renders only while something moves. The groupset&apos;s parts have their own material, so a choice in the builder eases them to a new finish, and the rims are reshaped in the browser, vertex by vertex, from the model&apos;s depth to the one you picked. Sizes work the same way: the Blender script&apos;s own stretch for each model&apos;s taller front end or compact rear runs live, lowering or raising the head tube, seat cluster, and saddle, so one model covers every size.</li>
                <li><strong>A fast first paint:</strong> the studio&apos;s wall texture and grain were drawn by script after the 3D loaded, and Chrome counted them as the page&apos;s largest paint, 16 seconds in on a throttled phone. They&apos;re now tiny image files, under the detail level Chrome counts, so the first paint is the page&apos;s own text.</li>
                <li><strong>Choices you can use by keyboard:</strong> every set of options is a radio group with arrow-key navigation, the 3D bike turns with the arrow keys, hotspots are buttons with their cards linked, and results are announced to screen readers.</li>
                <li><strong>Page to page:</strong> every page opens under the same cover until its fonts and its 3D bike are ready, and a link to another Kord page fades the cover back in before the browser leaves, while links to a section of the same page, the Help me choose dialog, and new tabs skip it.</li>
                <li><strong>Fallbacks:</strong> without WebGL, a still of the bike stays in place; under reduced motion, nothing animates on its own.</li>
              </ul>
            </CaseSection>

            {/* 05 — Learning & Next Steps */}
            <CaseSection id="learnings" number={5} title="Learning & Next Steps">
              <CaseLearnings
                learned={[
                  "I modeled the whole bike myself first. Comparing it side by side with a licensed model, its frame, levers, and saddle were clearly better and my wheels and drivetrain clearly better, so the bike on the site is both.",
                  "Realism came from taking shine away: a dark studio to reflect, matte paint, baked shading, and a soft shadow did more than any clear coat.",
                  "Writing each match's reasons in the rider's own words made the result read like advice, where a score would have read like a quiz.",
                  "A performance problem can hide in a background: the largest paint on the phone was a faint texture nobody would notice was missing.",
                ]}
                next={[
                  "Test Find your bike with riders: how many finish it, whether they agree with the match, and how many go on to build that bike.",
                  "Measure the path from match to builder to cart, and which choices people change most in the builder.",
                  "Bring the phone scores up from the 80s: the cover holds each page until its 3D bike is ready, which costs speed index (5.4 seconds on the landing on a throttled phone).",
                ]}
              />
            </CaseSection>

            <Cta />

          </CaseLayout>

          <CaseNext
            href="/hearthside"
            title="Hearthside"
            category="Product Design & Development"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
