export const onepage = () => {
  let sections = document.querySelectorAll(".cyril-section");
  let dots = document.querySelectorAll(".cyril-dot");
  let body = document.querySelector("body");
  let index = 0;
  let scrolling = false;

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
    dots[index].classList.add("cyril-active");
  }

  function updateActiveSection(index) {
    sections.forEach((section, sectionIndex) => {
      if (sectionIndex === index) {
        section.classList.add("cyril-active");
      } else {
        section.classList.remove("cyril-active");
      }
    });
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", function () {
      if (!scrolling) {
        index = dotIndex;
        scrollToSection(index);

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
    if (window.innerWidth >= 1200 && !scrolling && updatedBody.classList.contains('cyril-custom-scroll') ) {
      event.preventDefault();

      if (event.deltaY > 0 && index < sections.length - 1) {
        index++;
      } else if (event.deltaY < 0 && index > 0) {
        index--;
      }

      scrollToSection(index);

      // Allow scrolling again after a short delay
      setTimeout(function () {
        scrolling = false;
      }, 1200);
    }
  }

  if ( body.classList.contains('cyril-custom-scroll') ) {
    window.addEventListener("wheel", handleWheel, { passive: false });
  }
  
  // Set the initial scroll position to the top of the document after a short delay
  setTimeout(function () {
    if ( body.classList.contains('cyril-custom-scroll') ) {
      window.scrollTo(0, 0);
      updateActiveSection(index); // Update active section on page load
    }
  }, 100);
};
