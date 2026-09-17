export const cyrilUtility = {

  tpInner() {
    var topPanel = document.querySelector(".cyril-top-panel");
    var bottomPanel = document.querySelector(".cyril-bottom-panel");
    if (topPanel, bottomPanel) {
      topPanel.classList.add("cyril-tp-inner");
      bottomPanel.classList.add("cyril-bp-inner");
    }
  },

  // The body::after noise-static overlay flickers on mobile while its own
  // animation keeps running during a scroll (a fixed-position + animation
  // repaint conflict on mobile Safari/Chrome that GPU-layer hints alone
  // didn't fully fix). Pausing the animation for the duration of the scroll
  // and resuming once it settles avoids the conflict without giving up the
  // effect. Call once per page load (SiteLayout does this, so it covers
  // every page) — it attaches a single listener for the page's lifetime.
  pauseBgStaticOnScroll() {
    const body = document.body;
    let settleTimer;

    window.addEventListener('scroll', () => {
      body.classList.add('cyril-scrolling');
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        body.classList.remove('cyril-scrolling');
      }, 150);
    }, { passive: true });
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