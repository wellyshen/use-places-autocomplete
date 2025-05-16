import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}", "!src/index.ts"],
    },
  },
});
