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
      {isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}

    </button>
  );
};

export default Social;