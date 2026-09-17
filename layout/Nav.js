"use client";
import { usePathname } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
import { cyrilUtility } from "@/public/utility/index";

const Nav = () => {
  // next.config.js sets trailingSlash: true, so on the exported site
  // usePathname() returns "/about-me/" (trailing slash) rather than
  // "/about-me" — strip it so pathname === '/about-me' checks below work
  // both here and in cyrilUtility (root "/" never gets a trailing slash).
  const rawPathname = usePathname();
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/$/, '') : rawPathname;
  const [isTopSectionActive, setIsTopSectionActive] = useState(false);
  const [isPortfolioActive, setIsPortfolioActive] = useState(false);

  // Every route besides "/" and "/about-me" is a My Work project page (they
  // no longer live under a shared "/portfolio" prefix), so "My Work" should
  // be active there regardless of the hero/scroll state that governs "/".
  const isProjectPage = pathname !== '/' && pathname !== '/about-me';

  // Track whether the hero has been exited on "/", so "My Work" only lights
  // up once the user has actually scrolled/clicked their way to it — never
  // just because they're on "/".
  useEffect(() => {
    if (pathname !== '/') {
      setIsPortfolioActive(false);
      return;
    }

    const hero = document.getElementById('intro');
    const checkPortfolioActive = () => {
      setIsPortfolioActive(!!hero && hero.classList.contains('cyril-hero-exit'));
    };

    checkPortfolioActive();

    if (!hero) return;

    const observer = new MutationObserver(checkPortfolioActive);
    observer.observe(hero, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [pathname]);

  // Initial check on mount
  useEffect(() => {
    if (pathname === '/about-me') {
      const topSection = document.querySelector("#background");
      if (topSection) {
        setIsTopSectionActive(topSection.classList.contains('cyril-active'));
      }
    }
  }, []);

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

  useEffect(() => {
    const checkTopSectionActive = () => {
      if (pathname === '/about-me') {
        const topSection = document.querySelector("#background");
        setIsTopSectionActive(topSection?.classList.contains('cyril-active'));
      } else {
        setIsTopSectionActive(false);
      }
    };

    checkTopSectionActive();

    if (pathname === '/about-me') {
      window.addEventListener('scroll', checkTopSectionActive);
      return () => window.removeEventListener('scroll', checkTopSectionActive);
    }
  }, [pathname]);

  return (
    <Fragment>
      <nav>
        <ul>
          <li className={(isPortfolioActive || isProjectPage) ? "cyril-active" : ""}>
            <a
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
