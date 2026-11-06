import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Unit tests for the pure logic (dates, pricing, recommendations, stored-data
// checks, intake routing). `npm test` runs them in Los Angeles time, so the
// local-day helpers are checked away from UTC.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { include: ["tests/**/*.test.js"], environment: "node" },
});
