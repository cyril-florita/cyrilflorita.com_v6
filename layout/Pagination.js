// About Me's section dots. public/utility/onepage.js binds their clicks and
// moves cyril-active / aria-current between them as the sections change.
const SECTIONS = ["Background", "Experience", "Skills", "Tools", "Education", "Contact"];

const Pagination = ({ direction }) => {
  return (
    <div
      className={`cyril-pagination cyril-pagination-${
        direction ? direction : "right"
      }`}
    >
      {SECTIONS.map((name, i) => (
        <button
          key={name}
          type="button"
          className={`cyril-dot${i === 0 ? " cyril-active" : ""}`}
          data-index={i}
          data-name={name}
          aria-label={`Go to ${name}`}
          aria-current={i === 0 ? "true" : undefined}
        />
      ))}
    </div>
  );
};
export default Pagination;
