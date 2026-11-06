import { describe, expect, it } from "vitest";
import { local, safeDecode } from "@/components/safeStorage";

describe("safeDecode", () => {
  it("decodes valid input and returns malformed input as is", () => {
    expect(safeDecode("gty%20v9")).toBe("gty v9");
    expect(safeDecode("%")).toBe("%");
    expect(safeDecode("gty%2")).toBe("gty%2");
  });
});

describe("safe storage", () => {
  it("returns null instead of throwing when storage is unavailable", () => {
    expect(local.get("theme")).toBeNull();
    expect(() => local.set("theme", "dark")).not.toThrow();
    expect(() => local.remove("theme")).not.toThrow();
  });
});
