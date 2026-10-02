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
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";
import { BLOG_GRAPHICS } from "@/components/data/blogGraphics";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "approach", label: "Design Approach" },
  { id: "the-collection", label: "The Collection" },
  { id: "reflection", label: "Reflection" },
];

// Figures come from components/data/blogGraphics.js (the same files the My
// Work grid shows). Featured ones are picked by id per section; everything
// else lands in "The Collection", so each graphic appears once.
const BY_ID = Object.fromEntries(BLOG_GRAPHICS.map((g) => [g.id, g]));
const Fig = ({ id, size }) => {
  const g = BY_ID[`blog-${id}`];
  return <CaseFigure src={g.src} alt={g.caption} caption={g.caption} size={size} />;
};
const FEATURED = {
  title: ["christ-gives-the-gospel", "inerrancy-and-evangelical-syncretism"],
  frame: ["what-is-the-eye-of-a-needle", "pauls-gospel-essential"],
  metaphors: ["not-all-that-glitters-is-gold", "the-lord-told-me", "the-assault-on-the-virgin-birth-of-christ", "untangling-the-lords-lineage", "the-problem-of-evil", "takeaway-from-the-shepcon-q-a-session", "contentment-and-providence", "replacing-worry-with-the-right-focus"],
  art: ["engaging-without-imbibing", "limitless-love", "people-who-missed-christmas", "the-truth-about-man"],
  type: ["gods-unimpeachable-sovereignty", "the-totality-of-depravity", "the-subtlety-of-idolatry", "reconciled-in-christ", "the-coming-messiah", "faith-as-christ-defined-it"],
};
const SHOWN = new Set(["a-church-not-forsaken", ...Object.values(FEATURED).flat()].map((id) => `blog-${id}`));
const COLLECTION = BLOG_GRAPHICS.filter((g) => !SHOWN.has(g.id));

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'gtyblog');
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
    const projectId = 'gtyblog'; // This is the current project

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
            detail="Blog Graphics"
            title="GTY Blog Graphics"
            summary={CASE_SUMMARIES["/gty-blog-graphics"]}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
            ]}
            image="/img/portfolio/gty-blog_Christ-gives-the-gospel.jpg"
            imageAlt="Christ Gives the Gospel"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>Every post on the Grace to You blog needed a header graphic: the image at the top of the article and the one people see when it&apos;s shared. Over dozens of posts, my goal was to create graphics that not only attract attention but also visually encapsulate the essence of the blog post, making the content inviting and memorable for readers.</p>
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>The result is a body of graphics that each stand on their own, yet read unmistakably as Grace to You.</p>
            </CaseSection>

            {/* 03 — Design Approach */}
            <CaseSection id="approach" number={3} title="Design Approach">
              <h3 className="cyril-case-subheading">Starting from the Title</h3>
              <p>I always started with the core theme and title of each post, since they guided every visual choice. For &ldquo;A Church Not Forsaken,&rdquo; a serene image of a church bathed in warm light evokes hope and steadfastness, with a bold, classic font and an uncluttered composition that draws the eye to both the image and the text.</p>
              <Fig id="a-church-not-forsaken" size="text" />
              <p>For &ldquo;Christ Gives the Gospel,&rdquo; a dynamic split design pairs an illustration of Christ with a bold, modern &ldquo;CHRIST&rdquo; to highlight its importance. For &ldquo;Inerrancy and Evangelical Syncretism,&rdquo; a jar of separated liquids represents syncretism, paired with clean, contemporary type that conveys clarity and seriousness.</p>
              <CaseGrid layout="two">
                {FEATURED.title.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>

              <h3 className="cyril-case-subheading">A Consistent Frame</h3>
              <p>With a new graphic for nearly every post, the look could have drifted. A fixed frame around a changing picture holds the set together: the same wide format, the Grace to You logo and &ldquo;gty.org/blog&rdquo; bottom-left, and the most room for the title. A post in a series carries its name small in the opposite corner (&ldquo;Frequently Abused Verses,&rdquo; &ldquo;Christian Clich&eacute;s,&rdquo; &ldquo;Paul&apos;s Gospel Essentials&rdquo;), so readers can tell at a glance which posts belong together.</p>
              <CaseGrid layout="two">
                {FEATURED.frame.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>

              <h3 className="cyril-case-subheading">Visual Metaphors</h3>
              <p>Many posts deal with abstract ideas, so I often looked for one everyday object that could stand for the argument: fool&apos;s gold for &ldquo;Not All That Glitters Is Gold,&rdquo; a tin-can telephone for the cliché &ldquo;The Lord Told Me,&rdquo; a row of dominoes with one red piece for the assault on the virgin birth, a knotted rope for untangling the Lord&apos;s lineage, chess pieces for the problem of evil, and a takeout box for the takeaways from a conference Q&amp;A. A single, clear object reads in a second, even as a small thumbnail.</p>
              <CaseGrid layout="two">
                {FEATURED.metaphors.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>

              <h3 className="cyril-case-subheading">Art &amp; Illustration</h3>
              <p>For posts rooted in a biblical scene or a classic idea, I turned to engravings and paintings, such as Paul at Mars Hill, the Good Samaritan, and Leonardo&apos;s study of human proportions, and gave them a single-color treatment. The duotone ties very different artworks to the modern type set over them and keeps busy, detailed images calm enough to read a title against.</p>
              <CaseGrid layout="two">
                {FEATURED.art.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>

              <h3 className="cyril-case-subheading">Typography</h3>
              <p>Most titles are set in two voices: one key word given weight and size (SOVEREIGNTY, DEPRAVITY, IDOLATRY), and the rest of the phrase set smaller and lighter around it. The type style follows the tone of the post, with heavy, condensed capitals for urgent or confrontational topics, classic serifs for reflective ones, and an occasional script word, as in &ldquo;Reconciled&rdquo; and &ldquo;Messiah,&rdquo; where a personal, handwritten touch fits the subject.</p>
              <CaseGrid layout="two">
                {FEATURED.type.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>
            </CaseSection>

            {/* 04 — The Collection */}
            <CaseSection id="the-collection" number={4} title="The Collection">
              <p>The rest of the series, each built the same way: the title first, then an image and type chosen to carry it.</p>
              <CaseGrid layout="two">
                {COLLECTION.map((g) => <CaseFigure key={g.id} src={g.src} alt={g.caption} caption={g.caption} />)}
              </CaseGrid>
            </CaseSection>

            {/* 05 — Reflection */}
            <CaseSection id="reflection" number={5} title="Reflection">
              <p>Over the series, the approach stayed the same even as the subjects changed from week to week: read the post, find the one idea the title turns on, and give it a single strong image and a clear typographic voice inside a frame readers recognize.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-social-media-graphics"
            title="GTY Social Media Graphics"
            category="Marketing"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
