import { build, context } from "esbuild";

const watch = process.argv.includes("--watch");

const options = {
  entryPoints: ["src/elgin-thermostat-card.ts"],
  bundle: true,
  format: "esm",
  target: ["es2020"],
  outfile: "../custom_components/elg_air_hjfc/www/elgin-thermostat-card.js",
  minify: true,
  sourcemap: false,
  banner: {
    js: "// Elgin Thermostat Card — built artifact. Source: frontend/src/elgin-thermostat-card.ts",
  },
};

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await build(options);
  console.log("Built custom_components/elg_air_hjfc/www/elgin-thermostat-card.js");
}
