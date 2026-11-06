import { describe, expect, it } from "vitest";
import { isOverdue, route, seedReferrals } from "@/components/hearthside/intake-data";
import { nextId, parseSaved, pendingRoutes, SEED_BASE } from "@/components/hearthside/store";

describe("Hearthside saved state", () => {
  it("rejects anything not shaped like version 1", () => {
    expect(parseSaved({ v: 1 })).toBeNull();
    expect(parseSaved({ v: 2, referrals: [], done: [] })).toBeNull();
    expect(parseSaved(null)).toBeNull();
  });

  it("drops malformed referrals and done keys", () => {
    const seeds = seedReferrals(Date.now());
    const s = parseSaved({ v: 1, referrals: [...seeds, { id: 5 }, null], done: ["a", 3] });
    expect(s.referrals.length).toBe(seeds.length);
    expect(s.done).toEqual(["a"]);
  });
});

describe("reference numbers", () => {
  it("starts past the seed range when there are none", () => {
    expect(nextId([])).toBe(`HS-${SEED_BASE + 1}`);
  });
  it("goes one past the highest", () => {
    expect(nextId([{ id: "HS-24816" }, { id: "HS-24900" }, { id: "junk" }])).toBe("HS-24901");
  });
});

describe("routing", () => {
  it("routes a service-area ZIP to a coordinator and nothing else", () => {
    const seeds = seedReferrals(Date.now());
    const zip = seeds[0].patient.zip;
    expect(route(zip)?.coordinator).toBeTruthy();
    expect(route("00000")).toBeNull();
  });

  it("lists only form referrals still in New, except the one the board will play", () => {
    const rs = [
      { id: "A", stage: "new", arriving: true },
      { id: "B", stage: "new" },
      { id: "C", stage: "assigned", arriving: true },
      { id: "D", stage: "new", arriving: true },
    ];
    expect(pendingRoutes(rs)).toEqual(["A", "D"]);
    expect(pendingRoutes(rs, "D")).toEqual(["A"]);
  });

  it("flags a referral past its stage limit as overdue", () => {
    const now = Date.now();
    const r = { stage: "new", stageAt: now - 2 * 3600e3, history: [] };
    expect(isOverdue(r, now)).toBe(true);
    expect(isOverdue({ ...r, stageAt: now }, now)).toBe(false);
    expect(isOverdue({ ...r, stage: "soc" }, now)).toBe(false);
  });
});
