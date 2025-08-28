import { rmSync } from "node:fs";
import { execSync } from "node:child_process";
import * as esbuild from "esbuild";

const buildDir = "dist";

rmSync(buildDir, { force: true, recursive: true });

const sharedOpts = {
  sourcemap: false,
  bundle: true,
  allowOverwrite: true,
  external: ["jsdom"],
};

// For using in the browser
const esmOpts = {
  ...sharedOpts,
  entryPoints: ["lib/index-browser.ts"],
  outfile: `${buildDir}/app.esm.js`,
  platform: "browser",
  format: "esm",
};

// For using in nodejs
const cjsOpts = {
  ...sharedOpts,
  entryPoints: ["lib/index-nodejs.ts"],
  outfile: `${buildDir}/app.cjs.js`,
  platform: "node",
};

async function main() {
  await esbuild.build(esmOpts);
  await esbuild.build(cjsOpts);

  try {
    // Build types
    execSync("npx tsc --project tsconfig.build.json", { stdio: "inherit" });
  } catch (err) {
    console.log("build.mjs-npx-tsc-ERROR", err);
  }
}

main();
