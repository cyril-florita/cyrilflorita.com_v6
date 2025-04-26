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
    const projectId = 'gtyresources'; // This is the current project

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
                GTY Resources
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
                    <p className="cyril-mt-20"><a className="cyril-dark" href="https://www.gty.org" target="_blank">Grace to You</a>&mdash;A Christian Non-Profit Media Organization</p>
                  </div>
                  <div className="col-md-4 cyril-mb-30">
                    <p className="cyril-upper cyril-mb-10">Role:</p>
                    <p className="cyril-mt-20">Web Designer &amp; Developer</p>
                  </div>
                </div>

                <div className="cyril-divider cyril-mb-60" />

                <h4 className="cyril-up cyril-text-center">Visually Communicating Truth</h4>
                <p>
                As a designer at Grace to You, I focused on creating visuals that immediately grabbed attention and clearly communicated value. I would used a clean, modern aesthetic to highlight products that were being promoted, offered for free, or sold at a discount. My main objective is ensuring each graphic effectively promotes its intended offer. I concentrate on clarity and appeal to transform viewer interest into action by visually showcasing the benefits of each product, guaranteeing our audience recognizes the value they're receiving.
                </p>

                <div className="row">

                  <p className="cyril-upper cyril-text-sm cyril-mt-60 cyril-text-center">
                    Sales
                  </p>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Autumn-Sale-2017.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Autumn-Sale-2017.jpg" alt="gty-resource_Autumn-Sale-2017" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Autumn-Sale-2018-20.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Autumn-Sale-2018-20.jpg" alt="gty-resource_Autumn-Sale-2018-20" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Autumn-Sale-2021-22.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Autumn-Sale-2021-22.jpg" alt="gty-resource_Autumn-Sale-2021-22" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Summer-Sale-2017.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Summer-Sale-2017.jpg" alt="gty-resource_Summer-Sale-2017" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Summer-Sale-2018.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Summer-Sale-2018.jpg" alt="gty-resource_Summer-Sale-2018" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Summer-Sale-2019---Go.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Summer-Sale-2019---Go.jpg" alt="gty-resource_Summer-Sale-2019---Go" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>




                </div>

                <div className="row">

                  <p className="cyril-upper cyril-text-sm cyril-mt-60 cyril-text-center">
                    Free Product Offers
                  </p>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_44NASMDBL.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_44NASMDBL.jpg" alt="gty-resource_44NASMDBL" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_A-Jet-Tour-Through-Revelation.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_A-Jet-Tour-Through-Revelation.jpg" alt="gty-resource_A-Jet-Tour-Through-Revelation" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Alone-with-God.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Alone-with-God.jpg" alt="gty-resource_Alone-with-God" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Book---Anxious-for-Nothing.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Book---Anxious-for-Nothing.jpg" alt="gty-resource_Book---Anxious-for-Nothing" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Book---Good-News,-The-Gospel-of-Jesus-Christ.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Book---Good-News,-The-Gospel-of-Jesus-Christ.jpg" alt="gty-resource_Book---Good-News,-The-Gospel-of-Jesus-Christ" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_book---Standing-Strong.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_book---Standing-Strong.jpg" alt="gty-resource_book---Standing-Strong" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Booklet---Freedom-From-Sin.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Booklet---Freedom-From-Sin.jpg" alt="gty-resource_Booklet---Freedom-From-Sin" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Divine-Design.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Divine-Design.jpg" alt="gty-resource_Divine-Design" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Examine-Yourself-Free-1st-Time-Callers.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Examine-Yourself-Free-1st-Time-Callers.jpg" alt="gty-resource_Examine-Yourself-Free-1st-Time-Callers" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_How-to-Study-Your-Bible.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_How-to-Study-Your-Bible.jpg" alt="gty-resource_How-to-Study-Your-Bible" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Radio-Offer---CD-The-Freedom-and-Power-of-Forgiveness---1st-Time-Callers-copy.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Radio-Offer---CD-The-Freedom-and-Power-of-Forgiveness---1st-Time-Callers-copy.jpg" alt="gty-resource_Radio-Offer---CD-The-Freedom-and-Power-of-Forgiveness---1st-Time-Callers-copy" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Remember-and-Return-with-MacArthur-Study-Bible-Purchase-r1.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Remember-and-Return-with-MacArthur-Study-Bible-Purchase-r1.jpg" alt="gty-resource_Remember-and-Return-with-MacArthur-Study-Bible-Purchase-r1" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_saved-without-a-doubt.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_saved-without-a-doubt.jpg" alt="gty-resource_saved-without-a-doubt" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Store-Offer---Drawing-Near-with-MacArthur-Study-Bible-Purchase.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Store-Offer---Drawing-Near-with-MacArthur-Study-Bible-Purchase.jpg" alt="gty-resource_Store-Offer---Drawing-Near-with-MacArthur-Study-Bible-Purchase" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Store-Offer---One-Foundation-with-MSB-Purchase-2.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Store-Offer---One-Foundation-with-MSB-Purchase-2.jpg" alt="gty-resource_Store-Offer---One-Foundation-with-MSB-Purchase-2" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Study-Bible-and-Lord-Teach-Me-to-Pray.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Study-Bible-and-Lord-Teach-Me-to-Pray.jpg" alt="gty-resource_Study-Bible-and-Lord-Teach-Me-to-Pray" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                </div>

                
                <div className="row">

                  <p className="cyril-upper cyril-text-sm cyril-mt-60 cyril-text-center">
                    Product Promos
                  </p>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_2---Designed-with-preachers-in-mind-copy.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_2---Designed-with-preachers-in-mind-copy.jpg" alt="gty-resource_2---Designed-with-preachers-in-mind-copy" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_3---John-MacArthur-was-asked-copy.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_3---John-MacArthur-was-asked-copy.jpg" alt="gty-resource_3---John-MacArthur-was-asked-copy" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_4---The-most-important-feature-is-the-text-itself-copy.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_4---The-most-important-feature-is-the-text-itself-copy.jpg" alt="gty-resource_4---The-most-important-feature-is-the-text-itself-copy" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_12---Text-and-binding..jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_12---Text-and-binding..jpg" alt="gty-resource_12---Text-and-binding." />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_16---Lays-flat.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_16---Lays-flat.jpg" alt="gty-resource_16---Lays-flat" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_17---Crafted-for-faithful-workmen.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_17---Crafted-for-faithful-workmen.jpg" alt="gty-resource_17---Crafted-for-faithful-workmen" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_19---Smyth-sewn.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_19---Smyth-sewn.jpg" alt="gty-resource_19---Smyth-sewn" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_21---NASB-ver2.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_21---NASB-ver2.jpg" alt="gty-resource_21---NASB-ver2" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_22---Today-ver1.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_22---Today-ver1.jpg" alt="gty-resource_22---Today-ver1" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_22---Today-ver2.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_22---Today-ver2.jpg" alt="gty-resource_22---Today-ver2" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_Legacy-Standard-Bible---NT-and-Psalms.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_Legacy-Standard-Bible---NT-and-Psalms.jpg" alt="gty-resource_Legacy-Standard-Bible---NT-and-Psalms" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_The-MacArthur-Study-Bible---2nd-Edition-r2.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_The-MacArthur-Study-Bible---2nd-Edition-r2.jpg" alt="gty-resource_The-MacArthur-Study-Bible---2nd-Edition-r2" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_The-MacArthur-Study-Bible---2nd-Edition.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_The-MacArthur-Study-Bible---2nd-Edition.jpg" alt="gty-resource_The-MacArthur-Study-Bible---2nd-Edition" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_the-macarthur-study-bible.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_the-macarthur-study-bible.jpg" alt="gty-resource_the-macarthur-study-bible" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_The-Preachers-Bible-v1.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_The-Preachers-Bible-v1.jpg" alt="gty-resource_The-Preachers-Bible-v1" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_The-Preachers-Bible-v2.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_The-Preachers-Bible-v2.jpg" alt="gty-resource_The-Preachers-Bible-v2" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>

                  <div className="col-md-6 cyril-mt-40">
                    <a
                      href="/img/portfolio/gty-resource_The-Preachers-Bible-v3.jpg"
                      className="cyril-project-figure mfp-image"
                      data-effect="mfp-zoom-in"
                    >
                      <div className="cyril-cover">
                        <img src="/img/portfolio/gty-resource_The-Preachers-Bible-v3.jpg" alt="gty-resource_The-Preachers-Bible-v3" />
                        <div className="cyril-hover-link">
                          <i className="fa fa-search-plus" />
                        </div>
                      </div>
                    </a>
                  </div>


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