# Feature Specification: Fleet MCP Server

**Feature Branch**: `002-fleet-mcp`
**Created**: 2025-10-29
**Status**: Draft
**Input**: User description: "Create a MCP server which controls a fleet of Claude Code agents running inside devcontainers managed by Coder.com. Have the ability to spin up agents with different roles, the default being "coder" and for different projects. Agents will converge on the spec given by executing tasks. These tasks can be given by the agent itself, a human or controlling AI agent. When the agent is working on a task it will set it's status to "busy". When the agent is done it will be set to "idle". To enable advanced workflows, metadata fields which are prefixed with fleet_mcp inside of a Coder Workspace will be made available inside the agent details."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and Monitor Agent Fleet (Priority: P1)

An operator needs to spin up multiple Claude Code agents to work on different specifications across various projects. The operator creates agents with different roles (coder, operator, manager) assigned to specific projects (Setup, DataOne), provides each with a specification, and monitors their status and progress through the MCP interface.

**Why this priority**: This is the core functionality - without the ability to create and monitor agents, the entire fleet management system has no value. This represents the minimal viable product.

**Independent Test**: Can be fully tested by creating agents through the MCP server, assigning them specs, and querying their status and task history. Delivers immediate value by enabling parallel work across multiple agents.

**Acceptance Scenarios**:

1. **Given** the MCP server is running, **When** an operator issues a create agent command with a spec, project "Setup", and role "coder", **Then** a new Claude Code agent is provisioned in a Coder workspace with the specified configuration
2. **Given** multiple agents exist in the fleet, **When** the operator requests the agent list, **Then** the system returns all agents with their names, current status (busy/idle/offline), and current task
3. **Given** an agent is working on a task, **When** the operator queries agent details, **Then** the system returns the agent's name, status, current task, assigned spec, and all fleet_mcp metadata fields
4. **Given** an agent has completed multiple tasks, **When** the operator requests task history, **Then** the system returns a paginated list of all tasks the agent has worked on with timestamps and summaries

---

### User Story 2 - Task Lifecycle Management (Priority: P2)

An operator or controlling AI agent needs to manage the execution lifecycle of agent tasks. This includes starting new tasks, monitoring task progress through status changes (idle → busy → idle), and stopping tasks when needed. Tasks can be assigned by humans, by the agent itself, or by a controlling AI agent.

**Why this priority**: Once agents can be created and monitored (P1), the next critical capability is managing their work. Without task management, agents cannot effectively execute work assigned to them.

**Independent Test**: Can be tested independently by creating an agent, assigning it a task via the start task command, observing status changes to "busy", then using stop task to interrupt work. Delivers value by enabling dynamic task control.

**Acceptance Scenarios**:

1. **Given** an agent exists in "idle" status, **When** a task is started with a specification, **Then** the agent status changes to "busy" and begins working on the task
2. **Given** an agent is working on a task with status "busy", **When** the agent completes the task, **Then** the agent status automatically changes to "idle" and the task is recorded in history
3. **Given** an agent is working on a task with status "busy", **When** an operator issues a stop task command, **Then** the agent interrupts the current task and status changes to "idle"
4. **Given** an agent needs a new task, **When** the agent itself, a human, or controlling AI provides a task, **Then** the task is accepted and execution begins

---

### User Story 3 - Spec Convergence with PR Integration (Priority: P3)

A manager agent or human operator monitors agents working toward specifications that are tracked via pull requests. The system surfaces PR metadata (URL, status, CI check status) alongside agent progress, enabling verification that agents' work aligns with intended outcomes and that pull requests are progressing correctly.

**Why this priority**: This enables advanced workflows and quality assurance but requires P1 and P2 to be functional first. It adds observability and integration with external systems without which basic fleet management still works.

**Independent Test**: Can be tested by creating an agent with fleet_mcp_pull_request_url metadata, having it work on tasks, and verifying that PR status and check status are visible in agent details. Delivers value through enhanced visibility into work quality.

**Acceptance Scenarios**:

1. **Given** an agent is created with fleet_mcp_pull_request_url metadata, **When** the operator views agent details, **Then** the PR URL is displayed
2. **Given** an agent has fleet_mcp_pull_request_status metadata, **When** the PR status changes externally, **Then** the agent details reflect the updated status
3. **Given** an agent has fleet_mcp_pull_request_check_status metadata, **When** CI checks complete, **Then** the agent details show the check status (passing/failing)
4. **Given** an agent has fleet_mcp_agent_spec metadata, **When** a manager agent reviews the work, **Then** the spec is available for verification that work aligns with intended outcomes

---

### User Story 4 - Agent Lifecycle Management (Priority: P3)

An operator needs to manage the full lifecycle of agents including provisioning, ongoing operation, and eventual decommissioning. When agents are no longer needed or need to be reconfigured, operators can cleanly remove them from the fleet.

**Why this priority**: While important for production use, basic create/monitor/task-management (P1/P2) provides the core value. Deletion is a supporting capability needed for long-term fleet hygiene.

**Independent Test**: Can be tested by creating an agent, verifying it appears in the fleet list, then deleting it and confirming it no longer appears. Delivers value through resource management and cost control.

**Acceptance Scenarios**:

1. **Given** an agent exists in the fleet with status "idle", **When** an operator issues a delete agent command, **Then** the Coder workspace is destroyed and the agent is removed from the fleet
2. **Given** an agent exists in the fleet with status "busy", **When** an operator attempts to delete the agent, **Then** the agent is forcefully deleted, the Coder workspace is destroyed immediately, and any in-progress work is terminated
3. **Given** an agent has been deleted, **When** the operator queries the agent list, **Then** the deleted agent does not appear

---

### User Story 5 - Role and Project Discovery (Priority: P3)

A user or controlling system needs to understand what types of agents can be created and which projects are available. The system provides discovery endpoints to list available agent roles (coder, operator, manager) and projects (Setup, DataOne, etc.) that correspond to Coder templates.

**Why this priority**: This is a supporting capability that improves usability but isn't required for basic operation. Users can create agents with known roles/projects without discovery.

**Independent Test**: Can be tested by calling list roles and list projects endpoints and verifying they return the expected sets. Delivers value through discoverability and reduced need for external documentation.

**Acceptance Scenarios**:

1. **Given** the MCP server is running, **When** a user requests the list of available roles, **Then** the system returns roles including "coder", "operator", and "manager" with descriptions
2. **Given** the MCP server is connected to Coder, **When** a user requests the list of available projects, **Then** the system returns project names (e.g., "Setup", "DataOne") that map to Coder templates
3. **Given** a user wants to create an agent, **When** they query available roles and projects first, **Then** they can make informed choices about agent configuration

---

### Edge Cases

- What happens when a Coder workspace fails to provision during agent creation? (Answer: Agent status will reflect "failed" state from workspace)
- How does the system handle an agent going offline unexpectedly (workspace crash, network loss)? (Answer: Passive detection via workspace state polling - agent status will transition to "stopped", "failed", or appropriate error state based on workspace build status)
- What happens when multiple tasks are started on the same agent simultaneously?
- How does the system detect and report when an agent is stuck (busy for an unusually long time)?
- What happens when PR metadata fields are provided but the PR URL is invalid or inaccessible?
- How are agent names validated to ensure they are unique and conform to short, memorable format (like "Sony" or "Papi")?
- What happens when attempting to delete an agent while it's in the middle of committing code or creating a PR?
- How does the system handle pagination boundaries in task history (e.g., requesting page beyond available data)?
- What happens when an agent is assigned a spec that is malformed or empty?
- How does the system handle role or project names that don't exist in Coder templates?

## Requirements *(mandatory)*

### Functional Requirements

#### Agent Management

- **FR-001**: System MUST provision a new Claude Code agent in a Coder workspace when given a spec, project name, and role
- **FR-002**: System MUST support creating agents with role "coder" as the default role
- **FR-003**: System MUST assign each agent a unique, short, memorable name (examples: Sony, Papi)
- **FR-004**: System MUST allow listing all agents showing name, current status, and current task
- **FR-005**: System MUST provide detailed agent information including name, status, current task, assigned spec, and fleet_mcp metadata fields
- **FR-006**: System MUST support deleting an agent, which destroys the associated Coder workspace
- **FR-007**: System MUST track agent status using the AgentStatus enum with states: "pending", "starting", "busy", "idle", "stopping", "stopped", "failed", "canceling", "canceled", "deleting", "deleted"
- **FR-008**: System MUST automatically set agent status to "busy" when working on a task
- **FR-009**: System MUST automatically set agent status to "idle" when a task completes
- **FR-010**: System MUST detect and reflect workspace unavailability through appropriate status states ("stopped", "failed", "stopping", "deleting") when the Coder workspace or Claude Code instance becomes unavailable

#### Task Management

- **FR-011**: System MUST allow starting a task on an agent, providing the agent with work to execute
- **FR-012**: System MUST accept tasks from three sources: the agent itself, a human operator, or a controlling AI agent
- **FR-013**: System MUST allow stopping a currently executing task on an agent
- **FR-014**: System MUST maintain a complete history of all tasks an agent has worked on
- **FR-015**: System MUST provide paginated access to agent task history
- **FR-016**: System MUST record task summary messages sent by Claude Code to the Coder agent API as task history entries
- **FR-017**: System MUST associate each task history entry with a timestamp

#### Spec Convergence

- **FR-018**: System MUST accept a structured spec when creating an agent that defines the agent's objective, context, and expected deliverables
- **FR-019**: System MUST store the agent's spec in the fleet_mcp_agent_spec metadata field
- **FR-020**: System MUST make the agent's spec available for manager agents to verify work alignment with intended outcomes

#### Metadata Integration

- **FR-021**: System MUST read metadata fields prefixed with "fleet_mcp" from Coder workspaces and surface them in agent details
- **FR-022**: System MUST support the fleet_mcp_pull_request_url metadata field containing the PR URL associated with the spec
- **FR-023**: System MUST support the fleet_mcp_pull_request_status metadata field containing the current PR status
- **FR-024**: System MUST support the fleet_mcp_pull_request_check_status metadata field containing the CI check status
- **FR-025**: System MUST support the fleet_mcp_agent_spec metadata field containing the specification the agent should follow

#### Role and Project Management

- **FR-026**: System MUST support multiple agent roles including "coder", "operator", and "manager"
- **FR-027**: System MUST configure the agent's system prompt based on the assigned role
- **FR-028**: System MUST provide an endpoint to list all available agent roles with descriptions
- **FR-029**: System MUST support multiple projects that correspond to different Coder workspace templates
- **FR-030**: System MUST provide an endpoint to list all available projects mapped to Coder templates
- **FR-031**: System MUST provision agents using the Coder template associated with the specified project name

### Key Entities

- **Agent**: Represents a Claude Code instance running inside a Coder devcontainer. Attributes include unique name (short and memorable), current status (see AgentStatus enum: pending, starting, busy, idle, stopping, stopped, failed, canceling, canceled, deleting, deleted), assigned role (coder/operator/manager), associated project, assigned spec, current task, and task history.

- **Task**: Represents work assigned to an agent. Attributes include task summary message, timestamp, completion status, and source (agent itself, human, or controlling AI). Tasks are what agents converge on to meet their spec.

- **Spec**: A structured spec defining what an agent should accomplish, including objective, context, constraints, and expected deliverables. Acts as the source of truth for verifying agent work alignment.

- **Role**: Defines the agent's persona and system prompt configuration. Examples include "coder" (default, for writing code), "operator" (for operational tasks), and "manager" (for coordinating and verifying work).

- **Project**: Represents a category of work corresponding to a specific Coder workspace template. Examples include "Setup" and "DataOne". Determines the environment and tooling available to the agent.

- **Metadata**: Key-value pairs prefixed with "fleet_mcp" stored in Coder workspaces that provide additional context about agent work, including PR integration details (URL, status, check status) and the agent's spec.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Operators can create a new agent and have it provisioned and ready to accept tasks within 3 minutes (measured from MCP tool call to workspace reaching "running" status with agent initialized)
- **SC-002**: System accurately reflects agent status changes within 5 seconds (measured from Coder workspace state change to MCP server query returning updated status)
- **SC-003**: Operators can retrieve complete task history for any agent with pagination supporting at least 100 tasks per agent
- **SC-004**: System successfully provisions agents across at least 2 different projects (specifically: Setup and DataOne) using distinct Coder templates
- **SC-005**: Metadata fields (fleet_mcp_pull_request_url, fleet_mcp_pull_request_status, fleet_mcp_pull_request_check_status, fleet_mcp_agent_spec) are visible in agent details within 5 seconds (measured from metadata update in Coder to MCP show_agent query returning updated metadata)
- **SC-006**: Agent deletion completes within 2 minutes and successfully removes all associated Coder workspace resources
- **SC-007**: System supports managing at least 10 concurrent agents without degradation in status monitoring or command response times
- **SC-008**: Task history pagination returns results in under 1 second for queries up to 1000 total tasks
- **SC-009**: Role and project discovery endpoints return results in under 500ms
- **SC-010**: 95% of agent creation, task start, task stop, and deletion commands complete successfully on first attempt

## Assumptions

- Coder.com infrastructure is already set up and accessible via API with appropriate authentication
- Coder workspace templates exist for each project (Setup, DataOne, etc.) prior to agent creation
- Claude Code is pre-installed in Coder workspace templates or can be installed programmatically
- The MCP server has sufficient permissions to create, manage, and delete Coder workspaces
- Network connectivity exists between the MCP server and Coder infrastructure
- Claude Code instances can report their status to the Coder agent API
- Task summary messages from Claude Code conform to a parseable format
- PR URLs in metadata point to accessible GitHub, GitLab, or similar platforms
- Role configurations (system prompts) are predefined for "coder", "operator", and "manager"
- Agent names will be generated or validated to ensure uniqueness within the fleet
- Pagination for task history will use a standard page size (assumed 20 items per page unless specified)
- Busy agents will continue working unless explicitly stopped or they complete their task

## Dependencies

- Coder.com API for workspace lifecycle management (create, delete, query status)
- Coder workspace templates configured for each supported project
- Claude Code deployment mechanism within Coder workspaces
- Coder agent API for receiving task status updates from Claude Code instances
- MCP server framework/protocol implementation
- Authentication system for MCP server to Coder API (API tokens, OAuth, etc.)
- Mechanism to read and write metadata fields in Coder workspaces
- Storage system for tracking agents, tasks, and history (database, in-memory, or file-based)
