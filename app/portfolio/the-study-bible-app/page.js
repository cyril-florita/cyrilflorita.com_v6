"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {

  const router = useRouter();

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    cyrilUtility.tpInner();
    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);

    // Scroll Tracking
    cyrilUtility.trackScrollProgress(setScrollProgress);

  }, []);

  // Function to handle back navigation and save scroll position
  const handleBackToPortfolio = () => {
    // Get the project ID or identifier
    const projectId = 'thestudyBibleapp'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    router.push('/portfolio');
  };

  return (
    <SiteLayout>
      {/* Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '7px',
          width: `${scrollProgress}%`,
          backgroundColor: '#fa4729',
          zIndex: 1000,
          transition: 'width 0.1s ease-out'
        }}
      />
      <div>
        <div className="cyril-page cyril-project-page">

          {/* .container */}
          <div className="container">

            {/* top banner */}
            <div className="cyril-top-banner cyril-text-center">
              <img src="/img/portfolio/main_the-study-Bible-app.jpg" alt="The Study Bible App - Main" />
              <h2 className="cyril-mt-60">The Study Bible App</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">App Design</span>
              </p>
            </div>
            {/* dend of top banner */}

            {/* main content */}
            <div className="row cyril-mb-60">

              <div className="cyril-project-content">

                <div className="cyril-divider cyril-mb-60" />

                <div className="row cyril-mb-20">
                  <div className="col-md-6 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Employer:</p>
                    <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</p>
                  </div>
                  <div className="col-md-3 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Role:</p>
                    <p className="cyril-mt-20">User Experience Designer</p>
                  </div>
                  <div className="col-md-3 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Start / Launch Date:</p>
                    <p className="cyril-mt-20">June 2024 / Soon</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Project Overview</h4>

                <dl className="no-disc">
                  <dd>
                    As a UX designer at Grace to You, I had the opportunity to lead the redesign of The Study Bible app&mdash;a rich digital resource for Bible readers, students, and teachers who rely on the faithful teaching of and commentary from John MacArthur. While the legacy app offered unparalleled theological depth and matches the physical MacArthur Study Bible, it is froth critical usability issues.
                  </dd>
                  <dd>
                    This project is not just about addressing the usability issues the legacy app, but also about building something quite more powerful. Not flashy. Not overdone. Just something that users can expect to do with the physical MacArthur Study Bible, but more and better with this digital platform. And so I set out to create an experience that reflects the heart of what this Bible app offers&mdash;convenient access to faithful Bible teaching&mdash;presented in a way that's simple, clean, yet delightful.
                  </dd>
                  <dd>
                    <p className="cyril-text-sm cyril-accent">
                      <strong>&#40;Video/screenshots of the design process, the prototypes, and the actual app will be published on this page once it launches.&#41;</strong>
                    </p>                    
                  </dd>
                </dl>

                <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">The Challenge</h4>

                <dl className="no-disc">
                  <dd>
                    The Study Bible app was packed with powerful features:
                    <dl className="w-disc">
                      <dd>
                        Access to full ESV and NASB Bible translations
                      </dd>
                      <dd>
                        Over 25,000 explanatory notes from John MacArthur
                      </dd>
                      <dd>
                        Audio Bible integration and curated sermon content
                      </dd>
                      <dd>
                        Note-taking, highlighting, and bookmarking tools
                      </dd>
                      <dd>
                        Daily devotionals and study tools
                      </dd>
                    </dl>
                  </dd>
                  <dd>
                    But despite its robust content and features, users often encounter critical issues:
                    <dl className="w-disc">
                      <dd>
                        incompatibility with newer mobile and tablet devices
                      </dd>
                      <dd>
                        login and account creation & management errors
                      </dd>
                      <dd>
                        app crashing when accessing the login & account screens
                      </dd>
                      <dd>
                        loss of notes, highlights, and bookmarks after logging out
                      </dd>
                      <dd>
                        settings not being saved after logging out
                      </dd>
                      <dd>
                        text of the Bible suddenly jumping to the end of the book of Revelation
                      </dd>
                    </dl>
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Research &amp; Discovery</h4>

                <dl className="no-disc">
                  <dd>
                    With the leadership and approval of the Digital Platforms Director, I began by analyzing user feedback, App Store reviews, and data from the customer service tickets. I held stakeholder interviews to gather their own experience with and thoughts on the app. I also conducted targeted user interviews and usability tests.
                  </dd>
                  <dd>
                    Several consistent themes emerged:
                    <dl className="w-disc">
                      <dd>
                        Users wanted cleaner, more intuitive navigation
                      </dd>
                      <dd>
                        The existing note and highlight features felt buried or non-obvious
                      </dd>
                      <dd>
                        Reading comfort&mdash;like font size and background color&mdash;mattered a lot
                      </dd>
                      <dd>
                        Users expected their study progress, notes, highlights, and bookmars to sync seamlessly between different devices
                      </dd>
                      <dd>
                        Users wanted the audio Bible to track with the text of the Bible
                      </dd>
                    </dl>
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Goals for the Redesign</h4>

                <dl className="no-disc">
                  <dd>
                    To address these issues, I outlined three core UX goals:
                    <dl className="w-disc">
                      <dd>
                        <strong>Streamlined Navigation:</strong> Ensure users could easily access the search function, change books and chapters of the Bible, change translations, play the audio Bible, set bookmarks, change text settings, access John's notes, set & access highlights, set & access favorites, write & access personal notes, and access more features and materials in just a tap or two.
                      </dd>
                      <dd>
                        <strong>Enhanced Reading &amp; Study Experience:</strong>Improve the reading interface with better text layout, less distractions especially when scrolling down through the text, and easy access to John's notes.
                      </dd>
                      <dd>
                        <strong>More Intituive Access to Tools &amp; Features:</strong> Make the note-taking, highlight, favorite, and bookmark features more user-friendly with a long-press interaction.
                      </dd>
                      <dd>
                        <strong>Seamless Syncing &amp; Personalization:</strong> With GTY's effort to improve in all their platforms, ensure that the content management experience is consistent with the GTY website and the GTY app.
                      </dd>
                    </dl>
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Prototyping a Better Experience</h4>

                <dl className="no-disc">
                  <dd>
                    One of the central pieces of this redesign project was validating the goals above by building an interactive prototype. And once the prototype was ready, I conducted user testing to gather feedback.
                  </dd>
                  <dd>
                    Feedback from the stakeholders, Digital Platforms team, and testers was overwhelmingly positive. Users found the navigation intuitive, the Bible text having less distractions, and their beloved tools working as they expected.
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Development Handoff</h4>

                <dl className="no-disc">
                  <dd>
                    Once the high-fidelity prototype was validated through user testing, I shifted focus toward setting up a smooth development handoff. From the start, my goal was to minimize ambiguity, accelerate build time, and reduce rework cycles. And so with the guidance of the Senior Software Architect, I set up prototype walkthroughs with the developers and provided them with the prototype itself and with a style guide they could use as references.
                  </dd>
                </dl>

                <h4 className="cyril-up cyril-text-center">Reflection</h4>

                <dl className="no-disc">
                  <dd>
                    I was privileged to have worked on this project at Grace to You. My responsbility ended after the development handoff. But the project was a testament to the power of user-centered design, and the prototype was a turning point in validating, iterating, and finalizing the project's vision. It grounded the Digital Platforms team's choices in real user feedback and helped build trust among the stakeholders.
                  </dd>
                  <dd>
                    Moreover, by focusing on simplicity, usability, and performance, the organization aimed for The Study Bible app not just to be another bible-reading &amp; study tool, but a platform where users could enjoy a meaningful and focused study consistent with the GTY platforms ecosystem and like no other&mdash;hence the name, <strong>The Study Bible</strong>.                    
                  </dd>
                </dl>

                {/* pagination */}
                <div className="cyril-pagination-panel cyril-mt-60">
                  <button
                    onClick={handleBackToPortfolio}
                    className="cyril-button cyril-type-2 cyril-mb-30"
                  >
                    <svg className="cyril-prev" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    Back to Portfolio
                  </button>
                </div>
                {/* end of pagination */}

              </div>
              {/* end of <div className="offset-lg-1-custom col-lg-9"> */}

            </div>
            {/* end of .row */}
            {/* end of main content */}

          </div>
          {/* end of .container */}

        </div>
      </div>
    </SiteLayout>
  );
};

export default page;