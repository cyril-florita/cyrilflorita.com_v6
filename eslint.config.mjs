import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Page copy is full of apostrophes and quotes; they render fine.
      'react/no-unescaped-entities': 'off',
      // Static export with its own WebP thumbnails (components/imageProps.js),
      // so plain <img> is intentional.
      '@next/next/no-img-element': 'off',
      // Navigation between / and /about-me is a deliberate full reload behind
      // the preloader wipe (see CLAUDE.md, "Routing model").
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-location-assign-relative-destination': 'off',
      // Mount-time reads of browser-only state (saved theme, current section)
      // have to happen after hydration in a static export; flag, don't fail.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Staging folder for new project materials (git-ignored).
    'new-work/**',
  ]),
])

export default eslintConfig
