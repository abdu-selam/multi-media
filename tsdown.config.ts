import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.js", "./src/**/*ts"],
  dts: true,
  format: {
    esm: {
      target: ["es2015"],
    },
    cjs: {
      target: ["node20"],
    },
  },
});
