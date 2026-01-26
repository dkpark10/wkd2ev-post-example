import { defineConfig } from "vite";
import pkg from "./package.json";

export default defineConfig({
  base: `/reona-track/${pkg.name}/`,
  build: {
    outDir: `../../dist/${pkg.name}`,
    emptyOutDir: true,
    minify: false,
  },
  test: {
    globals: true,
    dir: "./src/tests",
    environment: "jsdom",
    setupFiles: './setupTest.js',
  },
});
