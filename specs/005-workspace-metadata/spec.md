# Feature Specification: Workspace Metadata in fleet-mcp

**Feature Branch**: `005-workspace-metadata`
**Created**: 2025-11-12
**Status**: Draft
**Input**: User description: "This is feature number 005. Extend the fleet-mcp MCP server to return metadata from the running workspace on both the show and list agent tools. The metadata returned will be defined in a separate yml file. And example of metadata would be the current git branch and git sha. This metadata is necessary to allow for fleet-mcp workflows like PR tracking to work."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Workspace Git Status for Single Agent (Priority: P1)

A fleet manager needs to check which git branch and commit a specific agent is currently working on to verify the agent is on the correct feature branch before starting a new task.

**Why this priority**: This is the most fundamental use case - knowing what code version an agent is running is essential for any collaborative workflow. Without this, managers can't safely coordinate work or track progress.

**Independent Test**: Can be fully tested by running `show_agent` command on any agent with an active workspace and verifying that git branch and SHA are displayed in the response. Delivers immediate value by showing current workspace state.

**Acceptance Scenarios**:

1. **Given** an agent with an active workspace on branch "feature-123" at commit "abc123def", **When** a manager runs the show agent command, **Then** the response includes metadata showing branch "feature-123" and SHA "abc123def"
2. **Given** an agent workspace with no git repository, **When** a manager runs the show agent command, **Then** the response includes metadata indicating git information is not available
3. **Given** an agent workspace with uncommitted changes, **When** a manager runs the show agent command, **Then** the response includes the current branch, SHA, and indication of uncommitted changes

---

### User Story 2 - List All Agents with Workspace Status (Priority: P2)

A fleet manager wants to see a summary view of all agents including their git branch and commit information to understand which agents are working on which features and identify agents that may be on outdated branches.

**Why this priority**: Enables fleet-wide visibility and coordination. Critical for managing multiple agents but builds on P1's single-agent capability. Can be developed after P1 is working since it uses the same metadata collection mechanism.

**Independent Test**: Can be tested independently by running `list_agents` command and verifying that metadata columns appear for all agents with workspaces. Delivers value by enabling quick fleet-wide status checks without querying each agent individually.

**Acceptance Scenarios**:

1. **Given** multiple agents with active workspaces on different branches, **When** a manager lists all agents, **Then** the response includes metadata columns showing each agent's git branch and SHA
2. **Given** a mix of agents with and without git repositories, **When** a manager lists all agents, **Then** agents with git repos show metadata while others indicate metadata is unavailable
3. **Given** five agents where three are on "main" and two are on "feature-x", **When** a manager lists agents with a filter for branch "feature-x", **Then** only the two agents on that branch are returned

---

### User Story 3 - Configure Custom Metadata Fields (Priority: P3)

A fleet manager needs to track additional workspace information beyond git details (such as deployed version, environment type, or custom tags) by configuring metadata fields in a YAML configuration file without modifying code.

**Why this priority**: Provides extensibility for future use cases but isn't required for the core PR tracking workflow. Can be added after P1 and P2 are stable since it extends the existing metadata collection framework.

**Independent Test**: Can be tested by adding a custom field to the metadata YAML file (e.g., "environment: staging"), restarting the server, and verifying the new field appears in agent responses. Delivers value by making the system adaptable to different team workflows.

**Acceptance Scenarios**:

1. **Given** a metadata configuration file with custom fields defined, **When** an agent workspace collects metadata, **Then** the custom fields are populated and returned alongside git information
2. **Given** an invalid metadata configuration file, **When** the server starts, **Then** the server logs an error and falls back to default git metadata only
3. **Given** a metadata field that requires running a shell command, **When** metadata is collected, **Then** the command is executed in the workspace and the output is captured as the field value

---

### Edge Cases

- What happens when a workspace is in the middle of a git rebase or merge conflict?
- How does the system handle workspaces where git commands fail or timeout?
- What happens when the metadata YAML file is modified while agents are running?
- How does the system handle very large git repositories where `git` commands may be slow?
- What happens when workspace metadata collection takes longer than expected?
- How does the system handle special characters or very long branch names in metadata?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST return workspace metadata when showing a single agent's details
- **FR-002**: System MUST return workspace metadata for all agents when listing agents
- **FR-003**: System MUST read metadata field definitions from a YAML configuration file
- **FR-004**: System MUST include git branch name in workspace metadata
- **FR-005**: System MUST include git commit SHA in workspace metadata
- **FR-006**: System MUST indicate when git information is unavailable or cannot be retrieved
- **FR-007**: System MUST collect metadata by executing commands within the agent's workspace context
- **FR-008**: System MUST handle metadata collection failures gracefully without blocking agent operations
- **FR-009**: System MUST support configurable metadata fields beyond default git information
- **FR-010**: System MUST validate metadata configuration file format on server startup
- **FR-011**: System MUST provide default metadata collection (git branch and SHA) if no configuration file exists
- **FR-012**: Metadata collection MUST complete within a reasonable timeout (default 10 seconds)
- **FR-013**: System MUST cache metadata values to avoid repeated expensive operations
- **FR-014**: System MUST indicate metadata freshness (timestamp of last collection)

### Key Entities

- **Workspace Metadata**: Information about the current state of an agent's workspace, including git branch, commit SHA, dirty state, and any custom fields defined in configuration. Collected on-demand or cached with timestamps.
- **Metadata Configuration**: YAML file defining which metadata fields to collect and how to collect them (e.g., which commands to run in the workspace). Includes field name, collection method, timeout, and caching policy.
- **Agent**: Existing entity that now includes workspace metadata in its representation when returned via show or list operations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fleet managers can identify which branch any agent is working on within 2 seconds of running a show or list command
- **SC-002**: Metadata collection adds no more than 500ms latency to agent show/list operations (with caching)
- **SC-003**: System handles metadata collection failures for 100% of agents without blocking other operations
- **SC-004**: Fleet managers can track PR status across all agents by correlating git branch metadata with PR systems
- **SC-005**: Custom metadata fields can be added by modifying configuration file without code changes and are available after server restart

## Assumptions *(if applicable)*

- Agents are running in Coder workspaces that have standard command execution capabilities
- Git is available in agent workspaces when git repositories are present
- The fleet-mcp server has permissions to execute commands in agent workspaces via existing Coder MCP integration
- Metadata YAML configuration file will be stored in a standard location accessible by the fleet-mcp server
- Metadata collection is performed on-demand with caching rather than continuously streamed
- The existing fleet-mcp codebase is in TypeScript/JavaScript (based on typical MCP server patterns)

## Dependencies *(if applicable)*

- Existing Coder MCP workspace command execution capabilities (coder_workspace_bash)
- YAML parsing library for reading metadata configuration
- Git must be installed in agent workspaces for git metadata collection

## Out of Scope *(if applicable)*

- Real-time monitoring or streaming of workspace changes
- Historical tracking of metadata changes over time
- Automated actions based on metadata values (e.g., auto-restarting agents on wrong branch)
- Integration with specific PR systems (GitHub, GitLab, etc.) - metadata provides the foundation but integration is separate
- GUI or dashboard for visualizing metadata across agents
- Metadata collection from non-workspace agents or external systems
