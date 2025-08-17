import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@lib": `${process.cwd()}/src/lib`,
      "@domain": `${process.cwd()}/src/domain`,
      "@component": `${process.cwd()}/src/component`,
      "@pages": `${process.cwd()}/src/pages`,
      "@services": `${process.cwd()}/src/services`,
      "@providers": `${process.cwd()}/src/providers`,
      "@layouts": `${process.cwd()}/src/layouts`,
      "@components": `${process.cwd()}/src/components`,
      "@hooks": `${process.cwd()}/src/hooks`,
      "@utils": `${process.cwd()}/src/utils`,
      "@styles": `${process.cwd()}/src/styles`,
      "@assets": `${process.cwd()}/src/assets`,
      "@types": `${process.cwd()}/src/types`,
      "@validation": `${process.cwd()}/src/validation`,
    },
  },
  server: {
    proxy: {
      "/api": {
        target:
          process.env["services__proxy__http__0"] || "http://localhost:3000",
        changeOrigin: true,
      },
      "/auth": {
        target:
          process.env["services__proxy__http__0"] || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  esbuild: {
    target: "es2020",
    tsconfigRaw: {
      compilerOptions: {
        useDefineForClassFields: false,
      },
    },
  },
  plugins: [react()],
});
