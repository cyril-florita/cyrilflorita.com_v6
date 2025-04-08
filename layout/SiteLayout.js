"use client";

import ImageGallery from "@/components/popup/ImageGallery";
import ImageView from "@/components/popup/ImageView";
import { Fragment, useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Social from "./Social";
import { cyrilUtility } from "@/utility/index";

const SiteLayout = ({ children, header, footer, noFooter }) => {
  useEffect(() => {
    if (document.querySelector("body").classList.contains("cyril-custom-scroll")) {
      document.querySelector("body").classList.remove("cyril-custom-scroll");
    }

    cyrilUtility.topBarActive();
      
    const handleScroll = () => {
      const backToTop = document.querySelector('.cyril-back-to-top');
      if (backToTop) {
        if (window.scrollY > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Fragment>
      <ImageView />
      <ImageGallery />
      <div className="cyril-frame">
        <Social />
        <Header header={header} />
        {!noFooter && <Footer footer={footer} />}
      </div>
      {children}
      <button 
        className="cyril-back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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