#!/usr/bin/env -S deno run --allow-all
/**
 * PostCSS CLI runner for Deno
 * This script imports and executes the postcss-cli npm package
 */

// Read version from deno.json import map to maintain single source of truth
const denoJson = JSON.parse(
  await Deno.readTextFile(new URL("./deno.json", import.meta.url))
);
const npmSpecifier = denoJson.imports["postcss-cli"];

const command = new Deno.Command("deno", {
  args: ["run", "--allow-all", "--quiet", npmSpecifier, ...Deno.args],
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

const { code } = await command.output();
Deno.exit(code);
