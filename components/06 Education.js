const Education = () => {
  return (
    <div className="cyril-section cyril-op-space-90">
      <div
        className="cyril-bg-item"
        style={{ bottom: "0%", left: "25%", transform: "rotate(-25deg)" }}
      />
      <div className="container">
        <div className="row justify-content-betweenx align-items-centerx">
          <div className="col-xl-5 cyril-mb-30">

            <div className="cyril-text-right-adapt">
              <p className="cyril-upper cyril-mb-20 subheader">
              &#91; My <span className="cyril-accent">Foundational Training</span> &#93;
              </p>
              <h2 className="cyril-up cyril-mb-30">Education</h2>
              <p>Structured learning that equipped me with technical expertise in design and web development, geared for cross-functional collaboration and project leadership.
              </p>
            </div>

          </div>
          <div className="col-xl-7">

            <div className="cyril-icon-box cyril-mt-40 cyril-mb-40">
              <div className="cyril-text-icon">
              <i className="fa-solid fa-user-graduate"></i>
              </div>
              <div className="cyril-box-text">
                <p className=" cyril-text-lg cyril-mb-15">
                  <span className="cyril-upper cyril-accent">Bachelor</span> of <span className="cyril-upper cyril-accent">Arts</span> in <span className="cyril-upper">Web Design</span> &amp; <span className="cyril-upper">Multimedia</span>
                </p>
                <p className="cyril-upper cyril-upper-sm cyril-text-normal cyril-mb-30">
                  <a className="cyril-text-underline" href="https://www.linkedin.com/school/westwood-college-los-angeles">Westwood College</a> &#40;2003 &mdash; 2006&#41;
                </p>
                <p>
                  This enhanced my technical skills in design, multimedia, and web development, preparing me to thrive in a rapidly evolving industry for diverse roles in a competitive job market.
                </p>
              </div>
            </div>
            
            <div className="cyril-icon-box">
              <div className="cyril-text-icon">
              <i className="fa-solid fa-user-graduate"></i>
              </div>
              <div className="cyril-box-text">
                <p className="cyril-text-lg cyril-mb-15">
                  <span className="cyril-upper cyril-accent">Master</span> of <span className="cyril-upper">Divinity</span>
                </p>
                <p className="cyril-upper cyril-upper-sm cyril-text-normal cyril-mb-30">
                  <a className="cyril-text-underline" href="https://www.tms.edu">The Master's Seminary</a>  &#40;2015 &mdash; 2024&#41;
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
