import { describe, it, expect } from "vitest";
import { normalizeBuild, priceBuild, weighBuild, buildQuery, BIKES } from "@/components/kord/data";

describe("Kord: the builder", () => {
  it("fills a build with Stealth and sensible defaults (no bike has its own paint)", () => {
    expect(normalizeBuild({ bike: "meridian" })).toEqual({ bike: "meridian", size: "54", paint: "stealth", group: "sport", wheels: "stock" });
    expect(normalizeBuild({ bike: "nope", size: "99", paint: "pink" }).bike).toBe("arc");
    expect(normalizeBuild({ bike: "constructor" }).bike).toBe("arc");
  });
  it("prices the base build at the bike's starting price", () => {
    for (const b of BIKES) expect(priceBuild(normalizeBuild({ bike: b.id, paint: "stealth" }))).toBe(b.from);
  });
  it("adds paint, groupset and wheels", () => {
    const b = normalizeBuild({ bike: "arc", paint: "glacier", group: "pro", wheels: "deep" });
    expect(priceBuild(b)).toBe(11900 + 350 + 3200 + 1600);
  });
  it("weighs a 56 base at the listed weight and lighter with lighter parts", () => {
    const base = normalizeBuild({ bike: "crest", size: "56" });
    expect(weighBuild(base)).toBe(6.8);
    expect(weighBuild({ ...base, group: "pro", wheels: "light" })).toBeLessThan(6.8);
  });
  it("round-trips through a query string", () => {
    const b = normalizeBuild({ bike: "atlas", size: "58", paint: "volt", group: "race", wheels: "light" });
    const p = Object.fromEntries(new URLSearchParams(buildQuery(b)));
    expect(normalizeBuild(p)).toEqual(b);
  });
});

import { compareOrder, DETAILS } from "@/components/kord/data";
describe("Kord: compare", () => {
  it("puts the asked-for pair first, once each, and keeps all four", () => {
    expect(compareOrder("meridian", "atlas").map((b) => b.id)).toEqual(["meridian", "atlas", "arc", "crest"]);
    expect(compareOrder("atlas", "atlas").map((b) => b.id)).toEqual(["atlas", "arc", "crest", "meridian"]);
    expect(compareOrder("x", "constructor").map((b) => b.id)).toEqual(["arc", "crest", "meridian", "atlas"]);
  });
  it("has details for every bike", () => { for (const b of compareOrder()) expect(DETAILS[b.id].geo.stack).toBeGreaterThan(500); });
});

import { fitFor, FIT_FIELDS } from "@/components/kord/data";
describe("Kord: virtual fit", () => {
  it("gives the sample rider a 54 with a classic saddle height", () => {
    const f = fitFor(Object.fromEntries(FIT_FIELDS.map((x) => [x.k, x.sample])));
    expect(f.size).toBe("54"); expect(f.saddle).toBe(742); expect(f.crank).toBe(172.5); expect(f.bar).toBe(42);
    expect(f.stem % 10).toBe(0);
  });
  it("clamps junk and extremes", () => {
    const f = fitFor({ height: "x", inseam: 999, torso: -5, arm: null, shoulders: 10 });
    expect(f.v.inseam).toBe(100); expect(f.v.torso).toBe(50); expect(f.bar).toBe(38);
    expect(f.stem).toBeGreaterThanOrEqual(80); expect(f.stem).toBeLessThanOrEqual(130);
  });
});
