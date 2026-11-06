"use client";

import { useEffect } from 'react';
import { local } from '@/components/safeStorage';

export function ClientThemeProvider({ children }) {
  useEffect(() => {
    const savedTheme = local.get('theme');
    const initialTheme = savedTheme || 'dark';
    
    document.documentElement.setAttribute('data-theme', initialTheme);

    const updateThemeAwareImages = (theme) => {
      const images = document.querySelectorAll('.theme-aware-image');
      images.forEach(img => {
        const src = theme === 'dark' ? img.dataset.darkSrc : img.dataset.lightSrc;
        if (src) img.src = src;
      });
    };

    updateThemeAwareImages(initialTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // Follow the OS while the visitor hasn't picked a theme with the toggle.
    const handleChange = (e) => {
      if (!local.get('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeAwareImages(newTheme);
      }
    };
    
    // Create a mutation observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme');
          updateThemeAwareImages(theme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  return children;
}