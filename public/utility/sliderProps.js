import SwiperCore from "swiper";
import {
  Autoplay,
  EffectFade,
  Grid,
  Navigation,
  Pagination,
  Parallax,
} from "swiper/modules";
SwiperCore.use([Pagination, Navigation, EffectFade, Autoplay, Grid, Parallax]);
export const sliderProps = {
  reviewsSlider: {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 800,
    parallax: true,
    navigation: {
      prevEl: ".cyril-reviews-prev",
      nextEl: ".cyril-reviews-next",
    },
    pagination: {
      el: ".cyril-reviews-pagination",
      type: "fraction",
      clickable: true,
    },
  },
  experienceSlider: {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 800,
    parallax: true,
    navigation: {
      prevEl: ".cyril-timeline-2-prev",
      nextEl: ".cyril-timeline-2-next",
    },
    pagination: {
      el: ".cyril-timeline-2-pagination",
      type: "fraction",
      clickable: true,
    },
    breakpoints: {
      992: {
        slidesPerView: 3,
      },
    },
  },
  projectSlider: {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 800,
    parallax: true,
    navigation: {
      prevEl: ".cyril-timeline-2-prev",
      nextEl: ".cyril-timeline-2-next",
    },
    pagination: {
      el: ".cyril-timeline-2-pagination",
      type: "fraction",
      clickable: true,
    },
    breakpoints: {
      1200: {
        slidesPerView: 2,
      },
    },
  },
};
