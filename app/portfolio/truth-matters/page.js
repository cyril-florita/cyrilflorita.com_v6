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
    const projectId = 'truthmatters'; // This is the current project

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
              <img src="/img/portfolio/main_truth-matters-podcast.jpg" alt="cover" />              
              <h2 className="cyril-mt-60">Truth Matters Podcast</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Branding, UX Design, and Front-End Development</span>
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
                      <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Non-Profit Media Organization</p>
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Role:</p>
                      <p className="cyril-mt-20">Product Designer &amp; Web Developer</p>
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Start / Launch Date:</p>
                      <p className="cyril-mt-20">Jan. / Apr. 2021</p>
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Website:</p>
                      <p className="cyril-mt-20"><a className="cyril-dark" href="https://truthmatterspodcast.gty.org" target="_blank">truthmatterspodcast.gty.org</a></p>
                    </div>
                  </div>

                  <div className="cyril-divider cyril-mb-60" />

                  <h4 className="cyril-up cyril-mb-30 cyril-text-center">Project Overview</h4>
                  <p>The Truth Matters Podcast is a media production by Grace to You. In each episode, host Darrell Harrison welcomes a guest to explore a featured resource from the Grace to You collection—whether it's a book, sermon, or blog series by John MacArthur. Together, they dive into the inspiration behind the resource, its core message, and why it still matters for the church today.</p>
                  <p className="cyril-mt-40">
                  As the Product Designer and Developer behind the Truth Matters Podcast, my goal was to create a digital experience that felt as grounded and compelling as the content itself. This project was one of those many projects for Grace to You where I got to wear many hats and ensure every touchpoint—from the logo to the episode pages—told a consistent story. It brought together three core roles I love: branding, UX/UI design, and front-end development.</p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Branding &amp; Visual Identity</h4>
                  <p className="cyril-mt-40">
                    From the start, I wanted the branding to echo the tone of the podcast—casual, yet theologically serious, thoughtful, and grounded in biblical truth. The logo is minimal yet strong, designed to reflect clarity and conviction that you would expect from Grace to You. I stuck to a muted, sophisticated color palette (deep charcoal, soft neutrals) to reinforce the show's tone: no hype, just truth. Typography was critical too&mdash;consistent with Grace to You's style, sharp, readable fonts that convey authority without being loud.
                  </p>

                  <div className="row cyril-mt-40">
                    <div className="col-md-6 cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_logo.jpg" alt="cover" />
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_icon.jpg" alt="cover" />
                    </div>
                    <div className="offset-md-3 col-md-6 cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_mug.jpg" alt="cover" />
                    </div>
                  </div>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">Graphics &amp; Supporting Media</h4>
                  <p className="cyril-mt-40">
                    Each podcast episode has its own hero product/imagery and thematic layout, designed to reflect the subject matter while staying true to the brand system. I created all the assets in-house, including episode thumbnail, podcast artwork, website banners, and social share images. These were crafted to feel cohesive yet distinctive, giving each episode a unique identity within the larger Truth Matters Podcast brand.
                  </p>
                  
                  <div className="row cyril-mt-40">
                    <div className="col-md-6 cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_youtube-thumb-1.jpg" alt="cover" />
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_youtube-thumb-2.jpg" alt="cover" />
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_episode-artwork-1.jpg" alt="cover" />
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_episode-artwork-2.jpg" alt="cover" />
                    </div>
                    <div className="offset-md-3 col-md-6 cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_apple-podacast.png" alt="cover" />
                    </div>
                  </div>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-mt-60 cyril-mb-30 cyril-text-center">UX Design, Web Development, &amp; Podcast Integration</h4>
                  <p className="cyril-mt-40">
                    The user journey was my next focus. With the guidance of the Senior Software Architect, I developed the site using WordPress for a more practical content publication and management. I designed the site to be clean, minimal, content-first, and easy to navigate. It's built with a focus on SEO and accessibility, ensuring that the podcast is easily discoverable, playable, and engaging for all audience. I kept the UI minimal so the podcast episodes and visuals could shine. There's the ability for the user to engage by leaving a comment or sharing the episode on social media. I also built a fully responsive experience that works seamlessly on mobile—because I knew a lot of listeners would be discovering this on the go.
                  </p>
                  <p className="cyril-mt-40">
                     The homepage showcases the most recent episodes with a global media player for immediate listening/watching, and one that does not get interrupted while trying to navigate the website. The media player keeps visitors focused on the main task of consuming great content. Any where in the site, there is the straightforward access to episodes, with a sidebar menu and clear CTAs ("Listen/Play," "Share," and "Subcribe").
                  </p>

                  <div className="row cyril-mt-40">                  
                    <div className="cyril-mb-30">
                      <img src="/img/portfolio/truth-matters_website.png" alt="cover" />
                    </div>
                  </div>                  
                  
                  {/* pagination */}
                  <div className="cyril-pagination-panel cyril-mt-60">
                    <button
                      onClick={handleBackToPortfolio}
                      className="cyril-button cyril-type-2 cyril-mb-30"
                    >
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