import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  minify: false,
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
})
