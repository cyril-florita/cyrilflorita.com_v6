const Pagination = ({ direction }) => {
  return (
    <div
      className={`cyril-pagination cyril-pagination-${
        direction ? direction : "right"
      }`}
    >
      <div className="cyril-dot cyril-active" data-index={0} data-name="Intro" />
      <div className="cyril-dot" data-index={1} data-name="Background" />
      <div className="cyril-dot" data-index={2} data-name="Experience" />
      <div className="cyril-dot" data-index={3} data-name="Skills" />
      <div className="cyril-dot" data-index={4} data-name="Tools" />
      <div className="cyril-dot" data-index={5} data-name="Education" />
    </div>
  );
};
export default Pagination;