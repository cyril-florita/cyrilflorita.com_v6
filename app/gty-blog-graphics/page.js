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
import { BLOG_GRAPHICS } from "@/components/data/blogGraphics";

const SECTIONS = [
  { id: "visually-communicating-truth", label: "Overview" },
  { id: "starting-from-the-title", label: "Starting from the Title" },
  { id: "a-consistent-frame", label: "A Consistent Frame" },
  { id: "visual-metaphors", label: "Visual Metaphors" },
  { id: "art-and-illustration", label: "Art & Illustration" },
  { id: "typography", label: "Typography" },
  { id: "the-collection", label: "The Collection" },
  { id: "outcome", label: "Outcome" },
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

const page = () => {

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
            summary="Blog graphics for Grace to You that pair imagery and typography to visually encapsulate the essence of each post, making the content inviting and memorable for readers."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "Web Designer & Developer" },
            ]}
            image="/img/portfolio/gty-blog_Christ-gives-the-gospel.jpg"
            imageAlt="Christ Gives the Gospel"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="visually-communicating-truth" number={1} title="Visually Communicating Truth">
              <p>Every post on the Grace to You blog needed a header graphic: the image at the top of the article and the one people see when it&apos;s shared. Over dozens of posts, my goal was to create graphics that not only attract attention but also visually encapsulate the essence of the blog post, making the content inviting and memorable for readers.</p>
            </CaseSection>

            {/* 02 — Starting from the Title */}
            <CaseSection id="starting-from-the-title" number={2} title="Starting from the Title">
              <p>When I designed blog graphics for Grace to You, I would always start by considering the core theme and title of each post, as these elements would guide my visual choices. For example, for a post titled &ldquo;A Church Not Forsaken,&rdquo; I selected a serene image of a church bathed in warm light, evoking a sense of hope and steadfastness that matches the message. The font I chose is bold and classic, ensuring the title stands out and immediately communicates the gravity and reassurance of the topic. The overall composition is uncluttered, allowing the viewer&apos;s attention to be drawn to both the image and the text without distraction, which is crucial for making a strong first impression.</p>
              <Fig id="a-church-not-forsaken" size="text" />
              <p>Similarly, for posts like &ldquo;Christ Gives the Gospel&rdquo; and &ldquo;Inerrancy and Evangelical Syncretism,&rdquo; I carefully pair imagery and typography to reinforce the post&apos;s subject. For the former, I use a dynamic split design with an illustration of Christ, combined with a modern, bold font for the word &ldquo;CHRIST&rdquo; to highlight its importance and draw the reader in. For the latter, I opt for a conceptual image&mdash;a jar with separated liquids&mdash;to visually represent the idea of syncretism, paired with clean, contemporary type to convey clarity and seriousness.</p>
              <CaseGrid layout="two">
                {FEATURED.title.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>
            </CaseSection>

            {/* 03 — A Consistent Frame */}
            <CaseSection id="a-consistent-frame" number={3} title="A Consistent Frame">
              <p>With a new graphic for nearly every post, the look could have drifted from week to week. What holds the set together is a fixed frame around a changing picture. Every graphic uses the same wide format, the Grace to You logo and &ldquo;gty.org/blog&rdquo; sit in the bottom-left corner, and the title gets the most room. When a post belongs to a series, its name runs small in the opposite corner (&ldquo;Frequently Abused Verses,&rdquo; &ldquo;Christian Clich&eacute;s,&rdquo; &ldquo;Paul&apos;s Gospel Essentials&rdquo;), so readers can tell at a glance which posts belong together.</p>
              <CaseGrid layout="two">
                {FEATURED.frame.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>
            </CaseSection>

            {/* 04 — Visual Metaphors */}
            <CaseSection id="visual-metaphors" number={4} title="Visual Metaphors">
              <p>Many posts deal with abstract ideas, so I often looked for one everyday object that could stand for the argument: fool&apos;s gold for &ldquo;Not All That Glitters Is Gold,&rdquo; a tin-can telephone for the cliché &ldquo;The Lord Told Me,&rdquo; a row of dominoes with one red piece for the assault on the virgin birth, a knotted rope for untangling the Lord&apos;s lineage, chess pieces for the problem of evil, and a takeout box for the takeaways from a conference Q&amp;A. A single, clear object reads in a second, even as a small thumbnail.</p>
              <CaseGrid layout="two">
                {FEATURED.metaphors.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>
            </CaseSection>

            {/* 05 — Art & Illustration */}
            <CaseSection id="art-and-illustration" number={5} title="Art &amp; Illustration">
              <p>For posts rooted in a biblical scene or a classic idea, I turned to engravings and paintings, such as Paul at Mars Hill, the Good Samaritan, and Leonardo&apos;s study of human proportions, and gave them a single-color treatment. The duotone ties very different artworks to the modern type set over them and keeps busy, detailed images calm enough to read a title against.</p>
              <CaseGrid layout="two">
                {FEATURED.art.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>
            </CaseSection>

            {/* 06 — Typography */}
            <CaseSection id="typography" number={6} title="Typography">
              <p>Most titles are set in two voices: one key word given weight and size (SOVEREIGNTY, DEPRAVITY, IDOLATRY), and the rest of the phrase set smaller and lighter around it. The type style follows the tone of the post, with heavy, condensed capitals for urgent or confrontational topics, classic serifs for reflective ones, and an occasional script word, as in &ldquo;Reconciled&rdquo; and &ldquo;Messiah,&rdquo; where a personal, handwritten touch fits the subject.</p>
              <CaseGrid layout="two">
                {FEATURED.type.map((id) => <Fig key={id} id={id} />)}
              </CaseGrid>
            </CaseSection>

            {/* 07 — The Collection */}
            <CaseSection id="the-collection" number={7} title="The Collection">
              <p>The rest of the series, each built the same way: the title first, then an image and type chosen to carry it.</p>
              <CaseGrid layout="two">
                {COLLECTION.map((g) => <CaseFigure key={g.id} src={g.src} alt={g.caption} caption={g.caption} />)}
              </CaseGrid>
            </CaseSection>

            {/* 08 — Outcome */}
            <CaseSection id="outcome" number={8} title="Outcome and Reflection">
              <CaseQuote>
                Graphics that not only attract attention but also visually encapsulate the essence of the blog post.
              </CaseQuote>
              <p>Over the series, the approach stayed the same even as the subjects changed from week to week: read the post, find the one idea the title turns on, and give it a single strong image and a clear typographic voice inside a frame readers recognize. The result is a body of graphics that each stand on their own, yet read unmistakably as Grace to You.</p>
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
