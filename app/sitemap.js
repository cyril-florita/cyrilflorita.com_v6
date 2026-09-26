// Emitted as out/sitemap.xml by the static export.
export const dynamic = 'force-static';

const SITE = 'https://cyrilflorita.com';

// Project case-study routes (app/<slug>/page.js), in My Work grid order.
const PROJECTS = [
  'hunger-action-month',
  'gty_v8',
  'gty-dashboard',
  '35-day-generosity-challenge',
  'giving-tuesday',
  'truth-matters',
  'grace-stream',
  'gty-app-landing',
  'gty_v9',
  'the-study-bible-app',
  'the-study-bible-app-logo',
  'patricia-macarthur-pastoral-care-fund',
  'gty-resources',
  'gty-blog-graphics',
  'gty-social-media-graphics',
  'sekihmentis',
  'he-took-my-place',
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
