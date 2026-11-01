// Hearthside Home Health: a fictional skilled home health agency, built as a
// design and dev pitch. Everything here is sample content. Coverage copy is
// general guidance that points to medicare.gov; nothing on the site makes an
// eligibility or coverage decision.

export const BASE = "/pitch/hearthside";

// PHONE is Cyril Florita's real number, so calls from the pitch reach him;
// the referral fax stays a fictional 555-01xx number (reserved for fiction).
export const PHONE = { display: "(818) 675-0181", href: "tel:+18186750181" };
export const REFERRAL_FAX = "(818) 555-0187";
// When a person answers the intake line (the credentials row, the callback
// modal and the referrals page all read it, so they never disagree).
export const HOURS = "7 days a week, 8 am to 6 pm";

// The footer's pitch to agency owners: Cyril's email (same as the portfolio's
// ContactBand), with a prefilled subject.
export const PITCH_EMAIL = "cyril.florita@pm.me";
export const PITCH_MAILTO = `mailto:${PITCH_EMAIL}?subject=${encodeURIComponent("Hearthside: a website and intake system for our agency")}`;

// Credentials as editorial figures: a large lead, then the rest of the
// sentence (each reads as one line to a screen reader).
export const CREDENTIALS = [
  { value: "Since 2009", text: "serving the San Fernando and Santa Clarita Valleys" },
  { value: "7 days", text: "a week, a person answers our intake line" },
  { value: "Medicare", text: "certified and state-licensed home health agency" },
  { value: "Bonded", text: "and insured, every clinician who visits" },
];

export const NAV = [
  { href: `${BASE}/services/`, label: "Services" },
  { href: `${BASE}/getting-started/`, label: "Getting started" },
  { href: `${BASE}/service-area/`, label: "Service area" },
  { href: `${BASE}/referrals/`, label: "For referral partners", short: "Referrals" }, // short: the phone nav strip
  { href: `${BASE}/careers/`, label: "Careers" },
];

// Each service: its photo (user-supplied, AI-generated with Perplexity; Home
// and Services cards), a short line for Home, then what it covers and who it's
// often for (Services). General descriptions, no outcome claims.
export const SERVICES = [
  {
    id: "nursing",
    photo: { shot: "A nurse dresses a wound on a patient's arm in his living room", alt: "A nurse in blue scrubs and gloves dresses a wound on an older man's forearm in his living room", src: "/img/hearthside/photos/svc-nursing", position: "82% 30%" },
    name: "Skilled nursing",
    short: "Wound care, medication management, injections, and monitoring after a hospital stay.",
    icon: "nurse",
    lead: "Registered and licensed vocational nurses who visit on a schedule your doctor sets.",
    covers: ["Wound and incision care", "Medication review and teaching", "Injections and IV therapy", "Monitoring heart failure, COPD, or diabetes", "Teaching family members what to watch for"],
  },
  {
    id: "pt",
    photo: { shot: "A physical therapist coaches a patient through arm exercises at home", alt: "A therapist kneels beside a smiling older woman lifting small hand weights in a chair in her living room", src: "/img/hearthside/photos/svc-pt", position: "50% 30%" },
    name: "Physical therapy",
    short: "Rebuilding strength, balance, and safe movement around your own home.",
    icon: "pt",
    lead: "Licensed physical therapists who work with you on the stairs, hallways, and chairs you actually use.",
    covers: ["Strength and balance after surgery or a fall", "Walking with a cane or walker", "Getting in and out of bed, chairs, and the car", "A home exercise plan you can keep up"],
  },
  {
    id: "ot",
    photo: { shot: "An occupational therapist helps a patient cook in her own kitchen", alt: "A therapist in blue scrubs points into a mixing bowl as an older woman stirs it at her kitchen counter", src: "/img/hearthside/photos/svc-ot", position: "70% 30%" },
    name: "Occupational therapy",
    short: "Making everyday tasks like dressing, bathing, and cooking safer and easier.",
    icon: "ot",
    lead: "Occupational therapists who help you do everyday things safely, your way.",
    covers: ["Bathing, dressing, and grooming", "Kitchen and household tasks", "Energy-saving techniques", "Advice on grab bars and other equipment"],
  },
  {
    id: "speech",
    photo: { shot: "A speech therapist works through picture cards with a patient", alt: "A therapist holds up a picture card of a mug as an older man names it at the dining table", src: "/img/hearthside/photos/svc-speech", position: "85% 30%" },
    name: "Speech-language pathology",
    short: "Help with speech, swallowing, and memory after a stroke or illness.",
    icon: "speech",
    lead: "Speech-language pathologists for speech, swallowing, and thinking skills.",
    covers: ["Speech and word-finding after a stroke", "Safer swallowing", "Memory and attention strategies", "Ways for family to communicate more easily"],
  },
  {
    id: "social",
    photo: { shot: "A medical social worker goes through resources with a patient at home", alt: "A social worker in a blue shirt goes through a folder of resources with an older man in his living room", src: "/img/hearthside/photos/svc-social", position: "65% 30%" },
    name: "Medical social work",
    short: "Connecting you with community resources, planning, and emotional support.",
    icon: "social",
    lead: "Medical social workers who help with benefits, planning, and support for caregivers.",
    covers: ["Community resources and benefits", "Planning for care at home", "Advance-care planning conversations", "Support for caregivers"],
  },
  {
    id: "aide",
    photo: { shot: "A home health aide helps a patient after her shower", alt: "An aide in blue scrubs offers a rolled towel to a smiling older woman in a robe on a shower chair", src: "/img/hearthside/photos/svc-aide", position: "55% 30%" },
    name: "Home health aide",
    short: "Personal care such as bathing, as part of a skilled plan of care.",
    icon: "aide",
    lead: "Home health aides who help with personal care while you receive skilled care.",
    covers: ["Bathing and personal care", "Help with mobility at home", "Part of your skilled plan of care, not a standalone service"],
  },
];

// How care begins: each step's photo (user-supplied, AI-generated with
// Perplexity; named after the step) replaced the Open Peeps illustrations.
export const STEPS = [
  {
    title: "You call us, or your doctor refers you",
    photo: { src: "/img/hearthside/photos/step-1", alt: "An older woman smiles as she talks on the phone on her sofa", position: "50% 30%" },
    text: "Call our intake team or ask your doctor, hospital, or discharge planner to send a referral. Either way, we take it from there.",
  },
  {
    title: "We check the details with you",
    photo: { src: "/img/hearthside/photos/step-2", alt: "An intake coordinator in a headset smiles at her computer screen", position: "50% 22%" },
    text: "We confirm your address is in our service area, talk with your doctor's office, and review your insurance before anything is scheduled.",
  },
  {
    title: "A clinician visits your home",
    photo: { src: "/img/hearthside/photos/step-3", alt: "A nurse with a clipboard talks with an older woman on her sofa", position: "50% 25%" },
    text: "A nurse or therapist meets you at home, gets to know your needs, and works with your doctor on a plan of care.",
  },
  {
    title: "Care continues, and you stay informed",
    photo: { src: "/img/hearthside/photos/step-4", alt: "A nurse talks a care plan through with an older woman and her daughter at home", position: "50% 30%" },
    text: "Visits follow your plan. You and your family always know who is coming, when, and who to call with questions.",
  },
];

// General guidance from medicare.gov's home health page. Shown as guidance,
// never as a decision.
export const MEDICARE_CONDITIONS = [
  "You're under the care of a doctor, and getting services under a plan of care your doctor reviews regularly.",
  "A doctor certifies that you need skilled care, such as intermittent nursing or physical, speech, or occupational therapy.",
  "A doctor certifies that you're homebound: leaving home takes considerable effort.",
];
export const MEDICARE_URL = "https://www.medicare.gov/coverage/home-health-services";

export const FAQS = [
  {
    q: "What's the difference between home health and home care?",
    a: "Home health is skilled, medical care ordered by a doctor, such as nursing or therapy. Home care is non-medical help like companionship, meals, or housekeeping. Hearthside provides home health. If you're looking for non-medical help, our intake team can point you to local options.",
  },
  {
    q: "Do I need a referral from my doctor?",
    a: "Home health care needs a doctor's order. You're welcome to call us first, though. We'll work with your doctor's office to get what's needed.",
  },
  {
    q: "Will Medicare cover my care?",
    a: "Medicare covers home health when certain conditions are met. We'll review your coverage with you before care begins. Medicare.gov explains the conditions in detail.",
  },
  {
    q: "What happens at the first visit?",
    a: "A nurse or therapist comes to your home, reviews your health and medications, checks your home for safety, and talks about your goals. The visit usually takes one to two hours. A family member is welcome to join.",
  },
  {
    q: "How quickly can care start?",
    a: "Once we have your doctor's order and the information we need, we schedule your first visit as soon as we can, and we'll tell you the date when we call.",
  },
  {
    q: "Can my family stay updated?",
    a: "Yes. With your permission, we keep a family member informed about visit times and who to contact. We never share health details without your consent.",
  },
];

// The sample service area: the San Fernando and Santa Clarita Valleys. Real
// ZIP codes and community names; the agency serving them is fictional.
export const AREAS = [
  {
    id: "sfv",
    name: "San Fernando Valley",
    communities: [
      ["Burbank", ["91501", "91502", "91504", "91505", "91506"]],
      ["Canoga Park", ["91303", "91304"]],
      ["Chatsworth", ["91311"]],
      ["Encino", ["91316", "91436"]],
      ["Granada Hills", ["91344"]],
      ["Mission Hills", ["91345"]],
      ["North Hills", ["91343"]],
      ["North Hollywood", ["91601", "91602", "91605", "91606"]],
      ["Northridge", ["91324", "91325", "91330"]],
      ["Pacoima", ["91331"]],
      ["Panorama City", ["91402"]],
      ["Porter Ranch", ["91326"]],
      ["Reseda", ["91335"]],
      ["San Fernando", ["91340"]],
      ["Sherman Oaks", ["91403", "91423"]],
      ["Studio City", ["91604"]],
      ["Sun Valley", ["91352"]],
      ["Sunland-Tujunga", ["91040", "91042"]],
      ["Sylmar", ["91342"]],
      ["Tarzana", ["91356"]],
      ["Valley Village", ["91607"]],
      ["Van Nuys", ["91401", "91405", "91406", "91411"]],
      ["West Hills", ["91307"]],
      ["Winnetka", ["91306"]],
      ["Woodland Hills", ["91364", "91367"]],
    ],
  },
  {
    id: "scv",
    name: "Santa Clarita Valley",
    communities: [
      ["Canyon Country", ["91351", "91387"]],
      ["Castaic", ["91384"]],
      ["Newhall", ["91321"]],
      ["Saugus", ["91350"]],
      ["Stevenson Ranch", ["91381"]],
      ["Valencia", ["91354", "91355"]],
    ],
  },
];

// Careers (sample roles). Applications go to a separate hiring workflow,
// never into patient intake.
export const ROLES = [
  { id: "rn", title: "Registered Nurse, Case Manager", area: "San Fernando Valley", type: "Full time", text: "Lead a caseload of patients at home: assessments, plans of care, and coordination with physicians." },
  { id: "pt", title: "Physical Therapist", area: "Santa Clarita Valley", type: "Full time or per visit", text: "Strength, balance, and mobility therapy in patients' homes." },
  { id: "ot", title: "Occupational Therapist", area: "San Fernando Valley", type: "Per visit", text: "Make daily life safer and easier for patients recovering at home." },
  { id: "slp", title: "Speech-Language Pathologist", area: "Both valleys", type: "Per visit", text: "Speech, swallowing, and cognition therapy for patients after stroke and illness." },
  { id: "hha", title: "Home Health Aide", area: "San Fernando Valley", type: "Part time", text: "Personal care visits as part of a patient's skilled plan of care." },
  { id: "intake", title: "Intake Coordinator", area: "Van Nuys office", type: "Full time", text: "Answer calls from families and referral partners, and route, screen, and schedule new patients." },
];
