// Emitted as out/robots.txt by the static export.
export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://cyrilflorita.com/sitemap.xml',
  };
}
