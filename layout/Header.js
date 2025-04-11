"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Nav from "./Nav";
import { cyrilUtility } from "@/public/utility/index";

const Header = () => {
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

  // Existing scroll effect
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

  return (
    <div className="cyril-top-panel cyril-tp-2">
      <div className="cyril-tp-frame">
        <a href="/" className={`cyril-logo ${isIntroActive ? 'cyril-disabled' : ''}`} onClick={handleIntroClick}>
          <strong>C<span>yril</span></strong>
        </a>
        <Nav />
      </div>
    </div>
  );
};

export default Header;