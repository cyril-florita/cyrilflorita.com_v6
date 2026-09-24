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

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "branding", label: "Branding" },
  { id: "ux-ui-design", label: "UX/UI Design" },
  { id: "web-development", label: "Development" },
  { id: "reflection", label: "Reflection" },
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
              { label: "Website", value: <a className="cyril-dark" href="https://www.gty.org/broadcasts/gracestream" target="_blank">gty.org/broadcasts/gracestream</a> },
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

            {/* 03 — UX/UI Design */}
            <CaseSection id="ux-ui-design" number={3} title="UX/UI Design">
              <p>The user experience was all about minimizing friction. Even though this is a minimal page, every pixel was intentional. From the background textures to the soft lighting around the player module, I wanted the visuals to reinforce a sense of calm, focus, and trust. The background photo I picked captures the essence of the brand. I leaned into subtle gradients and soft neutrals, avoiding any overly trendy styles so that the experience stays classic and enduring, just like the content. It's a design that gets out of the way but still feels polished and complete. This page is about listening, not browsing.</p>
              <CaseQuote>
                This page is about listening, not browsing.
              </CaseQuote>
              <p>Everything is optimized to be mobile-first, since many users might tune in while driving, working, or doing other tasks. Every touchpoint&mdash;from the play button to the info modals&mdash;is streamlined for quick access and readability. The interface is built to load fast, get out of the way, and let the stream take center stage. I intentionally avoided heavy visuals or complex interactions. The “Stream Now” section gives users just enough context without overwhelming them, and the CTA is always accessible without being pushy.</p>
              <CaseFigure src="/img/portfolio/grace-stream_mobile-view.jpg" alt="Grace Stream Mobile View" caption="Mobile View" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 04 — Web Development, & Integration of 24/7 Seamless Stream */}
            <CaseSection id="web-development" number={4} title="Web Development &amp; Integration of 24/7 Seamless Stream">
              <p>This was a lean build, but a thoughtful one. Working with a Back-End Developer, I handled the front-end development, focusing on performance, responsiveness, and real-time functionality for the stream. We implemented logic to keep the stream information current, and made sure the media player behaves consistently across devices and browsers. Accessibility standards were a priority&mdash;every listener should have access, regardless of how they interact with the page.</p>
              <p>As both the front-end developer and product designer, I wanted to integrate this broadcast system in a way that felt completely native to the Grace to You ecosystem—visually, functionally, and technically. One of the key challenges in building Grace Stream was delivering a true 24/7 live audio experience—a never-ending loop of expository preaching that just works, no matter when a listener tunes in. That's where <a className="cyril-accent" target="_blank" href="https://radio.co"><strong>Radio.co</strong></a> came in. Radio.co provided the perfect backend infrastructure for this kind of continuous audio broadcast. Its reliability, scheduling features, and embeddable player gave us the foundation we needed for a &#8220;set-it-and-forget-it&#8221; style stream that still offers control over what content goes out and when.</p>
              <p>The Internet Ministry Coordinator, Digital Platforms Director, and I started by curating a looping playlist of John MacArthur's sermons&mdash;designed to play continuously, covering a wide range of books and topics, with carefully scheduled transitions and breaks. Using Radio.co's scheduling tools, we were able to set it up so the stream feels like a real-time broadcast, rather than a simple playlist.</p>
              <p>From there, I customized the embedded player to match the design system of Grace Stream. I stripped away anything that felt off-brand or overly generic, styling the player with a minimal look that sits cleanly within the GTY design language. I also wrapped the stream in a custom UI that dynamically updates the &#8220;Now Playing&#8221; info. This required building a lightweight front-end component that fetches current track metadata from the Radio.co API, so users can always see which sermon is airing—even if they jump in mid-message.</p>
              <p>Because Grace Stream is meant to be &#8220;always on,&#8221; uptime and performance were non-negotiable. The Back-end Engineer and I implemented fallback behaviors for the player and ensured smooth cross-browser playback, even on mobile and lower-powered devices. Everything had to feel instant and reliable. Press play, and it just works—whether you're on your phone in traffic or at your desk looking for background teaching. The end result is an experience that feels as seamless and stable as a traditional radio station, but with all the benefits of modern streaming and a web-native design.</p>
              <CaseFigure src="/img/portfolio/grace-stream_website.jpg" alt="Grace Stream Website" caption="Website" />
              <p>Check out how <a className="cyril-accent" href="https://www.gty.org/broadcasts/gracestream" target="_blank"><strong>Grace Stream</strong></a> offers continuous, scripture-rich content that's always available.</p>
            </CaseSection>

            {/* 05 — Reflection */}
            <CaseSection id="reflection" number={5} title="Reflection">
              <p>As the Product Designer & Web Developer for Grace Stream, I embraced the challenge of building a 24/7 online broadcasting platform that feels “quietly powerful”&mdash;not flashy or overdone, but a digital space where biblical truth streams without interruption and listeners can tune in without distraction. From the outset, I focused on delivering constant access to faithful Bible teaching, presented in a way that's clean, approachable, and timeless by crafting a minimal interface where every pixel was intentional, leveraging subtle gradients and soft neutrals to reinforce calm, focus, and trust—allowing the stream to take center stage and minimizing friction across devices and contexts.</p>
              <p>As a cross-functional partner to the Back-End Developer, Internet Ministry Coordinator, and Digital Platforms Director, I curated a looping playlist of John MacArthur's sermons and integrated a set-it-and-forget-it live audio experience via Radio.co, customizing the embeddable player to match the GTY design language and dynamically update the “Now Playing” info. Grace Stream reinforced that effective product design isn't just about UI polish but about orchestrating technology, content, and mission-aligned strategy to deliver an experience that just works anytime, anywhere.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-dashboard"
            title="GTY Dashboard"
            category="UI Design & Front-End"
            image="/img/portfolio/thumb_gty-dashboard.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
