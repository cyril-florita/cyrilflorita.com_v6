"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  useEffect(() => {
    cyrilUtility.tpInner();
    setTimeout(() => {
      const pageElement = document.querySelector('.cyril-page');
      if (pageElement) {
        pageElement.classList.add('cyril-active');
      }
    }, 100);
  }, []);

  // Function to handle back navigation and save scroll position
  const handleBackToPortfolio = () => {
    // Get the project ID or identifier
    const projectId = 'gtyblog'; // This is the current project

    // Save the project ID for the portfolio page to use
    sessionStorage.setItem('returnToProject', projectId);
    router.push('/portfolio');
  };

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page cyril-project-page">
          {/* .container */}
          <div className="container">

            {/* top banner */}
            <div className="cyril-top-banner cyril-text-center">
              <h2 className="cyril-mt-60">
                GTY Blog Graphics
              </h2>
              <h2 className="cyril-upper"></h2>
              <p className="cyril-upper cyril-mt-30 cyril-mb-40">
                <span className="cyril-accent">Marketing</span>
              </p>

            </div>
            {/* dend of top banner */}

            {/* main content */}
            <div className="row cyril-mb-60">

              <div className="cyril-project-content">

                <div className="cyril-divider cyril-mb-60" />

                <div className="row cyril-mb-20">
                  <div className="col-md-8 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Employer:</p>
                    <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Media Organization</p>
                  </div>
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Role:</p>
                    <p className="cyril-mt-20">Web Designer &amp; Developer</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Visually Communicating Truth</h4>
                <p>
                  When I designed blog graphics for Grace to You, I would always start by considering the core theme and title of each post, as these elements would guide my visual choices. For example, for a post titled &ldquo;A Church Not Forsaken,&rdquo; I selected a serene image of a church bathed in warm light, evoking a sense of hope and steadfastness that matches the message. The font I chose is bold and classic, ensuring the title stands out and immediately communicates the gravity and reassurance of the topic. The overall composition is uncluttered, allowing the viewer's attention to be drawn to both the image and the text without distraction, which is crucial for making a strong first impression.
                </p>

                <div className="offset-md-3 col-md-6 cyril-mt-40">
                  <a
                    href="/img/portfolio/gty-blog_a-church-not-forsaken.jpg"
                    className="cyril-project-figure mfp-image"
                    data-effect="mfp-zoom-in"
                  >
                    <div className="cyril-cover">
                      <img src="/img/portfolio/gty-blog_a-church-not-forsaken.jpg" alt="gty-blog_a-church-not-forsaken.jpg" />
                      <div className="cyril-hover-link">
                        <i className="fa fa-search-plus" />
                      </div>
                    </div>
                  </a>
                </div>

                <p className="cyril-mt-40">
                  Similarly, for posts like &ldquo;Christ Gives the Gospel&rdquo; and &ldquo;Inerrancy and Evangelical Syncretism,&rdquo; I carefully pair imagery and typography to reinforce the post's subject. For the former, I use a dynamic split design with an illustration of Christ, combined with a modern, bold font for the word &ldquo;CHRIST&rdquo; to highlight its importance and draw the reader in. For the latter, I opt for a conceptual image&mdash;a jar with separated liquids&mdash;to visually represent the idea of syncretism, paired with clean, contemporary type to convey clarity and seriousness.
                </p>

                <div className="row">

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_Christ-gives-the-gospel.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_Christ-gives-the-gospel.jpg" alt="gty-blog_Christ-gives-the-gospel.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_inerrancy-and-evangelical-syncretism.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_inerrancy-and-evangelical-syncretism.jpg" alt="gty-blog_inerrancy-and-evangelical-syncretism.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                </div>

                <p className="cyril-mt-40">
                  In every case, my goal is to create graphics that not only attract attention but also visually encapsulate the essence of the blog post, making the content inviting and memorable for readers.
                </p>

                <div className="row">

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_a-world-gone-mad.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_a-world-gone-mad.jpg" alt="gty-blog_a-world-gone-mad.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_and-His-Name-shall-be-called.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_and-His-Name-shall-be-called.jpg" alt="gty-blog_and-His-Name-shall-be-called.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_answering-tough-questions-about-forgiveness.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_answering-tough-questions-about-forgiveness.jpg" alt="gty-blog_answering-tough-questions-about-forgiveness.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_assaulting-the-nature-of-truth.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_assaulting-the-nature-of-truth.jpg" alt="gty-blog_assaulting-the-nature-of-truth.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_commendation-of-a-persecuted-church.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_commendation-of-a-persecuted-church.jpg" alt="gty-blog_commendation-of-a-persecuted-church.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_contentment-and-providence.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_contentment-and-providence.jpg" alt="gty-blog_contentment-and-providence.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_courageous-Christianity.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_courageous-Christianity.jpg" alt="gty-blog_courageous-Christianity.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_dethroning-the-Judge.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_dethroning-the-Judge.jpg" alt="gty-blog_dethroning-the-Judge.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_digital-disrupters.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_digital-disrupters.jpg" alt="gty-blog_digital-disrupters.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_election-and-Christ.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_election-and-Christ.jpg" alt="gty-blog_election-and-Christ.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_engaging-without-embibing.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_engaging-without-embibing.jpg" alt="gty-blog_engaging-without-embibing.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_faith-as-Christ-defined-it.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_faith-as-Christ-defined-it.jpg" alt="gty-blog_faith-as-Christ-defined-it.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_false-Gods-fake-images.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_false-Gods-fake-images.jpg" alt="gty-blog_false-Gods-fake-images.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_Gods-unimpeachable-sovereignty.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_Gods-unimpeachable-sovereignty.jpg" alt="gty-blog_Gods-unimpeachable-sovereignty.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_He-loved-them-to-the-end.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_He-loved-them-to-the-end.jpg" alt="gty-blog_He-loved-them-to-the-end.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_in-the-world-but-not-of-it.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_in-the-world-but-not-of-it.jpg" alt="gty-blog_in-the-world-but-not-of-it.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_inerrancy-and-evangelical-syncretism.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_inerrancy-and-evangelical-syncretism.jpg" alt="gty-blog_inerrancy-and-evangelical-syncretism.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_is-there-a-temple-in-heaven.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_is-there-a-temple-in-heaven.jpg" alt="gty-blog_is-there-a-temple-in-heaven.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_legalism-and-assurance.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_legalism-and-assurance.jpg" alt="gty-blog_legalism-and-assurance.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_limitless-love.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_limitless-love.jpg" alt="gty-blog_limitless-love.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_looking-for-truth-in-the-wrong-places.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_looking-for-truth-in-the-wrong-places.jpg" alt="gty-blog_looking-for-truth-in-the-wrong-places.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_loving-the-local-church.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_loving-the-local-church.jpg" alt="gty-blog_loving-the-local-church.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_no-other-gospel.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_no-other-gospel.jpg" alt="gty-blog_no-other-gospel.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_not-all-that-glitters-is-gold.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_not-all-that-glitters-is-gold.jpg" alt="gty-blog_not-all-that-glitters-is-gold.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_one-race-one-remedy.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_one-race-one-remedy.jpg" alt="gty-blog_one-race-one-remedy.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_pauls-gospel-essential.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_pauls-gospel-essential.jpg" alt="gty-blog_pauls-gospel-essential.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_people-who-missed-Christmas.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_people-who-missed-Christmas.jpg" alt="gty-blog_people-who-missed-Christmas.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_purpose-of-the-parable-of-the-vineyard.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_purpose-of-the-parable-of-the-vineyard.jpg" alt="gty-blog_purpose-of-the-parable-of-the-vineyard.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_reconciled-in-Christ.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_reconciled-in-Christ.jpg" alt="gty-blog_reconciled-in-Christ.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_replacing-worry-with-the-right-focus.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_replacing-worry-with-the-right-focus.jpg" alt="gty-blog_replacing-worry-with-the-right-focus.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_seduced-by-mysticism.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_seduced-by-mysticism.jpg" alt="gty-blog_seduced-by-mysticism.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_social-injustice-and-the-gospel.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_social-injustice-and-the-gospel.jpg" alt="gty-blog_social-injustice-and-the-gospel.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_soteriology-of-the-thief.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_soteriology-of-the-thief.jpg" alt="gty-blog_soteriology-of-the-thief.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_stop-complaining.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_stop-complaining.jpg" alt="gty-blog_stop-complaining.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_takeaway-from-the-shepcon-qna-session.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_takeaway-from-the-shepcon-qna-session.jpg" alt="gty-blog_takeaway-from-the-shepcon-qna-session.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_teach-the-word.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_teach-the-word.jpg" alt="gty-blog_teach-the-word.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-assault-on-the-virgin-birth-of-Christ.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-assault-on-the-virgin-birth-of-Christ.jpg" alt="gty-blog_the-assault-on-the-virgin-birth-of-Christ.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-Bible-is-timeless-truth.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-Bible-is-timeless-truth.jpg" alt="gty-blog_the-Bible-is-timeless-truth.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-centraility-of-man-in-creation.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-centraility-of-man-in-creation.jpg" alt="gty-blog_the-centraility-of-man-in-creation.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-coming-Messiah.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-coming-Messiah.jpg" alt="gty-blog_the-coming-Messiah.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-condemnation-in-Gods-love.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-condemnation-in-Gods-love.jpg" alt="gty-blog_the-condemnation-in-Gods-love.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-danger-of-calling-the-church-to-repent.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-danger-of-calling-the-church-to-repent.jpg" alt="gty-blog_the-danger-of-calling-the-church-to-repent.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-fear-of-man.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-fear-of-man.jpg" alt="gty-blog_the-fear-of-man.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-fertile-ground.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-fertile-ground.jpg" alt="gty-blog_the-fertile-ground.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-great-exchange.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-great-exchange.jpg" alt="gty-blog_the-great-exchange.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-illegitimacy-of-the-pope.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-illegitimacy-of-the-pope.jpg" alt="gty-blog_the-illegitimacy-of-the-pope.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-inescapable-truth-about-God.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-inescapable-truth-about-God.jpg" alt="gty-blog_the-inescapable-truth-about-God.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-Lord-told-me.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-Lord-told-me.jpg" alt="gty-blog_the-Lord-told-me.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-problem-of-evil.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-problem-of-evil.jpg" alt="gty-blog_the-problem-of-evil.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-right-kind-of-hunger.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-right-kind-of-hunger.jpg" alt="gty-blog_the-right-kind-of-hunger.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-sovereign-Savior.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-sovereign-Savior.jpg" alt="gty-blog_the-sovereign-Savior.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-subtlety-of-idolatry.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-subtlety-of-idolatry.jpg" alt="gty-blog_the-subtlety-of-idolatry.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-totality-of-depravity.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-totality-of-depravity.jpg" alt="gty-blog_the-totality-of-depravity.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_the-truth-about-man.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_the-truth-about-man.jpg" alt="gty-blog_the-truth-about-man.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_ultimate-expression-divine-compassion.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_ultimate-expression-divine-compassion.jpg" alt="gty-blog_ultimate-expression-divine-compassion.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_unqualified-not-worthy.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_unqualified-not-worthy.jpg" alt="gty-blog_unqualified-not-worthy.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_untangling-the-Lords-lineage.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_untangling-the-Lords-lineage.jpg" alt="gty-blog_untangling-the-Lords-lineage.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_watching-your-spiritual-diet.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_watching-your-spiritual-diet.jpg" alt="gty-blog_watching-your-spiritual-diet.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_what-is-the-eye-of-a-needle.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_what-is-the-eye-of-a-needle.jpg" alt="gty-blog_what-is-the-eye-of-a-needle.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-blog_when-truth-is-stranger-than-fiction.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-blog_when-truth-is-stranger-than-fiction.jpg" alt="gty-blog_when-truth-is-stranger-than-fiction.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>


                  {/*
                  
                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/IMAGE_HERE.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/IMAGE_HERE.jpg" alt="IMAGE_HERE.jpg" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>
                  
                  */}

                </div>
                {/* end of .row */}

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