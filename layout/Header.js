"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Nav from "./Nav";

const Header = () => {
  const pathname = usePathname();
  const [toggle, setToggle] = useState(false);

  const handleIntroClick = (e) => {
    e.preventDefault();
    if (pathname === '/') {
      const sections = document.querySelectorAll(".cyril-section");
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
        // Update pagination dots
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("cyril-active", dotIndex === introIndex);
        });
      }
    }
  };

  return (
    <div className="cyril-top-panel cyril-tp-2">
      <div className="cyril-tp-frame">
        <a className="cyril-logo" onClick={handleIntroClick}>
          <strong>C<span>yril</span></strong>
        </a>
        <div 
          className={`cyril-menu-btn ${toggle ? 'cyril-active' : ''}`} 
          onClick={() => setToggle(!toggle)}
        >
          <span></span>
        </div>
        <Nav toggle={toggle} />
      </div>
    </div>
  );
};

export default Header;