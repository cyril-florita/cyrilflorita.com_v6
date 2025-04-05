"use client";
import SiteLayout from "@/layout/SiteLayout";
import dynamic from "next/dynamic";
import { cyrilUtility } from "@/utility/index";
import { useEffect } from "react";

const PortfolioIsotope = dynamic(
  () => import("@/components/PortfolioIsotope"),
  {
    ssr: false,
  }
);

const Page = () => {

  useEffect(() => {
    cyrilUtility.tpInner();
  }, []);

  return (
    <SiteLayout>
      <div>
        <div className="cyril-page">
          <div
            className="cyril-bg-item"
            style={{ top: "3%", right: "15%", transform: "rotate(-45deg)" }}
          />
          <div className="container">
            <div className="cyril-top-banner">
              <p className="cyril-upper cyril-mb-30 subheader">
                My <span className="cyril-accent">projects:</span>
              </p>
              <h2 className="cyril-up cyril-mb-30">Portfolio</h2>
              <p className="cyril-left-offset">
                A selection of my projects to showcase my experience and skills.
              </p>
            </div>
          </div>
          <PortfolioIsotope />
        </div>
      </div>
    </SiteLayout>
  );
};

export default Page;