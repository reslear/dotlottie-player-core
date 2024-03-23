import { defineConfig } from 'tsup'
import { copyFileSync } from 'fs'

export default defineConfig({
  format: ['cjs', 'esm'],
  dts: true,
  minify: false,
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
