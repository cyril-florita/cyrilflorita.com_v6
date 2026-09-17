"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "./Nav";
import { cyrilUtility } from "@/public/utility/index";

const Header = () => {
  const pathname = usePathname();
  const [isAtHeroTop, setIsAtHeroTop] = useState(false);

  // Disable the logo link whenever we're on "/" and already at the hero
  // (the very top) — clicking it there would be a no-op anyway.
  useEffect(() => {
    if (pathname !== '/') {
      setIsAtHeroTop(false);
      return;
    }

    const hero = document.getElementById('intro');
    if (!hero) return;

    const checkAtTop = () => {
      setIsAtHeroTop(!hero.classList.contains('cyril-hero-exit'));
    };

    checkAtTop();

    const observer = new MutationObserver(checkAtTop);
    observer.observe(hero, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [pathname]);

  const handleIntroClick = async (e) => {
    e.preventDefault();

    if (pathname !== '/') {
      await cyrilUtility.handlePageTransition();
      window.location.href = '/';
      return;
    }

    const introSection = document.querySelector("#intro");

    // Don't do anything if we're already on the hero
    if (introSection && !introSection.classList.contains('cyril-hero-exit')) {
      return;
    }

    // Bring it back into layout first (in case it's collapsed), forcing a
    // reflow before removing cyril-hero-exit so the fade-in actually animates.
    cyrilUtility.keepFrameVisible();
    introSection?.classList.remove('cyril-hero-collapsed');
    void introSection?.offsetHeight;
    introSection?.classList.remove('cyril-hero-exit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="cyril-top-panel cyril-tp-2">
      <div className="cyril-tp-frame">
        <a
          href="/"
          className={`cyril-logo ${isAtHeroTop ? 'cyril-disabled' : ''}`}
          onClick={handleIntroClick}
        >
          <strong>C<span>yril</span></strong>
        </a>
        <div className="cyril-nav-controls">
          <Nav />
        </div>
      </div>
    </div>
  );
};

export default Header;
