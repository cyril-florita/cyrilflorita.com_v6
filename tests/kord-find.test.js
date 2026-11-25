import { describe, it, expect } from "vitest";
import { FIND, findBike, encodeFind, decodeFind, BIKES } from "@/components/kord/data";

const all = (t, l, p, h = "h3") => ({ terrain: t, length: l, priority: p, height: h });

describe("Kord: Find your bike", () => {
  it("needs all four answers", () => {
    expect(findBike({ terrain: "flat", length: "short", priority: "speed" })).toBeNull();
    expect(findBike(null)).toBeNull();
    expect(findBike(all("flat", "short", "nope"))).toBeNull();
  });
  it("matches each bike's obvious rider", () => {
    expect(findBike(all("flat", "short", "speed")).bike.id).toBe("arc");
    expect(findBike(all("hills", "mid", "climbing")).bike.id).toBe("crest");
    expect(findBike(all("flat", "long", "comfort")).bike.id).toBe("meridian");
    expect(findBike(all("gravel", "multi", "anywhere")).bike.id).toBe("atlas");
  });
  it("gives a runner-up that isn't the winner, reasons and a size", () => {
    const r = findBike(all("mixed", "long", "comfort", "h4"));
    expect(r.runner.id).not.toBe(r.bike.id);
    expect(r.reasons.length).toBeGreaterThan(0);
    expect(r.size).toBe("56");
    expect(r.paint).toBeTruthy();
  });
  it("every combination finds a bike with at least one reason", () => {
    for (const t of FIND[0].a) for (const l of FIND[1].a) for (const p of FIND[2].a) {
      const r = findBike(all(t.id, l.id, p.id));
      expect(BIKES.map((b) => b.id)).toContain(r.bike.id);
      expect(r.reasons.length).toBeGreaterThan(0);
    }
  });
  it("round-trips a shared link and rejects junk", () => {
    const a = all("hills", "long", "comfort", "h2");
    expect(decodeFind(encodeFind(a))).toEqual(a);
    expect(decodeFind("constructor.x.y.z")).toBeNull();
    expect(decodeFind("")).toBeNull();
  });
});
