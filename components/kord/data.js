// Kord: catalog, paints and the 3D story's parts. Kord is a fictional online-only
// road-bike brand (a design and dev pitch); every bike, figure and price here is invented.

export const BRAND = { name: "Kord", tagline: "Road bikes, built to order." };

// The model names carry ™ and the brand ® wherever they're shown (the user's calls, 2026-11-24) — not
// the wall words behind the bike (the landing's giant ARC, the builder's faint name), which `plain()`
// strips too. `plain()` also strips them for screen-reader text (alt, aria-label, live messages),
// which would otherwise read "trademark" / "registered" at every mention.
export const plain = (s) => s.replace(/[™®]/g, "");

// The range: four road bikes, one frame family each. `weight` is a complete 56 cm bike.
export const BIKES = [
  {
    id: "arc", name: "Arc™", type: "Aero", line: "Refined speed. Less weight, more substance.",
    blurb: "Aero tubes, hidden cables and 50 mm wheels, for long efforts on flat and rolling roads.",
    from: 11900, weight: 7.4, wheels: "50 mm carbon", gearing: "2×12, 52/36 · 11–34", tires: "28 mm", clearance: "32 mm",
  },
  {
    id: "crest", name: "Crest™", type: "Climbing", line: "Less bike. More mountain.",
    blurb: "A light, stiff frame and shallow 35 mm wheels for steep roads and long days in the hills.",
    from: 11500, weight: 6.8, wheels: "35 mm carbon", gearing: "2×12, 48/35 · 10–36", tires: "28 mm", clearance: "32 mm",
  },
  {
    id: "meridian", name: "Meridian™", type: "Endurance", line: "All day. Every day.",
    blurb: "A taller front end, a softer ride and room for 35 mm tires, so the hundredth kilometer feels like the first.",
    from: 11200, weight: 8.1, wheels: "40 mm carbon", gearing: "2×12, 46/33 · 10–36", tires: "32 mm", clearance: "35 mm",
  },
  {
    id: "atlas", name: "Atlas™", type: "All-road", line: "Where the tarmac ends.",
    blurb: "Road geometry with gravel clearance, mounts for bags and fenders, and wide-range gearing.",
    from: 11000, weight: 8.7, wheels: "30 mm carbon", gearing: "2×12, 46/30 · 10–36", tires: "38 mm", clearance: "42 mm",
  },
];

// Paints for the 3D bike. `decal` is the wordmark's color on that paint (the rims had a stripe in
// it too, removed 2026-11-23). The wordmark sits on carbon (the frame is paint banded with carbon
// edges), so every decal is light.
export const PAINTS = [
  // `coat` / `coatRough`: the clear coat's strength and roughness. All five are matte, with no
  // coat (2026-11-23: a gloss coat read as glare); Ember keeps a little metallic flake.
  // The first is the default (Stealth; Volt was the default for a while on 2026-11-23).
  // `decal`: the down-tube wordmark (on raw carbon); `badge`: the model name on the head tube's front,
  // which is paint, so it takes a color that contrasts with the paint.
  { id: "stealth", name: "Stealth", hex: "#16171a", decal: "#c8f031", badge: "#c8f031", metal: 0.05, rough: 0.68, coat: 0, coatRough: 0.5 },
  { id: "volt", name: "Volt", hex: "#c8f031", decal: "#c8f031", badge: "#16171a", metal: 0.0, rough: 0.64, coat: 0, coatRough: 0.5 },
  // a deep matte blue with a little flake, white lettering, between Volt and Glacier (2026-11-25, the user's call: "another paint: blue")
  { id: "cobalt", name: "Cobalt", hex: "#2350c8", decal: "#f4f6f8", badge: "#f4f6f8", metal: 0.12, rough: 0.6, coat: 0, coatRough: 0.5 },
  { id: "glacier", name: "Glacier", hex: "#e4e8ec", decal: "#f4f6f8", badge: "#16171a", metal: 0.0, rough: 0.64, coat: 0, coatRough: 0.5 },
  { id: "ember", name: "Ember", hex: "#b8321c", decal: "#f4f1ea", badge: "#f4f1ea", metal: 0.15, rough: 0.6, coat: 0, coatRough: 0.5 },
];

// Hotspots on the hero bike: an anchor in the model's own space (three.js: x forward,
// y up, z toward the drive side), a title and a line.
export const HOTSPOTS = [
  // on the top tube's middle (it was on the down tube, over the wordmark)
  { id: "frame", at: [0.12, 0.757, 0.02], title: "Aero carbon frame", line: "Truncated-airfoil tubes, 820 g in a 56 cm." },
  { id: "wheels", at: [0.586 + 0.28, 0.34 + 0.1, 0.02], title: "50 mm carbon wheels", line: "28 mm tubeless tires on a 23 mm inner rim." },
  { id: "drive", at: [0.0, 0.27, 0.07], title: "2×12 wireless shifting", line: "52/36 rings, 11–34 cassette, a power meter in the crank." },
  { id: "cockpit", at: [0.52, 0.86, 0.0], title: "Carbon cockpit", line: "Aero bar and stem, every hose inside." },
];

// The exploded view: each part's offset (three.js units = metres) at full explode, and the
// callouts shown as it comes apart (anchored to a part; `side: "left"` hangs the label left of
// its dot instead of above it — the saddle's, which would otherwise run into the heading).
export const EXPLODE = {
  Frame: [0, 0, 0], Wordmark: [0, 0, 0],
  Fork: [0.16, 0.04, 0],
  Brake_F: [0.2, 0.04, -0.1],
  Wheel_F: [0.5, -0.02, 0],
  Wheel_R: [-0.5, -0.02, 0],
  Brake_R: [-0.12, 0, -0.12],
  Cockpit: [0.14, 0.24, 0],
  Seatpost: [-0.14, 0.1, 0],
  Saddle: [-0.26, 0.2, 0],     // back more than up, so it stays clear of the heading
  Crankset: [0.02, -0.12, 0.16],
  Chain: [-0.04, -0.07, 0.09],
  RearDerailleur: [-0.2, -0.12, 0.12],
  FrontDerailleur: [0.0, 0.06, 0.12],
};

export const CALLOUTS = [
  { n: "01", part: "Frame", at: [0.2, 0.62, 0], title: "Frame", line: "High-modulus carbon, 820 g." },
  { n: "02", part: "Wheel_F", at: [0.586, 0.62, 0], title: "Wheels", line: "50 mm deep, 1,390 g the pair." },
  { n: "03", part: "Crankset", at: [0.0, 0.2, 0.08], title: "Drivetrain", line: "2×12 wireless, power meter built in." },
  { n: "04", part: "Cockpit", at: [0.5, 0.9, 0], title: "Cockpit", line: "Carbon bar and stem, 285 g." },
  { n: "05", part: "Saddle", at: [-0.22, 0.97, 0], side: "left", title: "Saddle and post", line: "Carbon rails on an aero post." },
];

export const SPECS = [
  { value: "7.4", unit: "kg", label: "Complete, 56 cm" },
  { value: "50", unit: "mm", label: "Carbon wheels" },
  { value: "2×12", unit: "", label: "Wireless shifting" },
  { value: "32", unit: "mm", label: "Tire clearance" },
];

export const money = (n) => `$${n.toLocaleString("en-US")}`;

// ---------------------------------------------------------------- Find your bike
// Four questions, inline on the landing (FindBike.js). The first three score the bikes (`pts`;
// the most points wins, the runner-up is "also worth a look"); the fourth, height, only suggests
// a frame size. Each scoring answer carries a reason per bike it suits (`why`), written to restate
// the answer, and the result shows the winner's reasons in question order.
export const BIKE_PAINT = { arc: "stealth", crest: "glacier", meridian: "ember", atlas: "volt" };

export const FIND = [
  {
    id: "terrain", q: "Where do you ride?", a: [
      { id: "flat", label: "Flat and rolling roads", pts: { arc: 3, meridian: 1 }, why: {
        arc: "You ride flat and rolling roads, where deep tubes and 50 mm wheels hold your speed.",
        meridian: "You ride flat and rolling roads, and 32 mm tires smooth out the rough tarmac." } },
      { id: "hills", label: "Hills and mountains", pts: { crest: 3, meridian: 1 }, why: {
        crest: "You ride hills and mountains, and at 6.8 kg with a 10–36 cassette, it's built to climb.",
        meridian: "You ride hills, and 46/33 rings with a 10–36 cassette keep steep roads spinnable." } },
      { id: "mixed", label: "Mixed roads, some gravel", pts: { meridian: 2, atlas: 2 }, why: {
        meridian: "Your roads turn rough, and 35 mm of tire clearance takes broken tarmac in stride.",
        atlas: "Your roads turn to gravel, and 42 mm of tire clearance goes there with you." } },
      { id: "gravel", label: "Gravel and rough tracks", pts: { atlas: 3 }, why: {
        atlas: "You ride gravel and rough tracks, which 38 mm tires and 42 mm of clearance are made for." } },
    ],
  },
  {
    id: "length", q: "How long is a big day?", a: [
      { id: "short", label: "Under 2 hours", pts: { arc: 2, crest: 1 }, why: {
        arc: "Your rides are short and fast, which is what an aero bike is for.",
        crest: "Your rides are short, and a light bike makes every one of them quicker." } },
      { id: "mid", label: "2 to 4 hours", pts: { arc: 1, crest: 1, meridian: 1 }, why: {
        arc: "Your big days are 2 to 4 hours, right in its range.",
        crest: "Your big days are 2 to 4 hours, right in its range.",
        meridian: "Your big days are 2 to 4 hours, right in its range." } },
      { id: "long", label: "4 hours or more", pts: { meridian: 3, atlas: 1 }, why: {
        meridian: "Your big days run past 4 hours, and a taller front end keeps you comfortable to the end.",
        atlas: "Your big days run long, and its relaxed position keeps them comfortable." } },
      { id: "multi", label: "Several days, with bags", pts: { atlas: 3, meridian: 1 }, why: {
        atlas: "You ride for days with bags, and it has the mounts for bags and fenders.",
        meridian: "You ride for days, and its endurance position suits long stretches in the saddle." } },
    ],
  },
  {
    id: "priority", q: "What matters most?", a: [
      { id: "speed", label: "Holding speed", pts: { arc: 3 }, why: {
        arc: "You put speed first, and the Arc™ is our fastest bike." } },
      { id: "climbing", label: "Climbing light", pts: { crest: 3 }, why: {
        crest: "You put climbing first, and the Crest™ is our lightest bike." } },
      { id: "comfort", label: "All-day comfort", pts: { meridian: 3, atlas: 1 }, why: {
        meridian: "You put comfort first, and the Meridian™ is our smoothest ride.",
        atlas: "You put comfort first, and wide tires make the Atlas™ a soft ride." } },
      { id: "anywhere", label: "Going anywhere", pts: { atlas: 3 }, why: {
        atlas: "You want to go anywhere, and the Atlas™ goes where the tarmac ends." } },
    ],
  },
  {
    id: "height", q: "How tall are you?", a: [
      { id: "h1", label: "Under 165 cm", size: "49" },
      { id: "h2", label: "165 to 172 cm", size: "52" },
      { id: "h3", label: "173 to 180 cm", size: "54" },
      { id: "h4", label: "181 to 188 cm", size: "56" },
      { id: "h5", label: "Over 188 cm", size: "58" },
    ],
  },
];

const own = (o, k) => (Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined);
export const findAnswer = (qId, aId) => FIND.find((q) => q.id === qId)?.a.find((a) => a.id === aId);

// answers: { terrain, length, priority, height } (answer ids). Returns null until all four are in.
// Ties go to the bike the "what matters most" answer favours, then to the range's order.
export function findBike(answers) {
  if (!answers || FIND.some((q) => !findAnswer(q.id, own(answers, q.id)))) return null;
  const score = Object.fromEntries(BIKES.map((b) => [b.id, 0]));
  for (const q of FIND) for (const [id, n] of Object.entries(findAnswer(q.id, answers[q.id]).pts || {})) score[id] += n;
  const pri = findAnswer("priority", answers.priority).pts;
  const order = [...BIKES].sort((a, b) => (score[b.id] - score[a.id]) || ((pri[b.id] || 0) - (pri[a.id] || 0)) || (BIKES.indexOf(a) - BIKES.indexOf(b)));
  const bike = order[0], runner = order[1];
  const reasons = FIND.map((q) => findAnswer(q.id, answers[q.id]).why?.[bike.id]).filter(Boolean);
  const h = findAnswer("height", answers.height);
  return { bike, runner, reasons, size: h.size, height: h.label, paint: BIKE_PAINT[bike.id], score };
}

// for a shared link: ?find=flat.long.comfort.h3 (one answer id per question, in order)
export const encodeFind = (answers) => FIND.map((q) => answers[q.id]).join(".");
export function decodeFind(s) {
  const parts = String(s || "").split(".");
  if (parts.length !== FIND.length) return null;
  const answers = Object.fromEntries(FIND.map((q, i) => [q.id, parts[i]]));
  return findBike(answers) ? answers : null;
}

// ---------------------------------------------------------------- The builder
// /pitch/kord/build/ (Builder.js): bike, size, paint, groupset, wheels; the price and weight update
// as you go. Groupsets are Kord's own fictional "Drive 12" tiers (no real component maker named).
// A build is { bike, size, paint, group, wheels } (ids); `normalizeBuild` fills and checks one.
export const SIZES = ["49", "52", "54", "56", "58"];
// each size's frame against the model's (a 56: stack 570, saddle 735 mm from the BB along the seat tube),
// in mm — the 3D bike reshapes to it in the builder (bikeScene's setSpec): the front end up or down the
// head tube (stack), the seat cluster along the seat tube (seat), the seatpost and saddle (saddle). The stack
// changes are about three quarters of a real range: a 49's full drop squashed the head tube to almost nothing
export const SIZE_GEO = {
  "49": { stack: -42, seat: -55, saddle: -75, geo: { stack: -55, reach: -17, head: -1.5, seat: 1, wheelbase: -22 } },
  "52": { stack: -28, seat: -35, saddle: -45, geo: { stack: -35, reach: -10, head: -1, seat: 0.5, wheelbase: -14 } },
  "54": { stack: -14, seat: -18, saddle: -23, geo: { stack: -18, reach: -5, head: -0.5, seat: 0, wheelbase: -7 } },
  "56": { stack: 0, seat: 0, saddle: 0, geo: {} },
  "58": { stack: 16, seat: 18, saddle: 25, geo: { stack: 20, reach: 5, head: 0.3, seat: -0.3, wheelbase: 8 } },
};
// `geo`: the size's real geometry against the 56, for the numbers (Compare): small frames are lower and
// shorter, with a slacker head angle and a steeper seat angle, as a typical race range runs; chainstays
// and BB drop don't change. (The 3D's `stack` above is softened; these are the real ones.)
export const PAINT_PRICE = { stealth: 0, volt: 0, cobalt: 350, glacier: 350, ember: 350 };   // the last three: signature paints
export const GROUPSETS = [
  { id: "sport", name: "Drive 12 Sport", line: "Wireless 2×12, hydraulic discs.", price: 0, weight: 0 },
  { id: "race", name: "Drive 12 Race", line: "Lighter shifters and derailleurs, a carbon crank.", price: 1400, weight: -0.25 },
  { id: "pro", name: "Drive 12 Pro", line: "Our lightest: ceramic bearings, a power meter in the crank.", price: 3200, weight: -0.45 },
];
export const WHEELSETS = [
  { id: "stock", name: "Included", short: null, line: (b) => `${b.wheels} wheels, made for the ${b.name}.`, price: 0, weight: 0 },
  { id: "light", name: "38 mm carbon, climbing", short: "38 mm carbon", line: () => "1,240 g the pair: our lightest wheels.", price: 1200, weight: -0.18 },
  { id: "deep", name: "62 mm carbon, aero", short: "62 mm carbon", line: () => "Deeper rims that hold speed on the flat.", price: 1600, weight: 0.1 },
];
export const SHIP_DAYS = 21;

export function normalizeBuild(raw = {}) {
  const pick = (v, ok, d) => (ok.includes(v) ? v : d);
  const bike = BIKES.find((b) => b.id === raw.bike) || BIKES[0];
  return {
    bike: bike.id,
    size: pick(raw.size, SIZES, "54"),
    paint: pick(raw.paint, PAINTS.map((p) => p.id), PAINTS[0].id),   // Stealth when none is given: no bike has "its" paint (2026-11-25)
    group: pick(raw.group, GROUPSETS.map((g) => g.id), "sport"),
    wheels: pick(raw.wheels, WHEELSETS.map((w) => w.id), "stock"),
  };
}
// price and weight of a (normalized) build: the bike's starting price and 56 cm weight, plus each choice
export function priceBuild(b) {
  const bike = BIKES.find((x) => x.id === b.bike);
  return bike.from + PAINT_PRICE[b.paint] + GROUPSETS.find((g) => g.id === b.group).price + WHEELSETS.find((w) => w.id === b.wheels).price;
}
export function weighBuild(b) {
  const bike = BIKES.find((x) => x.id === b.bike);
  const sizeK = { "49": -0.12, "52": -0.06, "54": -0.03, "56": 0, "58": 0.05 }[b.size];
  const kg = bike.weight + sizeK + GROUPSETS.find((g) => g.id === b.group).weight + WHEELSETS.find((w) => w.id === b.wheels).weight;
  return Math.round(kg * 100) / 100;
}
export const buildQuery = (b) => `?bike=${b.bike}&size=${b.size}&paint=${b.paint}&group=${b.group}&wheels=${b.wheels}`;

// ---------------------------------------------------------------- Compare
// /pitch/kord/compare/: every bike side by side. Geometry is for a 56 cm frame (mm and degrees); `sizeGeo` gives
// it in any size (Compare's size picker).
export const DETAILS = {
  arc: { position: "Race", mounts: "Two bottles", best: "Fast group rides, flat and rolling roads",
    geo: { stack: 570, reach: 390, head: 73, seat: 73.5, wheelbase: 990, chainstay: 410, drop: 70 } },
  crest: { position: "Race", mounts: "Two bottles", best: "Hills, mountain passes, long climbs",
    geo: { stack: 565, reach: 392, head: 73.2, seat: 73.5, wheelbase: 985, chainstay: 408, drop: 70 } },
  meridian: { position: "Endurance", mounts: "Two bottles, fenders", best: "Long days, rough tarmac, comfort first",
    geo: { stack: 595, reach: 378, head: 72, seat: 73, wheelbase: 1005, chainstay: 415, drop: 72 } },
  atlas: { position: "Relaxed", mounts: "Three bottles, fenders, bags", best: "Gravel, bikepacking, going anywhere",
    geo: { stack: 590, reach: 380, head: 71.5, seat: 73, wheelbase: 1030, chainstay: 430, drop: 75 } },
};
// a bike's geometry in a size (DETAILS' 56 plus the size's changes)
export function sizeGeo(id, size) {
  const g = DETAILS[id].geo, d = (SIZE_GEO[size] || SIZE_GEO["56"]).geo;
  return Object.fromEntries(Object.entries(g).map(([k, x]) => [k, Math.round((x + (d[k] || 0)) * 10) / 10]));
}
export const GEO_ROWS = [
  { k: "stack", label: "Stack", unit: "mm" }, { k: "reach", label: "Reach", unit: "mm" },
  { k: "head", label: "Head angle", unit: "°" }, { k: "seat", label: "Seat angle", unit: "°" },
  { k: "wheelbase", label: "Wheelbase", unit: "mm" }, { k: "chainstay", label: "Chainstays", unit: "mm" },
  { k: "drop", label: "BB drop", unit: "mm" },
];
// ?a=meridian&b=atlas: those two first (and highlighted), then the rest in the range's order
export function compareOrder(a, b) {
  const ids = BIKES.map((x) => x.id), pick = [a, b].filter((x, i, arr) => ids.includes(x) && arr.indexOf(x) === i);
  return [...pick, ...ids.filter((x) => !pick.includes(x))].map((id) => BIKES.find((x) => x.id === id));
}

// ---------------------------------------------------------------- Virtual fit
// /pitch/kord/fit/: five measurements (cm) -> a starting fit. Saddle height is the classic
// inseam x 0.883 (to the top of the saddle from the crank's centre); the stem grows or shrinks
// from 100 mm with the torso and arms against what's typical for the height; the bar matches the
// shoulders. A fitter confirms it on the call or from photos. Values outside FIT_RANGE are clamped.
export const FIT_FIELDS = [
  { k: "height", label: "Height", hint: "Standing, without shoes", min: 150, max: 205, sample: 178 },
  { k: "inseam", label: "Inseam", hint: "Floor to crotch, a book pressed up between your legs", min: 65, max: 100, sample: 84 },
  { k: "torso", label: "Torso", hint: "Top of the book to the notch at the base of your neck", min: 50, max: 75, sample: 62 },
  { k: "arm", label: "Arm", hint: "Shoulder bone to the center of a closed fist", min: 50, max: 78, sample: 64 },
  { k: "shoulders", label: "Shoulders", hint: "Across the back, shoulder bone to shoulder bone", min: 32, max: 50, sample: 41 },
];
const clampN = (v, a, b) => Math.min(b, Math.max(a, v));
export function fitFor(m) {
  const v = Object.fromEntries(FIT_FIELDS.map((f) => [f.k, clampN(Number(m?.[f.k]) || f.sample, f.min, f.max)]));
  const size = v.height < 165 ? "49" : v.height <= 172 ? "52" : v.height <= 180 ? "54" : v.height <= 188 ? "56" : "58";
  const saddle = Math.round(v.inseam * 8.83);                                   // mm
  const crank = v.inseam < 76 ? 165 : v.inseam < 84 ? 170 : v.inseam < 90 ? 172.5 : 175;
  const reachDiff = v.torso + v.arm - v.height * 0.71;                           // cm longer than typical
  const stem = clampN(Math.round((100 + reachDiff * 2.5) / 10) * 10, 80, 130);
  const bar = [38, 40, 42, 44].reduce((a, b) => (Math.abs(b - v.shoulders) <= Math.abs(a - v.shoulders) ? b : a));   // ties go wider
  return { v, size, saddle, crank, stem, bar };
}

// The Kord® Guarantee: its own page since 2026-11-25 (/pitch/kord/guarantee/, the user's call; it was the
// landing's #kord-guarantee section, which replaced How it works on 2026-11-24, and is now a teaser linking
// there): the guarantees and their terms (the user's copy, 2026-11-25), how a return works, then how
// buying a Kord differs from a typical online store and a bike shop. The design system's cards sample shows
// the guarantees too.
export const GUARANTEES = [
  { id: "ride", figure: "30 days", title: "Ride it, or send it back", line: "Ride it for 30 days. If it isn’t right, return it in its original condition for a refund of the bike price. A prepaid return label and replacement shipping box are $95, deducted from your refund. Original shipping, and any damaged or missing parts, are not refunded." },
  { id: "frame", figure: "Lifetime", title: "Frame warranty", line: "Kord® frames and forks are covered against manufacturing defects in materials and workmanship for as long as the original owner owns the bike. We’ll repair or replace the frame at our discretion. Crashes, misuse, modifications, and normal wear aren’t covered. Proof of purchase is required." },
  { id: "crash", figure: "3 years", title: "Crash replacement", line: "If you damage the frame in a crash within three years, we’ll offer a replacement frame at our cost price. We’ll need photos and an inspection first. The offer is limited to one replacement per bike, and you pay shipping." },
  { id: "fit", figure: "1 year", title: "Fit adjustments", line: "If the fit feels off in the first year, we’ll swap your stem, bar, or saddle for a different size. Your first swap ships free, and later swaps cost shipping. Parts must be unused or lightly used.", href: "/pitch/kord/fit/", cta: "Try the virtual fit" },
];
// how a return works, on the Guarantee page (matches the 30-day terms above)
export const RETURN_STEPS = [
  { id: "tell", title: "Tell us", line: "Message us or call within 30 days of delivery. No form to fill in, and no reason needed." },
  { id: "ship", title: "We send a box", line: "A prepaid return label and a replacement shipping box, $95, deducted from your refund. Pack the bike in its original condition." },
  { id: "refund", title: "You're refunded", line: "The bike price, less the $95, within five working days of the bike reaching us. Original shipping isn’t refunded." },
];
export const DIFFERENCES = [
  { label: "Built", kord: "To order, for you", online: "From stock", shop: "From stock" },
  { label: "Fitted", kord: "Before it ships, from your measurements and a video call", online: "Rarely: you pick a size", shop: "In the store" },
  { label: "Arrives", kord: "Ride-ready: 95% assembled, bar and front wheel to fit", online: "Partly assembled", shop: "Ready, collected in store" },
  { label: "Trial", kord: "30 days, the bike price refunded", online: "Returns if unridden", shop: "Rarely" },
  { label: "Frame warranty", kord: "Lifetime, plus crash replacement", online: "Varies by brand", shop: "Varies by brand" },
  { label: "Price", kord: "Direct, with no dealer margin", online: "Direct", shop: "Includes the shop's margin" },
];
