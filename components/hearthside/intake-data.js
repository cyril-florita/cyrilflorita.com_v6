import { AREAS } from "./data";

// Hearthside's intake system: sample data and rules. Everything here is
// fictional (people, organizations, referrals) and shown stamped as sample
// content. Patients appear by first name and last initial only; no real
// health information is collected or stored anywhere.

// ---------- Pipeline ----------
export const STAGES = [
  { id: "new", name: "New", hint: "Just arrived" },
  { id: "assigned", name: "Assigned", hint: "Coordinator owns it" },
  { id: "contacted", name: "Contact attempted", hint: "Reaching the family" },
  { id: "screening", name: "Initial screening", hint: "Needs and eligibility" },
  { id: "review", name: "Docs & coverage", hint: "Orders, insurance" },
  { id: "accepted", name: "Accepted", hint: "Scheduling first visit" },
  { id: "soc", name: "Start of care", hint: "First visit done" },
  { id: "declined", name: "Not accepted", hint: "Reason recorded" },
];
export const OPEN_STAGES = ["new", "assigned", "contacted", "screening", "review", "accepted"];
export const stageName = (id) => STAGES.find((s) => s.id === id)?.name ?? id;

// How long a referral can sit in a stage before it's flagged (hours).
export const STAGE_LIMIT_H = { new: 1, assigned: 4, contacted: 24, screening: 48, review: 72, accepted: 72 };

// ---------- People and regions ----------
export const COORDINATORS = [
  { id: "dana", name: "Dana Kim", role: "Intake coordinator", region: "west" },
  { id: "luis", name: "Luis Ortega", role: "Intake coordinator", region: "east" },
  { id: "priya", name: "Priya Shah", role: "Intake coordinator", region: "scv" },
];
export const LIAISONS = [
  { id: "marcus", name: "Marcus Bell", role: "Community liaison, San Fernando Valley" },
  { id: "renee", name: "Renée Park", role: "Community liaison, Santa Clarita Valley" },
];
export const REGIONS = {
  west: { name: "SFV West", towns: ["Canoga Park", "Chatsworth", "Encino", "Granada Hills", "Northridge", "Porter Ranch", "Reseda", "Tarzana", "West Hills", "Winnetka", "Woodland Hills"] },
  east: { name: "SFV East", towns: ["Burbank", "Mission Hills", "North Hills", "North Hollywood", "Pacoima", "Panorama City", "San Fernando", "Sherman Oaks", "Studio City", "Sun Valley", "Sunland-Tujunga", "Sylmar", "Valley Village", "Van Nuys"] },
  scv: { name: "Santa Clarita", towns: AREAS.find((a) => a.id === "scv").communities.map(([t]) => t) },
};
export const coordinator = (id) => COORDINATORS.find((c) => c.id === id);

// ZIP → { town, region } from the service-area list.
const ZIPS = new Map();
for (const a of AREAS) for (const [town, zips] of a.communities) for (const z of zips) ZIPS.set(z, town);
export const townFor = (zip) => ZIPS.get(zip) ?? null;
export const regionFor = (zip) => {
  const town = townFor(zip);
  return Object.entries(REGIONS).find(([, r]) => r.towns.includes(town))?.[0] ?? null;
};

// Routing: the rules shown on the Rules screen, applied to every new referral.
export const ROUTING_RULES = [
  { id: "region", when: "ZIP code is in SFV West", then: "Assign to Dana Kim" },
  { id: "region-e", when: "ZIP code is in SFV East", then: "Assign to Luis Ortega" },
  { id: "region-s", when: "ZIP code is in the Santa Clarita Valley", then: "Assign to Priya Shah" },
  { id: "speech", when: "Speech-language pathology is requested", then: "Also notify the therapy manager" },
  { id: "first-call", when: "A referral is assigned", then: "Create a first-call task due within 2 hours" },
  { id: "docs", when: "Required documents are missing", then: "Create a request task and flag the card" },
  { id: "stale", when: "No activity past the stage limit", then: "Flag as overdue and notify the coordinator" },
];
export const route = (zip) => {
  const region = regionFor(zip);
  const c = COORDINATORS.find((x) => x.region === region);
  return c ? { coordinator: c.id, region, rule: `ZIP ${zip} is in ${REGIONS[region].name}` } : null;
};

// ---------- Documents ----------
export const DOCS = [
  { id: "order", name: "Signed physician order", required: true },
  { id: "f2f", name: "Face-to-face encounter note", required: true },
  { id: "hp", name: "History and physical / discharge summary", required: true },
  { id: "meds", name: "Medication list", required: true },
  { id: "insurance", name: "Insurance card (front and back)", required: true },
  { id: "demo", name: "Patient demographics sheet", required: false },
];
export const missingDocs = (r) => DOCS.filter((d) => d.required && !r.docs.includes(d.id));

// ---------- Referral partners (fictional; the logos on the Home page) ----------
export const PARTNER_ORGS = [
  { id: "larkfield", name: "Larkfield Medical Center", type: "Hospital", town: "Northridge", liaison: "marcus", contact: "Elena Ruiz, discharge planner", lastContact: -6, nextFollowUp: 8 },
  { id: "calloway", name: "Calloway Family Practice", type: "Physician practice", town: "Van Nuys", liaison: "marcus", contact: "Dr. Sam Calloway", lastContact: -21, nextFollowUp: -2 },
  { id: "fernwood", name: "Fernwood Senior Living", type: "Senior community", town: "Valencia", liaison: "renee", contact: "Joan Matsuda, wellness director", lastContact: -3, nextFollowUp: 11 },
  { id: "westbrook", name: "Westbrook Rehabilitation", type: "Skilled nursing facility", town: "Woodland Hills", liaison: "marcus", contact: "Andre Lewis, case manager", lastContact: -12, nextFollowUp: 2 },
  { id: "brightwater", name: "Brightwater Orthopedics", type: "Specialist practice", town: "Burbank", liaison: "marcus", contact: "Kim Nguyen, practice manager", lastContact: -34, nextFollowUp: -5 },
  { id: "oakline", name: "Oakline Cardiology", type: "Specialist practice", town: "Newhall", liaison: "renee", contact: "Dr. Priya Raman", lastContact: -9, nextFollowUp: 5 },
];
export const partner = (id) => PARTNER_ORGS.find((p) => p.id === id);
export const SOURCES = [...PARTNER_ORGS.map((p) => ({ id: p.id, name: p.name })), { id: "family", name: "Family or self (phone)" }, { id: "web", name: "Website callback" }];
export const sourceName = (id) => SOURCES.find((s) => s.id === id)?.name ?? id;

export const SERVICE_OPTIONS = [
  { id: "nursing", name: "Skilled nursing" },
  { id: "pt", name: "Physical therapy" },
  { id: "ot", name: "Occupational therapy" },
  { id: "speech", name: "Speech-language pathology" },
  { id: "social", name: "Medical social work" },
  { id: "aide", name: "Home health aide" },
];
export const PAYERS = ["Medicare", "Medicare Advantage", "Commercial plan"];
export const DECLINE_REASONS = [
  "Outside service area",
  "Not homebound / not eligible",
  "Insurance not accepted",
  "Patient or family declined",
  "No capacity in time",
  "Went to another agency",
];

// ---------- Sample patients for the referral form ----------
// Fictional names and details only; the form can't take real ones.
const FIRST = ["Rosa", "Harold", "Mei", "Gloria", "Walter", "Anita", "George", "Lillian", "Raymond", "Teresa", "Frank", "June", "Arturo", "Helen", "Samuel", "Doris"];
const LAST = ["A.", "B.", "C.", "D.", "F.", "G.", "H.", "L.", "M.", "N.", "P.", "R.", "S.", "T.", "V.", "W."];
const REASONS = [
  ["After hip replacement surgery", ["pt", "nursing"]],
  ["After a hospital stay for heart failure", ["nursing", "pt"]],
  ["After a stroke", ["speech", "pt", "ot"]],
  ["Wound care after surgery", ["nursing"]],
  ["After a fall, weakness at home", ["pt", "ot"]],
  ["New diabetes medications to manage", ["nursing"]],
  ["After pneumonia, recovering strength", ["nursing", "pt"]],
];
const SAMPLE_ZIPS = ["91355", "91324", "91406", "91367", "91350", "91504", "91342", "91311", "91601", "91387", "91356", "91402"];
export function samplePatient(seed = Math.random()) {
  const r = (n, k = 1) => Math.floor(((seed * 9301 * k + 49297) % 233280) / 233280 * n);
  const [reason, services] = REASONS[r(REASONS.length, 3)];
  const zip = SAMPLE_ZIPS[r(SAMPLE_ZIPS.length, 7)];
  return {
    name: `${FIRST[r(FIRST.length, 1)]} ${LAST[r(LAST.length, 5)]}`,
    age: 68 + r(22, 11),
    zip,
    town: townFor(zip),
    reason,
    services,
    payer: PAYERS[r(3, 13)],
  };
}

// ---------- Seed referrals ----------
// Ages and dates are relative to now (hours ago), so the board always looks
// lived-in: some fresh, some aging, a couple overdue.
const H = 3600e3;
const seed = (id, o) => ({ id, ...o });
export function seedReferrals(now = Date.now()) {
  const at = (h) => now - h * H;
  const ev = (h, text, who = "System") => ({ at: at(h), text, who });
  return [
    seed("HS-24791", { patient: { name: "Gloria M.", age: 81, zip: "91324", town: "Northridge", reason: "After a hospital stay for heart failure" }, source: "larkfield", contact: "Elena Ruiz", services: ["nursing", "pt"], payer: "Medicare", docs: ["order", "hp", "meds", "insurance"], stage: "screening", coordinator: "dana", createdAt: at(30), stageAt: at(6), nextAction: "Confirm homebound status with Dr. Ito's office", due: at(-4), history: [ev(30, "Referral received from Larkfield Medical Center"), ev(30, "Assigned to Dana Kim (ZIP 91324 is in SFV West)"), ev(28, "Called daughter, scheduled screening", "Dana Kim"), ev(6, "Screening started", "Dana Kim")] }),
    seed("HS-24795", { patient: { name: "Walter S.", age: 77, zip: "91406", town: "Van Nuys", reason: "After hip replacement surgery" }, source: "calloway", contact: "Dr. Sam Calloway", services: ["pt", "nursing"], payer: "Medicare Advantage", docs: ["order", "f2f", "hp", "meds"], stage: "review", coordinator: "luis", createdAt: at(152), stageAt: at(80), nextAction: "Verify Medicare Advantage authorization", due: at(4), history: [ev(152, "Referral received from Calloway Family Practice"), ev(152, "Assigned to Luis Ortega (ZIP 91406 is in SFV East)"), ev(149, "Spoke with patient", "Luis Ortega"), ev(80, "Requested insurance card", "Luis Ortega")] }),
    seed("HS-24802", { patient: { name: "Mei C.", age: 84, zip: "91355", town: "Valencia", reason: "After a stroke" }, source: "fernwood", contact: "Joan Matsuda", services: ["speech", "pt", "ot"], payer: "Medicare", docs: ["order", "f2f", "hp", "meds", "insurance"], stage: "accepted", coordinator: "priya", createdAt: at(70), stageAt: at(20), nextAction: "First visit Thursday 10:00 am, Maria R., RN", due: at(-40), history: [ev(70, "Referral received from Fernwood Senior Living"), ev(70, "Assigned to Priya Shah (ZIP 91355 is in Santa Clarita)"), ev(69.4, "Called Joan Matsuda and the patient's son", "Priya Shah"), ev(20, "Accepted, start of care scheduled", "Priya Shah")] }),
    seed("HS-24806", { patient: { name: "Raymond T.", age: 72, zip: "91367", town: "Woodland Hills", reason: "Wound care after surgery" }, source: "westbrook", contact: "Andre Lewis", services: ["nursing"], payer: "Commercial plan", docs: ["order", "hp"], stage: "contacted", coordinator: "dana", createdAt: at(26), stageAt: at(25), nextAction: "Second call attempt to patient", due: at(1), history: [ev(26, "Referral received from Westbrook Rehabilitation"), ev(26, "Assigned to Dana Kim (ZIP 91367 is in SFV West)"), ev(25, "Call attempt 1: voicemail", "Dana Kim")] }),
    seed("HS-24809", { patient: { name: "Anita P.", age: 79, zip: "91504", town: "Burbank", reason: "After a fall, weakness at home" }, source: "brightwater", contact: "Kim Nguyen", services: ["pt", "ot"], payer: "Medicare", docs: ["order", "f2f", "meds", "insurance"], stage: "assigned", coordinator: "luis", createdAt: at(3), stageAt: at(3), nextAction: "First call to patient", due: at(1), history: [ev(3, "Referral received from Brightwater Orthopedics"), ev(3, "Assigned to Luis Ortega (ZIP 91504 is in SFV East)")] }),
    seed("HS-24811", { patient: { name: "George H.", age: 88, zip: "91387", town: "Canyon Country", reason: "After pneumonia, recovering strength" }, source: "oakline", contact: "Dr. Priya Raman", services: ["nursing", "pt"], payer: "Medicare", docs: ["order", "f2f", "hp", "meds", "insurance"], stage: "soc", coordinator: "priya", createdAt: at(140), stageAt: at(30), nextAction: "Recertification due in 58 days", due: at(-1390), socAt: at(30), history: [ev(140, "Referral received from Oakline Cardiology"), ev(139.2, "Spoke with patient and daughter", "Priya Shah"), ev(96, "Accepted", "Priya Shah"), ev(30, "Start of care completed: Maria R., RN", "Priya Shah")] }),
    seed("HS-24813", { patient: { name: "Lillian W.", age: 90, zip: "91342", town: "Sylmar", reason: "After a hospital stay for heart failure" }, source: "family", contact: "Son, by phone", services: ["nursing"], payer: "Medicare", docs: ["insurance"], stage: "screening", coordinator: "luis", createdAt: at(60), stageAt: at(58), nextAction: "Request order from Dr. Alvarez's office", due: at(10), history: [ev(60, "Call from family logged"), ev(60, "Assigned to Luis Ortega (ZIP 91342 is in SFV East)"), ev(58, "Screening started", "Luis Ortega")] }),
    seed("HS-24814", { patient: { name: "Frank V.", age: 74, zip: "91311", town: "Chatsworth", reason: "New diabetes medications to manage" }, source: "larkfield", contact: "Elena Ruiz", services: ["nursing"], payer: "Commercial plan", docs: ["order", "f2f", "hp", "meds", "insurance"], stage: "declined", declineReason: "Insurance not accepted", coordinator: "dana", createdAt: at(120), stageAt: at(100), nextAction: "Referred back with two in-network agencies", due: null, history: [ev(120, "Referral received from Larkfield Medical Center"), ev(119, "Called patient, reviewed insurance", "Dana Kim"), ev(100, "Not accepted: insurance not accepted. Referrer notified with in-network options.", "Dana Kim")] }),
    seed("HS-24816", { patient: { name: "June A.", age: 83, zip: "91350", town: "Saugus", reason: "After hip replacement surgery" }, source: "web", contact: "Website callback", services: ["pt"], payer: "Medicare", docs: [], stage: "new", coordinator: null, createdAt: at(0.4), stageAt: at(0.4), nextAction: "Assign and make first call", due: at(-0.6), history: [ev(0.4, "Callback request from the website")] }),
    seed("HS-24788", { patient: { name: "Samuel R.", age: 69, zip: "91601", town: "North Hollywood", reason: "After a stroke" }, source: "calloway", contact: "Dr. Sam Calloway", services: ["speech", "ot"], payer: "Medicare", docs: ["order", "f2f", "hp", "meds", "insurance"], stage: "soc", coordinator: "luis", createdAt: at(200), stageAt: at(150), nextAction: "Weekly therapy visits", due: null, socAt: at(150), history: [ev(200, "Referral received from Calloway Family Practice"), ev(198.5, "Spoke with patient's wife", "Luis Ortega"), ev(150, "Start of care completed", "Luis Ortega")] }),
    seed("HS-24785", { patient: { name: "Doris L.", age: 86, zip: "91356", town: "Tarzana", reason: "After a fall, weakness at home" }, source: "westbrook", contact: "Andre Lewis", services: ["pt", "ot"], payer: "Medicare", docs: ["order", "f2f", "hp", "meds", "insurance"], stage: "declined", declineReason: "Patient or family declined", coordinator: "dana", createdAt: at(230), stageAt: at(210), nextAction: "Closed", due: null, history: [ev(230, "Referral received from Westbrook Rehabilitation"), ev(229.7, "Called family", "Dana Kim"), ev(210, "Not accepted: family chose outpatient therapy", "Dana Kim")] }),
    seed("HS-24779", { patient: { name: "Helen G.", age: 78, zip: "91324", town: "Northridge", reason: "Wound care after surgery" }, source: "larkfield", contact: "Elena Ruiz", services: ["nursing"], payer: "Medicare", docs: ["order", "f2f", "hp", "meds", "insurance"], stage: "soc", coordinator: "dana", createdAt: at(300), stageAt: at(260), nextAction: "Wound care visits 3× a week", due: null, socAt: at(260), history: [ev(300, "Referral received from Larkfield Medical Center"), ev(299.2, "Spoke with patient", "Dana Kim"), ev(260, "Start of care completed", "Dana Kim")] }),
  ];
}

// First response = first logged human activity after the referral arrived.
export const firstResponseH = (r) => {
  const human = r.history.find((h) => h.who !== "System");
  return human ? (human.at - r.createdAt) / H : null;
};
export const hoursInStage = (r, now = Date.now()) => (now - r.stageAt) / H;
export const isOverdue = (r, now = Date.now()) => OPEN_STAGES.includes(r.stage) && ((r.due && r.due < now) || hoursInStage(r, now) > (STAGE_LIMIT_H[r.stage] ?? Infinity));

export const fmtAgo = (t, now = Date.now()) => {
  const m = Math.round((now - t) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
};
export const fmtDue = (t, now = Date.now()) => {
  if (!t) return null;
  const m = Math.round((t - now) / 60000);
  if (m < 0) return `${fmtAgo(t, now).replace(" ago", "")} overdue`;
  if (m < 60) return `due in ${m} min`;
  const h = Math.round(m / 60);
  return h < 48 ? `due in ${h} h` : `due in ${Math.round(h / 24)} days`;
};
export const fmtTime = (t) => new Date(t).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" });
