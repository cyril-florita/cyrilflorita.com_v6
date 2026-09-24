import { onPreloaderHidden, wipeThen } from "@/components/Preloader";

// Elements that fade/slide in as they scroll into view. Deliberately not
// .cyril-grid-item (Isotope positions those with its own transforms) or
// About Me's sections (onepage.js already animates those on desktop).
const REVEAL_SELECTORS = [
  // Case-study layout (components/case/CaseStudy.js). Stats and grids are
  // revealed piece by piece rather than as one block.
  '.cyril-case-eyebrow',
  '.cyril-case-summary',
  '.cyril-case-fact',
  '.cyril-case-bleed',
  '.cyril-case-toc',
  '.cyril-case-section-head',
  '.cyril-case-content > :not(.cyril-case-stats):not(.cyril-case-grid)',
  '.cyril-case-stat',
  '.cyril-case-grid > *',
  '.cyril-case-end > *',
  // Contact band on the home page (on About Me it's a snap section and
  // staggers with the rest).
  '.cyril-main-page .cyril-contact .container > *',
  '#portfolio-start .cyril-top-banner',
  '.cyril-filter',
  '.cyril-portfolio-item',
];

// About Me: the individual pieces inside a section that fade in one by one.
// Anything nested inside another match is dropped (e.g. the <p>s inside an
// Experience card), so each card fades as one unit instead of twice.
// .cyril-slide-inner = an Experience card (the wrapper inside each Swiper
// slide — the slide's own class list is owned by Swiper);
// .cyril-text-row = a Skills/Tools entry (icon + label together);
// .cyril-text-icon = an Education icon, whose texts then fade separately.
const SECTION_REVEAL_SELECTORS = '.subheader, h2, p, .cyril-about-person, .cyril-slide-inner, .cyril-timeline-nav-2, .cyril-text-row, .cyril-text-icon, .cyril-contact-actions, .cyril-contact-profiles';

export const getSectionRevealElements = (section) => {
  const matched = Array.from(section.querySelectorAll(SECTION_REVEAL_SELECTORS));
  const set = new Set(matched);
  return matched.filter((el) => {
    for (let p = el.parentElement; p && p !== section; p = p.parentElement) {
      if (set.has(p)) return false;
    }
    return true;
  });
};

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#01';
const randomGlyph = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
// A random letter in the same case as `char`.
const randomLetter = (char) => {
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  return char === char.toLowerCase() ? letter.toLowerCase() : letter;
};

// Scrambles every text node under `el` through random glyphs, resolving
// left to right, without touching the markup (so nested accent spans keep
// their styling). Used for subheaders (layout/MotionEffects.js).
export const scrambleText = (el, duration = 800) => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  const originals = nodes.map((n) => n.textContent);
  const total = originals.join('').length;
  if (!total) return;

  const start = performance.now();
  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    let index = 0;
    nodes.forEach((node, i) => {
      node.textContent = originals[i].split('').map((char) => {
        const resolved = index++ / total < progress;
        if (resolved || !char.trim()) return char;
        return randomGlyph();
      }).join('');
    });
    if (progress < 1) requestAnimationFrame(frame);
    else nodes.forEach((node, i) => { node.textContent = originals[i]; });
  };
  requestAnimationFrame(frame);
};

// Types in pre-split letter elements (hidden by CSS until they get
// cyril-char-on) one after another, each flickering through random letters
// before settling on its real one. Each letter's width is pinned to its
// final width meanwhile so wider/narrower letters don't jostle the line.
// Returns a cancel function that snaps every letter back to its real text.
export const scrambleInChars = (chars, { step = 30, settle = 225, onDone } = {}) => {
  const items = chars.map((el) => {
    el.dataset.char = el.dataset.char ?? el.textContent;
    el.textContent = el.dataset.char;
    el.style.width = '';
    return { el, final: el.dataset.char, width: el.getBoundingClientRect().width };
  });
  items.forEach(({ el, width }) => {
    el.style.width = `${width}px`;
    el.style.textAlign = 'center';
  });

  const settleItem = (item) => {
    item.el.textContent = item.final;
    item.el.style.width = '';
    item.el.style.textAlign = '';
    item.settled = true;
  };

  let rafId;
  const start = performance.now();
  const frame = (now) => {
    const elapsed = now - start;
    let done = true;
    items.forEach((item, i) => {
      if (item.settled) return;
      const t = elapsed - i * step;
      if (t < 0) { done = false; return; }
      item.el.classList.add('cyril-char-on');
      if (t >= settle) {
        settleItem(item);
      } else {
        item.el.textContent = randomLetter(item.final);
        done = false;
      }
    });
    if (done) onDone?.();
    else rafId = requestAnimationFrame(frame);
  };
  rafId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(rafId);
    items.forEach((item) => { if (!item.settled) settleItem(item); });
  };
};

// Splits a plain-text element into .cyril-word > .cyril-char spans (words
// stay unbreakable inline-blocks so it only wraps between them) for
// scrambleInTitle. Idempotent. The hero h1 is split in its JSX instead.
export const splitChars = (el) => {
  if (el.classList.contains('cyril-split')) return;
  const text = el.textContent.trim();
  el.classList.add('cyril-split');
  el.setAttribute('aria-label', text);
  el.textContent = '';
  text.split(/\s+/).forEach((word, w) => {
    if (w > 0) el.appendChild(document.createTextNode(' '));
    const wordEl = document.createElement('span');
    wordEl.className = 'cyril-word';
    wordEl.setAttribute('aria-hidden', 'true');
    word.split('').forEach((char) => {
      const charEl = document.createElement('span');
      charEl.className = 'cyril-char';
      charEl.textContent = char;
      wordEl.appendChild(charEl);
    });
    el.appendChild(wordEl);
  });
};

// Hides a split title's letters (and its glitch copies — see
// .cyril-split-hidden) until scrambleInTitle types them in.
export const hideSplitTitle = (el) => {
  el._cyrilScrambleCancel?.();
  el.classList.add('cyril-split-hidden');
  el.querySelectorAll('.cyril-char').forEach((c) => c.classList.remove('cyril-char-on'));
};

// Types a split title in letter by letter (restarting if already running),
// then reveals it fully, glitch effect included.
export const scrambleInTitle = (el, options = {}) => {
  hideSplitTitle(el);
  el._cyrilScrambleCancel = scrambleInChars(Array.from(el.querySelectorAll('.cyril-char')), {
    ...options,
    onDone: () => {
      el._cyrilScrambleCancel = null;
      el.classList.remove('cyril-split-hidden');
      options.onDone?.();
    },
  });
};

// Puts elements into an entrance's hidden starting state (by adding
// `className`) instantly. Just adding the class would *transition* them from
// visible to hidden, and if the entrance starts before that finishes it
// reverses from nearly visible — i.e. no visible entrance at all.
export const applyHiddenState = (els, className) => {
  els.forEach((el) => {
    el.style.transition = 'none';
    el.classList.add(className);
  });
  void document.body.offsetHeight;
  els.forEach((el) => { el.style.transition = ''; });
};

let revealObserver;

const getRevealObserver = () => {
  if (revealObserver) return revealObserver;

  revealObserver = new IntersectionObserver((entries) => {
    let batchIndex = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      // Stagger siblings that enter together, capped so nothing waits long.
      // About Me's first section gets the slower, hero-style cadence.
      const step = el.closest('#background') ? 180 : 80;
      el.style.transitionDelay = `${Math.min(batchIndex * step, step * 5)}ms`;
      batchIndex++;
      el.classList.add('cyril-revealed');
      revealObserver.unobserve(el);
    });
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  return revealObserver;
};

export const cyrilUtility = {

  // Tags matching elements right away (while the page/preloader still hides
  // them, so nothing visibly blinks out), then starts watching them only once
  // the preloader is gone, so anything already in view animates in visibly.
  // Idempotent — safe to call again when late content mounts (e.g. the
  // dynamically-imported portfolio grid).
  revealOnScroll() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const candidates = Array.from(document.querySelectorAll(REVEAL_SELECTORS.join(',')));

    // About Me on tablet/mobile scrolls normally (no snapping), so its pieces
    // reveal on scroll like everything else. On desktop, onepage.js staggers
    // them per section instead — don't double up there.
    if (window.innerWidth <= 1200) {
      document.querySelectorAll('.cyril-onepage .cyril-section').forEach((section) => {
        candidates.push(...getSectionRevealElements(section));
      });
    }

    const els = candidates.filter((el) => !el.dataset.reveal);

    els.forEach((el) => { el.dataset.reveal = 'pending'; });
    applyHiddenState(els, 'cyril-reveal');

    onPreloaderHidden(() => {
      const observer = getRevealObserver();
      els.forEach((el) => {
        if (el.isConnected) observer.observe(el);
      });
    });
  },

  tpInner() {
    var topPanel = document.querySelector(".cyril-top-panel");
    var bottomPanel = document.querySelector(".cyril-bottom-panel");
    if (topPanel, bottomPanel) {
      topPanel.classList.add("cyril-tp-inner");
      bottomPanel.classList.add("cyril-bp-inner");
    }
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

  // Covers the page with the preloader panel before a hard navigation
  // (resolves once it's covering; see wipeThen in components/Preloader.js).
  handlePageTransition() {
    return new Promise(resolve => wipeThen(resolve));
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