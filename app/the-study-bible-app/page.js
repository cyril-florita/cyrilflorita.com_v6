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
  { id: "challenge", label: "Challenge" },
  { id: "research", label: "Research" },
  { id: "goals", label: "Goals" },
  { id: "content-tree", label: "Mapping the Content" },
  { id: "screens", label: "Designing the Screens" },
  { id: "prototyping", label: "Prototyping" },
  { id: "handoff", label: "Handoff" },
  { id: "reflection", label: "Reflection" },
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
            summary="Leading the redesign of The Study Bible app to address the legacy app's critical usability issues with an experience that's simple, clean, yet delightful."
            facts={[
              { label: "Client", value: <><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</> },
              { label: "Role", value: "User Experience Designer" },
              { label: "Deliverables", value: "Research, Interactive Prototype, Style Guide" },
            ]}
            image="/img/portfolio/main_the-study-bible-app.jpg"
            imageAlt="The Study Bible App - Main"
          />

          <CaseLayout sections={SECTIONS}>

            {/* 01 — Overview */}
            <CaseSection id="overview" number={1} title="Project Overview">
              <p>As a UX designer at Grace to You, I had the opportunity to lead the redesign of The Study Bible app&mdash;a rich digital resource for Bible readers, students, and teachers who rely on the faithful teaching of and commentary from John MacArthur. While the legacy app offered unparalleled theological depth and matched the physical MacArthur Study Bible, it was fraught with critical usability issues.</p>
              <p>This project is not just about addressing the usability issues of the legacy app, but also about building something much more powerful. Not flashy. Not overdone. Just something that users can expect to do with the physical MacArthur Study Bible, but more and better with this digital platform. And so I set out to create an experience that reflects the heart of what this Bible app offers&mdash;convenient access to faithful Bible teaching&mdash;presented in a way that's simple, clean, yet delightful.</p>
              <CaseFigure src={`${P}project-timeline.jpg`} alt="The Study Bible app project flow, from research to public release" caption="Project flow" />
            </CaseSection>

            {/* 02 — Challenge */}
            <CaseSection id="challenge" number={2} title="The Challenge">
              <p>The legacy Study Bible app was packed with powerful features:</p>
              <ul className="cyril-case-list">
                <li>Access to full ESV and NASB Bible translations</li>
                <li>Over 25,000 explanatory notes from John MacArthur</li>
                <li>Audio Bible integration and curated sermon content</li>
                <li>Note-taking, highlighting, and bookmarking tools</li>
                <li>Daily devotionals and study tools</li>
              </ul>
              <p>But despite its robust content and features, users often encountered critical issues:</p>
              <ul className="cyril-case-list">
                <li>incompatibility with newer mobile and tablet devices</li>
                <li>login and account creation & management errors</li>
                <li>app crashing when accessing the login & account screens</li>
                <li>loss of notes, highlights, and bookmarks after logging out</li>
                <li>settings not being saved after logging out</li>
                <li>text of the Bible suddenly jumping to the end of the book of Revelation</li>
              </ul>
            </CaseSection>

            {/* 03 — Research */}
            <CaseSection id="research" number={3} title="Research &amp; Discovery">
              <p>With the leadership and approval of the Digital Platforms Director, I began by analyzing user feedback, App Store reviews, and data from the customer service tickets. I held stakeholder interviews to gather their own experience with and thoughts on the app. I also conducted targeted user interviews and usability tests.</p>
              <p>Several consistent themes emerged:</p>
              <ul className="cyril-case-list">
                <li>Users wanted cleaner, more intuitive navigation</li>
                <li>The existing note and highlight features felt buried or non-obvious</li>
                <li>Reading comfort&mdash;like font size and background color&mdash;mattered a lot</li>
                <li>Users expected their study progress, notes, highlights, and bookmarks to sync seamlessly between different devices</li>
                <li>Users wanted the audio Bible to track with the text of the Bible</li>
              </ul>
            </CaseSection>

            {/* 04 — Goals */}
            <CaseSection id="goals" number={4} title="Goals for the Redesign">
              <p>To address the issues and concerns above, I outlined three core UX goals:</p>
              <ul className="cyril-case-list">
                <li><strong>Streamlined Navigation:</strong> Ensure users could easily access the search function, change books and chapters of the Bible, change translations, play the audio Bible, set bookmarks, change text settings, access John's notes, set & access highlights, set & access favorites, write & access personal notes, and access more features &amp; materials in just a tap or two.</li>
                <li><strong>Enhanced Reading &amp; Study Experience:</strong> Improve the reading interface with better text layout, less distractions especially when scrolling down through the text, and easy access to John's notes.</li>
                <li><strong>More Intuitive Access to Tools &amp; Features:</strong> Make the note-taking, highlight, favorite, and bookmark features more user-friendly with a tap on the verse or a long-press interaction.</li>
                <li><strong>Seamless Syncing &amp; Personalization:</strong> In line with GTY's effort to improve user experience consistency and continuity in all their platforms, ensure that the content management experience is consistent with the GTY website and the GTY app.</li>
              </ul>
            </CaseSection>

            {/* 05 — Mapping the Content */}
            <CaseSection id="content-tree" number={5} title="Mapping the Content">
              <p>Before designing a single screen, I mapped every piece of content and every component in the app into one tree: the home menu, the Bible text and its navigation, John&apos;s notes, search, and the account and &ldquo;more&rdquo; screens. It became the blueprint for the navigation and the prototype that followed.</p>
              <CaseFigure src={`${P}content-tree.jpg`} alt="The Study Bible app content and component tree" caption="Content & component tree" />
            </CaseSection>

            {/* 06 — Designing the Screens */}
            <CaseSection id="screens" number={6} title="Designing the Screens">
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

            {/* 07 — Prototyping */}
            <CaseSection id="prototyping" number={7} title="Prototyping a Better Experience">
              <p>One of the central pieces of this redesign project was validating the goals above by building an interactive prototype. And once the prototype was ready, I conducted user testing to gather feedback.</p>
              <p>Feedback from the stakeholders, Digital Platforms team, and testers was overwhelmingly positive. Users found the navigation intuitive, the Bible text having less distractions, and their beloved tools working as they expected.</p>
            </CaseSection>

            {/* 08 — Handoff */}
            <CaseSection id="handoff" number={8} title="Development Handoff">
              <p>Once the high-fidelity prototype was validated through user testing, I shifted focus toward setting up a smooth development handoff. From the start, my goal was to minimize ambiguity, accelerate build time, and reduce rework cycles. And so with the guidance of the Senior Software Architect, I set up prototype walkthroughs with the developers. I also provided them with a style guide and the prototype itself to use as references.</p>
            </CaseSection>

            {/* 09 — Reflection */}
            <CaseSection id="reflection" number={9} title="Reflection">
              <CaseQuote>
                The project was a testament to the power of user-centered design.
              </CaseQuote>
              <p>I was privileged to have worked on this project at Grace to You. My responsibility ended after the development handoff. But the project was a testament to the power of user-centered design, and the prototype was a turning point in validating, iterating, and finalizing the project's vision. It grounded the Digital Platforms team's choices in real user feedback and helped build trust among the stakeholders.</p>
              <p>Moreover, by focusing on simplicity, usability, and performance, the organization aimed for The Study Bible app not just to be another Bible-reading &amp; study tool, but a platform where users could enjoy a meaningful and focused study consistent with the GTY platforms ecosystem and like no other&mdash;hence the name, <strong>The Study Bible</strong>.</p>
            </CaseSection>

          </CaseLayout>

          <CaseNext
            href="/gty-dashboard"
            title="GTY Dashboard"
            category="Design & Development"
            onBack={handleBackToPortfolio}
          />

        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;
