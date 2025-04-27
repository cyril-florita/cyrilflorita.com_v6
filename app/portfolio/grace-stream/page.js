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
    const projectId = 'gracestream'; // This is the current project

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
              <img src="/img/portfolio/main_grace-stream.jpg" alt="Main Image for Grace Stream" />              
              <h2 className="cyril-mt-60">Grace Stream</h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Branding / UI/UX Design / Web Development</span>
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
                    <div className="col-md-6 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Role:</p>
                      <p className="cyril-mt-20">Product Designer &amp; Web Developer</p>
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Start / Launch Date:</p>
                      <p className="cyril-mt-20">June 2016 / Feb. 2017</p>
                    </div>
                    <div className="col-md-6 cyril-mb-30">
                      <p className="cyril-upper cyril-mb-10">Website:</p>
                      <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org/broadcasts/gracestream" target="_blank">gty.org/broadcasts/gracestream</a></p>
                    </div>
                  </div>

                  <div className="cyril-divider cyril-mb-60" />

                  <h4 className="cyril-up cyril-text-center">Project Overview</h4>
                  <p>
                    Grace Stream is a 24/7 online broadcasting platform created by Grace to You, featuring continuous teaching from John MacArthur's extensive library of sermons. Designed to provide uninterrupted access to biblically sound preaching, Grace Stream serves as a powerful resource for spiritual growth, encouragement, and discipleship. Whether you're tuning in during your morning commute, throughout your workday, or during quiet evening moments, Grace Stream delivers clear, uncompromising truth directly from God's Word&mdash;anytime, anywhere.
                  </p>
                  <p className="cyril-mt-40">
                    This project was about building something quietly powerful. Not flashy. Not overdone. Just a digital space where truth can stream 24/7&mdash;and people can tune in without distraction. As both the Product Designer and Web Developer, I set out to create an experience that reflects the heart of what this feature offers&mdash;constant access to faithful Bible teaching, presented in a way that's clean, approachable, and timeless. </p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-text-center">Concept, Branding, &amp; Visual Identity</h4>
                  
                  <p className="cyril-mt-40">
                    Grace Stream isn't just another media player—it's a 24/7 stream of John MacArthur's verse-by-verse teaching. That clarity and consistency inspired the branding approach: simple, strong, and steady. The Grace Stream wordmark is intentionally understated. It fits within the larger GTY brand ecosystem but has just enough of its own personality to stand on its own. It's designed to feel like a “channel” you can always trust. So for the logo, I knew I wanted to capture a sense of movement, peace, and spiritual depth — all while keeping things clean, modern, and versatile for both print and digital platforms. I then explored two options.
                  </p>

                  <p className="cyril-mt-40">
                    <img className="d-block w-40 float-left" src="/img/portfolio/grace-stream_logo-1.jpg" alt="Grace Stream Logo 1" />
                    <strong>Logo, version 1 &mdash; The Arrows Design:</strong> This one was about continuous movement. I wanted to create a more digital-forward feel, something that would look great on an app icon or loading screen. The open circle with arrows suggests ongoing flow, continuity, and even interactivity. It also plays into the concept of streaming itself — content that's never-ending, always accessible, always looping back in meaningful ways. The typography here was intentional to keep a strong, consistent identity across different logo uses. But visually, this one has a more tech-savvy, dynamic energy. It feels like it could sit comfortably in a UI alongside modern apps, and still carry that deeper meaning of grace moving through life.
                  </p>

                  <p className="cyril-mt-40">
                    <img className="d-block w-40 float-right" src="/img/portfolio/grace-stream_logo-2.jpg" alt="Grace Stream Logo 2" />
                    <strong>Logo, version 2 &mdash; The Wave Design:</strong> With this one, I started with a circle because it represents wholeness, unity, and continuity — which seemed really aligned with the core message of grace. Inside that circle, I used three flowing wave lines to symbolize the idea of a stream — something constantly moving, refreshing, and full of life. It felt like a natural metaphor for grace itself: not static, but always in motion, always available. I chose a deep blue because it brings calm and trust — it also hints at water and depth without being too literal. For the typography, I went with a bold sans-serif for “GRACE” to give it presence and strength, and a lighter type for “STREAM” to complement it without competing. I love how this version feels grounded and serene — perfect for contexts where the objective, yet emotional tone needs to capture people's attention.
                  </p>

                  <p className="cyril-mt-40">
                    Both of these logos were built as part of a broader visual identity system, where the goal is to have flexibility: one logo feels more grounded and organic, the other more dynamic and functional. Yet only one would represent the brand. And so the ministry decided on the Wave logo, which I then used for all digital and print assets. Depending on where Grace Stream shows up&mdash;whether it's a worship service, the GTY app, a podcast, a digital community, or at a conference — the brand can show up consistently but appropriately tailored. 
                    <img className="d-block mx-auto w-50 cyril-mt-40" src="/img/portfolio/grace-stream_logo.jpg" alt="Grace Stream Logo" />
                  </p>
                               
                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-text-center">UX/UI Design</h4>
                  <img className="float-right w-30" src="/img/portfolio/grace-stream_mobile-view.jpg" alt="Grace Stream Mobile View" />
                  <p className="cyril-mt-40">
                    
                    The user experience was all about minimizing friction. Even though this is a minimal page, every pixel was intentional. From the background textures to the soft lighting around the player module, I wanted the visuals to reinforce a sense of calm, focus, and trust. The background photo I picked captures the essence of the brand. I leaned into subtle gradients and soft neutrals, avoiding any overly trendy styles so that the experience stays classic and enduring, just like the content. It's a design that gets out of the way but still feels polished and complete. This page is about listening, not browsing.
                  </p>
                  <p className="cyril-mt-40">
                    Everything is optimized to be mobile-first, since many users might tune in while driving, working, or doing other tasks. Every touchpoint&mdash;from the play button to the info modals&mdash;is streamlined for quick access and readability. The interface is built to load fast, get out of the way, and let the stream take center stage. I intentionally avoided heavy visuals or complex interactions. The “Stream Now” section gives users just enough context without overwhelming them, and the CTA is always accessible without being pushy.
                  </p>
                  <h4 className="cyril-up cyril-text-center">Web Development, &amp; Integration of 24/7 Seamless Stream</h4>
                  <p className="cyril-mt-40">
                    This was a lean build, but a thoughtful one. Working with a Back-End Developer, I handled the front-end development, focusing on performance, responsiveness, and real-time functionality for the stream. We implemented logic to keep the stream information current, and made sure the media player behaves consistently across devices and browsers. Accessibility standards were a priority&mdash;every listener should have access, regardless of how they interact with the page.
                  </p>

                  <p className="cyril-mt-40">
                    As both the front-end developer and product designer, I wanted to integrate this broadcast system in a way that felt completely native to the Grace to You ecosystem—visually, functionally, and technically. One of the key challenges in building Grace Stream was delivering a true 24/7 live audio experience—a never-ending loop of expository preaching that just works, no matter when a listener tunes in. That's where <a className="cyril-accent" target="_blank" href="https://radio.co"><strong>Radio.co</strong></a> came in. Radio.co provided the perfect backend infrastructure for this kind of continuous audio broadcast. Its reliability, scheduling features, and embeddable player gave us the foundation we needed for a &#8220;set-it-and-forget-it&#8221; style stream that still offers control over what content goes out and when.
                  </p>

                  <p className="cyril-mt-40">
                    The Internet Ministry Coordinator, Digital Platforms Director, and I started by curating a looping playlist of John MacArthur's sermons&mdash;designed to play continuously, covering a wide range of books and topics, with carefully scheduled transitions and breaks. Using Radio.co's scheduling tools, we were able to set it up so the stream feels like a real-time broadcast, rather than a simple playlist.
                  </p>

                  <p className="cyril-mt-40">
                    From there, I customized the embedded player to match the design system of Grace Stream. I stripped away anything that felt off-brand or overly generic, styling the player with a minimal look that sits cleanly within the GTY design language. I also wrapped the stream in a custom UI that dynamically updates the &#8220;Now Playing&#8221; info. This required building a lightweight front-end component that fetches current track metadata from the Radio.co API, so users can always see which sermon is airing—even if they jump in mid-message.
                  </p>

                  <p className="cyril-mt-40">
                    Because Grace Stream is meant to be &#8220;always on,&#8221; uptime and performance were non-negotiable. The Back-end Engineer and I implemented fallback behaviors for the player and ensured smooth cross-browser playback, even on mobile and lower-powered devices. Everything had to feel instant and reliable. Press play, and it just works—whether you're on your phone in traffic or at your desk looking for background teaching. The end result is an experience that feels as seamless and stable as a traditional radio station, but with all the benefits of modern streaming and a web-native design. 
                    <img className="cyril-mt-40" src="/img/portfolio/grace-stream_website.jpg" alt="Grace Stream Website" />
                  </p>
                  <p className="cyril-mt-40">
                    Check out how <a className="cyril-accent" href="https://www.gty.org/broadcasts/gracestream" target="_blank"><strong>Grace Stream</strong></a> offers continuous, scripture-rich content that's always available.                    
                  </p>

                  <div className="cyril-divider cyril-mt-60 cyril-mb-60" />

                  <h4 className="cyril-up cyril-text-center">Reflection</h4>

                  <p className="cyril-mt-40">
                    As the Product Designer & Web Developer for Grace Stream, I embraced the challenge of building a 24/7 online broadcasting platform that feels “quietly powerful”&mdash;not flashy or overdone, but a digital space where biblical truth streams without interruption and listeners can tune in without distraction. From the outset, I focused on delivering constant access to faithful Bible teaching, presented in a way that's clean, approachable, and timeless by crafting a minimal interface where every pixel was intentional, leveraging subtle gradients and soft neutrals to reinforce calm, focus, and trust—allowing the stream to take center stage and minimizing friction across devices and contexts.
                  </p>

                  <p className="cyril-mt-40">
                    As a cross-functional parter to the Back-End Developer, Internet Ministry Coordinator, and Digital Platforms Director, I curated a looping playlist of John MacArthur's sermons and integrated a sett-and-forget-it live audio experience via Radio.co, customizing the embeddable player to match the GTY design language and dynamically update the “Now Playing” info. Grace Stream reinforced that effective product design isn't just about UI polish but about orchestrating technology, content, and mission-aligned strategy to deliver an experience that just works anytime, anywhere.
                  </p>
                  
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