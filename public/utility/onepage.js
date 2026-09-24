import { applyHiddenState, getSectionRevealElements } from "@/public/utility/index";
import { onPreloaderHidden } from "@/components/Preloader";

// Desktop: tag each section's pieces and give each a delay by its on-screen
// position (top to bottom, then left to right), so they fade in in reading
// order whenever the section gets cyril-active — see .cyril-stagger in
// _components.scss. Visual position rather than DOM order because some
// sections put a left column (e.g. the photo) before the text in the markup.
const STAGGER_STEP_MS = 70;
const STAGGER_MAX_MS = 900;
// The first section (#background) enters like the home hero: slower and
// further (see .cyril-onepage #background in _components.scss).
const HERO_STAGGER_STEP_MS = 180;
const HERO_STAGGER_MAX_MS = 1400;
const SLIDE_STAGGER_STEP_MS = 160;

const prepareStagger = (sections) => {
  sections.forEach((section) => {
    const els = getSectionRevealElements(section)
      .map((el) => ({ el, rect: el.getBoundingClientRect() }))
      .sort((a, b) => (a.rect.top - b.rect.top) || (a.rect.left - b.rect.left));

    const isHero = section.id === 'background';
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

export const onepage = () => {
  let sections = document.querySelectorAll(".cyril-section");
  let dots = document.querySelectorAll(".cyril-dot");
  let body = document.querySelector("body");
  let scrolling = false;

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

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", function () {
      if (!scrolling) {
        scrollToSection(dotIndex);

        // Allow scrolling again after a short delay
        setTimeout(function () {
          scrolling = false;
        }, 1200);
      }
    });
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

      // Allow scrolling again after a short delay
      setTimeout(function () {
        scrolling = false;
      }, 1200);
    }
  }

  if (body.classList.contains('cyril-custom-scroll')) {
    window.addEventListener("wheel", handleWheel, { passive: false });
  }

  // Set the initial scroll position to the top of the document after a short delay
  setTimeout(function () {
    if (body.classList.contains('cyril-custom-scroll')) {
      window.scrollTo(0, 0);
    }
  }, 100);

  // Hold the first section's fade-in until the preloader is gone, so it
  // plays in view rather than behind it.
  onPreloaderHidden(() => {
    if (!body.classList.contains('cyril-custom-scroll')) return;
    if (window.innerWidth > 1200) prepareStagger(sections);
    updateActiveSection(getCurrentIndex());
  });
};
