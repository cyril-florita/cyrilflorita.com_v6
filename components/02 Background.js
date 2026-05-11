const Background = ( { bgImage = "img/cyril-profile-w-a-smile.jpg" } ) => {
  return (
    <div className="cyril-section cyril-op-space-90">
      <div
        className="cyril-bg-item cyril-bg-item-large"
        style={{ top: "-40%", right: "32%", transform: "rotate(-35deg)" }}
      />
      <div
        className="cyril-bg-item"
        style={{ bottom: "-10%", right: "-10%", transform: "rotate(-25deg)" }}
      />
      <div className="container">
        <div className="row justify-content-between align-items-center">
          
          <div className="col-xl-4">
            <div className="cyril-about-person cyril-mb-30">
              <img
                src={bgImage}
                alt="Cyril Florita"
                className="cyril-avatar"
              />
            </div>
          </div>

          <div className="col-xl-7">
            <div className="row">
              <div className="col-xl-12">
                <p className="cyril-upper subheader">
                &#91; My <span className="cyril-accent">story</span> &#93;
                </p>
                <h2 className="cyril-up cyril-mb-30 glitch" data-text="Background">Background</h2>
                <p className="cyril-mb-20">
                  
                  I've built a reputation as a versatile Designer and Developer who crafts thoughtful, beautiful, and functional digital experiences.
                </p>
                <p className="cyril-mb-20">
                  I've consistently <strong className="cyril-accent">enhanced product value</strong>, <strong className="cyril-accent">driven marketing success</strong>, and <strong className="cyril-accent">delivered measurable business growth</strong> through cross-functional collaboration and creative problem-solving. 
                </p>
                <p>
                  And I've done so across non-profits, software firms, design agencies, printing companies, and entertainment industries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Background;