import { useEffect } from "react";

const Footer = () => {

  // Initialize theme from localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
  }, []);

  return (
    <div className="cyril-bottom-panel">
      <div className="cyril-bp-frame">

        <div className="cyril-footer">

          <ul>
            <li>
              <a href="mailto:cyril.florita@pm.me" aria-label="Email">
                <i className="fa-solid fa-paper-plane" />
              </a>
            </li>
            <li>
              <a
                href="https://www.behance.net/cyrilflorita"
                target="_blank"
                className="social-icon"
                aria-label="Behance"
              >
                <i className="fab fa-behance" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/cyril-florita"
                target="_blank"
                className="social-icon"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/cyrilflorita"
                target="_blank"
                className="social-icon"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in" />
              </a>
            </li>
            <li>
              <a
                href="https://x.com/CyrilFlorita"
                target="_blank"
                className="social-icon"
                aria-label="Twitter/X"
              >
                <i className="fab fa-x-twitter" />
              </a>
            </li>
          </ul>

        </div>

      </div>

    </div>

  );
};

export default Footer;