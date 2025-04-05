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
    
    if (
      document.querySelector("body").classList.contains("cyril-custom-scroll")
    ) {
      document.querySelector("body").classList.remove("cyril-custom-scroll");
    }

    cyrilUtility.topBarActive();
      
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
    </Fragment>
  );

};

export default SiteLayout;