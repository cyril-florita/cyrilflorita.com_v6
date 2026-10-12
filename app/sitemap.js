// Emitted as out/sitemap.xml by the static export.
export const dynamic = 'force-static';

const SITE = 'https://cyrilflorita.com';

// Project case-study routes (app/<slug>/page.js), in My Work grid order.
const PROJECTS = [
  'viteo',
  'hunger-action-month-dashboard',
  'the-study-bible-app',
  'gty_v9',
  'hunger-action-month',
  'giving-tuesday',
  'gty_v8',
  '35-day-generosity-challenge',
  'grace-stream',
  'gty-dashboard',
  'volunteer-leadership-team',
  'truth-matters',
  'gty-app-landing',
  'gty-blog-graphics',
  'gty-social-media-graphics',
  'gty-resources',
  'the-study-bible-app-logo',
  'patricia-macarthur-pastoral-care-fund',
  'sekihmentis',
  'he-took-my-place',
];

const PITCH = ['/pitch/viteo/', '/pitch/viteo/quiz/', '/pitch/viteo/design-system/'];

export default function sitemap() {
  return [
    { url: `${SITE}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/about-me/`, changeFrequency: 'monthly', priority: 0.8 },
    ...PROJECTS.map((slug) => ({
      url: `${SITE}/${slug}/`,
      changeFrequency: 'yearly',
      priority: 0.6,
    })),
    // The Viteo prototype's indexable pages (plan, checkout and account are noindex).
    ...PITCH.map((path) => ({ url: `${SITE}${path}`, changeFrequency: 'monthly', priority: 0.7 })),
  ];
}
