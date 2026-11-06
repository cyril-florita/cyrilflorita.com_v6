import { describe, expect, it } from "vitest";
import { addDays, addMonths, dayKey, monthKey, monthStart } from "@/components/viteo/dates";

describe("Viteo dates (local time)", () => {
  it("keys a late-evening check-in to the same local day", () => {
    expect(dayKey(new Date(2026, 10, 5, 9))).toBe("2026-11-05");
    expect(dayKey(new Date(2026, 10, 5, 23, 30))).toBe("2026-11-05");
  });

  it("keys months locally, also early on the 1st", () => {
    expect(monthKey(new Date(2026, 10, 1, 0, 30))).toBe("2026-11");
  });

  it("steps back whole months without rolling over", () => {
    const from = new Date(2026, 2, 31, 7, 30); // Mar 31
    expect(monthKey(monthStart(from, -1))).toBe("2026-02");
    expect(monthKey(monthStart(from, -5))).toBe("2025-10");
  });

  it("clamps addMonths to the target month's last day", () => {
    expect(dayKey(addMonths(new Date(2026, 0, 29, 12).toISOString(), 1))).toBe("2026-02-28");
    expect(dayKey(addMonths(new Date(2024, 0, 31, 12).toISOString(), 1))).toBe("2024-02-29");
    expect(dayKey(addMonths(new Date(2026, 0, 15, 12).toISOString(), 2))).toBe("2026-03-15");
    expect(dayKey(addMonths(new Date(2026, 11, 31, 12).toISOString(), 2))).toBe("2027-02-28");
  });

  it("adds calendar days across the daylight-saving change", () => {
    expect(dayKey(addDays(new Date(2026, 10, 1, 0, 30), 1))).toBe("2026-11-02");
    expect(dayKey(addDays(new Date(2026, 2, 8, 0, 30), -1))).toBe("2026-03-07");
  });
});
