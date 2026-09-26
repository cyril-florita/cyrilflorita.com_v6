"use client";

import Background from "@/components/02 Background";
import Experience from "@/components/03 Experience";
import Skills from "@/components/04 Skills";
import Tools from "@/components/05 Tools";
import Education from "@/components/06 Education";
import ContactBand from "@/components/ContactBand";
import Pagination from "@/layout/Pagination";
import SiteLayout from "@/layout/SiteLayout";
import { onepage } from "@/public/utility/onepage";
import { useEffect } from "react";
import { cyrilUtility } from "@/public/utility/index";

const AboutMe = () => {

  useEffect(() => {
    document.querySelector("body").classList.add("cyril-custom-scroll");
    // Solid header like the other pages — on tablet/mobile, where this page
    // scrolls normally. Desktop keeps it transparent over the snap sections
    // (see .cyril-tp-inner in _components.scss).
    cyrilUtility.tpInner();
    return onepage();
  }, []);

  return (

    <SiteLayout header={0}>

      <div className="cyril-onepage">
        {/* The page's main heading for screen readers and search engines —
            the visible section titles (About Me, Experience, …) are <h2>s,
            which the title and reveal animations target. */}
        <h1 className="cyril-sr-only">About Cyril Florita</h1>

        {/* 02 background */}
        <Background />
        {/* 02 background end */}

        {/* 03 experience */}
         <Experience />
        {/* 03 experience end */}

        {/* 04 skills */}
        <Skills />
        {/* 04 skills end */}

        {/* 05 tools */}
        <Tools />
        {/* 05 tools end */}

        {/* 06 education */}
        <Education />
        {/* 06 education end */}

        {/* 07 contact */}
        <div className="cyril-section cyril-op-space-90" id="contact">
          <ContactBand />
        </div>

      </div>

      <Pagination direction={"left"} />

    </SiteLayout>

  );

};

export default AboutMe;
