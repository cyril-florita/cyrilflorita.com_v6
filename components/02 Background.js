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
                <h2 className="cyril-up cyril-mb-30">Background</h2>
                <p className="cyril-mb-10">
                  With <strong><span className="cyril-accent">almost 2 decades of industry experience</span></strong>, and through my <strong>thoughtfully-</strong>, <strong>carefully-</strong>, <strong>and-beautifully-crafted</strong> projects, I have established myself as a versatile Designer and Developer with a proven track record of:
                </p>
                <ul className="cyril-left-offset cyril-mt-20 cyril-mb-20">
                  <li>enhancing product value</li>
                  <li>driving marketing success</li>
                  <li>delivering measurable business growth</li>
                </ul>
                <p className="cyril-mb-30">
                  My career opportunities span roles at non-profit organizations, multimedia &amp; software companies, design agencies, entertainment industries, financial institutions, and printing companies. And with these opportunities, I have consistently led successful projects while collaborating cross-functionally to deliver <strong>usable</strong>, <strong>profitable</strong>, and <strong>high-quality</strong> creative solutions.
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