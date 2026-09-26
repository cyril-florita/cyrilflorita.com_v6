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
  CaseQuote,
  CaseNext,
} from "@/components/case/CaseStudy";
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
  { id: "branding", label: "Branding" },
  { id: "logo-suite", label: "Logo Suite" },
  { id: "color", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "usage", label: "Usage" },
  { id: "ux-ui-design", label: "UX/UI Design" },
  { id: "web-development", label: "Development" },
  { id: "reflection", label: "Reflection" },
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

const page = () => {

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
            category="Branding/UI/UX/Web"
            detail="24/7 Broadcast Platform"
            title="Grace Stream"
            summary="Designing and building Grace to You's 24/7 online broadcasting platform—a digital space where truth can stream 24/7 and people can tune in without distraction."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Product Designer & Web Developer" },
              { label: "Website", value: <a className="cyril-dark" href="https://www.gty.org/listen/gracestream" target="_blank">gty.org/listen/gracestream</a> },
              { label: "Tools", value: "Radio.co" },
            ]}
            image="/img/portfolio/main_grace-stream.jpg"
            imageAlt="Main Image for Grace Stream"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>Grace Stream is a 24/7 online broadcasting platform created by Grace to You, featuring continuous teaching from John MacArthur's extensive library of sermons. Designed to provide uninterrupted access to biblically sound preaching, Grace Stream serves as a powerful resource for spiritual growth, encouragement, and discipleship. Whether you're tuning in during your morning commute, throughout your workday, or during quiet evening moments, Grace Stream delivers clear, uncompromising truth directly from God's Word&mdash;anytime, anywhere.</p>
              <p>This project was about building something quietly powerful. Not flashy. Not overdone. Just a digital space where truth can stream 24/7&mdash;and people can tune in without distraction. As both the Product Designer and Web Developer, I set out to create an experience that reflects the heart of what this feature offers&mdash;constant access to faithful Bible teaching, presented in a way that's clean, approachable, and timeless.</p>
            </CaseSection>

            {/* 02 — Concept, Branding, & Visual Identity */}
            <CaseSection id="branding" number={2} title="Concept, Branding, &amp; Visual Identity">
              <p>Grace Stream isn't just another media player—it's a 24/7 stream of John MacArthur's verse-by-verse teaching. That clarity and consistency inspired the branding approach: simple, strong, and steady. The Grace Stream wordmark is intentionally understated. It fits within the larger GTY brand ecosystem but has just enough of its own personality to stand on its own. It's designed to feel like a “channel” you can always trust. So for the logo, I knew I wanted to capture a sense of movement, peace, and spiritual depth — all while keeping things clean, modern, and versatile for both print and digital platforms. I then explored two options.</p>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/grace-stream_logo-1.jpg" alt="Grace Stream Logo 1" caption="Logo, Version 1" />
                <CaseFigure src="/img/portfolio/grace-stream_logo-2.jpg" alt="Grace Stream Logo 2" caption="Logo, Version 2" />
              </CaseGrid>
              <p><strong>Logo, version 1 &mdash; The Arrows Design:</strong> This one was about continuous movement. I wanted to create a more digital-forward feel, something that would look great on an app icon or loading screen. The open circle with arrows suggests ongoing flow, continuity, and even interactivity. It also plays into the concept of streaming itself — content that's never-ending, always accessible, always looping back in meaningful ways. The typography here was intentional to keep a strong, consistent identity across different logo uses. But visually, this one has a more tech-savvy, dynamic energy. It feels like it could sit comfortably in a UI alongside modern apps, and still carry that deeper meaning of grace moving through life.</p>
              <p><strong>Logo, version 2 &mdash; The Wave Design:</strong> With this one, I started with a circle because it represents wholeness, unity, and continuity — which seemed really aligned with the core message of grace. Inside that circle, I used three flowing wave lines to symbolize the idea of a stream — something constantly moving, refreshing, and full of life. It felt like a natural metaphor for grace itself: not static, but always in motion, always available. I chose a deep blue because it brings calm and trust — it also hints at water and depth without being too literal. For the typography, I went with a bold sans-serif for “GRACE” to give it presence and strength, and a lighter type for “STREAM” to complement it without competing. I love how this version feels grounded and serene — perfect for contexts where the objective, yet emotional tone needs to capture people's attention.</p>
              <p>Both of these logos were built as part of a broader visual identity system, where the goal is to have flexibility: one logo feels more grounded and organic, the other more dynamic and functional. Yet only one would represent the brand. And so the ministry decided on the Wave logo, which I then used for all digital and print assets. Depending on where Grace Stream shows up&mdash;whether it's a worship service, the GTY app, a podcast, a digital community, or at a conference — the brand can show up consistently but appropriately tailored.</p>
              <CaseFigure src="/img/portfolio/grace-stream_logo.jpg" alt="Grace Stream Logo" caption="Grace Stream Logo" size="text" />
            </CaseSection>

            {/* 03 — Logo Suite */}
            <CaseSection id="logo-suite" number={3} title="Logo Suite">
              <p>The Wave logo is one roundel, used in three ways: deep blue on white, and white over photography, with or without a blue overlay.</p>
              <BrandLogos items={LOGOS} ratio="1 / 1" />
              <h3 className="cyril-case-subheading">Clear Space &amp; Size</h3>
              <p>The circle needs room around it to read as a calm, whole shape, and enough size for the three waves to stay separate.</p>
              <BrandClearSpace src={LOGO} box={[30, 32, 960, 960]} size={LOGO_SIZE} specs={CLEAR_SPECS} />
            </CaseSection>

            {/* 04 — Color */}
            <CaseSection id="color" number={4} title="Color">
              <p>A deep blue brings calm and trust and hints at water without being too literal. Over photos, the logo turns white and a blue overlay keeps the image quiet behind it.</p>
              <BrandSwatches colors={COLORS} />
            </CaseSection>

            {/* 05 — Typography */}
            <CaseSection id="typography" number={5} title="Typography">
              <p>Two weights of one sans-serif make up the name, so it reads as a single, steady channel name.</p>
              <BrandLettering src={LOGO} size={LOGO_SIZE} items={TYPE} />
            </CaseSection>

            {/* 06 — Usage */}
            <CaseSection id="usage" number={6} title="Usage">
              <p>A few rules keep Grace Stream consistent wherever it shows up: a worship service, the GTY app, a podcast or a conference.</p>
              <BrandUsage items={USAGE} />
            </CaseSection>

            {/* 07 — UX/UI Design */}
            <CaseSection id="ux-ui-design" number={7} title="UX/UI Design">
              <p>The user experience was all about minimizing friction. Even though this is a minimal page, every pixel was intentional. From the background textures to the soft lighting around the player module, I wanted the visuals to reinforce a sense of calm, focus, and trust. The background photo I picked captures the essence of the brand. I leaned into subtle gradients and soft neutrals, avoiding any overly trendy styles so that the experience stays classic and enduring, just like the content. It's a design that gets out of the way but still feels polished and complete. This page is about listening, not browsing.</p>
              <CaseQuote>
                This page is about listening, not browsing.
              </CaseQuote>
              <p>Everything is optimized to be mobile-first, since many users might tune in while driving, working, or doing other tasks. Every touchpoint&mdash;from the play button to the info modals&mdash;is streamlined for quick access and readability. The interface is built to load fast, get out of the way, and let the stream take center stage. I intentionally avoided heavy visuals or complex interactions. The “Stream Now” section gives users just enough context without overwhelming them, and the CTA is always accessible without being pushy.</p>
              <CaseFigure src="/img/portfolio/grace-stream_mobile-view.jpg" alt="Grace Stream Mobile View" caption="Mobile View" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 08 — Web Development, & Integration of 24/7 Seamless Stream */}
            <CaseSection id="web-development" number={8} title="Web Development &amp; Integration of 24/7 Seamless Stream">
              <p>This was a lean build, but a thoughtful one. Working with a Back-End Developer, I handled the front-end development, focusing on performance, responsiveness, and real-time functionality for the stream. We implemented logic to keep the stream information current, and made sure the media player behaves consistently across devices and browsers. Accessibility standards were a priority&mdash;every listener should have access, regardless of how they interact with the page.</p>
              <p>As both the front-end developer and product designer, I wanted to integrate this broadcast system in a way that felt completely native to the Grace to You ecosystem—visually, functionally, and technically. One of the key challenges in building Grace Stream was delivering a true 24/7 live audio experience—a never-ending loop of expository preaching that just works, no matter when a listener tunes in. That's where <a className="cyril-accent" target="_blank" href="https://radio.co"><strong>Radio.co</strong></a> came in. Radio.co provided the perfect backend infrastructure for this kind of continuous audio broadcast. Its reliability, scheduling features, and embeddable player gave us the foundation we needed for a &#8220;set-it-and-forget-it&#8221; style stream that still offers control over what content goes out and when.</p>
              <p>The Internet Ministry Coordinator, Digital Platforms Director, and I started by curating a looping playlist of John MacArthur's sermons&mdash;designed to play continuously, covering a wide range of books and topics, with carefully scheduled transitions and breaks. Using Radio.co's scheduling tools, we were able to set it up so the stream feels like a real-time broadcast, rather than a simple playlist.</p>
              <p>From there, I customized the embedded player to match the design system of Grace Stream. I stripped away anything that felt off-brand or overly generic, styling the player with a minimal look that sits cleanly within the GTY design language. I also wrapped the stream in a custom UI that dynamically updates the &#8220;Now Playing&#8221; info. This required building a lightweight front-end component that fetches current track metadata from the Radio.co API, so users can always see which sermon is airing—even if they jump in mid-message.</p>
              <p>Because Grace Stream is meant to be &#8220;always on,&#8221; uptime and performance were non-negotiable. The Back-end Engineer and I implemented fallback behaviors for the player and ensured smooth cross-browser playback, even on mobile and lower-powered devices. Everything had to feel instant and reliable. Press play, and it just works—whether you're on your phone in traffic or at your desk looking for background teaching. The end result is an experience that feels as seamless and stable as a traditional radio station, but with all the benefits of modern streaming and a web-native design.</p>
              <CaseFigure src="/img/portfolio/grace-stream_website.jpg" alt="Grace Stream Website" caption="Website" />
              <p>Check out how <a className="cyril-accent" href="https://www.gty.org/listen/gracestream" target="_blank"><strong>Grace Stream</strong></a> offers continuous, scripture-rich content that's always available.</p>
            </CaseSection>

            {/* 09 — Reflection */}
            <CaseSection id="reflection" number={9} title="Reflection">
              <p>As the Product Designer & Web Developer for Grace Stream, I embraced the challenge of building a 24/7 online broadcasting platform that feels “quietly powerful”&mdash;not flashy or overdone, but a digital space where biblical truth streams without interruption and listeners can tune in without distraction. From the outset, I focused on delivering constant access to faithful Bible teaching, presented in a way that's clean, approachable, and timeless by crafting a minimal interface where every pixel was intentional, leveraging subtle gradients and soft neutrals to reinforce calm, focus, and trust—allowing the stream to take center stage and minimizing friction across devices and contexts.</p>
              <p>As a cross-functional partner to the Back-End Developer, Internet Ministry Coordinator, and Digital Platforms Director, I curated a looping playlist of John MacArthur's sermons and integrated a set-it-and-forget-it live audio experience via Radio.co, customizing the embeddable player to match the GTY design language and dynamically update the “Now Playing” info. Grace Stream reinforced that effective product design isn't just about UI polish but about orchestrating technology, content, and mission-aligned strategy to deliver an experience that just works anytime, anywhere.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-app-landing"
            title="GTY App Landing Page"
            category="Web Design & Front-End"
            image="/img/portfolio/thumb_gty-app-landing.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
