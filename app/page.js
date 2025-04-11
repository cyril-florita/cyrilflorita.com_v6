"use client";

import Intro from "@/components/01 Intro";
import Background from "@/components/02 Background";
import Experience from "@/components/03 Experience";
import Skills from "@/components/04 Skills";
import Tools from "@/components/05 Tools";
import Education from "@/components/06 Education";
import Pagination from "@/layout/Pagination";
import SiteLayout from "@/layout/SiteLayout";
import { onepage } from "@/public/utility/onepage";
import { useEffect } from "react";

const Index = () => {

  useEffect(() => {
    document.querySelector("body").classList.add("cyril-custom-scroll");
    onepage();
    setTimeout(() => {
      document.querySelector('.cyril-onepage')?.classList.add('loaded');
    }, 100);
  }, []);

  return (

    <SiteLayout header={0}>
      
      <div className="cyril-onepage">

        {/* 01 intro */}
        <Intro />
        {/* 01 intro end */}

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

      </div>

      <Pagination direction={"left"} />

    </SiteLayout>

  );
  
};

export default Index;