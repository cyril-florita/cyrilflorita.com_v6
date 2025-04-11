"use client";
import { usePathname } from "next/navigation";
import { Fragment, useState, useEffect } from "react";
import { cyrilUtility } from "@/public/utility/index";

const Nav = () => {
  const pathname = usePathname();
  const [isIntroActive, setIsIntroActive] = useState(false);

  // Initial check on mount
  useEffect(() => {
    if (pathname === '/') {
      const introSection = document.querySelector("#intro");
      if (introSection) {
        setIsIntroActive(introSection.classList.contains('cyril-active'));
      }
    }
  }, []);

  // Update handleIntroClick to match Header.js behavior
  const handleIntroClick = async (e) => {
    e.preventDefault();
    
    if (pathname !== '/') {
        await cyrilUtility.handlePageTransition();
        window.location.href = '/';
        return;
    }
    
    const sections = document.querySelectorAll(".cyril-section");
    const introSection = document.querySelector("#intro");

    // Don't do anything if we're on home page and intro is active
    if (pathname === '/' && introSection?.classList.contains('cyril-active')) {
      return;
    }

    if (pathname === '/') {
      const dots = document.querySelectorAll(".cyril-dot");
      const introIndex = Array.from(sections).findIndex(section => section.id === 'intro');
      if (introIndex !== -1) {
        window.scrollTo({
          top: introIndex * window.innerHeight,
          behavior: "smooth",
        });
        sections.forEach((section, sectionIndex) => {
          section.classList.toggle("cyril-active", sectionIndex === introIndex);
        });
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("cyril-active", dotIndex === introIndex);
        });
      }
    } else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const checkIntroActive = () => {
      if (pathname === '/') {
        const introSection = document.querySelector("#intro");
        setIsIntroActive(introSection?.classList.contains('cyril-active'));
      } else {
        setIsIntroActive(false);
      }
    };

    checkIntroActive();

    if (pathname === '/') {
      window.addEventListener('scroll', checkIntroActive);
      return () => window.removeEventListener('scroll', checkIntroActive);
    }
  }, [pathname]);

  // Remove handleAboutClick function as it's redundant

  return (
    <Fragment>
      <nav>
        <ul>
          <li className={pathname.includes("index") || pathname == "/" ? "cyril-active" : ""}>
            <a
              href="/"
              className={isIntroActive ? 'cyril-disabled' : ''}
              onClick={handleIntroClick}
            >
              About Me
            </a>
          </li>
          <li className={pathname == "/portfolio" ? "cyril-active" : ""}>
            <a 
              href="/portfolio" 
              onClick={async (e) => {
                e.preventDefault();
                await cyrilUtility.handlePageTransition();
                window.location.href = '/portfolio';
              }}
            >
              My Work
            </a>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};
export default Nav;
