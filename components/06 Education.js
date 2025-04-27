const Education = () => {
  return (
    <div className="cyril-section cyril-education cyril-op-space-90">
      <div
        className="cyril-bg-item"
        style={{ top: "0%", right: "14%", transform: "rotate(124deg)" }}
      />
      <div className="container">

        <div>
          <p className="cyril-upper subheader">
            &#91; My <span className="cyril-accent">Foundational Training</span> &#93;
          </p>
          <h2 className="cyril-up cyril-mb-50">Education</h2>
        </div>

        <div className="row">
          <div className="offset-xl-1 col-xl-5 cyril-mb-30">
            <div className="cyril-icon-box">
              <div className="cyril-text-icon">
              <i className="fa-solid fa-user-graduate"></i>
              </div>
              <div className="cyril-box-text">
                <p className="cyril-upper cyril-text-lg cyril-mb-15">
                  <span className="cyril-accent">Bachelor</span><span className="cyril-lower"> of </span><span className="cyril-accent">Arts</span> <span className="cyril-lower">in</span> Web Design<span className="cyril-lower"> &amp; </span>Multimedia
                </p>
                <p className="cyril-upper cyril-text-normal cyril-mb-30">
                  <a className="cyril-text-underline" href="https://www.linkedin.com/school/westwood-college-los-angeles" target="_blank">Westwood College</a> &#40;2003 &mdash; 2006&#41;
                </p>
                <p>
                  This B.A. degree enhanced my technical skills in design, multimedia, and web development, preparing me to thrive in a rapidly evolving industry for diverse roles in a competitive job market.
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-6">         
            <div className="cyril-icon-box cyril-mb-60">
              <div className="cyril-text-icon">
              <i className="fa-solid fa-user-graduate"></i>
              </div>
              <div className="cyril-box-text">
                <p className="cyril-upper cyril-text-lg cyril-mb-15">
                  <span className="cyril-accent">Master</span><span className="cyril-lower"> of </span>Divinity
                </p>
                <p className="cyril-upper cyril-text-normal cyril-mb-30">
                  <a className="cyril-text-underline" href="https://www.tms.edu" target="_blank">The Master's Seminary</a>  &#40;2015 &mdash; 2024&#41;
                </p>
                <p>
                  Though this Master's degree was for pastoral ministry, it honed my skills in thinking critically, communicating precisely and clearly, collaborating with colleagues while resolving conflicts with integrity and professionalism, leading with courage and empathy, and managing multiple projects even under pressure and duress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Education;
