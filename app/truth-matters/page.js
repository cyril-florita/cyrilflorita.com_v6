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
  { id: "graphics", label: "Graphics & Media" },
  { id: "ux-web", label: "UX & Web" },
  { id: "reflection", label: "Reflection" },
];

const page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'truthmatters');
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
    const projectId = 'truthmatters'; // This is the current project

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
            detail="Podcast Brand & Website"
            title="Truth Matters Podcast"
            summary="Creating the brand, UX/UI design, and website for Grace to You's Truth Matters Podcast—a digital experience as grounded and compelling as the content itself."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Product Designer & Web Developer" },
              { label: "Website", value: <a className="cyril-dark" href="https://truthmatterspodcast.gty.org" target="_blank">truthmatterspodcast.gty.org</a> },
              { label: "Platform", value: "WordPress" },
            ]}
            image="/img/portfolio/main_truth-matters-podcast.jpg"
            imageAlt="Truth Matters Podcast Wide"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>The Truth Matters Podcast is a media production by Grace to You. In each episode, host Darrell Harrison welcomes a guest to explore a featured resource from the Grace to You collection—whether it's a book, sermon, or blog series by John MacArthur. Together, they dive into the inspiration behind the resource, its core message, and why it still matters for the church today.</p>
              <p>As the Product Designer and Developer behind the Truth Matters Podcast, my goal was to create a digital experience that felt as grounded and compelling as the content itself. This project was one of those many projects for Grace to You where I got to wear many hats and ensure every touchpoint—from the logo to the episode pages—told a consistent story. It brought together three core roles I love: branding, UX/UI design, and front-end development.</p>
            </CaseSection>

            {/* 02 — Branding */}
            <CaseSection id="branding" number={2} title="Branding &amp; Visual Identity">
              <p>From the start, I wanted the branding to echo the tone of the podcast—casual, yet theologically serious, thoughtful, and grounded in biblical truth. The logo is minimal yet strong, designed to reflect clarity and conviction that you would expect from Grace to You. I stuck to a muted, sophisticated color palette (deep charcoal, soft neutrals) to reinforce the show's tone: no hype, just truth. Typography was critical too&mdash;consistent with Grace to You's style, sharp, readable fonts that convey authority without being loud.</p>
              <CaseQuote>
                No hype, just truth.
              </CaseQuote>
              <CaseFigure src="/img/portfolio/main_truth-matters-podcast.jpg" alt="Truth Matters Podcast Wide" caption="Truth Matters Podcast" />
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/truth-matters_logo.jpg" alt="Truth Matters Podcast Logo" caption="Logo" />
                <CaseFigure src="/img/portfolio/truth-matters_icon.jpg" alt="Truth Matters Podcast Icon" caption="Icon" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/truth-matters_mug.jpg" alt="Truth Matters Podcast Mug" caption="Mug" size="text" />
            </CaseSection>

            {/* 03 — Graphics & Supporting Media */}
            <CaseSection id="graphics" number={3} title="Graphics &amp; Supporting Media">
              <p>Each podcast episode has its own hero product/imagery and thematic layout, designed to reflect the subject matter while staying true to the brand system. I created all the assets in-house, including episode thumbnails, podcast artwork, website banners, and social share images. These were crafted to feel cohesive yet distinctive, giving each episode a unique identity within the larger Truth Matters Podcast brand.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/truth-matters_youtube-thumb-1.jpg" alt="Truth Matters Podcast YouTube Thumb 1" caption="YouTube Thumbnail 1" />
                <CaseFigure src="/img/portfolio/truth-matters_youtube-thumb-2.jpg" alt="Truth Matters Podcast YouTube Thumb 2" caption="YouTube Thumbnail 2" />
              </CaseGrid>
              <CaseGrid layout="offset">
                <CaseFigure src="/img/portfolio/truth-matters_episode-artwork-1.jpg" alt="Truth Matters Podcast Episode Artwork 1" caption="Episode Artwork 1" />
                <CaseFigure src="/img/portfolio/truth-matters_episode-artwork-2.jpg" alt="Truth Matters Podcast Episode Artwork 2" caption="Episode Artwork 2" />
              </CaseGrid>
              <CaseFigure src="/img/portfolio/truth-matters_apple-podacast.png" alt="Truth Matters Apple Podcast" caption="Apple Podcast" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 04 — UX Design, Web Development, & Podcast Integration */}
            <CaseSection id="ux-web" number={4} title="UX Design, Web Development, &amp; Podcast Integration">
              <p>The user journey was my next focus. With leadership from the Digital Platforms Director and collaboration with the Senior Software Architect, I developed the site using WordPress for a more practical content publication and management. I designed the site to be clean, minimal, content-first, and easy to navigate. It's built with a focus on SEO and accessibility, ensuring that the podcast is easily discoverable, playable, and engaging for all audiences. I kept the UI minimal so the podcast episodes and visuals could shine. There's the ability for the user to engage by leaving a comment or sharing the episode on social media. I also built a fully responsive experience that works seamlessly on mobile—because I knew a lot of listeners would be discovering this on the go.</p>
              <p>The homepage showcases the most recent episodes with a global media player for immediate listening/watching, and one that does not get interrupted while trying to navigate the website. The media player keeps visitors focused on the main task of consuming great content. Anywhere in the site, there is the straightforward access to episodes, with a sidebar menu and clear CTAs &#40;&ldquo;Listen/Play,&rdquo; &ldquo;Share,&rdquo; and &ldquo;Subscribe&rdquo;&#41;.</p>
              <CaseFigure src="/img/portfolio/truth-matters_website.png" alt="Truth Matters Podcast Website" caption="Website" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 05 — Reflection */}
            <CaseSection id="reflection" number={5} title="Reflection">
              <p>As the Product Designer & Web Developer behind the Truth Matters Podcast, I embraced the challenge of creating a digital experience that felt as grounded and compelling as the content itself. My goal was to ensure every touchpoint&mdash;from the logo to the episode pages—told a consistent story, uniting branding, UX/UI design, and front-end development into a cohesive whole.</p>
              <p>In crafting the brand's visual identity, I leaned into a casual, yet theologically serious, thoughtful, and grounded in biblical truth tone. The minimal yet strong logo, paired with a muted, sophisticated color palette &#40;deep charcoal, soft neutrals&#41;, reinforced clarity and conviction. I selected sharp, readable fonts that convey authority without being loud, ensuring that the design echoed both the podcast's purpose and Grace to You's style guidelines.</p>
              <p>On the UX and development front, I designed a clean, minimal, content-first interface built on WordPress with a focus on SEO and accessibility. I implemented a global media player that doesn't interrupt playback when navigating, along with clear CTAs &#40;&ldquo;Listen/Play,&rdquo; &ldquo;Share,&rdquo; and &ldquo;Subscribe&rdquo;&#41; and responsive layouts for seamless mobile discovery. This approach kept the audience engaged with the content and empowered them to interact, share, and subscribe without friction.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/grace-stream"
            title="Grace Stream"
            category="Branding/UI/UX/Web"
            image="/img/portfolio/main_grace-stream.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
