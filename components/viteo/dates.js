// Calendar helpers for the account (and anything else that keys by day or
// month). All in the visitor's local time: a check-in at 9 PM in California
// belongs to that day, not to the next UTC one. Pure functions.

const pad = (n) => String(n).padStart(2, "0");

// "2026-11-05" for the local day of a Date, timestamp or ISO string.
export const dayKey = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};

// "2026-11" for the local month of a Date, timestamp or ISO string.
export const monthKey = (d) => dayKey(d).slice(0, 7);

// The local month `n` months from `d` (negative goes back), as a Date on its
// 1st at noon, so it never rolls over into the next month.
export const monthStart = (d, n = 0) => {
  const x = new Date(d);
  return new Date(x.getFullYear(), x.getMonth() + n, 1, 12);
};

// An ISO date `n` months later, keeping the time of day. The day is clamped
// to the target month's last day, so Jan 31 + 1 month is Feb 28 (or 29), not
// Mar 3. Takes and returns ISO strings (a Date or timestamp works too).
export const addMonths = (iso, n) => {
  const d = new Date(iso);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return d.toISOString();
};

// The Date `n` local days from `d` (negative goes back). Calendar days, not
// 24-hour steps, so a daylight-saving change can't skip or repeat a day.
export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
