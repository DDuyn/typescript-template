import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      all: true,
      include: [
        "src/features/**/domain/**/*service.ts",
        "src/features/**/api/**/**/*.handler.ts",
      ],
      exclude: ["**/*.test.ts", "**/node_modules/**"],
    },
  },
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/core"),
      "@features": path.resolve(__dirname, "src/features"),
      "@infra": path.resolve(__dirname, "src/infra"),
    },
  },
});
