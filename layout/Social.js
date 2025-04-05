const Social = () => {
  return (
    <div className="cyril-social">
      <ul>
        <li>
          <a
            href="https://www.behance.net/cyrilflorita"
            target="_blank"
            className="social-icon"
          >
            <i className="fab fa-behance" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/cyril-florita"
            target="_blank"
            className="social-icon"
          >
            <i className="fab fa-github"></i>
            </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/cyrilflorita"
            target="_blank"
            className="social-icon"
          >
            <i className="fab fa-linkedin-in" />
          </a>
        </li>
        <li>
          <a
            href="https://x.com/CyrilFlorita"
            target="_blank"
            className="social-icon"
          >
            <i className="fab fa-x-twitter" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Social;