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

// Mustang: a design & dev pitch to a car dealership (the live ad is
// /pitch/mustang/, outside the portfolio layout; see its README). Stills were
// captured from the built ad in headless Chrome with the GPU on: desktop at
// 1440×900 @2x, tablet at 820×1180 @1.5x, phone at 390×844 @2x; the clips
// with CDP screencast (1280×800, the phone at 390×844 → 600 wide).

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "approach", label: "Design Approach" },
  { id: "engineering", label: "Engineering" },
  { id: "learnings", label: "Learning & Next Steps" },
];

const P = "/img/portfolio/mustang_";
const URL = "cyrilflorita.com/pitch/mustang";
const LIVE = "/pitch/mustang/";
const KIT = "/pitch/mustang/kit/";

const Desktop = ({ name, caption }) => (
  <CaseFigure src={`${P}desktop-${name}.jpg`} alt={`Mustang ad — ${caption}`} caption={caption} frame="browser" url={`${URL}/`} />
);
const Clip = ({ name, caption }) => (
  <CaseVideo src={`${P}${name}.mp4`} caption={caption} url={`${URL}/`} />
);
const Phone = ({ name, caption }) => (
  <CaseFigure src={`${P}mobile-${name}.jpg`} alt={`Mustang ad on a phone — ${caption}`} caption={caption} size="phone" ratio="390 / 844" />
);
const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
);

const Cta = ({ inline }) => (
  <div className={`cyril-case-cta${inline ? " cyril-case-cta-inline" : ""}`}>
    <div>
      <h3 className="cyril-case-subheading">Try it yourself</h3>
      <p>Drag the car around, change its paint, and open the windows to see the taillights, the cockpit, and the headlights up close. Best with a mouse, and it works on a phone too. The campaign kit has the email, the social spots, the website hero, the display ads, and the stills, ready to download.</p>
    </div>
    <div className="cyril-case-cta-actions">
      <a className="cyril-button" href={LIVE} target="_blank" rel="noopener noreferrer">Try the ad live <Arrow /></a>
      <a className="cyril-button cyril-type-2" href={KIT} target="_blank" rel="noopener noreferrer">See the campaign kit <Arrow /></a>
    </div>
  </div>
);

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    session.set("returnToProject", "mustang");
    cyrilUtility.tpInner();
    const unsubscribePreloader = onPreloaderHidden(() => {
      document.querySelector(".cyril-page")?.classList.add("cyril-active");
    });
    return () => unsubscribePreloader();
  }, []);

  const handleBackToPortfolio = () => {
    session.set("returnToProject", "mustang");
    wipeThen(() => router.push("/"));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Interactive Ad Design & Development"
            detail="Design & Dev Pitch"
            title="Mustang"
            summary={CASE_SUMMARIES["/mustang"]}
            facts={[
              { label: "Target Clients", value: "Car dealerships" },
              { label: "Role", value: "Designer & Front-End Developer" },
              { label: "Platform & Tools", value: "Web — Desktop, Tablet, Mobile · Next.js, three.js, Blender" },
              { label: "Try It Live", value: <><a className="cyril-dark" href={LIVE} target="_blank" rel="noopener noreferrer">The ad</a> · <a className="cyril-dark" href={KIT} target="_blank" rel="noopener noreferrer">The campaign kit</a></> },
            ]}
            tile="/mustang"
          />

          <CaseLayout sections={SECTIONS} railAction={{ href: LIVE, label: "Try the ad live" }}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Most car ads online are a photo, a price, and a button. People scroll past them, and the ones who do click have to leave the ad to find out anything else:</p>
              <ul className="cyril-case-list">
                <li><strong>A photo shows one side of the car:</strong> buyers want to see the rear, the interior, and the details before they make the trip.</li>
                <li><strong>The offer is buried:</strong> the monthly price is easy to find, but the terms behind it are a click and a page load away.</li>
                <li><strong>Nothing invites a second look:</strong> a static banner gives nobody a reason to stay on it.</li>
              </ul>
              <p>This is my pitch to a car dealership: a prototype that shows how I approach design across channels. At its center is a one-page interactive ad for the Mustang, built around a 3D Dark Horse you can turn, repaint, and look inside, with the lease offer under the car. It&apos;s designed mobile-first and progressively enhanced for desktops, and the same concept carries beyond the ad: a launch email, seven-second spots for social, a hero for the dealer&apos;s website, and display ads, gathered in a campaign kit the dealer&apos;s team can download. I designed and built it on my own, from the layout and type to the 3D scene, with four goals:</p>
              <ul className="cyril-case-list">
                <li>let people explore the car the way they would on the lot: walk around it, look inside, and pick a color</li>
                <li>keep the offer in view the whole time, with its terms one tap away</li>
                <li>design for the phone first, then enhance the experience for larger screens</li>
                <li>make one creative concept that works across channels: web, email, and social</li>
              </ul>
              <h3 className="cyril-case-subheading">What&apos;s Built</h3>
              <ul className="cyril-case-list">
                <li><strong>A 3D car you can turn all the way around</strong> by dragging, with momentum, or with the arrow keys</li>
                <li><strong>Three windows</strong> that fly the camera to the tri-bar taillights, the driver&apos;s cockpit, and the LED headlights, and back to the full view</li>
                <li><strong>Five paints</strong> that repaint the car and every window at once</li>
                <li><strong>The offer under the car:</strong> a monthly price, its terms, and an &ldquo;Offer details&rdquo; panel with lease and finance terms, Book a test drive, and Call us</li>
                <li><strong>A studio stage:</strong> a giant MUSTANG behind the car, drifting smoke that stirs when you point at the car, and wet, scuffed concrete with a soft shadow and reflection</li>
                <li><strong>A preloader</strong> built from the S650 / MUSTANG lockup, which lights up while the car loads</li>
                <li><strong>A phone version</strong> with the car full width, the windows in a row under it, and the offer as a bottom sheet</li>
                <li><strong>A spec strip:</strong> 5.0 L V8, 500 hp, rear-wheel drive, 6 or 10 speeds, 2+2 seating</li>
                <li><strong>A campaign kit:</strong> a launch email with the car turning in a GIF, seven-second spots in 9:16, 4:5, and 16:9, a 1920 × 600 website hero, display ads in six standard sizes (HTML5 with GSAP, GIF, and backup JPG), and stills of the three close-ups, all made from the same 3D car</li>
              </ul>
              <p>It&apos;s a spec ad: unofficial, not affiliated with Ford, and every price and term in it is sample content. Nothing can be booked from it.</p>
              <Cta inline />
              <Clip name="intro" caption="The preloader lights the lockup, then the car glides in under the word" />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>The ad hasn&apos;t run yet, so there are no click or lead numbers, and I won&apos;t make any up. What it delivers is a complete, working ad, accessible and light enough to load as one:</p>
              <CaseStats items={[
                { value: "100", label: "Accessibility" },
                { value: "100", label: "Best practices" },
                { value: "2.7 MB", label: "The 3D car, down from 26 MB" },
                { value: "0", label: "Accessibility violations" },
              ]} />
              <p>Lighthouse scores for the live ad. The licensed car model came as 26 MB of geometry and textures; trimmed, compressed, and with its textures resized, it loads at 2.7 MB. An axe audit (WCAG A and AA, plus best practices) at desktop, tablet, and phone widths, with motion on and off, finds no violations. Performance is the open item: Lighthouse reads 77 on desktop and 43 on a simulated phone, almost all of it from the 3D model and the shaders, and the fix is planned below. Once it runs, the numbers to watch are how long people stay on the ad, how many open a window or change the paint, and how many tap through to the offer and book a test drive.</p>

              <Desktop name="landing" caption="The ad" />
              <p><strong>Walk around the car.</strong> Drag the car and it turns all the way around and carries on a little when you let go, like a turntable. Point at it and the smoke behind it stirs. The giant word sits behind the car, so the car always reads first.</p>
              <Clip name="turn" caption="Turning the car and trying the paints" />
              <p><strong>Pick a color.</strong> The paint rail runs down the left edge. Each swatch repaints the car and the three windows together, and the paint keeps its metallic flake and clear coat in every color.</p>
              <CaseGrid layout="two">
                <Desktop name="red" caption="Signal Red" />
                <Desktop name="white" caption="Arctic White" />
                <Desktop name="yellow" caption="Volt Yellow" />
                <Desktop name="turned" caption="Storm Blue, turned to its side" />
              </CaseGrid>

              <p><strong>Look closer.</strong> The three windows down the right are live views of the same car: the taillights, the cockpit, and the headlights. Choose one and the main camera flies there; a Full view window then takes you back, as does Esc. Each window glows around its edge on hover, and on its first view the ad runs that glow around each window in turn, once, so people know they can open them.</p>
              <Clip name="windows" caption="Opening the three windows, then back to the full view" />
              <CaseGrid layout="two">
                <Desktop name="rear" caption="Tri-bar taillights" />
                <Desktop name="cockpit" caption="Driver's cockpit" />
              </CaseGrid>
              <Desktop name="lights" caption="LED headlights" />

              <p><strong>The offer, without leaving.</strong> &ldquo;Yours from $499 a month&rdquo; sits under the car the whole time. Offer details opens a glass panel with the lease and finance terms, who qualifies, and what isn&apos;t included, while the car glides aside and stays in view beside it. Book a test drive and Call us are the dealer&apos;s two actions.</p>
              <Clip name="offer" caption="Offer details" />
              <Desktop name="offer" caption="The offer panel, with the car beside it" />
              <p><strong>A preloader with the brand in it.</strong> While the car loads, the S650 / MUSTANG lockup draws in and its four slashes light one by one; once the car is ready, they all light, and the lockup lifts away.</p>
              <Desktop name="preloader" caption="The preloader" />
            </CaseSection>

            {/* 03 — Design Approach */}
            <CaseSection id="approach" number={3} title="Design Approach">
              <h3 className="cyril-case-subheading">Mobile-First, Enhanced for Desktop</h3>
              <p>Most people will see an ad like this on a phone, so the design starts there. The car fills the width of the screen with the name behind it, the three windows sit in a row underneath, and the paint choice is a small menu at the top. When a window opens, the offer glides down to make room instead of jumping. Offer details becomes a bottom sheet, and the car rises above it so it stays in view.</p>
              <CaseGrid layout="three">
                <Phone name="landing" caption="The ad on a phone" />
                <Phone name="cockpit" caption="A window opened" />
                <Phone name="paint" caption="Paint menu" />
                <Phone name="red" caption="Signal Red" />
                <Phone name="offer" caption="Offer details" />
                <CaseFigure src={`${P}tablet-landing.jpg`} alt="Mustang ad on a tablet" caption="Tablet" ratio="820 / 1180" />
              </CaseGrid>
              <CaseVideo src={`${P}phone.mp4`} caption="Turning, opening windows, and changing paint on a phone" size="phone" />
              <p>On a desktop, the same page is progressively enhanced. The windows move into a column beside the car, the paints become a rail down the left edge, the smoke becomes a live shader that stirs when you point at the car, the car leans slightly toward the pointer, and each window glows on hover. Nothing on the phone depends on any of it.</p>
              <h3 className="cyril-case-subheading">A Car Launch, on a Page</h3>
              <p>The layout follows a poster: the car in the middle of a dark studio, the model name huge behind it, the windows like a contact sheet down the side, and the price under the tires. The stage is wet, scuffed concrete with smoke drifting over it, so the car&apos;s paint and chrome have something to reflect, and the floor shows a short, faded reflection under the tires and a soft shadow, as a showroom floor would. The type is narrow and loud for the name (Big Shoulders, chosen from ten condensed faces), wide and mechanical for headings (Michroma), and plain for reading (Exo 2, chosen from nine side by side). One accent blue marks everything you can act on.</p>
              <h3 className="cyril-case-subheading">One Concept, Many Channels</h3>
              <p>The web page is one application of the idea, not the whole of it. The same stage, type, and car carry into a launch email, short spots for social, a website hero, and display ads: one creative concept with multiple applications, so the campaign looks and feels the same in the inbox, in the feed, on the dealer&apos;s site, and across the web. Every piece is in the <a className="cyril-dark" href={KIT} target="_blank" rel="noopener noreferrer">campaign kit</a>, with what it&apos;s for, its specs, and a download.</p>
              <CaseFigure src={`${P}desktop-kit.jpg`} alt="The Mustang campaign kit page: one concept, everywhere the buyer is" caption="The campaign kit" frame="browser" url={`${URL}/kit/`} />
              <p><strong>The email.</strong> A launch email for the dealer&apos;s list, built the way email has to be: tables and inline styles, a 600px column that stacks on phones, a button that holds up in Outlook, and web fonts only where the inbox allows them. The car turns at the top as a GIF: one full turn, looping, opening on the front three-quarter view, the only frame Outlook on Windows shows. Under it, the three close-ups from the ad&apos;s windows, the specs, and the offer, with every image and button leading back to the 3D ad.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}email-desktop.jpg`} alt="The Mustang launch email on a desktop" caption="The email, desktop" frame="browser" url={`${URL}/kit/email.html`} ratio="680 / 900" />
                <CaseFigure src={`${P}email-phone.jpg`} alt="The Mustang launch email on a phone" caption="The email, phone" size="phone" ratio="375 / 812" />
              </CaseGrid>
              <figure className="cyril-case-figure cyril-case-figure-full">
                <img src={`${KIT}mustang-email-turn.gif`} width="560" height="299" alt="The Mustang Dark Horse turning all the way around under a giant MUSTANG" loading="lazy" style={{ display: "block", width: "100%", maxWidth: 560, height: "auto", margin: "0 auto" }} />
                <figcaption className="cyril-upper">The email&apos;s GIF: one full turn, 1.3 MB</figcaption>
              </figure>
              <p><strong>Seven-second spots.</strong> Three sizes for social, recorded from the 3D car rather than animated separately, so they match the ad frame for frame: the car turns from its tail to the front three-quarter view, the giant word rises behind it, and the offer lands with a call to explore it in 3D. In the 9:16 spot, the copy stays clear of the top and bottom, where the apps draw their own buttons. To make them, the ad has a recording mode that drives the car from a clock instead of the pointer, so every take plays the same.</p>
              <CaseVideo src={`${KIT}mustang-spot-wide.mp4`} caption="16:9, for YouTube, X, LinkedIn, and the dealer's site" frame={false} />
              <CaseGrid layout="two">
                <CaseVideo src={`${KIT}mustang-spot-story.mp4`} caption="9:16, for Reels, Stories, and TikTok" size="phone" />
                <CaseVideo src={`${KIT}mustang-spot-feed.mp4`} caption="4:5, for Instagram and Facebook feeds" frame={false} />
              </CaseGrid>
              <p><strong>A hero for the dealer&apos;s website.</strong> A 1920 × 600 banner for the top of the dealer&apos;s home page, short enough to leave the inventory above the fold: the offer on the left and the car turning under MUSTANG on the right. It comes as an 8-second MP4 that loops without a seam (1 MB, the one to use), an HTML5 version in GSAP whose car turns again on hover, a GIF for places that don&apos;t allow video, and a still.</p>
              <CaseVideo src={`${KIT}hero/mustang-hero.mp4`} caption="The website hero, 1920 × 600" frame={false} />
              <p><strong>Display ads.</strong> The six standard sizes, from the 970 × 250 billboard to the 320 × 50 phone banner, each as an HTML5 ad, a GIF, and the backup image networks show when neither runs. In the HTML5 ads, one GSAP timeline spins the car into its front three-quarter view, lands the copy and the button, then turns the car once more and stops at about eleven seconds, inside the networks&apos; limits; the car turns again on hover. The car is a sprite sheet of 24 frames taken from the 3D model, crossfaded so the turn reads smoothly, and a script fits each ad under the 150 KB cap Google Ads sets, lowering image quality only as far as it needs to.</p>
              <figure className="cyril-case-figure cyril-case-figure-full">
                <img src={`${KIT}ads/mustang-970x250.gif`} width="970" height="250" alt="The 970 × 250 Mustang display ad: the car spinning into view beside the offer" loading="lazy" style={{ display: "block", width: "100%", height: "auto" }} />
                <figcaption className="cyril-upper">970 × 250 billboard, GIF</figcaption>
              </figure>
              <CaseGrid layout="two">
                <figure className="cyril-case-figure">
                  <img src={`${KIT}ads/mustang-300x600.gif`} width="300" height="600" alt="The 300 × 600 Mustang display ad" loading="lazy" style={{ display: "block", width: "100%", maxWidth: 300, height: "auto", margin: "0 auto" }} />
                  <figcaption className="cyril-upper">300 × 600 half page</figcaption>
                </figure>
                <figure className="cyril-case-figure">
                  <img src={`${KIT}ads/mustang-300x250.gif`} width="300" height="250" alt="The 300 × 250 Mustang display ad" loading="lazy" style={{ display: "block", width: "100%", maxWidth: 300, height: "auto", margin: "0 auto" }} />
                  <figcaption className="cyril-upper">300 × 250 medium rectangle</figcaption>
                </figure>
              </CaseGrid>
            </CaseSection>

            {/* 04 — Engineering */}
            <CaseSection id="engineering" number={4} title="Engineering">
              <p>Built with Next.js and React as a static page, with the 3D scene in three.js, loaded only when the page needs it.</p>
              <ul className="cyril-case-list">
                <li><strong>One canvas, four cameras:</strong> the main view and the three windows are drawn into one WebGL canvas, each camera into its own part of the screen. The slanted windows are cut to shape on the GPU, so the main view fills their corners and no seams show.</li>
                <li><strong>A licensed model, made to fit:</strong> the Dark Horse model (by livanovbog, CC BY 4.0) arrived with its doors, hood, and trunk open. A Blender script closes them, turns and centers the car, renames its materials so the page can repaint it, and compresses it with Draco, from 26 MB to 2.7 MB.</li>
                <li><strong>Materials that hold up close:</strong> metallic flake under a clear coat for the paint, a studio of light bars and softboxes for the reflections, and a floor shader for the wet concrete, its cracks, stains, and grain.</li>
                <li><strong>It only draws when something moves:</strong> the car renders while you drag, the camera flies, or the paint changes, and stops when everything settles. The smoke runs at reduced resolution and pauses when it&apos;s off screen or the tab is hidden.</li>
                <li><strong>No flicker:</strong> button hovers fade a layer instead of repainting, after a screen recording caught Chrome showing a stale frame mid-hover on another project.</li>
                <li><strong>Fallbacks:</strong> without WebGL, the ad shows a still of the car; phones get lighter CSS smoke; under reduced motion everything holds still.</li>
                <li><strong>Accessibility:</strong> the car turns with the arrow keys, the paints are a radio group with arrow-key navigation, the windows are buttons that say what they show, the offer panel is a native dialog that returns focus, and changes are announced to screen readers.</li>
              </ul>
            </CaseSection>

            {/* 05 — Learning & Next Steps */}
            <CaseSection id="learnings" number={5} title="Learning & Next Steps">
              <CaseLearnings
                learned={[
                  "Recording the social spots and the GIF from the live 3D car, on a clock, meant the email and the feed show exactly what the ad does, and a change to the car or the offer is a re-record, not a redraw.",
                  "I first built the car myself in Blender, from cross-sections traced over photos. A licensed model looked far better, and the work moved to making it fit the page: closing it up, renaming its parts, and getting it under 3 MB.",
                  "Small cues mattered more than big effects: one glow running around each window was enough to show people they can open them, where a constant pulse read as a notification.",
                  "A dark, moody stage needs care everywhere: the reflection, the floor, and the shadows each took several rounds before the car looked like it was standing on something.",
                ]}
                next={[
                  "Run the kit with the dealer: send the email to a test list and compare its subject lines, and try the spots' first second against a still of the car; set the display ads' click-through to the dealer's page and compare the HTML5 ads with the GIFs.",
                  "Bring phone performance up: lift the preloader on the fonts and show a still of the car until the 3D one is ready, ship the smoke and grit as image files, and serve a lighter model to phones.",
                  "Put in the dealer's real offer, phone number, and test-drive booking, and its own photos for the share image.",
                  "Measure time on the ad, windows opened, paints tried, and taps through to the offer, then test which first view keeps people longest.",
                  "Add the trims and their prices, and let the paint carry through to the offer.",
                ]}
              />
            </CaseSection>

            <Cta />

          </CaseLayout>

          <CaseNext
            href="/viteo"
            title="Viteo"
            category="Product Design & Development"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
