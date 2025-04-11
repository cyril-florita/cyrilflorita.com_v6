export const cyrilUtility = {

  tpInner() {
    var topPanel = document.querySelector(".cyril-top-panel");
    var bottomPanel = document.querySelector(".cyril-bottom-panel");
    if (topPanel, bottomPanel) {
      topPanel.classList.add("cyril-tp-inner");
      bottomPanel.classList.add("cyril-bp-inner");
    }
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
    if (pathname === '/') {
      const sections = document.querySelectorAll(".cyril-section");
      const dots = document.querySelectorAll(".cyril-dot");
      if (!sections.length || !dots.length) return;

      const introIndex = Array.from(sections).findIndex(section => section.id === 'intro');
      if (introIndex !== -1) {
        window.scrollTo({
          top: introIndex * window.innerHeight,
          behavior: 'smooth'
        });

        sections.forEach((section, sectionIndex) => {
          section.classList.toggle("cyril-active", sectionIndex === introIndex);
        });

        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("cyril-active", dotIndex === introIndex);
        });
      }
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
  }
};