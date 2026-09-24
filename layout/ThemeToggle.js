import { useState, useEffect } from 'react';

const Social = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme !== 'light');
  }, []);

  return (
    <button
      className="cyril-theme-toggle"
      onClick={() => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        setIsDarkMode(!isDarkMode);
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