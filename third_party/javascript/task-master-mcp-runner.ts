#!/usr/bin/env -S deno run --allow-all
/**
 * Task Master MCP Server runner for Deno
 * This script imports and executes the task-master-ai MCP server
 */

const wrapperPath = new URL("./task-master-mcp-wrapper.ts", import.meta.url)
  .pathname;
const configPath = new URL("./deno.json", import.meta.url).pathname;
const lockPath = new URL("./deno.lock", import.meta.url).pathname;

// Run wrapper with import map so react and other dependencies resolve correctly
const command = new Deno.Command("deno", {
  args: [
    "run",
    "--allow-all",
    "--quiet",
    `--config=${configPath}`,
    `--lock=${lockPath}`,
    wrapperPath,
    ...Deno.args,
  ],
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

const { code } = await command.output();
Deno.exit(code);
