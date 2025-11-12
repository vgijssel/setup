# Feature Specification: Fleet Metadata Server

**Feature Branch**: `005-fleet-metadata-server`
**Created**: 2025-11-11
**Status**: Draft
**Input**: User description: "This is feature number 005. Create a server which returns metadata for the fleet-mcp MCP server. The fleet-mcp MCP server will call the fleet-metadata server and collect metadata keys and values for a single agent. Every agent in the fleet will run an instance of the metadata server and each server will be stateless. This server is needed to implement custom workflows onto the fleet-mcp MCP server like PR tracking in GitHub or merge request tracking in GitLab."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Query Agent Metadata (Priority: P1)

A fleet-mcp MCP server operator needs to retrieve current metadata about a specific agent in the fleet to understand its operational state and track workflow progress.

**Why this priority**: Core functionality - without the ability to query metadata, the server has no purpose. This is the minimum viable product that enables all downstream workflows.

**Independent Test**: Can be fully tested by starting a metadata server instance with a running workspace, making HTTP requests to retrieve metadata, and verifying the returned workspace state. Delivers immediate value by exposing agent state.

**Acceptance Scenarios**:

1. **Given** a metadata server is running for an agent with an active workspace, **When** fleet-mcp queries for all metadata, **Then** the server returns all current workspace state as key-value pairs
2. **Given** a metadata server has collected workspace metadata, **When** fleet-mcp queries for a specific metadata key, **Then** the server returns the current value for that key
3. **Given** a metadata server with a newly initialized workspace, **When** fleet-mcp queries for metadata, **Then** the server returns basic workspace information without errors

---

### User Story 2 - Automatic Workspace Metadata Collection (Priority: P1)

The metadata server needs to automatically collect metadata from the running workspace (git status, current branch, open PRs, etc.) so that fleet-mcp can access up-to-date workflow information without manual intervention.

**Why this priority**: Essential for read-only architecture - metadata must be automatically discovered from the workspace rather than explicitly written. This is what differentiates this from a simple key-value store.

**Independent Test**: Can be tested by performing workspace operations (git checkout, creating PRs, etc.) and verifying that subsequent metadata queries reflect these changes. Delivers value by enabling zero-configuration workflow tracking.

**Acceptance Scenarios**:

1. **Given** a workspace with a git repository, **When** the metadata server collects metadata, **Then** it includes current branch name, commit hash, and repository status
2. **Given** a workspace with open GitHub PRs, **When** the metadata server collects metadata, **Then** it includes PR numbers and status for PRs associated with the current workspace
3. **Given** a workspace with active tasks, **When** the metadata server collects metadata, **Then** it includes current task status and progress information
4. **Given** workspace state changes, **When** fleet-mcp queries metadata again, **Then** the server returns updated information reflecting current workspace state

---

### User Story 3 - Health and Status Monitoring (Priority: P2)

Fleet-mcp and monitoring systems need to verify that metadata servers are running and responsive across all agents in the fleet.

**Why this priority**: Operational reliability - critical for production deployments where fleet-mcp must distinguish between "no metadata" and "server unavailable".

**Independent Test**: Can be tested by making health check requests to running and stopped servers. Delivers value by enabling automated fleet monitoring.

**Acceptance Scenarios**:

1. **Given** a metadata server is running, **When** a health check request is made, **Then** the server responds with a success status
2. **Given** a metadata server is under load, **When** a health check request is made, **Then** the server still responds within acceptable timeframe
3. **Given** a metadata server has just started, **When** a health check request is made, **Then** the server indicates ready status

---

### Edge Cases

- What happens when fleet-mcp queries a metadata server that is temporarily unreachable?
- How does the system handle workspace metadata collection when git commands fail or timeout?
- What happens when the workspace is in an inconsistent state (e.g., merge conflict, detached HEAD)?
- How does the system handle metadata collection when GitHub API rate limits are hit?
- What happens when metadata collection from the workspace exceeds reasonable size limits?
- How does the system handle special characters or encoding issues in workspace data (branch names, commit messages)?
- What happens when the workspace is not a git repository or has no remote configured?
- How does the system handle collecting metadata for workspaces with no active PRs or tasks?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each agent in the fleet MUST run its own independent instance of the metadata server
- **FR-002**: The metadata server MUST be stateless (no shared state between server instances)
- **FR-003**: The metadata server MUST automatically collect metadata from the running workspace
- **FR-004**: The metadata server MUST support retrieving all metadata for its agent via HTTP interface
- **FR-005**: The metadata server MUST support retrieving specific metadata by key via HTTP interface
- **FR-006**: The metadata server MUST NOT expose write, update, or delete endpoints (read-only from external perspective)
- **FR-007**: The metadata server MUST collect git repository information including current branch, commit hash, and repository status
- **FR-008**: The metadata server MUST collect GitHub/GitLab PR/MR information associated with the current workspace
- **FR-009**: The metadata server MUST collect workspace task and execution status information
- **FR-010**: The metadata server MUST respond to health check requests
- **FR-011**: The metadata server MUST handle concurrent read requests safely
- **FR-012**: The metadata server MUST refresh workspace metadata on each query to return current state
- **FR-013**: Fleet-mcp MUST be able to query metadata servers for all agents in the fleet
- **FR-014**: The metadata server MUST gracefully handle workspace states where certain metadata is unavailable (no git repo, no PRs, etc.)
- **FR-015**: The metadata server MUST enforce size limits on collected metadata: maximum 256 characters for keys, 4KB for values, and 1MB total per agent
- **FR-016**: The metadata server MUST validate and sanitize collected workspace data to prevent injection attacks

### Key Entities

- **Agent**: A member of the fleet that runs its own metadata server instance and workspace. Each agent has a unique identifier and workspace environment.
- **Workspace**: The execution environment for an agent containing git repository, running processes, and task state. Source of all metadata.
- **Metadata Entry**: A key-value pair automatically collected from the workspace. Keys identify the metadata type (e.g., "git_branch", "github_pr_number", "current_task"). Values contain the current workspace state.
- **Fleet-MCP Server**: The orchestration system that queries metadata servers across the fleet to enable custom workflows like PR tracking and merge request tracking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fleet-mcp can successfully retrieve metadata from all running agents in under 5 seconds for fleets up to 100 agents
- **SC-002**: Metadata queries return results in under 100 milliseconds for 95% of requests (including workspace data collection)
- **SC-003**: The metadata server handles at least 100 concurrent read requests without errors
- **SC-004**: Workspace state changes are reflected in metadata queries within 1 second of query execution
- **SC-005**: The metadata server has 99.9% uptime over a 7-day period during normal operation
- **SC-006**: Metadata collection succeeds for at least 95% of workspace states (handling edge cases gracefully)
- **SC-007**: Fleet-mcp can successfully implement PR tracking workflow using automatically collected metadata without manual intervention or configuration
