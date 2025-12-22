/**
 * Task Master MCP wrapper that sets loadTUI polyfill before importing
 * This file is executed with the import map from deno.json
 */
globalThis.loadTUI = async () => null;
await import("task-master-ai/dist/mcp-server.js");
