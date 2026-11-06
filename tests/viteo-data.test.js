import { describe, expect, it } from "vitest";
import { activeAnswers, getOwn, normalizeCart, normalizeOrder, normalizeStored, PARTNERS, priceFor, recommend } from "@/components/viteo/data";

describe("Viteo lookups", () => {
  it("only finds a partner's own keys", () => {
    for (const k of ["constructor", "__proto__", "toString", "hasOwnProperty"]) expect(getOwn(PARTNERS, k)).toBeNull();
    expect(getOwn(PARTNERS, "cyril-florita")).not.toBeNull();
    expect(getOwn(PARTNERS, undefined)).toBeNull();
  });
});

describe("recommend", () => {
  it("ignores a fish answer once the diet skips that question", () => {
    expect(activeAnswers({ diet: "vegan", fish: "rarely" })).toEqual({ diet: "vegan" });
    const omega = recommend({ diet: "vegan", fish: "rarely" }).find((p) => p.id === "omega");
    expect(omega.why).toBe("Fish isn't part of your diet.");
  });

  it("tops up to three picks unless asked not to", () => {
    expect(recommend({}).length).toBe(3);
    expect(recommend({}, { fill: false })).toEqual([]);
  });

  it("never returns duplicates or more than six", () => {
    const picks = recommend({ sun: "rarely", diet: "vegan", sleep: "restless", activity: "intense", goals: ["immune", "digestion", "hair", "focus", "energy", "sleep"] });
    expect(picks.length).toBeLessThanOrEqual(6);
    expect(new Set(picks.map((p) => p.id)).size).toBe(picks.length);
  });
});

describe("priceFor", () => {
  it("prices a plan in cents and ignores unknown items", () => {
    const one = priceFor([{ id: "d3" }], "monthly");
    const withJunk = priceFor([{ id: "d3" }, { id: "nope" }, null], "monthly");
    expect(withJunk.total).toBe(one.total);
    const two = priceFor([{ id: "d3" }, { id: "omega" }], "two");
    expect(two.total).toBe(Math.round((two.subtotal - two.savings) * 100) / 100);
    expect(priceFor(undefined, "three").total).toBe(0);
  });
});

describe("stored data", () => {
  it("drops a cart with no valid items", () => {
    expect(normalizeCart({ plan: "two" })).toBeNull();
    expect(normalizeCart({ items: [{ id: "nope" }] })).toBeNull();
    expect(normalizeStored("cart", { plan: "two" })).toBeNull();
  });

  it("keeps valid items, drops unknown and repeated ones, and fixes the plan", () => {
    const c = normalizeCart({ items: [{ id: "d3", why: "x" }, { id: "nope" }, { id: "d3" }], plan: "weekly", suggestedBy: "constructor" });
    expect(c.items.map((i) => i.id)).toEqual(["d3"]);
    expect(c.plan).toBe("two");
    expect(c).not.toHaveProperty("suggestedBy");
  });

  it("drops an order without a valid cart or next date", () => {
    expect(normalizeOrder({ cart: { items: ["nope"] }, next: new Date().toISOString() })).toBeNull();
    expect(normalizeOrder({ cart: { items: [{ id: "d3" }] }, next: "soon" })).toBeNull();
    const o = normalizeOrder({ cart: { items: [{ id: "d3" }] }, next: new Date().toISOString(), checkins: ["2026-11-05", 7, "bad"] });
    expect(o.checkins).toEqual(["2026-11-05"]);
  });
});
