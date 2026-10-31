import { useIsDark } from './domState';

const Social = () => {
  const isDarkMode = useIsDark(); // follows data-theme on <html>, which the click below sets

  return (
    <button
      className="cyril-theme-toggle"
      onClick={() => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        // Cross-fade colors for just this switch (see .cyril-theme-switching).
        const root = document.documentElement;
        root.classList.add('cyril-theme-switching');
        clearTimeout(window.__cyrilThemeFade);
        window.__cyrilThemeFade = setTimeout(() => root.classList.remove('cyril-theme-switching'), 500);
        root.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
      }}
      aria-label="Toggle dark mode"
    >
      {/* The same outline sun and moon as the Viteo and Hearthside pitches. */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {isDarkMode ? (
          <>
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        )}
      </svg>

    </button>
  );
};

export default Social;