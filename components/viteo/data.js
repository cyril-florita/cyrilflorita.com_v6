// Viteo — a fictional personalized-vitamin subscription, built as a
// product design concept (/pitch/viteo/). Everything here is made up:
// products, prices, people. No health claims; nothing is medical advice.

export const BASE = "/pitch/viteo";

// The catalog. `color`/`color2` paint the pill illustration; `form` picks
// its shape (capsule = two-tone, softgel = oval, tablet = round, or an oblong
// caplet with `shape: "oblong"`).
export const PRODUCTS = {
  d3: {
    id: "d3",
    name: "Vitamin D3",
    dose: "2,000 IU",
    form: "softgel",
    color: "#F6C453",
    price: 5,
    blurb: "Vegan D3 from lichen, in an olive-oil softgel. Your skin makes vitamin D from sunlight, so indoor days mean less of it.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["You spend most of the day indoors.", "Your daily time outside is on the short side.", "It rounds out packs that would otherwise have fewer than three items."],
    pairs: ["omega"],
  },
  b12: {
    id: "b12",
    shape: "oblong", // a caplet rather than a round tablet
    name: "Vitamin B12",
    dose: "500 mcg",
    form: "tablet",
    color: "#E58E73",
    price: 4,
    blurb: "Methylcobalamin, a ready-to-use form of B12. It comes almost entirely from animal foods, so most plant-based eaters supplement it.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["You eat mostly or fully plant-based.", "You'd like steadier energy through the day."],
    pairs: ["omega"],
  },
  omega: {
    id: "omega",
    name: "Omega-3 (algae)",
    dose: "500 mg",
    form: "softgel",
    color: "#7FB3A6",
    price: 9,
    blurb: "EPA and DHA from algae, the same source fish get theirs from. A plant-based alternative to fish oil, with no fishy aftertaste.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["Fish isn't part of your diet.", "Oily fish rarely makes it onto your plate.", "It rounds out packs that would otherwise have fewer than three items."],
    pairs: ["b12", "d3"],
  },
  magnesium: {
    id: "magnesium",
    name: "Magnesium Glycinate",
    dose: "200 mg",
    form: "capsule",
    color: "#B9A6E0",
    color2: "#F4EFFB",
    price: 6,
    blurb: "Magnesium bound to glycine, a form known for being easy on the stomach. Most people take it in the evening.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["You'd like help winding down.", "You mentioned restless nights.", "You train hard most weeks."],
    pairs: [],
  },
  c: {
    id: "c",
    name: "Vitamin C",
    dose: "250 mg",
    form: "tablet",
    color: "#F29E4C",
    price: 4,
    blurb: "250 mg of buffered vitamin C, a moderate everyday amount that's gentle enough to take on an empty stomach.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["You picked busy-season support.", "It rounds out packs that would otherwise have fewer than three items."],
    pairs: ["zinc"],
  },
  zinc: {
    id: "zinc",
    name: "Zinc",
    dose: "15 mg",
    form: "tablet",
    color: "#9FB7C9",
    price: 4,
    blurb: "Zinc picolinate, a well-absorbed form, at 15 mg. Usually paired with vitamin C.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["You picked busy-season support (it joins vitamin C)."],
    pairs: ["c"],
  },
  probiotic: {
    id: "probiotic",
    name: "Probiotic Blend",
    dose: "10 billion CFU",
    form: "capsule",
    color: "#8FBF7F",
    color2: "#F1F7EE",
    price: 8,
    blurb: "Five well-studied strains, 10 billion CFU at expiry, in a delayed-release capsule built to get past stomach acid.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["You'd like to focus on digestion."],
    pairs: [],
  },
  biotin: {
    id: "biotin",
    shape: "oblong", // a caplet rather than a round tablet
    name: "Biotin",
    dose: "2,500 mcg",
    form: "tablet",
    color: "#E7A9C0",
    price: 5,
    blurb: "Vitamin B7. A popular addition for people whose routine centres on hair and nails.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["You picked hair & nails."],
    pairs: [],
  },
  theanine: {
    id: "theanine",
    name: "L-Theanine",
    dose: "100 mg",
    form: "capsule",
    color: "#6E9CCF",
    color2: "#EEF4FB",
    price: 7,
    blurb: "An amino acid found naturally in green tea. Many people take it alongside their morning coffee.",
    // When the quiz adds it (mirrors recommend() below) and what it's often packed with.
    reasons: ["You'd like calm focus."],
    pairs: [],
  },
};

// Quiz. `type`: "single" (radio cards), "multi" (checkbox cards, `max`),
// "text" (first name). Each option's `hint` is optional helper copy.
export const QUESTIONS = [
  {
    id: "name",
    type: "text",
    title: "First, what's your first name?",
    sub: "We print it on your pack, so it's easy to spot.",
    placeholder: "Your first name",
  },
  {
    id: "goals",
    type: "multi",
    max: 3,
    title: "What would you like your routine to focus on?",
    sub: "Pick up to three. You can change these later.",
    options: [
      { value: "energy", label: "Steady energy", icon: "☀" },
      { value: "sleep", label: "Winding down", icon: "☾" },
      { value: "focus", label: "Calm focus", icon: "◎" },
      { value: "immune", label: "Busy-season support", icon: "✚" },
      { value: "digestion", label: "Digestion", icon: "≈" },
      { value: "hair", label: "Hair & nails", icon: "✿" },
    ],
  },
  {
    id: "diet",
    type: "single",
    title: "How would you describe the way you eat?",
    options: [
      { value: "omnivore", label: "A bit of everything" },
      { value: "pescatarian", label: "Pescatarian", hint: "Fish, but no meat" },
      { value: "vegetarian", label: "Vegetarian" },
      { value: "vegan", label: "Vegan", hint: "Fully plant-based" },
    ],
  },
  {
    id: "fish",
    type: "single",
    title: "How often do you eat oily fish?",
    sub: "Salmon, sardines, mackerel and the like.",
    options: [
      { value: "often", label: "Twice a week or more" },
      { value: "sometimes", label: "Now and then" },
      { value: "rarely", label: "Rarely or never" },
    ],
    // Skipped for vegetarian and vegan answers.
    skip: (a) => a.diet === "vegetarian" || a.diet === "vegan",
  },
  {
    id: "sun",
    type: "single",
    title: "On a typical day, how much time do you spend outdoors?",
    sub: "Commutes and lunch breaks count.",
    options: [
      { value: "rarely", label: "Hardly any", hint: "Mostly indoors" },
      { value: "some", label: "Around 30 minutes" },
      { value: "lots", label: "An hour or more" },
    ],
  },
  {
    id: "sleep",
    type: "single",
    title: "How have you been sleeping lately?",
    options: [
      { value: "great", label: "Like a log" },
      { value: "okay", label: "It's okay" },
      { value: "restless", label: "Restless most nights" },
    ],
  },
  {
    id: "activity",
    type: "single",
    title: "How active is a usual week?",
    options: [
      { value: "light", label: "Light", hint: "Walks, the odd stretch" },
      { value: "moderate", label: "Moderate", hint: "2–3 workouts" },
      { value: "intense", label: "Intense", hint: "4+ hard sessions" },
    ],
  },
  {
    id: "time",
    type: "single",
    title: "When would you like to take your pack?",
    sub: "We'll time your daily reminder to match.",
    options: [
      { value: "morning", label: "With breakfast" },
      { value: "evening", label: "With dinner" },
    ],
  },
];

// The quiz answers -> recommended products, each with a plain reason.
// `fill: false` skips the "at least three" top-up, so the quiz can show only
// what the answers so far have earned.
export const recommend = (a, { fill = true } = {}) => {
  const picks = [];
  const add = (id, why) => {
    if (!picks.find((p) => p.id === id)) picks.push({ id, why });
  };
  const goals = a.goals || [];
  if (a.sun === "rarely" || a.sun === "some") add("d3", a.sun === "rarely" ? "You spend most of the day indoors." : "Your daily time outside is on the short side.");
  if (a.diet === "vegan" || a.diet === "vegetarian") add("b12", "You eat mostly or fully plant-based.");
  if (a.diet === "vegan" || a.diet === "vegetarian" || a.fish === "rarely") add("omega", a.fish === "rarely" ? "Oily fish rarely makes it onto your plate." : "Fish isn't part of your diet.");
  if (a.sleep === "restless" || goals.includes("sleep")) add("magnesium", goals.includes("sleep") ? "You'd like help winding down." : "You mentioned restless nights.");
  if (a.activity === "intense" && !picks.find((p) => p.id === "magnesium")) add("magnesium", "You train hard most weeks.");
  if (goals.includes("immune")) {
    add("c", "You picked busy-season support.");
    add("zinc", "Pairs with vitamin C for your busy-season goal.");
  }
  if (goals.includes("digestion")) add("probiotic", "You'd like to focus on digestion.");
  if (goals.includes("hair")) add("biotin", "You picked hair & nails.");
  if (goals.includes("focus")) add("theanine", "You'd like calm focus.");
  if (goals.includes("energy") && !picks.find((p) => p.id === "b12")) add("b12", "You'd like steadier energy through the day.");
  // Always at least three, so every pack feels complete.
  if (fill) ["d3", "omega", "c"].forEach((id) => {
    if (picks.length < 3) add(id, "A well-rounded everyday addition.");
  });
  return picks.slice(0, 6);
};

export const PLANS = [
  { id: "monthly", label: "Every month", months: 1, discount: 0 },
  { id: "two", label: "Every 2 months", months: 2, discount: 0.1, badge: "Save 10%" },
  { id: "three", label: "Every 3 months", months: 3, discount: 0.15, badge: "Save 15%" },
];

export const SHIPPING = 0; // free, always — one less line to worry about

export const priceFor = (items, planId) => {
  const plan = PLANS.find((p) => p.id === planId) || PLANS[0];
  const monthly = items.reduce((n, i) => n + (PRODUCTS[i.id]?.price || 0), 0);
  const subtotal = monthly * plan.months;
  const savings = Math.round(subtotal * plan.discount * 100) / 100;
  return { plan, monthly, subtotal, savings, total: Math.round((subtotal - savings) * 100) / 100 };
};

export const money = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\.00$/, "")}`;

// Sample people for the landing page — clearly fictional.
export const SAMPLE_REVIEWS = [
  { name: "Maya R.", text: "The quiz took two minutes, and for once I know why every pill is in my pack.", plan: "Vegan · 4 items" },
  { name: "Jordan T.", text: "I travel a lot. Skipping a month is one tap, and that's why I've stayed.", plan: "Every 2 months" },
  { name: "Priya S.", text: "It flagged that I should check with my doctor about the medication I take. I appreciated that.", plan: "Morning pack" },
  { name: "Daniel K.", text: "I swapped one item for another in about ten seconds. No email thread, no phone call.", plan: "Evening pack" },
  { name: "Aisha M.", text: "Seeing my name on the box sounds small, but it's the first routine I've actually kept up with.", plan: "Every 3 months" },
  { name: "Tomás L.", text: "The reminder lands right when I'm making coffee, and checking the day off is weirdly satisfying.", plan: "Morning pack · 5 items" },
  { name: "Grace H.", text: "I moved apartments mid-subscription. Changing the address took a minute, and the next box just showed up.", plan: "Every 2 months" },
];

// Batch results (/lot/): sample lots, so the transparency page can be tried.
// Each lot is one production batch of one product, tested by an independent
// lab before release. Clearly sample data (stamped on the page).
const METALS = (lead) => [
  { test: "Lead", result: `${lead} µg/serving`, spec: "≤ 0.5 µg/serving", pass: true },
  { test: "Cadmium", result: "Not detected", spec: "Within spec", pass: true },
  { test: "Arsenic", result: "Not detected", spec: "Within spec", pass: true },
  { test: "Mercury", result: "Not detected", spec: "Within spec", pass: true },
];
const MICRO = [
  { test: "Total aerobic count", result: "< 10 CFU/g", spec: "Within spec", pass: true },
  { test: "Yeast and mold", result: "< 10 CFU/g", spec: "Within spec", pass: true },
  { test: "E. coli", result: "Absent", spec: "Absent", pass: true },
  { test: "Salmonella", result: "Absent", spec: "Absent", pass: true },
];
export const SAMPLE_LOTS = {
  "VT-2410-07": { product: "d3", made: "Sep 18, 2026", tested: "Sep 24, 2026", bestBy: "Sep 2028", potency: 104, metals: METALS("0.04"), micro: MICRO },
  "VT-2409-12": { product: "magnesium", made: "Aug 27, 2026", tested: "Sep 3, 2026", bestBy: "Aug 2028", potency: 101, metals: METALS("0.07"), micro: MICRO },
  "VT-2408-03": { product: "omega", made: "Aug 5, 2026", tested: "Aug 12, 2026", bestBy: "Feb 2028", potency: 108, metals: METALS("0.02"), micro: MICRO },
};
export const LOT_LAB = "An ISO/IEC 17025-accredited independent laboratory";

