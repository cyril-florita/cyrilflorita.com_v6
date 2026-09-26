// Emitted as out/sitemap.xml by the static export.
export const dynamic = 'force-static';

const SITE = 'https://cyrilflorita.com';

// Project case-study routes (app/<slug>/page.js), in My Work grid order.
const PROJECTS = [
  'hunger-action-month',
  'grace-stream',
  'gty_v9',
  'giving-tuesday',
  'gty-app-landing',
  'gty_v8',
  '35-day-generosity-challenge',
  'truth-matters',
  'volunteer-leadership-team',
  'gty-dashboard',
  'gty-blog-graphics',
  'gty-social-media-graphics',
  'gty-resources',
  'the-study-bible-app',
  'the-study-bible-app-logo',
  'patricia-macarthur-pastoral-care-fund',
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
