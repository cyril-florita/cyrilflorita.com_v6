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
} from "@/components/case/CaseStudy";

const SECTIONS = [
  { id: "visually-elevating-resource-value", label: "Overview" },
  { id: "what-every-graphic-says", label: "What Every Graphic Says" },
  { id: "free-product-offers", label: "The Offer Template" },
  { id: "sales", label: "Seasonal Sales" },
  { id: "preachers-bible-launch", label: "Preacher\u2019s Bible Launch" },
  { id: "bible-promotions", label: "Bible Promotions" },
  { id: "outcome", label: "Outcome" },
];

const P = "/img/portfolio/gty-resource_";

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gtyresources');
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
    const projectId = 'gtyresources'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="Marketing"
            detail="Resource Graphics"
            title="GTY Resources"
            summary="Clean, modern graphics for Grace to You that highlight products being promoted, offered for free, or sold at a discount, clearly communicating the value of each offer."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
            ]}
            image="/img/portfolio/gty-resource_the-macarthur-study-bible.jpg"
            imageAlt="The MacArthur Study Bible, 25% off"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="visually-elevating-resource-value" number={1} title="Visually Elevating Resource Value">
              <p>As a designer at Grace to You, I focused on creating visuals that immediately grabbed attention and clearly communicated value. I would use a clean, modern aesthetic to highlight products that were being promoted, offered for free, or sold at a discount. My main objective is ensuring each graphic effectively promotes its intended offer. I concentrate on clarity and appeal to transform viewer interest into action by visually showcasing the benefits of each product, guaranteeing our audience recognizes the value they&apos;re receiving.</p>
            </CaseSection>

            {/* 02 — What Every Graphic Has to Say */}
            <CaseSection id="what-every-graphic-says" number={2} title="What Every Graphic Has to Say">
              <p>Whether it ran on the website, in the store or alongside a radio broadcast, each graphic had a few seconds to answer the same four questions:</p>
              <ul className="cyril-case-list">
                <li>What is it? The product itself, shown large: the book, booklet, CD or Bible, never an abstract stand-in</li>
                <li>What&apos;s the offer? &ldquo;Free,&rdquo; &ldquo;25% off&rdquo; or &ldquo;free with every MacArthur Study Bible you purchase,&rdquo; set where the eye lands first</li>
                <li>Who is it for? Terms such as &ldquo;to anyone who has never contacted us before&rdquo; or &ldquo;if you&apos;re new to Grace to You,&rdquo; kept short and legible</li>
                <li>Until when? End dates and &ldquo;some exclusions apply,&rdquo; present but quiet</li>
              </ul>
            </CaseSection>

            {/* 03 — The Offer Template */}
            <CaseSection id="free-product-offers" number={3} title="The Offer Template">
              <p>Free offers came up constantly, so rather than design each one from scratch, I built them on one template. A diagonal line splits the frame: on the left, the product sits on a block of color pulled from its own cover, so every graphic feels made for that title; on the right, a dark charcoal panel holds the title, a short rule, and the offer in the same order every time. The same layout carried store offers that pair a free book with a MacArthur Study Bible purchase, and it made a run of very different titles read as one family.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}44NASMDBL.jpg`} alt="New to Grace to You? — The MacArthur Daily Bible" caption="New to Grace to You? — The MacArthur Daily Bible" />
                <CaseFigure src={`${P}A-Jet-Tour-Through-Revelation.jpg`} alt="A Jet Tour Through Revelation" caption="A Jet Tour Through Revelation" />
                <CaseFigure src={`${P}Alone-with-God.jpg`} alt="Alone with God" caption="Alone with God" />
                <CaseFigure src={`${P}Book---Anxious-for-Nothing.jpg`} alt="Book — Anxious for Nothing" caption="Book — Anxious for Nothing" />
                <CaseFigure src={`${P}Book---Good-News,-The-Gospel-of-Jesus-Christ.jpg`} alt="Book — Good News, The Gospel of Jesus Christ" caption="Book — Good News, The Gospel of Jesus Christ" />
                <CaseFigure src={`${P}book---Standing-Strong.jpg`} alt="Book — Standing Strong" caption="Book — Standing Strong" />
                <CaseFigure src={`${P}Booklet---Freedom-From-Sin.jpg`} alt="Booklet — Freedom from Sin" caption="Booklet — Freedom from Sin" />
                <CaseFigure src={`${P}Divine-Design.jpg`} alt="Divine Design" caption="Divine Design" />
                <CaseFigure src={`${P}Examine-Yourself-Free-1st-Time-Callers.jpg`} alt="Examine Yourself — Free, 1st Time Callers" caption="Examine Yourself — Free, 1st Time Callers" />
                <CaseFigure src={`${P}How-to-Study-Your-Bible.jpg`} alt="How to Study Your Bible" caption="How to Study Your Bible" />
                <CaseFigure src={`${P}Radio-Offer---CD-The-Freedom-and-Power-of-Forgiveness---1st-Time-Callers-copy.jpg`} alt="Radio Offer — CD, The Freedom and Power of Forgiveness" caption="Radio Offer — CD, The Freedom and Power of Forgiveness" />
                <CaseFigure src={`${P}Remember-and-Return-with-MacArthur-Study-Bible-Purchase-r1.jpg`} alt="Remember and Return with MacArthur Study Bible Purchase" caption="Remember and Return with MacArthur Study Bible Purchase" />
                <CaseFigure src={`${P}saved-without-a-doubt.jpg`} alt="Saved Without a Doubt" caption="Saved Without a Doubt" />
                <CaseFigure src={`${P}Store-Offer---Drawing-Near-with-MacArthur-Study-Bible-Purchase.jpg`} alt="Store Offer — Drawing Near with MacArthur Study Bible Purchase" caption="Store Offer — Drawing Near with MacArthur Study Bible Purchase" />
                <CaseFigure src={`${P}Store-Offer---One-Foundation-with-MSB-Purchase-2.jpg`} alt="Store Offer — One Foundation with MSB Purchase" caption="Store Offer — One Foundation with MSB Purchase" />
                <CaseFigure src={`${P}Study-Bible-and-Lord-Teach-Me-to-Pray.jpg`} alt="Study Bible and Lord, Teach Me to Pray" caption="Study Bible and Lord, Teach Me to Pray" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — Seasonal Sales */}
            <CaseSection id="sales" number={4} title="Seasonal Sales">
              <p>Sales work the other way around: the offer is the product. The recurring Autumn and Summer sales lead with a big &ldquo;25% off inventory&rdquo; set over seasonal photography (fallen leaves and hand lettering for autumn, bright beach scenes for summer), with the end date and exclusions underneath. Each season was refreshed with a new version, so the same offer never looked stale from one year to the next.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}Autumn-Sale-2017.jpg`} alt="Autumn Sale, Version 1" caption="Autumn Sale, Version 1" />
                <CaseFigure src={`${P}Autumn-Sale-2018-20.jpg`} alt="Autumn Sale, Version 2" caption="Autumn Sale, Version 2" />
                <CaseFigure src={`${P}Autumn-Sale-2021-22.jpg`} alt="Autumn Sale, Version 3" caption="Autumn Sale, Version 3" />
                <CaseFigure src={`${P}Summer-Sale-2017.jpg`} alt="Summer Sale, Version 1" caption="Summer Sale, Version 1" />
                <CaseFigure src={`${P}Summer-Sale-2018.jpg`} alt="Summer Sale, Version 2" caption="Summer Sale, Version 2" />
                <CaseFigure src={`${P}Summer-Sale-2019---Go.jpg`} alt="Summer Sale — Go" caption="Summer Sale — Go" />
              </CaseGrid>
            </CaseSection>

            {/* 05 — The Preacher's Bible Launch */}
            <CaseSection id="preachers-bible-launch" number={5} title="The Preacher&apos;s Bible Launch">
              <p>The Preacher&apos;s Bible got a full launch campaign that built anticipation in stages. It opened with &ldquo;Coming Soon&rdquo; teasers: dark, typographic posts with the Bible glimpsed through a slanted frame and a single line each, such as John MacArthur being asked what the perfect Bible for pastors would include.</p>
              <CaseGrid layout="three">
                <CaseFigure src={`${P}2---Designed-with-preachers-in-mind-copy.jpg`} alt="Designed with Preachers in Mind" caption="Designed with Preachers in Mind" />
                <CaseFigure src={`${P}3---John-MacArthur-was-asked-copy.jpg`} alt="John MacArthur Was Asked" caption="John MacArthur Was Asked" />
                <CaseFigure src={`${P}4---The-most-important-feature-is-the-text-itself-copy.jpg`} alt="The Most Important Feature Is the Text Itself" caption="The Most Important Feature Is the Text Itself" />
              </CaseGrid>
              <p>Next came &ldquo;Coming in March&rdquo; posts, each built around one close-up photo and one feature: the text and binding, a Bible that lays flat, its craftsmanship, the Smyth-sewn binding and the NASB text. All carried the #PreachersBible tag to tie the series together.</p>
              <CaseGrid layout="three">
                <CaseFigure src={`${P}12---Text-and-binding..jpg`} alt="Text and Binding" caption="Text and Binding" />
                <CaseFigure src={`${P}16---Lays-flat.jpg`} alt="Lays Flat" caption="Lays Flat" />
                <CaseFigure src={`${P}17---Crafted-for-faithful-workmen.jpg`} alt="Crafted for Faithful Workmen" caption="Crafted for Faithful Workmen" />
                <CaseFigure src={`${P}19---Smyth-sewn.jpg`} alt="Smyth Sewn" caption="Smyth Sewn" />
                <CaseFigure src={`${P}21---NASB-ver2.jpg`} alt="NASB" caption="NASB" />
              </CaseGrid>
              <p>On launch day, the &ldquo;Today&rdquo; posts showed the finished Bible and its box, and website banners carried the line &ldquo;John MacArthur&apos;s Design Specs. Your Study Notes.&rdquo; into the store.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}22---Today-ver1.jpg`} alt="Today, Version 1" caption="Today, Version 1" />
                <CaseFigure src={`${P}22---Today-ver2.jpg`} alt="Today, Version 2" caption="Today, Version 2" />
              </CaseGrid>
              <CaseFigure src={`${P}The-Preachers-Bible-v1.jpg`} alt="The Preacher&apos;s Bible, Version 1" caption="The Preacher&apos;s Bible, Version 1" />
              <CaseGrid layout="two">
                <CaseFigure src={`${P}The-Preachers-Bible-v2.jpg`} alt="The Preacher&apos;s Bible, Version 2" caption="The Preacher&apos;s Bible, Version 2" />
                <CaseFigure src={`${P}The-Preachers-Bible-v3.jpg`} alt="The Preacher&apos;s Bible, Version 3" caption="The Preacher&apos;s Bible, Version 3" />
              </CaseGrid>
            </CaseSection>

            {/* 06 — Bible Promotions */}
            <CaseSection id="bible-promotions" number={6} title="Bible Promotions">
              <p>Other Bible releases and promotions, the pocket-edition Legacy Standard Bible New Testament with Psalms and Proverbs, the MacArthur Study Bible&apos;s second edition, and a 25%-off MacArthur Study Bible offer, reuse the same diagonal split as the offer template, so a new release sits comfortably next to the free offers around it.</p>
              <CaseGrid layout="two">
                <CaseFigure src={`${P}Legacy-Standard-Bible---NT-and-Psalms.jpg`} alt="Legacy Standard Bible — NT and Psalms" caption="Legacy Standard Bible — NT and Psalms" />
                <CaseFigure src={`${P}The-MacArthur-Study-Bible---2nd-Edition-r2.jpg`} alt="The MacArthur Study Bible — 2nd Edition, Version 1" caption="The MacArthur Study Bible — 2nd Edition, Version 1" />
                <CaseFigure src={`${P}The-MacArthur-Study-Bible---2nd-Edition.jpg`} alt="The MacArthur Study Bible — 2nd Edition, Version 2" caption="The MacArthur Study Bible — 2nd Edition, Version 2" />
                <CaseFigure src={`${P}the-macarthur-study-bible.jpg`} alt="The MacArthur Study Bible" caption="The MacArthur Study Bible" />
              </CaseGrid>
            </CaseSection>

            {/* 07 — Outcome */}
            <CaseSection id="outcome" number={7} title="Outcome and Reflection">
              <p>Across dozens of graphics, a handful of decisions did most of the work: the product always shown large, the offer always stated plainly, and a small set of layouts reused instead of reinvented. The offer template in particular meant each new free resource started from a proven layout rather than a blank canvas, and Grace to You&apos;s promotions read as one consistent family across the website, the store and the broadcasts, while a campaign like The Preacher&apos;s Bible launch still had room for its own look.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/the-study-bible-app"
            title="The Study Bible App"
            category="App Design"
            image="/img/portfolio/main_the-study-bible-app.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
