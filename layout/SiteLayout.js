"use client";
import { usePathname } from "next/navigation";

import ZoomViewer from "@/components/ZoomViewer";
import { Fragment, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ThemeToggle from "./ThemeToggle";
import MotionEffects from "./MotionEffects";
import ScrollProgress from "./ScrollProgress";
import { cyrilUtility } from "@/public/utility/index";

const SiteLayout = ({ children, header, footer, noFooter }) => {
  // next.config.js sets trailingSlash: true, so on the exported site
  // usePathname() returns e.g. "/about-me/" rather than "/about-me" — strip
  // it so cyrilUtility.handleBackToTop's pathname === '/about-me' check
  // below actually matches (root "/" never gets a trailing slash).
  const rawPathname = usePathname();
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/$/, '') : rawPathname;
  // Every route besides "/" and "/about-me" is a project page.
  const isProjectPage = pathname !== '/' && pathname !== '/about-me';

  useEffect(() => {
    if (document.querySelector("body").classList.contains("cyril-custom-scroll")) {
      document.querySelector("body").classList.remove("cyril-custom-scroll");
    }

    cyrilUtility.topBarActive();
    cyrilUtility.backToTop();
    cyrilUtility.builtTextVisibility();
    cyrilUtility.swiperSliderSameHeight();
    cyrilUtility.revealOnScroll();
  }, []);

  return (
    <Fragment>
      {/* First Tab stop: jump past the header/nav straight to the page. */}
      <a className="cyril-skip-link" href="#main">Skip to content</a>
      <MotionEffects />
      {isProjectPage && <ScrollProgress />}
      <ZoomViewer />
      <div className="cyril-frame">
        <ThemeToggle />
        <Header header={header} />
        {!noFooter && <Footer footer={footer} />}
      </div>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <div className="cyril-built">
        <p>Built with React, NextJS, &amp; some cool JS libraries &amp; plugins, in collaboration with <a className="cyril-dark" href="https://www.trae.ai" target="_blank">TRAE</a>, and with lots of <i className="fa fa-heart"></i></p>
      </div>
      <button 
        className="cyril-back-to-top"
        onClick={() => cyrilUtility.handleBackToTop(pathname)}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </Fragment>
  );
};

export default SiteLayout;