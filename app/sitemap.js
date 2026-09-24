// Emitted as out/sitemap.xml by the static export.
export const dynamic = 'force-static';

const SITE = 'https://cyrilflorita.com';

// Project case-study routes (app/<slug>/page.js), in My Work grid order.
const PROJECTS = [
  'gty_v9',
  'the-study-bible-app',
  'gty_v8',
  'truth-matters',
  'grace-stream',
  'gty-dashboard',
  'gty-app-landing',
  'the-study-bible-app-logo',
  'sekihmentis',
  'he-took-my-place',
  'gty-blog-graphics',
  'patricia-macarthur-pastoral-care-fund',
  'gty-resources',
  'gty-social-media-graphics',
];

export default function sitemap() {
  return [
    { url: `${SITE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/about-me/`, changeFrequency: 'monthly', priority: 0.8 },
    ...PROJECTS.map((slug) => ({
      url: `${SITE}/${slug}/`,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
  ];
}
