export const cyrilUtility = {

  tpInner() {
    var topPanel = document.querySelector(".cyril-top-panel");
    var bottomPanel = document.querySelector(".cyril-bottom-panel");
    if (topPanel, bottomPanel) {
      topPanel.classList.add("cyril-tp-inner");
      bottomPanel.classList.add("cyril-bp-inner");
    }
  },

  // The body::after noise-static overlay flickers/jumps on mobile Safari.
  // Current theory: iOS Safari's rubber-band bounce at the very top/bottom
  // of the page keeps nudging position:fixed elements for a few hundred ms
  // after native scroll events stop, and separately, the page's own initial
  // load (body fade-in, images/fonts settling, mount effects) is a similar
  // burst of reflow activity. Hiding the layer (opacity, not
  // animation-play-state — see _common.scss for why) during those windows
  // avoids showing the glitch without ever stopping the animation. Call
  // once per page load (SiteLayout does this, so it covers every page) —
  // it attaches listeners/patches for the page's lifetime.
  pauseBgStaticOnScroll() {
    const body = document.body;
    let settleTimer;
    let releaseAt = 0;

    const isNearBoundary = () => {
      const doc = document.documentElement;
      const atTop = window.scrollY <= 5;
      const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 5;
      return atTop || atBottom;
    };

    // `duration` is how long to stay hidden *after this call*, not how long
    // a scroll takes. releaseAt only ever moves later (never earlier) — a
    // short reactive call arriving after a longer one (e.g. a real scroll
    // happening alongside a click that also requested scrollTo) must not
    // shrink the window back down and reveal it mid-transition.
    const pause = (duration = 150) => {
      body.classList.add('cyril-scrolling');
      releaseAt = Math.max(releaseAt, Date.now() + duration);

      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        body.classList.remove('cyril-scrolling');
      }, releaseAt - Date.now());
    };

    // Real user scrolling: 150ms after the last 'scroll' event is normally
    // enough, but hold longer whenever we're at (or land on) the top/bottom
    // edge, since that's where the rubber-band bounce happens.
    window.addEventListener('scroll', () => pause(isNearBoundary() ? 600 : 150), { passive: true });

    // Programmatic scrolls (Back to Top, My Work, the logo, etc.) — these
    // usually land exactly at an edge (top of the page, or a specific grid
    // item), and also trigger their own ~0.4-0.5s CSS transition (hero
    // reveal, page fade) alongside a scroll that may cover very little
    // distance, so there aren't enough native 'scroll' events to keep
    // extending a short pause on their own. Patching scrollTo/scrollIntoView
    // once hides it the instant a scroll is requested, with no gap. Guarded
    // so navigating between pages (client-side, without a full reload)
    // doesn't wrap it again on every mount.
    if (!window.__cyrilScrollPatched) {
      window.__cyrilScrollPatched = true;

      const nativeScrollTo = window.scrollTo.bind(window);
      window.scrollTo = (...args) => {
        pause(700);
        nativeScrollTo(...args);
      };

      const nativeScrollIntoView = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function (...args) {
        pause(700);
        return nativeScrollIntoView.apply(this, args);
      };
    }

    window.setTimeout(() => {
      body.classList.add('cyril-static-ready');
    }, 1200);
  },

  // Keeps the top/bottom chrome visible through a programmatic scroll (e.g.
  // landing on or jumping to My Work) instead of letting the normal
  // hide-on-scroll-down behavior hide it. Rather than guessing how long a
  // smooth scroll takes, it clears itself shortly after scrolling actually
  // stops — `maxDuration` is just a safety net in case no scroll ever fires.
  keepFrameVisible(maxDuration = 2000) {
    const frame = document.querySelector(".cyril-frame");
    if (!frame) return;

    frame.classList.add("cyril-keep-visible");

    let settleTimer;
    let maxTimer;

    const release = () => {
      clearTimeout(settleTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('scroll', onScroll);
      frame.classList.remove("cyril-keep-visible");
      // topBarActive()'s own scroll listener sets "hide" on every
      // scroll-down tick, so it's still sitting there from the scroll we
      // just suppressed — clear it too, or the chrome would hide the
      // instant our override lifts, right as the transition finishes.
      frame.classList.remove("hide");
    };

    const onScroll = () => {
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(release, 150);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // In case scroll never fires (e.g. already at the target), or the
    // animation runs long, don't hold the chrome visible forever.
    maxTimer = window.setTimeout(release, maxDuration);
  },

  topBarActive() {
    var cyrilFrame = document.querySelector(".cyril-frame");
    let lastScrollTop = 0;
    if (cyrilFrame) {
      window.addEventListener("scroll", function () {
        var scrolling = window.scrollY || document.documentElement.scrollTop;
        // if scrolling down
        if (scrolling > lastScrollTop) {
          cyrilFrame.classList.add("hide");
        } else {
          cyrilFrame.classList.remove("hide");
        }
        // update last scroll position
        lastScrollTop = scrolling <= 0 ? 0 : scrolling;
      });
    }
  },

  backToTop() {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const backToTop = document.querySelector('.cyril-back-to-top');
      if (backToTop) {
        const currentScroll = window.scrollY;

        if (currentScroll > 300) {
          backToTop.classList.add('visible');
          // Add hiding class when scrolling up
          if (currentScroll < lastScrollTop) {
            backToTop.classList.add('hiding');
          } else {
            backToTop.classList.remove('hiding');
          }
        } else {
          backToTop.classList.remove('visible');
          backToTop.classList.remove('hiding');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  },

  handleBackToTop(pathname) {
    if (pathname === '/about-me') {
      const sections = document.querySelectorAll(".cyril-section");
      const dots = document.querySelectorAll(".cyril-dot");
      if (!sections.length || !dots.length) return;

      const topIndex = Array.from(sections).findIndex(section => section.id === 'background');
      if (topIndex !== -1) {
        window.scrollTo({
          top: topIndex * window.innerHeight,
          behavior: 'smooth'
        });

        sections.forEach((section, sectionIndex) => {
          section.classList.toggle("cyril-active", sectionIndex === topIndex);
        });

        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("cyril-active", dotIndex === topIndex);
        });
      }
    } else if (pathname === '/') {
      document.getElementById('intro')?.classList.remove('cyril-hero-exit');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  },

  getPagination(totalNumber, sort) {
    let arr = new Array(Math.ceil(totalNumber / sort))
      .fill()
      .map((_, idx) => idx + 1);
    return arr;
  },

  pagination(listClass, sort, active) {
    let list = document.querySelectorAll(listClass);
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (active === 1) {
        if (i < sort) {
          element.classList.remove("d-none");
        } else {
          element.classList.add("d-none");
        }
      } else {
        if (i >= (active - 1) * sort && i < active * sort) {
          element.classList.remove("d-none");
        } else {
          element.classList.add("d-none");
        }
      }
    }
  },

  handlePageTransition() {
    return new Promise(resolve => {
      document.body.classList.add('page-exit');
      setTimeout(() => {
        resolve();
      }, 400);
    });
  },

  builtTextVisibility: () => {
    const builtText = document.querySelector('.cyril-built');
    const isOnePage = document.querySelector('.cyril-onepage');

    window.addEventListener('scroll', () => {
      const isMobileView = window.innerWidth <= 1200;

      if (isOnePage && !isMobileView) {
        // Desktop onepage behavior
        const sections = document.querySelectorAll('.cyril-section');
        const lastSection = sections[sections.length - 1];

        if (lastSection && lastSection.classList.contains('cyril-active')) {
          builtText.classList.add('show');
        } else {
          builtText.classList.remove('show');
        }
      } else {
        // Mobile/tablet view or regular pages
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        // For screens <= 1200px, show when 60px from bottom
        // For larger screens, show when very close to bottom (within 1px)
        const threshold = isMobileView ? 60 : 1;

        if ((scrollTop + clientHeight) >= (scrollHeight - threshold)) {
          builtText.classList.add('show');
        } else {
          builtText.classList.remove('show');
        }
      }
    });
  },
  
  trackScrollProgress(setProgressCallback) {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setProgressCallback(progress);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  },

  swiperSliderSameHeight() {
    const setEqualHeight = () => {
      const experienceSection = document.querySelector('#experience');
      if (experienceSection) {
        const slides = experienceSection.querySelectorAll('.swiper-slide');
        if (slides.length > 0) {
          let maxHeight = 0;
          // Reset heights to auto to get the natural height
          slides.forEach(slide => {
            slide.style.height = 'auto';
          });

          // Find the max height
          slides.forEach(slide => {
            if (slide.offsetHeight > maxHeight) {
              maxHeight = slide.offsetHeight;
            }
          });

          // Set all slides to the max height
          slides.forEach(slide => {
            slide.style.height = `${maxHeight}px`;
          });
        }
      }
    };
    window.addEventListener('load', setEqualHeight);
    window.addEventListener('resize', setEqualHeight);
    setEqualHeight(); // Initial call
  }
};