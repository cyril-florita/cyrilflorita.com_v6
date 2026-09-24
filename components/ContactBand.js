// Closing "Let's work together" band — ends the home page (after My Work)
// and About Me (as its last snap section). Title types in like the other
// section titles (TITLE_SELECTOR in layout/MotionEffects.js); pieces fade in
// via the scroll reveals. Pass `resume` (a URL to a PDF in /public) to show
// a résumé download button. Styles: "contact band" in _components.scss.
const EMAIL = "cyril.florita@pm.me";

const PROFILES = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/cyrilflorita" },
  { label: "Behance", href: "https://www.behance.net/cyrilflorita" },
  { label: "GitHub", href: "https://github.com/cyril-florita" },
  { label: "X", href: "https://x.com/CyrilFlorita" },
];

const ContactBand = ({ resume }) => (
  <div className="cyril-contact">
    <div className="container">
      <p className="cyril-upper subheader">
        &#91; Let&apos;s <span className="cyril-accent">connect</span> &nbsp;&#93;
      </p>
      <h2 className="cyril-up glitch cyril-contact-title" data-text="Let's work together">
        Let&apos;s work together
      </h2>
      <p className="cyril-contact-lede">
        Have a project, a role, or an idea in mind? I&apos;d love to hear about it.
      </p>
      <div className="cyril-contact-actions">
        <a className="cyril-button" href={`mailto:${EMAIL}`}>Email Me</a>
        <a className="cyril-button cyril-type-2" href={PROFILES[0].href} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        {resume && (
          <a className="cyril-button cyril-type-2" href={resume} download>
            Résumé
          </a>
        )}
      </div>
      <p className="cyril-contact-email">
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </p>
      <ul className="cyril-contact-profiles" aria-label="Profiles">
        {PROFILES.map(({ label, href }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ContactBand;
