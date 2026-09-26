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
  { id: "merchandise", label: "Merchandise" },
  { id: "graphics", label: "Graphics & Media" },
  { id: "ux-web", label: "UX & Web" },
  { id: "reflection", label: "Reflection" },
];

// Brand guide data. Colors are sampled from the delivered logo and website;
// crop boxes are [x, y, width, height] in each file's original pixels.
const LOGO = "/img/portfolio/truth-matters_logo.jpg";
const LOGO_SIZE = [1500, 1500];
const LOCKUP = "/img/portfolio/main_truth-matters-podcast.jpg";
const LOCKUP_SIZE = [1920, 938];
const ICON = "/img/portfolio/truth-matters_icon.jpg";
const ICON_SIZE = [3000, 3000];
const THUMB = "/img/portfolio/truth-matters_youtube-thumb-1.jpg";
const ARTWORK = "/img/portfolio/truth-matters_episode-artwork-2.jpg";

const LOGOS = [
  { src: LOGO, box: [150, 450, 1210, 730], size: LOGO_SIZE, fit: "62%", name: "Logo", ground: "White", use: "The default: episode pages, merchandise and anywhere the show is named on its own." },
  { src: LOCKUP, box: [220, 260, 1440, 470], size: LOCKUP_SIZE, fit: "88%", name: "Podcast Lockup", ground: "White", use: "Wide spaces that need to say what the show is: banners, headers and directory listings." },
  { src: ICON, box: [240, 740, 2510, 1880], size: ICON_SIZE, fit: "40%", name: "Icon", ground: "White", use: "Small, square spaces such as the favicon, app and social avatars." },
];

const COLORS = [
  { name: "Black", hex: "#000000", rgb: "0 0 0", role: "The logo\u2019s speech-bubble block, with the letters cut out of it." },
  { name: "Deep Charcoal", hex: "#111618", rgb: "17 22 24", role: "The deepest UI color: the site footer and dark bands." },
  { name: "Charcoal", hex: "#3A3A3A", rgb: "58 58 58", role: "The global media player and dark overlays; 11.4:1 with white text." },
  { name: "Soft Grey", hex: "#999999", rgb: "153 153 153", role: "Secondary buttons and dividers. Too light for text on white (2.85:1)." },
  { name: "Soft Neutral", hex: "#F6F6F6", rgb: "246 246 246", role: "Quiet section backgrounds that separate content without lines." },
  { name: "White", hex: "#FFFFFF", rgb: "255 255 255", role: "The page ground, and the letters of the logo over photos." },
];

const TYPE = [
  { name: "\u201cTruth Matters\u201d \u2014 Heavy", box: [177, 480, 1148, 605], fit: "88%", role: "Heavy capitals cut out of a solid block, so the name reads as one strong statement: clarity and conviction." },
  { name: "\u201cPodcast\u201d \u2014 Light", src: LOCKUP, size: LOCKUP_SIZE, box: [1063, 498, 573, 94], fit: "68%", role: "A light, widely tracked weight beside the logo that names the format without competing with it." },
  { name: "\u201cGTY.ORG\u201d \u2014 Bold", box: [886, 1085, 276, 62], fit: "22%", role: "Small bold capitals under the speech-bubble tail, tying the show back to Grace to You." },
];

const CLEAR_SPECS = [
  { label: "Clear space", value: "One eighth of the logo\u2019s width (x) on every side, measured from the block\u2019s edge." },
  { label: "Minimum size", value: "Logo 120px wide on screen, 1 in (25 mm) in print. Below that, use the icon, down to 32px." },
  { label: "Over photos", value: "Use the white version on a darker, even area, so the photo shows through the letters." },
];

const art = (src, className = "", style) => <img className={className} src={thumbFor(src)} alt="" loading="lazy" decoding="async" style={style} />;
// the logo file is square; cyril-brand-contain shows it whole in the wide tiles
const logoArt = (className = "") => art(LOGO, `cyril-brand-contain ${className}`);

const USAGE = [
  { ok: true, label: "Use the black logo on white or a soft neutral.", visual: logoArt() },
  { ok: true, label: "Use the white logo over a darker, even area of a photo.", visual: art(THUMB, "", { objectPosition: "left bottom" }) },
  { ok: false, label: "Stretch, squash or skew the logo.", visual: logoArt("cyril-brand-stretch") },
  { ok: false, label: "Put the logo in bright colors. It stays black, white or charcoal.", visual: <div className="cyril-brand-tintbox">{art(LOGO)}</div> },
  { ok: false, label: "Put the white-ground file on a dark background.", visual: <div className="cyril-brand-onblack">{art(LOGO)}</div> },
  { ok: false, label: "Place the black logo over busy imagery.", visual: <div className="cyril-brand-onphoto" style={{ backgroundImage: `url(${thumbFor(ARTWORK)})` }}>{art(LOGO)}</div> },
];

const Page = () => {

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
            category="Design, Development, & Branding"
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

            {/* 03 — Logo Suite */}
            <CaseSection id="logo-suite" number={3} title="Logo Suite">
              <p>The logo is a speech bubble with the name cut out of it: a conversation about the truth. It comes as the logo itself, a wide podcast lockup, and a two-letter icon for small spaces.</p>
              <BrandLogos items={LOGOS} />
              <h3 className="cyril-case-subheading">Clear Space &amp; Size</h3>
              <p>The cut-out letters need room around the block to read as a shape, and enough size for the gaps between them to stay open.</p>
              <BrandClearSpace src={LOGO} box={[170, 470, 1162, 690]} size={LOGO_SIZE} specs={CLEAR_SPECS} />
            </CaseSection>

            {/* 04 — Color */}
            <CaseSection id="color" number={4} title="Color">
              <p>A muted, sophisticated palette of deep charcoal and soft neutrals reinforces the show&apos;s tone: no hype, just truth. Color comes from the episode photography, never from the brand itself.</p>
              <BrandSwatches colors={COLORS} />
            </CaseSection>

            {/* 05 — Typography */}
            <CaseSection id="typography" number={5} title="Typography">
              <p>Consistent with Grace to You&apos;s style: sharp, readable fonts that convey authority without being loud.</p>
              <BrandLettering src={LOGO} size={LOGO_SIZE} items={TYPE} />
            </CaseSection>

            {/* 06 — Usage */}
            <CaseSection id="usage" number={6} title="Usage">
              <p>A few rules keep the logo clear across episode artwork, thumbnails, the website and merchandise.</p>
              <BrandUsage items={USAGE} />
            </CaseSection>

            {/* 07 — Merchandise */}
            <CaseSection id="merchandise" number={7} title="Merchandise">
              <p>A speech bubble with the name cut out of it is built to be worn and shared, so I carried the identity onto merchandise concepts: a cap, a mug, stickers, and a T-shirt. The solid black mark prints cleanly at any size, from a sticker on a laptop to the front of a shirt, and reads instantly as the show.</p>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/truth-matters_merch-cap.jpg" alt="Truth Matters cap" caption="Cap" />
                <CaseFigure src="/img/portfolio/truth-matters_merch-mug.jpg" alt="Truth Matters mug" caption="Mug" />
              </CaseGrid>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/truth-matters_merch-stickers.jpg" alt="Truth Matters stickers" caption="Stickers" />
                <CaseFigure src="/img/portfolio/truth-matters_merch-t-shirt.jpg" alt="Truth Matters T-shirt" caption="T-Shirt" />
              </CaseGrid>
            </CaseSection>

            {/* 08 — Graphics & Supporting Media */}
            <CaseSection id="graphics" number={8} title="Graphics &amp; Supporting Media">
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

            {/* 09 — UX Design, Web Development, & Podcast Integration */}
            <CaseSection id="ux-web" number={9} title="UX Design, Web Development, &amp; Podcast Integration">
              <p>The user journey was my next focus. With leadership from the Digital Platforms Director and collaboration with the Senior Software Architect, I developed the site using WordPress for a more practical content publication and management. I designed the site to be clean, minimal, content-first, and easy to navigate. It's built with a focus on SEO and accessibility, ensuring that the podcast is easily discoverable, playable, and engaging for all audiences. I kept the UI minimal so the podcast episodes and visuals could shine. There's the ability for the user to engage by leaving a comment or sharing the episode on social media. I also built a fully responsive experience that works seamlessly on mobile—because I knew a lot of listeners would be discovering this on the go.</p>
              <p>The homepage showcases the most recent episodes with a global media player for immediate listening/watching, and one that does not get interrupted while trying to navigate the website. The media player keeps visitors focused on the main task of consuming great content. Anywhere in the site, there is the straightforward access to episodes, with a sidebar menu and clear CTAs &#40;&ldquo;Listen/Play,&rdquo; &ldquo;Share,&rdquo; and &ldquo;Subscribe&rdquo;&#41;.</p>
              <CaseFigure src="/img/portfolio/truth-matters_website.png" alt="Truth Matters Podcast Website" caption="Website" ratio="3 / 4" size="text" />
            </CaseSection>

            {/* 10 — Reflection */}
            <CaseSection id="reflection" number={10} title="Reflection">
              <p>As the Product Designer & Web Developer behind the Truth Matters Podcast, I embraced the challenge of creating a digital experience that felt as grounded and compelling as the content itself. My goal was to ensure every touchpoint&mdash;from the logo to the episode pages—told a consistent story, uniting branding, UX/UI design, and front-end development into a cohesive whole.</p>
              <p>In crafting the brand's visual identity, I leaned into a casual, yet theologically serious, thoughtful, and grounded in biblical truth tone. The minimal yet strong logo, paired with a muted, sophisticated color palette &#40;deep charcoal, soft neutrals&#41;, reinforced clarity and conviction. I selected sharp, readable fonts that convey authority without being loud, ensuring that the design echoed both the podcast's purpose and Grace to You's style guidelines.</p>
              <p>On the UX and development front, I designed a clean, minimal, content-first interface built on WordPress with a focus on SEO and accessibility. I implemented a global media player that doesn't interrupt playback when navigating, along with clear CTAs &#40;&ldquo;Listen/Play,&rdquo; &ldquo;Share,&rdquo; and &ldquo;Subscribe&rdquo;&#41; and responsive layouts for seamless mobile discovery. This approach kept the audience engaged with the content and empowered them to interact, share, and subscribe without friction.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/volunteer-leadership-team"
            title="Volunteer Leadership Team"
            category="Design & Development"
            image="/img/portfolio/chf-volunteer-leadership_main.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
