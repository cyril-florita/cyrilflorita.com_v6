import "@css/plugins/bootstrap-grid.css";
import "@css/plugins/swiper.min.css";
// Only the icons the site uses — regenerate with scripts/subset-icons.py.
import "@fonts/font-awesome/css/fa-subset.css";
import "@scss/style.css";
import Preloader from "@/components/Preloader";

// The portfolio (every route in this group): its global styles and the
// preloader / page-transition panel. Not a root layout — app/layout.js is —
// so client-side navigation inside the portfolio keeps the preloader
// mounted. app/not-found.js repeats these, since the 404 renders outside
// this group.
export default function SiteGroupLayout({ children }) {
  return (
    <>
      <Preloader />
      {children}
    </>
  );
}
