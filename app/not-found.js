"use client";

import SiteLayout from "@/layout/SiteLayout";
import { cyrilUtility } from "@/public/utility/index";
import { onPreloaderHidden } from "@/components/Preloader";
import { useEffect } from "react";

// Exported as out/404.html; Apache serves it for missing URLs
// (ErrorDocument 404 /404.html in public/.htaccess).
const goTo = (href) => (e) => {
  e.preventDefault();
  cyrilUtility.handlePageTransition().then(() => {
    window.location.href = href;
  });
};

const NotFound = () => {
  useEffect(() => {
    cyrilUtility.tpInner();
    return onPreloaderHidden(() => {
      document.querySelector(".cyril-page")?.classList.add("cyril-active");
    });
  }, []);

  return (
    <SiteLayout>
      <div className="cyril-page cyril-not-found">
        <div className="container">
          <p className="cyril-upper subheader">
            &#91; Page <span className="cyril-accent">not found</span> &nbsp;&#93;
          </p>
          <h1 className="cyril-up glitch cyril-not-found-title" data-text="404">404</h1>
          <p className="cyril-not-found-lede">
            This page doesn&apos;t exist, or it moved. Here&apos;s a way back.
          </p>
          <div className="cyril-contact-actions">
            <a className="cyril-button" href="/" onClick={goTo("/")}>See My Work</a>
            <a className="cyril-button cyril-type-2" href="/about-me/" onClick={goTo("/about-me/")}>About Me</a>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default NotFound;
