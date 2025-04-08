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
    const handleScroll = () => {
      const backToTop = document.querySelector('.cyril-back-to-top');
      if (backToTop) {
        if (window.scrollY > 300) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
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
};