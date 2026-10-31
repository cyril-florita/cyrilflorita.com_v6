"use client";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useHeroState, useIsCasePage, useTopSectionActive } from "./domState";
import { cyrilUtility } from "@/public/utility/index";

const Nav = () => {
  // next.config.js sets trailingSlash: true, so on the exported site
  // usePathname() returns "/about-me/" (trailing slash) rather than
  // "/about-me" — strip it so pathname === '/about-me' checks below work
  // both here and in cyrilUtility (root "/" never gets a trailing slash).
  const rawPathname = usePathname();
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/$/, '') : rawPathname;
  // "My Work" lights up on project pages (the ones using the case-study
  // layout — checked on the page itself rather than by URL, so other routes,
  // e.g. the 404 page served at any missing URL, don't count), and on "/"
  // only once the user has actually scrolled/clicked past the hero — never
  // just because they're on "/". "About Me" is disabled while its top
  // section is the active one.
  const isProjectPage = useIsCasePage();
  const hero = useHeroState(pathname);
  const isPortfolioActive = pathname === "/" && hero === "exited";
  const isTopSectionActive = useTopSectionActive(pathname);

  // Update handleIntroClick to match Header.js behavior
  const handleIntroClick = async (e) => {
    e.preventDefault();

    if (pathname !== '/about-me') {
      await cyrilUtility.handlePageTransition();
      window.location.href = '/about-me';
      return;
    }

    const sections = document.querySelectorAll(".cyril-section");
    const topSection = document.querySelector("#background");

    // Don't do anything if we're on the About Me page and its top section is active
    if (topSection?.classList.contains('cyril-active')) {
      return;
    }

    const dots = document.querySelectorAll(".cyril-dot");
    const topIndex = Array.from(sections).findIndex(section => section.id === 'background');
    if (topIndex !== -1) {
      window.scrollTo({
        top: topIndex * window.innerHeight,
        behavior: "smooth",
      });
      sections.forEach((section, sectionIndex) => {
        section.classList.toggle("cyril-active", sectionIndex === topIndex);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("cyril-active", dotIndex === topIndex);
      });
    }
  };

  return (
    <Fragment>
      <nav>
        <ul>
          <li className={(isPortfolioActive || isProjectPage) ? "cyril-active" : ""}>
            <a
              aria-current={(isPortfolioActive || isProjectPage) ? "page" : undefined}
              href="/"
              onClick={async (e) => {
                e.preventDefault();

                if (pathname === '/') {
                  cyrilUtility.keepFrameVisible();
                  document.getElementById('intro')?.classList.add('cyril-hero-exit');
                  document.getElementById('portfolio-start')?.scrollIntoView({ behavior: 'smooth' });
                  return;
                }

                sessionStorage.setItem('scrollToPortfolio', 'true');
                await cyrilUtility.handlePageTransition();
                window.location.href = '/';
              }}
            >
              My Work
            </a>
          </li>
          <li className={pathname.startsWith("/about-me") ? "cyril-active" : ""}>
            <a
              aria-current={pathname.startsWith("/about-me") ? "page" : undefined}
              href="/about-me"
              className={isTopSectionActive ? 'cyril-disabled' : ''}
              onClick={handleIntroClick}
            >
              About Me
            </a>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};
export default Nav;
