<objective>
Implement a `workspace_test` moon task for the coder-devcontainer-kubernetes library that performs end-to-end testing of the Coder workspace template by creating a real workspace, validating its health using goss, and cleaning up afterward.

This task enables automated validation that the workspace template deploys correctly and that all MCP apps (fleet-mcp, claude-code) are healthy before merging changes.
</objective>

<context>
Project: libs/coder-devcontainer-kubernetes
Template: Terraform-based Coder workspace template with devcontainer support

Key apps with healthchecks defined in main.tf:
- `fleet-mcp`: HTTP server at http://127.0.0.1:8000 with healthcheck at /health
- `claude-code`: MCP integration module from registry.coder.com/coder/claude-code/coder

The template uses presets ("Coder", "Operator", "Researcher") and supports parameters like cpu, memory, git_branch.

Relevant files:
@libs/coder-devcontainer-kubernetes/main.tf - Template definition with healthchecks
@libs/coder-devcontainer-kubernetes/moon.yml - Existing tasks (init, test)
@libs/devenv/goss.yaml - Example goss patterns used in this repo
</context>

<requirements>
1. Add a `workspace_test` task to moon.yml that:
   - Creates a test workspace using `coder create` with the coder-devcontainer-kubernetes template
   - Uses the `--yes` flag to bypass prompts
   - Uses a unique workspace name (e.g., `test-<timestamp>` or `test-<random>`)
   - Sets minimal resource parameters (cpu=2, memory=4) to speed up testing

2. Create a goss test file `goss-workspace.yaml` that validates:
   - Fleet MCP app health (check via coder show or API)
   - Claude Code MCP app health
   - Overall workspace health status (using `coder list -o json` filtered for the test workspace)

3. Use goss built-in retry logic:
   - Use `goss validate --retry-timeout 10m --sleep 15s` for automatic retries
   - No custom retry logic needed - goss handles this natively

4. Ensure cleanup happens regardless of success/failure:
   - Delete the test workspace with `coder delete --yes <workspace-name>`
   - Use trap or similar mechanism to ensure cleanup on script exit/error

5. Return proper exit codes:
   - Exit 0 if all goss tests pass
   - Exit 1 if any test fails or timeout occurs
</requirements>

<implementation>
Create the following files:

1. `libs/coder-devcontainer-kubernetes/goss-workspace.yaml`:
   - Use command tests to check workspace and app health via coder CLI
   - Check `coder show <workspace>` output for agent status
   - Use `coder list -o json --search "name:<workspace>"` to get health status
   - The goss file will receive the workspace name via environment variable (e.g., WORKSPACE_NAME)

2. `libs/coder-devcontainer-kubernetes/scripts/workspace-test.sh`:
   - Generate unique workspace name
   - Create workspace with appropriate parameters
   - Export WORKSPACE_NAME for goss to use
   - Run `goss -g goss-workspace.yaml validate --retry-timeout 10m --sleep 15s`
   - Clean up workspace on exit using trap
   - Return goss exit code

3. Update `libs/coder-devcontainer-kubernetes/moon.yml`:
   - Add `workspace_test` task that invokes the test script
   - Set appropriate timeout (longer than 10 min retry + workspace creation time)
   - Enable caching - the test validates the template files, so cache based on template inputs

Key coder CLI commands:
- `coder create --template coder-devcontainer-kubernetes --yes --parameter cpu=2 --parameter memory=4 <name>`
- `coder list -o json --search "name:<name>"` - Get workspace JSON including health
- `coder show <name>` - Display workspace details and agent status
- `coder delete --yes <name>` - Remove workspace

Goss patterns to use (based on existing goss.yaml files):
- `command` tests with exec, exit-status, stdout patterns
- Use jq to parse JSON output from coder CLI
- Reference workspace name via `{{.Env.WORKSPACE_NAME}}` in goss templates

The healthy field in coder list JSON indicates overall workspace health.
App health can be checked through the workspace's agent resources.
</implementation>

<constraints>
- Do NOT use interactive flags that require user input
- Do NOT leave test workspaces running if the script fails
- Do NOT hardcode workspace names - use unique identifiers
- Use `--yes` flag for all coder commands that prompt
- The test should be idempotent - running twice should work correctly
- Follow existing moon.yml task patterns in the project
- Use environment variables or script arguments for template name flexibility
</constraints>

<verification>
Before completing, verify:
1. The goss-workspace.yaml file has valid goss syntax
2. The moon.yml task is properly configured with appropriate timeout
3. The cleanup mechanism (trap) is correctly implemented
4. The goss validate command uses `--retry-timeout 10m --sleep 15s`
5. Run `moon run coder-devcontainer-kubernetes:workspace_test` to test (if possible in current environment)
</verification>

<success_criteria>
- `workspace_test` task added to moon.yml
- goss-workspace.yaml created with health checks for fleet-mcp and claude-code apps
- Test creates workspace, validates health with `goss validate --retry-timeout 10m`, and cleans up
- Proper exit codes (0 success, 1 failure)
- Cleanup happens even on failure (via trap)
</success_criteria>
