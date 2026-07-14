const { readFile } = require("node:fs/promises");
const path = require("node:path");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

// Handle ESM interop: require() may return { default: fn } instead of fn
const tw = tailwindcss.default || tailwindcss;
const ap = autoprefixer.default || autoprefixer;

// Mirrors the `strip-bodyless-layers` plugin in postcss.config.js: esbuild's CSS
// parser chokes on bodyless `@layer a, b;` statements, so remove them.
const stripBodylessLayers = {
  postcssPlugin: "strip-bodyless-layers",
  Once(root) {
    root.walkAtRules("layer", (rule) => {
      if (!rule.nodes) {
        rule.remove();
      }
    });
  },
};

// esbuild has no knowledge of PostCSS/Tailwind, so `@tailwind` directives are left
// unexpanded and no utility classes are emitted. This plugin runs the same PostCSS
// pipeline as postcss.config.js (used by the Vite path) on stylesheets that use the
// directives, so `yarn start` (esbuild dev) and `yarn build` (esbuild prod) produce
// the same CSS as `yarn dev` (Vite).
const PostcssPlugin = {
  name: "postcss-tailwind",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await readFile(args.path, "utf8");
      // Only the entry stylesheet uses @tailwind. Defer library CSS (return
      // undefined) to esbuild's native CSS loader, which also resolves @import.
      if (!css.includes("@tailwind")) {
        console.log(`[postcss-tailwind] Skipping (no @tailwind): ${args.path}`);
        return undefined;
      }
      console.log(`[postcss-tailwind] Processing: ${args.path}`);
      const result = await postcss([
        stripBodylessLayers,
        tw,
        ap,
      ]).process(css, { from: args.path });
      console.log(`[postcss-tailwind] Output length: ${result.css.length}, has grid-cols-2: ${result.css.includes('grid-cols-2')}, has bg-canvas: ${result.css.includes('bg-canvas')}`);
      return {
        contents: result.css,
        loader: "css",
        resolveDir: path.dirname(args.path),
      };
    });
  },
};

module.exports.PostcssPlugin = PostcssPlugin;
