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
  { id: "visually-elevating-resource-value", label: "Resource Value" },
  { id: "sales", label: "Sales" },
  { id: "free-product-offers", label: "Free Product Offers" },
  { id: "product-promos", label: "Product Promos" },
];

const page = () => {

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
            image="/img/portfolio/gty-resource_Divine-Design.jpg"
            imageAlt="Divine Design"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Visually Elevating Resource Value */}
            <CaseSection id="visually-elevating-resource-value" number={1} title="Visually Elevating Resource Value">
              <p>As a designer at Grace to You, I focused on creating visuals that immediately grabbed attention and clearly communicated value. I would use a clean, modern aesthetic to highlight products that were being promoted, offered for free, or sold at a discount. My main objective is ensuring each graphic effectively promotes its intended offer. I concentrate on clarity and appeal to transform viewer interest into action by visually showcasing the benefits of each product, guaranteeing our audience recognizes the value they're receiving.</p>
            </CaseSection>

            {/* 02 — Sales */}
            <CaseSection id="sales" number={2} title="Sales">
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty-resource_Autumn-Sale-2017.jpg" alt="Autumn Sale, Version 1" caption="Autumn Sale, Version 1" />
                <CaseFigure src="/img/portfolio/gty-resource_Autumn-Sale-2018-20.jpg" alt="Autumn Sale, Version 2" caption="Autumn Sale, Version 2" />
                <CaseFigure src="/img/portfolio/gty-resource_Autumn-Sale-2021-22.jpg" alt="Autumn Sale, Version 3" caption="Autumn Sale, Version 3" />
                <CaseFigure src="/img/portfolio/gty-resource_Summer-Sale-2017.jpg" alt="Summer Sale, Version 1" caption="Summer Sale, Version 1" />
                <CaseFigure src="/img/portfolio/gty-resource_Summer-Sale-2018.jpg" alt="Summer Sale, Version 2" caption="Summer Sale, Version 2" />
                <CaseFigure src="/img/portfolio/gty-resource_Summer-Sale-2019---Go.jpg" alt="Summer Sale — Go" caption="Summer Sale — Go" />
              </CaseGrid>
            </CaseSection>

            {/* 03 — Free Product Offers */}
            <CaseSection id="free-product-offers" number={3} title="Free Product Offers">
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty-resource_44NASMDBL.jpg" alt="44NASMDBL" caption="44NASMDBL" />
                <CaseFigure src="/img/portfolio/gty-resource_A-Jet-Tour-Through-Revelation.jpg" alt="A Jet Tour Through Revelation" caption="A Jet Tour Through Revelation" />
                <CaseFigure src="/img/portfolio/gty-resource_Alone-with-God.jpg" alt="Alone with God" caption="Alone with God" />
                <CaseFigure src="/img/portfolio/gty-resource_Book---Anxious-for-Nothing.jpg" alt="Book — Anxious for Nothing" caption="Book — Anxious for Nothing" />
                <CaseFigure src="/img/portfolio/gty-resource_Book---Good-News,-The-Gospel-of-Jesus-Christ.jpg" alt="Book — Good News, The Gospel of Jesus Christ" caption="Book — Good News, The Gospel of Jesus Christ" />
                <CaseFigure src="/img/portfolio/gty-resource_book---Standing-Strong.jpg" alt="Book — Standing Strong" caption="Book — Standing Strong" />
                <CaseFigure src="/img/portfolio/gty-resource_Booklet---Freedom-From-Sin.jpg" alt="Booklet — Freedom from Sin" caption="Booklet — Freedom from Sin" />
                <CaseFigure src="/img/portfolio/gty-resource_Divine-Design.jpg" alt="Divine Design" caption="Divine Design" />
                <CaseFigure src="/img/portfolio/gty-resource_Examine-Yourself-Free-1st-Time-Callers.jpg" alt="Examine Yourself — Free, 1st Time Callers" caption="Examine Yourself — Free, 1st Time Callers" />
                <CaseFigure src="/img/portfolio/gty-resource_How-to-Study-Your-Bible.jpg" alt="How to Study Your Bible" caption="How to Study Your Bible" />
                <CaseFigure src="/img/portfolio/gty-resource_Radio-Offer---CD-The-Freedom-and-Power-of-Forgiveness---1st-Time-Callers-copy.jpg" alt="Radio Offer — CD, The Freedom and Power of Forgiveness" caption="Radio Offer — CD, The Freedom and Power of Forgiveness" />
                <CaseFigure src="/img/portfolio/gty-resource_Remember-and-Return-with-MacArthur-Study-Bible-Purchase-r1.jpg" alt="Remember and Return with MacArthur Study Bible Purchase" caption="Remember and Return with MacArthur Study Bible Purchase" />
                <CaseFigure src="/img/portfolio/gty-resource_saved-without-a-doubt.jpg" alt="Saved Without a Doubt" caption="Saved Without a Doubt" />
                <CaseFigure src="/img/portfolio/gty-resource_Store-Offer---Drawing-Near-with-MacArthur-Study-Bible-Purchase.jpg" alt="Store Offer — Drawing Near with MacArthur Study Bible Purchase" caption="Store Offer — Drawing Near with MacArthur Study Bible Purchase" />
                <CaseFigure src="/img/portfolio/gty-resource_Store-Offer---One-Foundation-with-MSB-Purchase-2.jpg" alt="Store Offer — One Foundation with MSB Purchase" caption="Store Offer — One Foundation with MSB Purchase" />
                <CaseFigure src="/img/portfolio/gty-resource_Study-Bible-and-Lord-Teach-Me-to-Pray.jpg" alt="Study Bible and Lord, Teach Me to Pray" caption="Study Bible and Lord, Teach Me to Pray" />
              </CaseGrid>
            </CaseSection>

            {/* 04 — Product Promos */}
            <CaseSection id="product-promos" number={4} title="Product Promos">
              <CaseGrid layout="three">
                <CaseFigure src="/img/portfolio/gty-resource_2---Designed-with-preachers-in-mind-copy.jpg" alt="Designed with Preachers in Mind" caption="Designed with Preachers in Mind" />
                <CaseFigure src="/img/portfolio/gty-resource_3---John-MacArthur-was-asked-copy.jpg" alt="John MacArthur Was Asked" caption="John MacArthur Was Asked" />
                <CaseFigure src="/img/portfolio/gty-resource_4---The-most-important-feature-is-the-text-itself-copy.jpg" alt="The Most Important Feature Is the Text Itself" caption="The Most Important Feature Is the Text Itself" />
                <CaseFigure src="/img/portfolio/gty-resource_12---Text-and-binding..jpg" alt="Text and Binding" caption="Text and Binding" />
                <CaseFigure src="/img/portfolio/gty-resource_16---Lays-flat.jpg" alt="Lays Flat" caption="Lays Flat" />
                <CaseFigure src="/img/portfolio/gty-resource_17---Crafted-for-faithful-workmen.jpg" alt="Crafted for Faithful Workmen" caption="Crafted for Faithful Workmen" />
                <CaseFigure src="/img/portfolio/gty-resource_19---Smyth-sewn.jpg" alt="Smyth Sewn" caption="Smyth Sewn" />
                <CaseFigure src="/img/portfolio/gty-resource_21---NASB-ver2.jpg" alt="NASB" caption="NASB" />
                <CaseFigure src="/img/portfolio/gty-resource_22---Today-ver1.jpg" alt="Today, Version 1" caption="Today, Version 1" />
                <CaseFigure src="/img/portfolio/gty-resource_22---Today-ver2.jpg" alt="Today, Version 2" caption="Today, Version 2" />
              </CaseGrid>
              <CaseGrid layout="two">
                <CaseFigure src="/img/portfolio/gty-resource_Legacy-Standard-Bible---NT-and-Psalms.jpg" alt="Legacy Standard Bible — NT and Psalms" caption="Legacy Standard Bible — NT and Psalms" />
                <CaseFigure src="/img/portfolio/gty-resource_The-MacArthur-Study-Bible---2nd-Edition-r2.jpg" alt="The MacArthur Study Bible — 2nd Edition, Version 1" caption="The MacArthur Study Bible — 2nd Edition, Version 1" />
                <CaseFigure src="/img/portfolio/gty-resource_The-MacArthur-Study-Bible---2nd-Edition.jpg" alt="The MacArthur Study Bible — 2nd Edition, Version 2" caption="The MacArthur Study Bible — 2nd Edition, Version 2" />
                <CaseFigure src="/img/portfolio/gty-resource_the-macarthur-study-bible.jpg" alt="The MacArthur Study Bible" caption="The MacArthur Study Bible" />
                <CaseFigure src="/img/portfolio/gty-resource_The-Preachers-Bible-v1.jpg" alt="The Preacher's Bible, Version 1" caption="The Preacher's Bible, Version 1" />
                <CaseFigure src="/img/portfolio/gty-resource_The-Preachers-Bible-v2.jpg" alt="The Preacher's Bible, Version 2" caption="The Preacher's Bible, Version 2" />
                <CaseFigure src="/img/portfolio/gty-resource_The-Preachers-Bible-v3.jpg" alt="The Preacher's Bible, Version 3" caption="The Preacher's Bible, Version 3" />
              </CaseGrid>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-social-media-graphics"
            title="GTY Social Media Graphics"
            category="Marketing"
            image="/img/portfolio/thumb_gty-social-media.jpg"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;
