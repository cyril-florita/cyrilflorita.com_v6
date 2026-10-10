// Viteo — a fictional personalized-vitamin subscription, built as a
// product design concept (/lab/viteo/). Everything here is made up:
// products, prices, people. No health claims; nothing is medical advice.

export const BASE = "/lab/viteo";

// The catalog. `color`/`color2` paint the pill illustration; `form` picks
// its shape (capsule = two-tone, softgel = oval, tablet = round).
export const PRODUCTS = {
  d3: {
    id: "d3",
    name: "Vitamin D3",
    dose: "2,000 IU",
    form: "softgel",
    color: "#F6C453",
    price: 5,
    blurb: "The sunshine vitamin, for days spent mostly indoors.",
  },
  b12: {
    id: "b12",
    name: "Vitamin B12",
    dose: "500 mcg",
    form: "tablet",
    color: "#E58E73",
    price: 4,
    blurb: "Found mostly in animal foods, so plant-based diets often fall short.",
  },
  omega: {
    id: "omega",
    name: "Omega-3 (algae)",
    dose: "500 mg",
    form: "softgel",
    color: "#7FB3A6",
    price: 9,
    blurb: "Plant-sourced EPA & DHA, for when fish isn't on the menu.",
  },
  magnesium: {
    id: "magnesium",
    name: "Magnesium Glycinate",
    dose: "200 mg",
    form: "capsule",
    color: "#B9A6E0",
    color2: "#F4EFFB",
    price: 6,
    blurb: "A gentle form, often taken in the evening.",
  },
  c: {
    id: "c",
    name: "Vitamin C",
    dose: "250 mg",
    form: "tablet",
    color: "#F29E4C",
    price: 4,
    blurb: "A daily staple for busy weeks.",
  },
  zinc: {
    id: "zinc",
    name: "Zinc",
    dose: "15 mg",
    form: "tablet",
    color: "#9FB7C9",
    price: 4,
    blurb: "A small daily dose to round out the pack.",
  },
  probiotic: {
    id: "probiotic",
    name: "Probiotic Blend",
    dose: "10 billion CFU",
    form: "capsule",
    color: "#8FBF7F",
    color2: "#F1F7EE",
    price: 8,
    blurb: "Five well-studied strains in a delayed-release capsule.",
  },
  biotin: {
    id: "biotin",
    name: "Biotin",
    dose: "2,500 mcg",
    form: "tablet",
    color: "#E7A9C0",
    price: 5,
    blurb: "A B vitamin people often add for hair and nails.",
  },
  theanine: {
    id: "theanine",
    name: "L-Theanine",
    dose: "100 mg",
    form: "capsule",
    color: "#6E9CCF",
    color2: "#EEF4FB",
    price: 7,
    blurb: "An amino acid from tea leaves, paired with your morning coffee.",
  },
};

// Quiz. `type`: "single" (radio cards), "multi" (checkbox cards, `max`),
// "text" (first name). Each option's `hint` is optional helper copy.
export const QUESTIONS = [
  {
    id: "name",
    type: "text",
    title: "First, what should we call you?",
    sub: "Just a first name. We'll use it to label your pack.",
    placeholder: "Your first name",
  },
  {
    id: "goals",
    type: "multi",
    max: 3,
    title: "What would you like your routine to focus on?",
    sub: "Pick up to three.",
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
    title: "On a typical day, how much time do you spend outside?",
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
    title: "When would you rather take your pack?",
    sub: "We'll set your reminder for it.",
    options: [
      { value: "morning", label: "With breakfast" },
      { value: "evening", label: "With dinner" },
    ],
  },
];

// The quiz answers -> recommended products, each with a plain reason.
export const recommend = (a) => {
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
  ["d3", "omega", "c"].forEach((id) => {
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

export const money = (n) => `$${n.toFixed(2).replace(/\.00$/, "")}`;

// Sample people for the landing page — clearly fictional.
export const SAMPLE_REVIEWS = [
  { name: "Maya R.", text: "The quiz took two minutes and actually explained why each thing was in my pack.", plan: "Vegan · 4 items" },
  { name: "Jordan T.", text: "Skipping a month from the app is one tap. That's the whole reason I stayed.", plan: "Every 2 months" },
  { name: "Priya S.", text: "I like that it told me to check with my doctor about anything I already take.", plan: "Morning pack" },
];
