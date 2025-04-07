"use client";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const Nav = ({ toggle }) => {
  const pathname = usePathname();

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
    } else {
      window.location.href = '/';
    }
  };
  
  return (
    <Fragment>
      <nav className={toggle ? "cyril-active" : ""}>
        <ul>
          <li className={pathname.includes("index") || pathname == "/" ? "cyril-active" : ""}>
            <a href="/" onClick={handleIntroClick}>About Me</a>
          </li>
          <li className={pathname == "/portfolio" ? "cyril-active" : ""}>
            <a href="/portfolio">My Work</a>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};
export default Nav;
