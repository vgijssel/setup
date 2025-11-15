# Implementation Plan: Workspace Metadata for Fleet-MCP

**Branch**: `005-workspace-metadata` | **Date**: 2025-11-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-workspace-metadata/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Extend the fleet-mcp MCP server to return workspace metadata (git branch, commit SHA, PR number) from agent workspaces in both `show_agent` and `list_agents` tools. Metadata fields are defined as individual Taskfile tasks with a `meta` key containing only `include_in_list` flag (description comes from task `desc` field), executed within the workspace context, and returned with error handling (null value + error field) for graceful degradation.

## Technical Context

**Language/Version**: Python 3.10
**Primary Dependencies**:
- Pydantic (data validation and models)
- httpx (HTTP client for agent app communication)
- go-task/task (Taskfile YAML format for metadata commands)
- Coder SDK (workspace info and URL construction)
**Storage**: N/A (metadata collected on-demand, not persisted)
**Testing**: pytest with fixtures and contract tests
**Target Platform**: Linux server (Coder workspaces run on Linux containers)
**Project Type**: Single library (`libs/fleet-mcp`)
**Performance Goals**: Metadata retrieval adds <2 seconds overhead to agent queries
**Constraints**:
- Read-only operations (no workspace state modification)
- Graceful degradation on failures (partial metadata returned with error field populated)
- Metadata collection timeout: 5 seconds per field
**Scale/Scope**:
- 10-50 agents in typical fleet
- 3-5 metadata fields initially (extensible via Taskfile)
- Tasks with `meta` key are identified as metadata fields (MVP requirement)
- `meta` key contains only `include_in_list: true/false`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Minimal Code & Dependency Reuse
✅ **PASS** - Reusing existing infrastructure:
- httpx for HTTP client (already in use by CoderClient)
- Coder SDK for workspace URL construction (existing pattern from TaskRepository)
- go-task/task for metadata command definitions (well-maintained, battle-tested)
- Pydantic for data validation (already in use)
- No custom task runner or command executor needed

### Principle II: Deterministic Dependencies
✅ **PASS** - All dependencies already pinned in `libs/fleet-mcp/pyproject.toml`:
- Pydantic pinned to exact version
- Coder SDK integration uses MCP tools (already available)
- Taskfile format is version 3 (stable specification)

### Principle III: Test-Driven Design (TDD)
✅ **PASS** - TDD workflow planned:
1. Write contract tests for metadata response schema (with error field)
2. Write unit tests for Taskfile parsing (meta key extraction)
3. Write integration tests for metadata collection (including failure cases)
4. Implement metadata collection service
5. Implement tool extensions for show_agent and list_agents

### Principle IV: Nx Monorepo Structure
✅ **PASS** - Follows existing structure:
- Feature implemented in `libs/fleet-mcp` (existing library)
- No new projects or apps needed
- Extends existing models and services

### Principle V: Third-Party Dependency Management
✅ **PASS** - No new third-party dependencies:
- Taskfile YAML format is a specification, not a runtime dependency
- All required tools (git, gh) expected in workspace environment
- Coder SDK already integrated via MCP

### Principle VI: Semantic Versioning & Independent Releases
✅ **PASS** - Minor version bump:
- MINOR increment (backward-compatible functionality addition)
- New optional fields in response models (metadata, error)
- Existing clients unaffected (metadata fields are additive)

### Principle VII: GitOps Deployment
✅ **PASS** - No deployment changes:
- MCP server configuration unchanged
- Feature enabled automatically via library update
- No infrastructure or GitOps changes required

### Principle VIII: Tool Availability
✅ **PASS** - Workspace tools already available:
- git, gh, and other workspace tools provisioned in Coder templates
- Taskfile execution via shell commands (no additional tooling)
- Error handling for missing tools (graceful degradation)

### Principle IX: On-Demand Dependency Provisioning
✅ **PASS** - No new provisioning needed:
- Metadata collected on-demand (no background processes)
- Workspace tools already provisioned via Coder templates
- Taskfile YAML parsed at runtime

### Principle X: Modular Library Design
✅ **PASS** - Focused library extension:
- Single responsibility: workspace metadata collection
- Isolated test suite additions
- Minimal coupling (new service layer component)

**Overall**: ✅ **ALL GATES PASS** - No violations, no complexity justification needed

## Project Structure

### Documentation (this feature)

```text
specs/005-workspace-metadata/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── metadata-schema.json  # JSON Schema for metadata response
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
libs/fleet-mcp/
├── src/fleet_mcp/
│   ├── models/
│   │   ├── agent.py              # [EXTEND] Add metadata field to Agent model
│   │   ├── responses.py          # [EXTEND] Add metadata to AgentListView and ShowAgentResponse
│   │   └── metadata.py           # [NEW] WorkspaceMetadata, MetadataField models
│   ├── clients/
│   │   └── metadata_client.py    # [NEW] HTTP client for agent /metadata endpoint
│   ├── repositories/
│   │   └── metadata_repository.py # [NEW] Metadata collection orchestration
│   ├── services/
│   │   └── agent_service.py      # [EXTEND] Integrate metadata collection
│   ├── tools/
│   │   ├── show_agent.py         # [NO CHANGE] Already returns ShowAgentResponse
│   │   └── list_agents.py        # [NO CHANGE] Already returns ListAgentsResponse
│   └── __main__.py               # [EXTEND] Add /metadata endpoint handler
│
└── tests/
    ├── unit/
    │   ├── services/
    │   │   └── test_metadata_service.py  # [NEW] Taskfile parsing, error handling
    │   └── models/
    │       └── test_metadata.py           # [NEW] Metadata model validation
    ├── integration/
    │   └── test_metadata_collection.py    # [NEW] End-to-end metadata retrieval
    └── contract/
        └── test_metadata_schema.py        # [NEW] Response schema validation
```

**Structure Decision**: Single library extension within `libs/fleet-mcp`. No new projects needed. Metadata collection implemented as a new service layer component (`metadata_service.py`) with minimal changes to existing tools (responses extended via model updates only).

## Metadata Schema (Data Model Preview)

Based on the requirements, here's the key schema structure:

### WorkspaceMetadata Model

```python
class MetadataField(BaseModel):
    """Individual metadata field with value and error tracking."""
    name: str
    value: Optional[str] = None  # NULL indicates failure
    error: Optional[str] = None  # Populated on failure, NULL on success

class WorkspaceMetadata(BaseModel):
    """Complete workspace metadata from Taskfile execution."""
    fields: list[MetadataField]
    collected_at: datetime
```

**Key Design Decisions**:
1. **Error Field**: `error` is NULL on success, populated with error message on failure
2. **Null Value**: When `value` is NULL AND `error` is populated, indicates partial failure
3. **Graceful Degradation**: Failed fields don't block entire metadata response
4. **Extensibility**: New fields added via Taskfile without code changes

### Agent Model Extension

```python
class Agent(BaseModel):
    # ... existing fields ...
    metadata: Optional[WorkspaceMetadata] = None  # Added for workspace context
```

### Response Model Extensions

```python
class AgentListView(BaseModel):
    # ... existing fields ...
    metadata: Optional[WorkspaceMetadata] = None  # Added for list view

class ShowAgentResponse(BaseModel):
    agent: Agent  # Agent model already includes metadata field
```

## Taskfile Integration

### Meta Key Structure (MVP Requirement)

Metadata fields defined as individual Taskfile tasks with `meta` key containing ONLY `include_in_list`:

```yaml
version: "3"

vars:
  gh_info:
    sh: gh pr view --json number,url,state 2>/dev/null || echo '{}'

tasks:
  pull_request_number:
    desc: "The number of the current pull request on GitHub"
    meta:
      include_in_list: true
    cmds:
      - echo '{{.gh_info}}' | jq -r '.number // empty'

  git_branch:
    desc: "The name of the current git branch"
    meta:
      include_in_list: false
    cmds:
      - git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown"
```

**Meta Key Requirements**:
- Each metadata field is a separate task (not nested under one task)
- The `meta` key ONLY contains `include_in_list: true/false`
- Description comes from the standard Taskfile `desc` field
- Commands are in the standard `cmds` array
- Tasks MUST be read-only (no workspace modifications)
- Tasks MUST handle failures gracefully (exit code 0 or error captured)
- Empty output indicates unavailable metadata (not an error)

### Metadata Collection Flow

**Architecture**: Fleet-mcp server makes HTTP calls to each agent's fleet-mcp app instance

```
Fleet-MCP Server (MCP Tools)
  ↓
AgentService.get_agent()
  ↓
MetadataRepository.collect_metadata(workspace_id)
  ↓
MetadataClient.get_metadata(agent_api_url)
  ↓
HTTP GET {agent_api_url}/metadata
  ↓
Agent's Fleet-MCP App (/metadata endpoint)
  ↓
Read Taskfile.yml → Execute metadata tasks → Return results
```

**Application URL Construction** (similar to TaskRepository pattern):
```python
# From existing TaskRepository pattern for ccw app
agent_api_url = f"{coder_base_url}/@{owner}/{workspace}.{workspace_id}/apps/fleet-mcp/"

# Metadata endpoint
metadata_url = f"{agent_api_url}metadata"
```

**Flow Steps**:
1. **Construct URL**: Build agent-specific fleet-mcp app URL using workspace info
2. **HTTP GET**: MetadataClient makes GET request to `{agent_api_url}/metadata`
3. **Agent Processing**: Agent's fleet-mcp app reads its Taskfile.yml and executes metadata tasks
4. **Response**: Agent returns JSON with metadata fields (value, error, schema)
5. **Parse Response**: MetadataClient parses JSON into WorkspaceMetadata model

## Endpoint Behavior

### `/metadata` Endpoint (Agent-Specific)

**IMPORTANT**: The `/metadata` endpoint is exposed by EACH agent's fleet-mcp app instance (not the main MCP server). Each agent workspace runs its own fleet-mcp app that exposes this endpoint.

**Endpoint Location**: `{coder_base_url}/@{owner}/{workspace}.{workspace_id}/apps/fleet-mcp/metadata`

**Example URLs**:
- Agent "test-agent": `https://coder.example.com/@alice/test-agent.abc123/apps/fleet-mcp/metadata`
- Agent "prod-runner": `https://coder.example.com/@bob/prod-runner.def456/apps/fleet-mcp/metadata`

**Request Flow**:
1. Main fleet-mcp server receives MCP tool call (e.g., `show_agent`)
2. MetadataRepository constructs agent-specific URL
3. MetadataClient makes HTTP GET to agent's `/metadata` endpoint
4. Agent's fleet-mcp app reads its local Taskfile.yml
5. Agent executes metadata tasks and returns results
6. Main server aggregates metadata into MCP response

**No Query Parameters**: The endpoint doesn't need workspace identification because it runs INSIDE the workspace - it already knows its own context.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. This section is intentionally empty.
