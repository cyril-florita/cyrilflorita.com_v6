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
  CaseVideo,
  CaseNext,
  CaseLearnings,
} from "@/components/case/CaseStudy";
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";

// Truth Matters Conference: the brand for Grace to You's conference, from the
// Behance project "Branding: Truth Matters Conference". Originals are staged
// in new-work/Truth Matters Conference/ and exported here as tmc_*.
const P = "/img/portfolio/tmc_";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "mark", label: "The Handwritten Mark" },
  { id: "stream-web", label: "Livestream & Web" },
  { id: "merch", label: "Merch & Stickers" },
  { id: "learnings", label: "Reflection" },
];

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page, including via the browser's own back button.
    session.set("returnToProject", "tmconference");
    cyrilUtility.tpInner();
    const unsubscribePreloader = onPreloaderHidden(() => {
      document.querySelector(".cyril-page")?.classList.add("cyril-active");
    });
    return () => unsubscribePreloader();
  }, []);

  const handleBackToPortfolio = () => {
    session.set("returnToProject", "tmconference");
    wipeThen(() => router.push("/"));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Branding, Design, & Development"
            detail="Conference Brand & Web"
            title="Truth Matters Conference"
            summary={CASE_SUMMARIES["/truth-matters-conference"]}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank" rel="noopener noreferrer">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Brand, Motion, and Web Designer & Developer" },
              { label: "Platform & Tools", value: "Illustrator, Photoshop, After Effects" },
            ]}
            tile="/truth-matters-conference"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Truth Matters is Grace to You&apos;s Bible conference. This one, <em>Truth Matters: Recovering a Biblical Worldview</em>, was the first held outside California, at the Answers Center at the Ark Encounter in Williamstown, Kentucky, with John MacArthur and guest speakers over three days of preaching and panel Q&amp;As.</p>
              <p>I designed the brand and everything that carried it: the graphic on the LED wall behind the stage, an animated logo, the livestream thumbnails, the website banners, and the shirts, sweatshirts, bags, and stickers. I also designed and built the conference pages on GTY.org.</p>
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results &amp; Impact">
              <p>One mark ran through the whole conference. The handwriting on the LED wall behind each speaker was the same one on the livestream, the website, the merch table, and the stickers, so the event looked like one thing in the room and online. After the conference, its twelve sessions were published together as a series on GTY.org, under the same mark.</p>
            </CaseSection>

            {/* 03 — The Handwritten Mark */}
            <CaseSection id="mark" number={3} title="The Handwritten Mark">
              <h3 className="cyril-case-subheading">From Handwriting to Vector</h3>
              <p>The logo is John MacArthur&apos;s own handwriting. I traced it and cleaned it up in Photoshop, then vectorized it in Illustrator, keeping the pen&apos;s movement while making the letters even enough to read at any size, from a sticker to the jumbotron.</p>
              <CaseFigure src={`${P}logo-jumbotron.jpg`} alt="Truth Matters! in John MacArthur's handwriting, white on black" caption="Logo for the jumbotron" />

              <h3 className="cyril-case-subheading">Animated Logo</h3>
              <p>In After Effects I gave the mark the effect of being written by hand, stroke by stroke, so it appears the way it began: as someone writing it.</p>
              <CaseVideo src={`${P}animated-logo.mp4`} caption="Animated logo" frame={false} />

              <h3 className="cyril-case-subheading">On Stage</h3>
              <p>On the LED wall the mark became the backdrop for every session, set high and wide so it framed the speaker at the podium without competing with him.</p>
              <CaseFigure src={`${P}led-wall.jpg`} alt="John MacArthur preaching in front of the LED wall showing Truth Matters!" caption="LED wall graphic, Answers Center" />
            </CaseSection>

            {/* 04 — Livestream & Web */}
            <CaseSection id="stream-web" number={4} title="Livestream &amp; Web">
              <h3 className="cyril-case-subheading">Livestream</h3>
              <p>Each day of the conference streamed on YouTube. Standby screens and thumbnails pair the mark with the conference subtitle and the day, over a dark Grace to You ground.</p>
              <CaseFigure src={`${P}livestream-thumbnail.jpg`} alt="Truth Matters livestream standby screen for Day 3" caption="YouTube livestream thumbnail" />

              <h3 className="cyril-case-subheading">Banners</h3>
              <p>Banners across GTY.org pointed visitors to the conference and its livestream: one on the homepage, and the conference page&apos;s header.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}homepage-banner.jpg`} alt="Homepage banner for the Truth Matters Conference" caption="Homepage banner" />
                <CaseFigure src={`${P}page-banner.jpg`} alt="Truth Matters page banner" caption="Conference page banner" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">Conference Pages</h3>
              <p>I designed and built the conference page on GTY.org, with three tabs: the session videos by day, the conference details and venue, and the speakers.</p>
              <CaseGrid layout="three">
                <CaseFigure src={`${P}conference-page_media.jpg`} alt="Conference page, Media tab with the sessions by day" caption="Media tab" ratio="3 / 4" />
                <CaseFigure src={`${P}conference-page_venue.jpg`} alt="Conference page, Conference Info tab with the venue" caption="Conference info tab" ratio="3 / 4" />
                <CaseFigure src={`${P}conference-page_speakers.jpg`} alt="Conference page, Speakers tab" caption="Speakers tab" ratio="3 / 4" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">After the Conference</h3>
              <p>Once the conference ended, its sessions moved to a product page as one series, with video and audio for each message and the option to buy the set on DVD or CD.</p>
              <CaseFigure src={`${P}product-page.jpg`} alt="Post-conference product page listing the series' messages" caption="Post-conference product page" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 05 — Merch & Stickers */}
            <CaseSection id="merch" number={5} title="Merch &amp; Stickers">
              <h3 className="cyril-case-subheading">Shirts</h3>
              <p>The shirts carry the handwritten mark across the back, with the Grace to You logo on the front and John&apos;s signature near the hem. I explored layouts on black before settling the color range.</p>
              <CaseGrid layout="three">
                <CaseFigure src={`${P}tee-aqua.jpg`} alt="Aqua Truth Matters T-shirt, front and back" caption="T-shirt, aqua" />
                <CaseFigure src={`${P}tee-firebrick.jpg`} alt="Firebrick Truth Matters T-shirt, front and back" caption="T-shirt, firebrick" />
                <CaseFigure src={`${P}tee-indigo.jpg`} alt="Indigo Truth Matters T-shirt, front and back" caption="T-shirt, indigo" />
                <CaseFigure src={`${P}tee-design-1.jpg`} alt="Black T-shirt, layout 1" caption="Layout 1" />
                <CaseFigure src={`${P}tee-design-2.jpg`} alt="Black T-shirt, layout 2" caption="Layout 2" />
                <CaseFigure src={`${P}tee-design-3.jpg`} alt="Black T-shirt, layout 3" caption="Layout 3" />
                <CaseFigure src={`${P}tee-design-4.jpg`} alt="Black T-shirt, layout 4" caption="Layout 4" />
                <CaseFigure src={`${P}tee-design-5.jpg`} alt="Black T-shirt, layout 5" caption="Layout 5" />
                <CaseFigure src={`${P}tee-design-6.jpg`} alt="Black T-shirt, layout 6" caption="Layout 6" />
              </CaseGrid>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}tee-design-7.jpg`} alt="Black T-shirt, layout 7" caption="Layout 7" />
                <CaseFigure src={`${P}tee-womens.jpg`} alt="Women's black Truth Matters shirt, front and back" caption="Women's shirt" />
              </CaseGrid>

              <h3 className="cyril-case-subheading">Sweatshirts &amp; Bag</h3>
              <p>The zip sweatshirts follow the shirts in the same three colors and on black, and a black string bag carries the mark with the Grace to You logo beneath it.</p>
              <CaseGrid layout="three">
                <CaseFigure src={`${P}sweatshirt-aqua.jpg`} alt="Aqua Truth Matters sweatshirt, front and back" caption="Sweatshirt, aqua" />
                <CaseFigure src={`${P}sweatshirt-firebrick.jpg`} alt="Firebrick Truth Matters sweatshirt, front and back" caption="Sweatshirt, firebrick" />
                <CaseFigure src={`${P}sweatshirt-indigo.jpg`} alt="Indigo Truth Matters sweatshirt, front and back" caption="Sweatshirt, indigo" />
                <CaseFigure src={`${P}sweatshirt-design-1.jpg`} alt="Black sweatshirt, layout 1" caption="Sweatshirt layout 1" />
                <CaseFigure src={`${P}sweatshirt-design-2.jpg`} alt="Black sweatshirt, layout 2" caption="Sweatshirt layout 2" />
                <CaseFigure src={`${P}sweatshirt-design-3.jpg`} alt="Black sweatshirt, layout 3" caption="Sweatshirt layout 3" />
              </CaseGrid>
              <CaseFigure src={`${P}string-bag.jpg`} alt="Black string bag with the Truth Matters mark and the Grace to You logo" caption="String bag" size="text" />

              <h3 className="cyril-case-subheading">Stickers</h3>
              <p>A die-cut sticker of the mark and a round one with GTY.org under it were the conference&apos;s branding stickers. Grace to You, as the sponsor, had its own round sticker in black and in white.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}sticker-logo.jpg`} alt="Die-cut Truth Matters! sticker" caption="Branding sticker, die-cut" />
                <CaseFigure src={`${P}sticker-round.jpg`} alt="Round Truth Matters! sticker with GTY.org" caption="Branding sticker, round" />
                <CaseFigure src={`${P}sticker-gty-black.jpg`} alt="Round black Grace to You sticker" caption="Sponsor sticker, black" />
                <CaseFigure src={`${P}sticker-gty-white.jpg`} alt="Round white Grace to You sticker" caption="Sponsor sticker, white" />
              </CaseGrid>
            </CaseSection>

            {/* 06 — Reflection */}
            <CaseSection id="learnings" number={6} title="Reflection">
              <CaseLearnings
                learned={[
                  "Building the logo from the speaker’s own handwriting gave the conference a voice no typeface could. The work was keeping it legible as I cleaned it up and turned it into vectors.",
                  "The same mark had to hold up on a stage-sized LED wall and on a sticker, so I checked it at both sizes early instead of designing for one.",
                  "Animating the handwriting stroke by stroke made the mark feel written in the moment, which suited a conference built around live preaching.",
                ]}
              />
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/grace-stream"
            title="Grace Stream"
            category="Branding, Design, & Development"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
