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
  CaseVideo,
  CaseGrid,
  CaseNext,
  CaseLearnings,
} from "@/components/case/CaseStudy";
import { CASE_SUMMARIES } from "@/components/data/caseSummaries";

// Design & prototype screens (Axure), grouped as in the prototype. Very tall
// full-page screens are cropped to a phone-height preview; the zoom viewer
// opens them whole.
const P = "/img/portfolio/tsba_";
const PHONE = "750 / 1624";
const Screen = ({ name, caption }) => (
  <CaseFigure src={`${P}${name}.jpg`} alt={`The Study Bible app — ${caption}`} caption={caption} size="phone" ratio={PHONE} />
);

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "results", label: "Results & Impact" },
  { id: "research", label: "Research & Goals" },
  { id: "design", label: "Mapping & Designing" },
  { id: "prototyping", label: "Prototyping & Handoff" },
  { id: "learnings", label: "Learning and Reflection" },
];

const Page = () => {

  const router = useRouter();

  useEffect(() => {
    // Mark which project to scroll back to whenever the user leaves this
    // page — including via the browser's own back button, not just the
    // "Back to Portfolio" button below.
    sessionStorage.setItem('returnToProject', 'thestudybibleapp');
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
    const projectId = 'thestudybibleapp'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    wipeThen(() => router.push('/'));
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page cyril-case-page">

          <CaseHero
            category="App Design & Prototyping"
            detail="Mobile & Tablet"
            title="The Study Bible App"
            summary={CASE_SUMMARIES["/the-study-bible-app"]}
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "User Experience Designer" },
              { label: "Deliverables", value: "Research, Interactive Prototype, Style Guide" },
              { label: "Website", value: <a className="cyril-dark" href="https://studybible.org" target="_blank" rel="noopener noreferrer">studybible.org</a> },
            ]}
            tile="/the-study-bible-app"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Overview">
              <p>The legacy Study Bible app offered unparalleled theological depth and matched the physical MacArthur Study Bible, but it was fraught with critical usability issues. As a UX designer at Grace to You, I led its redesign, released as <strong>The MacArthur Study Bible</strong> app: a rich digital resource for readers, students, and teachers who rely on John MacArthur&apos;s faithful teaching and commentary.</p>
              <p>The aim was not just to fix the legacy app, but to let users do everything they can with the physical Bible, and more and better. Not flashy, not overdone: simple, clean, yet delightful.</p>
              <CaseFigure src={`${P}project-timeline.jpg`} alt="The Study Bible app project flow, from research to public release" caption="Project flow" />
            </CaseSection>

            {/* 02 — Results & Impact */}
            <CaseSection id="results" number={2} title="Results & Impact">
              <p>At release, the app took the name of the print edition it brings to life: <strong>The MacArthur Study Bible</strong>. It was built from the redesign and prototype by the development team behind the <a className="cyril-accent" href="https://literalword.com/mobile" target="_blank" rel="noopener noreferrer"><strong>Literal Word Bible app</strong></a>, so the design reached developers already experienced in building a fast, reliable Bible reader. Learn more at <a className="cyril-accent" href="https://studybible.org" target="_blank" rel="noopener noreferrer"><strong>studybible.org</strong></a>.</p>
              <CaseVideo src="/img/portfolio/tsba_released-app.mp4" caption="The MacArthur Study Bible app" size="phone" />
            </CaseSection>

            {/* 03 — Research & Goals */}
            <CaseSection id="research" number={3} title="Research &amp; Goals">
              <p>The legacy app was packed with features: full ESV and NASB translations, over 25,000 explanatory notes from John MacArthur, an audio Bible, curated sermons, note-taking, highlighting and bookmarking, and daily devotionals. But users kept running into critical issues:</p>
              <ul className="cyril-case-list">
                <li>incompatibility with newer mobile and tablet devices</li>
                <li>login and account errors, including crashes on the login and account screens</li>
                <li>lost notes, highlights, bookmarks, and settings after logging out</li>
                <li>Bible text suddenly jumping to the end of the book of Revelation</li>
              </ul>
              <p>With the approval of the Digital Platforms Director, I analyzed user feedback, App Store reviews, and customer service tickets, held stakeholder interviews, and ran user interviews and usability tests. Several themes were consistent:</p>
              <ul className="cyril-case-list">
                <li>Users wanted cleaner, more intuitive navigation</li>
                <li>The note and highlight features felt buried or non-obvious</li>
                <li>Reading comfort, like font size and background color, mattered a lot</li>
                <li>Study progress, notes, highlights, and bookmarks should sync seamlessly between devices</li>
                <li>The audio Bible should track with the text</li>
              </ul>
              <p>To address these, I set four UX goals:</p>
              <ul className="cyril-case-list">
                <li><strong>Streamlined Navigation:</strong> Search, books and chapters, translations, audio, bookmarks, text settings, John&apos;s notes, highlights, favorites, and personal notes, all within a tap or two.</li>
                <li><strong>Enhanced Reading &amp; Study Experience:</strong> Better text layout, fewer distractions when scrolling, and easy access to John&apos;s notes.</li>
                <li><strong>More Intuitive Access to Tools &amp; Features:</strong> Note-taking, highlights, favorites, and bookmarks reachable with a tap on the verse or a long-press.</li>
                <li><strong>Seamless Syncing &amp; Personalization:</strong> A content management experience consistent with the GTY website and the GTY app, in line with GTY&apos;s effort to improve consistency across its platforms.</li>
              </ul>
            </CaseSection>

            {/* 04 — Mapping & Designing */}
            <CaseSection id="design" number={4} title="Mapping &amp; Designing">
              <p>Before designing a single screen, I mapped every piece of content and every component into one tree: the home menu, the Bible text and its navigation, John&apos;s notes, search, and the account and &ldquo;more&rdquo; screens. It became the blueprint for the navigation and the prototype that followed.</p>
              <CaseFigure src={`${P}content-tree.jpg`} alt="The Study Bible app content and component tree" caption="Content & component tree" />
              <p><strong>Reading the Bible.</strong> The text stays front and center, with translation, audio, text settings, and book-and-chapter navigation a tap away&mdash;by grid, list, or recent passages.</p>
              <CaseGrid layout="three">
                <Screen name="bible-text" caption="Bible text" />
                <Screen name="bible-text-reference" caption="Bible text with references" />
                <Screen name="bible-text-full" caption="Full chapter" />
                <Screen name="bible-version" caption="Bible version" />
                <Screen name="play-audio" caption="Audio Bible" />
                <Screen name="text-settings" caption="Text settings" />
                <Screen name="bible-navigate-grid-view" caption="Navigate: grid view" />
                <Screen name="bible-navigate-grid-view-nest" caption="Navigate: book" />
                <Screen name="bible-navigate-grid-view-nest-1" caption="Navigate: chapter" />
                <Screen name="bible-navigate-grid-view-nest-2" caption="Navigate: verse" />
                <Screen name="bible-navigate-list-view" caption="Navigate: list view" />
                <Screen name="bible-navigate-recent" caption="Navigate: recent" />
              </CaseGrid>
              <p><strong>John&apos;s notes.</strong> MacArthur&apos;s study notes and book introductions sit right alongside the text instead of buried in a menu.</p>
              <CaseGrid layout="three">
                <Screen name="johns-notes" caption="John's notes" />
                <Screen name="johns-notes-more" caption="John's notes: more" />
                <Screen name="bible-book-introduction" caption="Book introduction" />
              </CaseGrid>
              <p><strong>Search.</strong> One search for passages and words, with book suggestions as you type and filters to narrow the results.</p>
              <CaseGrid layout="three">
                <Screen name="search" caption="Search" />
                <Screen name="book-suggestion" caption="Book suggestion" />
                <Screen name="word-search-result-main" caption="Word search results" />
                <Screen name="word-search-result-with-filter" caption="Word search with filter" />
              </CaseGrid>
              <p><strong>Account and more.</strong> Logging in, notifications, feedback, rating, and sharing, redesigned around the login and account problems users reported most.</p>
              <CaseGrid layout="three">
                <Screen name="login-or-register-main" caption="Log in or register" />
                <Screen name="login-tab" caption="Log in" />
                <Screen name="logged-in" caption="Logged in" />
                <Screen name="notifications" caption="Notifications" />
                <Screen name="about" caption="About" />
                <Screen name="feedback" caption="Feedback" />
                <Screen name="rate-app" caption="Rate the app" />
                <Screen name="share" caption="Share" />
              </CaseGrid>
            </CaseSection>

            {/* 05 — Prototyping & Handoff */}
            <CaseSection id="prototyping" number={5} title="Prototyping &amp; Handoff">
              <p>To validate the goals, I built an interactive prototype and user-tested it.</p>
              <CaseGrid layout="three">
                <CaseVideo src="/img/portfolio/tsba_proto_1_home.mp4" caption="Prototype: home" size="phone" />
                <CaseVideo src="/img/portfolio/tsba_proto_2_bible-text_get-notes.mp4" caption="Prototype: Bible text & John's notes" size="phone" />
                <CaseVideo src="/img/portfolio/tsba_proto_3_bible-text_personalization.mp4" caption="Prototype: personalization" size="phone" />
                <CaseVideo src="/img/portfolio/tsba_proto_4_bible-nav.mp4" caption="Prototype: Bible navigation" size="phone" />
                <CaseVideo src="/img/portfolio/tsba_proto_5_johns-notes_main.mp4" caption="Prototype: John's notes" size="phone" />
              </CaseGrid>
              <p>Feedback from the stakeholders, Digital Platforms team, and testers was overwhelmingly positive: users found the navigation intuitive, the Bible text less distracting, and their beloved tools working as they expected.</p>
              <p>Once the high-fidelity prototype was validated, I focused on a smooth development handoff, to minimize ambiguity, accelerate build time, and reduce rework. With the guidance of the Senior Software Architect, I set up prototype walkthroughs with the developers and gave them a style guide and the prototype itself as references.</p>
              <CaseFigure src={`${P}prototype-handoff-file.jpg`} alt="The Study Bible app handoff file in Axure: the color guide and the full page tree of the prototype" caption="Handoff file: color guide and prototype page tree" />
            </CaseSection>

            {/* 06 — Learning and Reflection */}
            <CaseSection id="learnings" number={6} title="Learning and Reflection">
              <CaseLearnings
                learned={[
                  "Testing an interactive prototype with users before handoff grounded the team's choices in real feedback and built trust among stakeholders.",
                  "Prototype walkthroughs, a style guide, and the prototype itself gave developers clear references and cut down ambiguity at handoff.",
                  "Mapping every piece of content into one tree before designing a screen gave the navigation and the prototype a solid blueprint.",
                ]}
                next={[
                  "Revisit the legacy app's login, sync, and lost-notes problems against feedback on the released app.",
                  "Run another round of usability testing on navigation, notes, and highlights in the released app.",
                  "Keep aligning content management with the GTY website and GTY app so the experience stays consistent.",
                ]}
              />
              <p>I was privileged to work on this project at Grace to You. My responsibility ended after the development handoff, but the aim all along was for the app to be more than another Bible-reading tool: a simple, focused place to study, consistent with the GTY platforms ecosystem.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty_v9"
            title="Grace to You"
            category="UX Design"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
