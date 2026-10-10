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
import {
  BrandLogos,
  BrandClearSpace,
  BrandSwatches,
  BrandLettering,
  BrandUsage,
} from "@/components/case/BrandGuide";
import { thumbFor } from "@/components/imageProps";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "brand", label: "Brand Identity" },
  { id: "design-development", label: "Design & Development" },
  { id: "learnings", label: "Learning and Reflection" },
];

// Brand guide data. Colors are sampled from the delivered artwork; crop boxes
// are [x, y, width, height] in the 1024 × 1024 logo file.
const LOGO = "/img/portfolio/grace-stream_logo-2.jpg";
const LOGO_REVERSED = "/img/portfolio/grace-stream_logo.jpg";
const LOGO_ARROWS = "/img/portfolio/grace-stream_logo-1.jpg";
const HERO = "/img/portfolio/main_grace-stream.jpg";
const LOGO_SIZE = [1024, 1024];

const LOGOS = [
  { src: LOGO, name: "Deep Blue on White", ground: "White", use: "The default: print, the GTY app, podcasts and anywhere on a light background." },
  { src: LOGO_REVERSED, name: "White on Blue", ground: "Photo with a blue overlay", use: "Social graphics and app artwork, where a photo sits behind the logo." },
  { src: HERO, name: "White on Photography", ground: "A calm, dark area of a photo", use: "Website heroes and event screens, with the logo over an even patch of the image." },
];

const COLORS = [
  { name: "Deep Blue", hex: "#345171", rgb: "52 81 113", role: "The logo on white. Calm and trustworthy, hinting at water and depth; 8.2:1 on white." },
  { name: "Overlay Blue", hex: "#1E4181", rgb: "30 65 129", role: "The blue laid over photography behind the white logo, shown here at its deepest." },
  { name: "White", hex: "#FFFFFF", rgb: "255 255 255", role: "The ground for the blue logo, and the logo itself over photos." },
];

const TYPE = [
  { name: "\u201cGrace\u201d \u2014 Bold", box: [229, 286, 552, 131], fit: "86%", role: "A bold sans-serif that gives the name presence and strength." },
  { name: "\u201cStream\u201d \u2014 Light", box: [302, 465, 411, 74], fit: "64%", role: "A lighter, tracked-out weight that complements \u201cGrace\u201d without competing." },
];

const CLEAR_SPECS = [
  { label: "Clear space", value: "One eighth of the circle\u2019s width (x) on every side." },
  { label: "Minimum size", value: "64px wide on screen, 0.75 in (19 mm) in print, so the three waves stay distinct." },
  { label: "Over photos", value: "Only on a calm, even area; add the blue overlay when the photo is busy." },
];

// the logo files are square; `cyril-brand-contain` shows them whole in the
// wide usage tiles (the hero photo still fills its tile)
const art = (src, className = "") => <img className={className} src={thumbFor(src)} alt="" loading="lazy" decoding="async" />;
const logoArt = (src, className = "") => art(src, `cyril-brand-contain ${className}`);

const USAGE = [
  { ok: true, label: "Use the deep blue logo on white.", visual: logoArt(LOGO) },
  { ok: true, label: "Use the white logo over a calm area of a photo.", visual: art(HERO) },
  { ok: false, label: "Stretch, squash or skew the circle.", visual: logoArt(LOGO, "cyril-brand-stretch") },
  { ok: false, label: "Change the blue to another color.", visual: logoArt(LOGO, "cyril-brand-recolor") },
  { ok: false, label: "Use the retired Arrows version.", visual: logoArt(LOGO_ARROWS) },
  { ok: false, label: "Put the white-ground artwork on a dark background.", visual: <div className="cyril-brand-onblack">{art(LOGO)}</div> },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gracestream');
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

  // Function to handle back navigation and save scroll position
  const handleBackToPortfolio = () => {
    // Get the project ID or identifier
    const projectId = 'gracestream'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Branding, Design, & Development"
            detail="24/7 Broadcast Platform"
            title="Grace Stream"
            summary={CASE_SUMMARIES["/grace-stream"]}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Product Designer & Web Developer" },
              { label: "Website", value: <a className="cyril-dark" href="https://www.gty.org/listen/gracestream" target="_blank">gty.org/listen/gracestream</a> },
              { label: "Platform & Tools", value: "Radio.co" },
            ]}
            image="/img/portfolio/main_grace-stream.jpg"
            imageAlt="Main Image for Grace Stream"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Listeners needed uninterrupted access to biblically sound preaching&mdash;during a morning commute, throughout a workday, or in quiet evening moments. Grace to You created Grace Stream, a 24/7 online broadcasting platform featuring continuous teaching from John MacArthur's extensive library of sermons, to meet that need.</p>
              <p>This project was about building something quietly powerful. Not flashy. Not overdone. Just a digital space where truth can stream 24/7&mdash;and people can tune in without distraction. As both the Product Designer and Web Developer, I set out to create an experience that is clean, approachable, and timeless.</p>
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results &amp; Impact">
              <p>Grace Stream is live as a 24/7 broadcast of John MacArthur's teaching: a looping playlist on Radio.co, a player customized to the GTY design language, and &ldquo;Now Playing&rdquo; info that updates dynamically. The ministry chose the Wave logo, which I used for all digital and print assets. Check out how <a className="cyril-accent" href="https://www.gty.org/listen/gracestream" target="_blank"><strong>Grace Stream</strong></a> offers continuous, scripture-rich content that's always available.</p>
            </CaseSection>

            {/* 03 — Brand Identity */}
            <CaseSection id="brand" number={3} title="Brand Identity">
              <h3 className="cyril-case-subheading">Concept</h3>
              <p>Grace Stream isn't just another media player&mdash;it's a 24/7 stream of John MacArthur's verse-by-verse teaching. That clarity and consistency inspired a branding approach that is simple, strong, and steady. The wordmark is intentionally understated: it fits within the larger GTY brand ecosystem but has enough personality to stand on its own, like a &ldquo;channel&rdquo; you can always trust. I wanted to capture movement, peace, and spiritual depth, clean and versatile for print and digital, and explored two options.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/grace-stream_logo-1.jpg" alt="Grace Stream Logo 1" caption="Logo, Version 1" />
                <CaseFigure src="/img/portfolio/grace-stream_logo-2.jpg" alt="Grace Stream Logo 2" caption="Logo, Version 2" />
              </CaseGrid>
              <p><strong>Logo, version 1 &mdash; The Arrows Design:</strong> Built around continuous movement, with a digital-forward feel for an app icon or loading screen. The open circle with arrows suggests ongoing flow and content that is never-ending, always accessible, always looping back. It has a more tech-savvy, dynamic energy.</p>
              <p><strong>Logo, version 2 &mdash; The Wave Design:</strong> A circle for wholeness, unity, and continuity, with three flowing wave lines inside to symbolize a stream: not static, but always in motion, always available. A bold sans-serif for &ldquo;GRACE&rdquo; gives presence and strength, and a lighter type for &ldquo;STREAM&rdquo; complements it. It feels grounded and serene.</p>
              <p>Only one would represent the brand, and the ministry decided on the Wave logo. Depending on where Grace Stream shows up&mdash;a worship service, the GTY app, a podcast, a digital community, or a conference&mdash;the brand shows up consistently but appropriately tailored.</p>
              <CaseFigure src="/img/portfolio/grace-stream_logo.jpg" alt="Grace Stream Logo" caption="Grace Stream Logo" size="text" />

              <h3 className="cyril-case-subheading">Logo Suite</h3>
              <p>The Wave logo is one roundel, used in three ways: deep blue on white, and white over photography, with or without a blue overlay.</p>
              <BrandLogos items={LOGOS} ratio="1 / 1" />
              <h3 className="cyril-case-subheading">Clear Space &amp; Size</h3>
              <p>The circle needs room around it to read as a calm, whole shape, and enough size for the three waves to stay separate.</p>
              <BrandClearSpace src={LOGO} box={[30, 32, 960, 960]} size={LOGO_SIZE} specs={CLEAR_SPECS} />

              <h3 className="cyril-case-subheading">Color</h3>
              <p>A deep blue brings calm and trust and hints at water without being too literal. Over photos, the logo turns white and a blue overlay keeps the image quiet behind it.</p>
              <BrandSwatches colors={COLORS} />

              <h3 className="cyril-case-subheading">Typography</h3>
              <p>Two weights of one sans-serif make up the name, so it reads as a single, steady channel name.</p>
              <BrandLettering src={LOGO} size={LOGO_SIZE} items={TYPE} />

              <h3 className="cyril-case-subheading">Usage</h3>
              <p>A few rules keep Grace Stream consistent wherever it shows up: a worship service, the GTY app, a podcast or a conference.</p>
              <BrandUsage items={USAGE} />

              <h3 className="cyril-case-subheading">Merchandise</h3>
              <p>To carry Grace Stream beyond the screen, I extended the identity onto merchandise concepts: a sweatshirt, a mug, a cap, and a tote. The roundel works as a simple print or patch in deep blue on light goods, and reverses to white on dark ones.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/grace-stream_merch-sweatshirt.jpg" alt="Grace Stream sweatshirt" caption="Sweatshirt" />
                <CaseFigure src="/img/portfolio/grace-stream_merch-mug.jpg" alt="Grace Stream mug" caption="Mug" />
              </CaseGrid>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/grace-stream_merch-cap.jpg" alt="Grace Stream cap" caption="Cap" />
                <CaseFigure src="/img/portfolio/grace-stream_merch-tote.jpg" alt="Grace Stream tote bag" caption="Tote" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — Design & Development */}
            <CaseSection id="design-development" number={4} title="Design &amp; Development">
              <h3 className="cyril-case-subheading">UX/UI Design</h3>
              <p>The user experience was all about minimizing friction. Even on a minimal page, every pixel was intentional: the background textures and the soft lighting around the player module reinforce calm, focus, and trust. I leaned into subtle gradients and soft neutrals, avoiding trendy styles so the experience stays classic and enduring, just like the content. This page is about listening, not browsing.</p>
              <p>Everything is mobile-first, since many users tune in while driving or working. The interface loads fast and avoids heavy visuals or complex interactions. The &ldquo;Stream Now&rdquo; section gives just enough context, and the CTA is always accessible without being pushy.</p>
              <CaseFigure src="/img/portfolio/grace-stream_mobile-view.jpg" alt="Grace Stream Mobile View" caption="Mobile View" ratio="3 / 4" size="text" />

              <h3 className="cyril-case-subheading">Development &amp; Integration of the 24/7 Stream</h3>
              <p>Working with a Back-End Developer, I handled the front-end development, focusing on performance, responsiveness, and real-time functionality, keeping the stream information current and the media player consistent across devices and browsers. Accessibility was a priority&mdash;every listener should have access, regardless of how they interact with the page.</p>
              <p>The key challenge was delivering a true 24/7 live audio experience that just works, no matter when a listener tunes in. <a className="cyril-accent" target="_blank" href="https://radio.co"><strong>Radio.co</strong></a> provided the backend infrastructure: its reliability, scheduling features, and embeddable player gave us a &#8220;set-it-and-forget-it&#8221; stream that still offers control over what goes out and when. The Internet Ministry Coordinator, Digital Platforms Director, and I curated a looping playlist of John MacArthur's sermons across a wide range of books and topics, and used Radio.co's scheduling tools so the stream feels like a real-time broadcast rather than a simple playlist.</p>
              <p>I then customized the embedded player to match the Grace Stream design system, stripping away anything off-brand or generic, and wrapped it in a custom UI that fetches current track metadata from the Radio.co API to update the &#8220;Now Playing&#8221; info, so users can see which sermon is airing even if they jump in mid-message.</p>
              <p>Because Grace Stream is &#8220;always on,&#8221; uptime and performance were non-negotiable. The Back-end Engineer and I implemented fallback behaviors for the player and ensured smooth cross-browser playback, even on mobile and lower-powered devices. Press play, and it just works.</p>
              <CaseFigure src="/img/portfolio/grace-stream_website.jpg" alt="Grace Stream Website" caption="Website" />
            </CaseSection>

            {/* 05 — Learning and Reflection */}
            <CaseSection id="learnings" number={5} title="Learning and Reflection">
              <CaseLearnings
                learned={[
                  "Presenting two logo concepts, each with its own rationale, let the ministry choose the direction that would represent the brand.",
                  "Building the broadcast on Radio.co let me put my effort into the player and the listening experience rather than the streaming infrastructure.",
                  "For an always-on product, uptime is a design requirement, which is why the Back-end Engineer and I built fallback behaviors into the player.",
                ]}
                reflection={
                  <p>As the Product Designer &amp; Web Developer for Grace Stream, I embraced the challenge of building a 24/7 online broadcasting platform that feels &ldquo;quietly powerful&rdquo;&mdash;not flashy or overdone, but a digital space where biblical truth streams without interruption and listeners can tune in without distraction. Working as a cross-functional partner to the Back-End Developer, Internet Ministry Coordinator, and Digital Platforms Director, Grace Stream reinforced that effective product design isn&apos;t just about UI polish but about orchestrating technology, content, and mission-aligned strategy to deliver an experience that just works anytime, anywhere.</p>
                }
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-dashboard"
            title="GTY Dashboard"
            category="Design & Development"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
