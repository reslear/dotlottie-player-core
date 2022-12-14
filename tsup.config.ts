import { defineConfig } from "tsup"

export default defineConfig((options) => {
  return {
    format: ["cjs", "esm"],
    dts: true,
    minify: !options.watch,
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: true,
    clean: true,
  }
})
