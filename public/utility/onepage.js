import { applyHiddenState, getSectionRevealElements } from "@/public/utility/index";
import { onPreloaderHidden } from "@/components/Preloader";

// Desktop: tag each section's pieces and give each a delay by its on-screen
// position (top to bottom, then left to right), so they fade in in reading
// order whenever the section gets cyril-active — see .cyril-stagger in
// _components.scss. Visual position rather than DOM order because some
// sections put a left column (e.g. the photo) before the text in the markup.
const STAGGER_STEP_MS = 70;
const STAGGER_MAX_MS = 900;
// The first section (#background) and the closing contact section enter
// like the home hero: slower and further (see .cyril-onepage #background /
// #contact in _components.scss).
const HERO_STAGGER_STEP_MS = 180;
const HERO_STAGGER_MAX_MS = 1400;
const SLIDE_STAGGER_STEP_MS = 160;

const prepareStagger = (sections) => {
  sections.forEach((section) => {
    const els = getSectionRevealElements(section)
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left));

    const isHero = section.id === 'background' || section.id === 'contact';
    const step = isHero ? HERO_STAGGER_STEP_MS : STAGGER_STEP_MS;
    const max = isHero ? HERO_STAGGER_MAX_MS : STAGGER_MAX_MS;

    // Experience cards get a wider gap between them than regular pieces, so
    // they visibly arrive one by one (see .cyril-slide-inner.cyril-stagger).
    let delay = 0;
    els.forEach(({ el }, i) => {
      if (i > 0) delay += el.matches('.cyril-slide-inner') ? SLIDE_STAGGER_STEP_MS : step;
      el.style.setProperty('--stagger-delay', `${Math.min(delay, max)}ms`);
    });
    applyHiddenState(els.map(({ el }) => el), 'cyril-stagger');
  });
};

// Returns a cleanup function; call it on unmount. Without it, a second run
// (React Strict Mode runs effects twice in dev) leaves two wheel/key
// handlers, each with its own `scrolling` lock, so one wheel notch
// advances two sections.
export const onepage = () => {
  let sections = document.querySelectorAll(".cyril-section");
  let dots = document.querySelectorAll(".cyril-dot");
  let body = document.querySelector("body");
  let scrolling = false;
  const timers = [];
  // Let snapping resume once the smooth scroll has had time to finish.
  const unlockLater = () => {
    timers.push(setTimeout(() => { scrolling = false; }, 1200));
  };

  // Read the current section straight off the DOM (whichever one has
  // cyril-active) instead of trusting a private counter, so it can't drift
  // out of sync with external changes like the "Back to Top" button or the
  // Nav "About Me" click handler, which set that class directly.
  function getCurrentIndex() {
    const activeIndex = Array.from(sections).findIndex((section) =>
      section.classList.contains("cyril-active")
    );
    return activeIndex === -1 ? 0 : activeIndex;
  }

  function scrollToSection(index) {
    scrolling = true;
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    });

    updateActiveDot(index);
    updateActiveSection(index);
  }

  function updateActiveDot(index) {
    dots.forEach((dot) => dot.classList.remove("cyril-active"));
    dots[index]?.classList.add("cyril-active");
  }

  function updateActiveSection(index) {
    sections.forEach((section, sectionIndex) => {
      section.classList.toggle("cyril-active", sectionIndex === index);
    });
  }

  const dotHandlers = Array.from(dots).map((dot, dotIndex) => {
    const onClick = () => {
      if (!scrolling) {
        scrollToSection(dotIndex);
        unlockLater();
      }
    };
    dot.addEventListener("click", onClick);
    return [dot, onClick];
  });

  function handleWheel(event) {
    let updatedBody = document.querySelector("body");

    // Check if the screen width is greater than or equal to 1200px
    if (window.innerWidth >= 1200 && !scrolling && updatedBody.classList.contains('cyril-custom-scroll')) {
      event.preventDefault();

      let index = getCurrentIndex();
      if (event.deltaY > 0 && index < sections.length - 1) {
        index++;
      } else if (event.deltaY < 0 && index > 0) {
        index--;
      } else {
        return;
      }

      scrollToSection(index);
      unlockLater();
    }
  }

  // Keyboard equivalents of the wheel snapping. Normal scrolling is off on
  // desktop (body overflow: hidden), so without these, keyboard users could
  // never get past the first section.
  const KEYS_NEXT = ["ArrowDown", "PageDown"];
  const KEYS_PREV = ["ArrowUp", "PageUp"];
  function handleKey(event) {
    if (window.innerWidth < 1200 || scrolling || !body.classList.contains('cyril-custom-scroll')) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (document.querySelector('.cyril-zoom')) return; // image viewer has the keyboard
    const tag = event.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;

    let index = getCurrentIndex();
    const isSpace = event.key === ' ' && tag !== 'BUTTON' && tag !== 'A';
    if (KEYS_NEXT.includes(event.key) || (isSpace && !event.shiftKey)) index++;
    else if (KEYS_PREV.includes(event.key) || (isSpace && event.shiftKey)) index--;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = sections.length - 1;
    else return;

    event.preventDefault();
    index = Math.max(0, Math.min(sections.length - 1, index));
    if (index === getCurrentIndex()) return;
    scrollToSection(index);
    unlockLater();
  }

  // Tabbing onto something in a section that isn't showing: bring that
  // section in (its contents are faded out until it's active).
  function handleFocus(event) {
    if (window.innerWidth < 1200 || !body.classList.contains('cyril-custom-scroll')) return;
    const section = event.target?.closest?.('.cyril-section');
    const index = Array.from(sections).indexOf(section);
    if (index === -1 || index === getCurrentIndex()) return;
    scrollToSection(index);
    unlockLater();
  }

  if (body.classList.contains('cyril-custom-scroll')) {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    document.addEventListener("focusin", handleFocus);
  }

  // Set the initial scroll position to the top of the document after a short delay
  timers.push(setTimeout(function () {
    if (body.classList.contains('cyril-custom-scroll')) {
      window.scrollTo(0, 0);
    }
  }, 100));

  // Hold the first section's fade-in until the preloader is gone, so it
  // plays in view rather than behind it.
  const stopPreloaderWait = onPreloaderHidden(() => {
    if (!body.classList.contains('cyril-custom-scroll')) return;
    if (window.innerWidth > 1200) prepareStagger(sections);
    updateActiveSection(getCurrentIndex());
  });

  return () => {
    dotHandlers.forEach(([dot, onClick]) => dot.removeEventListener("click", onClick));
    window.removeEventListener("wheel", handleWheel);
    window.removeEventListener("keydown", handleKey);
    document.removeEventListener("focusin", handleFocus);
    timers.forEach(clearTimeout);
    stopPreloaderWait();
  };
};
