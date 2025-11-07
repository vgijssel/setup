# Feature Specification: Fleet MCP Clean Architecture Implementation

**Feature Branch**: `001-fleet-mcp-clean`
**Created**: 2025-11-07
**Status**: Draft
**Input**: User description: "Create a clone of the existing fleet-mcp server in libs/fleet-mcp called libs/fleet-mcp-clean but with two architectural differences: it uses clean architecture and it uses a better AI compatible testing strategy. It's a completely new implementation and there is no need for backwards compatibility. The fleet-mcp-clean has the following MCP tool calls similar to the existing fleet-mcp implementation: 1. List agents 2. Show agent 3. Create agent 4. Send task to agent 5. Cancel whatever task agent is working on 6. Show agent task history 7. Show agent logs 8. Delete agent 9. Restart agent 10. List agent projects 11. List agent roles per project"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agent Discovery and Inspection (Priority: P1)

As a fleet manager, I need to discover available agent capabilities and inspect individual agents to understand my fleet's capacity and current workload distribution.

**Why this priority**: This is foundational functionality - users must be able to see what agents exist and what they can do before performing any other operations. Without this, the system is a black box.

**Independent Test**: Can be fully tested by calling list operations and show operations, verifying that agent metadata is returned correctly without requiring any agent creation or task execution.

**Acceptance Scenarios**:

1. **Given** the fleet has multiple agents running, **When** I list all agents, **Then** I receive a summary of all agents including their name, status, project, and last task
2. **Given** a specific agent exists in the fleet, **When** I request details for that agent by name, **Then** I receive comprehensive information including workspace ID, role, creation time, and current status
3. **Given** I want to know what types of agents I can create, **When** I list available projects, **Then** I receive all valid fleet-mcp project templates with their capabilities
4. **Given** I select a specific project, **When** I list available roles for that project, **Then** I receive all workspace presets (roles) defined in that project template

---

### User Story 2 - Agent Lifecycle Management (Priority: P1)

As a fleet manager, I need to create new agents and remove agents from the fleet to scale my workforce based on workload demands.

**Why this priority**: Creating and deleting agents are fundamental lifecycle operations. Without these, users cannot build or manage their fleet. This must work before task management is useful.

**Independent Test**: Can be fully tested by creating agents with different configurations (name, project, role, initial task) and then deleting them, verifying creation success and cleanup completion.

**Acceptance Scenarios**:

1. **Given** valid agent parameters (name, project, role, task), **When** I create a new agent, **Then** the agent is provisioned with a Coder workspace and becomes available in the fleet
2. **Given** an agent name that already exists, **When** I attempt to create another agent with the same name, **Then** the operation fails with a clear error message
3. **Given** an agent exists in the fleet, **When** I delete that agent, **Then** the agent's workspace is destroyed and the agent is removed from the fleet
4. **Given** an agent is busy with a task, **When** I delete that agent, **Then** the agent is forcefully deleted regardless of its busy state
5. **Given** an agent exists in any state, **When** I restart that agent, **Then** the agent's workspace is restarted and the agent becomes available again

---

### User Story 3 - Task Assignment and Cancellation (Priority: P2)

As a fleet manager, I need to assign tasks to idle agents and cancel tasks on busy agents to control workload execution and respond to changing priorities.

**Why this priority**: Task management is the primary value proposition of the fleet, but it requires agents to exist first (depends on P1). This enables the core "work assignment" use case.

**Independent Test**: Can be fully tested by creating an agent, assigning it a task, verifying busy status, canceling the task, and verifying idle status - all operations are self-contained.

**Acceptance Scenarios**:

1. **Given** an agent is idle, **When** I send a task to that agent, **Then** the agent transitions to busy status and begins executing the task
2. **Given** an agent is already busy, **When** I attempt to send another task to that agent, **Then** the operation fails with a conflict error
3. **Given** an agent is busy with a task, **When** I cancel the task, **Then** an interrupt signal is sent to the agent and it gracefully transitions to idle status
4. **Given** an agent is idle, **When** I attempt to cancel a non-existent task, **Then** the operation fails with an appropriate error message
5. **Given** an agent is offline, **When** I attempt to send a task to that agent, **Then** the operation fails indicating the agent is unavailable

---

### User Story 4 - Task and Log History Tracking (Priority: P3)

As a fleet manager, I need to review task history and conversation logs for agents to monitor productivity, debug issues, and understand what work has been completed.

**Why this priority**: Historical data is valuable for monitoring and debugging, but the system delivers value without it. Users can operate the fleet effectively using real-time status alone.

**Independent Test**: Can be fully tested by creating an agent, executing multiple tasks, and then paginating through task history and logs to verify data persistence and retrieval.

**Acceptance Scenarios**:

1. **Given** an agent has completed multiple tasks, **When** I request task history for that agent with pagination, **Then** I receive tasks ordered by creation time (newest first) with proper pagination metadata
2. **Given** an agent has an empty task history, **When** I request task history for that agent, **Then** I receive an empty result set with no errors
3. **Given** an agent has generated conversation logs, **When** I request logs with pagination, **Then** I receive log entries ordered by time (newest first) with pagination support
4. **Given** I want to see only the latest log entry, **When** I request logs with page size 1, **Then** I receive only the most recent log entry

---

### Edge Cases

**Note**: Each edge case below maps to specific test tasks (see tasks.md Phase 7: T161-T167)

- **T161**: What happens when an agent name contains uppercase letters, numbers, or hyphens (valid), but not special characters like @ or spaces (invalid)?
  - Expected: Validation error with clear message listing valid characters
- **T162**: How does the system handle attempts to create an agent with a project that doesn't have required parameters (ai_prompt, system_prompt)?
  - Expected: Validation error indicating missing required template parameters
- **T163**: What happens when Coder API is temporarily unavailable during agent creation or task assignment?
  - Expected: Network error with retry suggestion or timeout message
- **T164**: How does the system handle pagination when requesting page numbers beyond available data (e.g., page 100 when only 3 pages exist)?
  - Expected: Empty result set with pagination metadata showing actual available pages
- **T165**: What happens when an agent's workspace is in a transitional state (starting, stopping) during task assignment?
  - Expected: Agent status check fails with message indicating agent is not online
- **T166**: How does the system handle very long task descriptions or log entries that might exceed storage limits?
  - Expected: Truncation or chunking with warning about length limit
- **T167**: What happens when attempting to show details for an agent that was just deleted by another user?
  - Expected: 404 error with clear message that agent no longer exists

## Requirements *(mandatory)*

### Functional Requirements

**Agent Discovery**
- **FR-001**: System MUST provide an operation to list all agents in the fleet with summary information (name, status, project, last task)
- **FR-002**: System MUST provide an operation to retrieve detailed information about a specific agent by name
- **FR-003**: System MUST provide an operation to list all available projects (templates) that can be used to create agents
- **FR-004**: System MUST provide an operation to list all available roles (workspace presets) for a specific project

**Agent Lifecycle Management**
- **FR-005**: System MUST provide an operation to create a new agent with specified name, project, role, and initial task description
- **FR-006**: System MUST enforce unique agent names - creation with duplicate name MUST fail with clear error
- **FR-007**: System MUST validate that agent names contain only alphanumeric characters and hyphens, with length between 1-20 characters
- **FR-008**: System MUST validate that the specified project exists and has required parameters before creating an agent
- **FR-009**: System MUST provide an operation to delete an agent and destroy its underlying workspace
- **FR-010**: System MUST allow deletion of busy agents (forceful deletion) without requiring task cancellation first
- **FR-011**: System MUST provide an operation to restart an agent's workspace regardless of current state

**Task Management**
- **FR-012**: System MUST provide an operation to send a task description to an idle agent
- **FR-013**: System MUST transition agent status to busy when a task is successfully assigned
- **FR-014**: System MUST prevent task assignment to busy agents and return a conflict error
- **FR-015**: System MUST prevent task assignment to offline agents and return an availability error
- **FR-016**: System MUST provide an operation to cancel a currently running task on a busy agent
- **FR-017**: System MUST send an interrupt signal (Ctrl+C / SIGINT) when canceling a task to allow graceful shutdown
- **FR-018**: System MUST validate that task descriptions are not empty before assignment

**History and Logging**
- **FR-019**: System MUST provide an operation to retrieve paginated task history for an agent, ordered by creation time (newest first)
- **FR-020**: System MUST provide an operation to retrieve paginated conversation logs for an agent, ordered by time (newest first)
- **FR-021**: System MUST support pagination parameters (page number, page size) for both task history and logs
- **FR-022**: System MUST limit page size to a maximum of 100 items
- **FR-023**: System MUST default log pagination to page size 1 (show only latest entry)

**Architecture Requirements**
- **FR-024**: System MUST implement clean architecture with 5 distinct layers: Tool → Service → Repository → Client → Coder API
- **FR-025**: System MUST enforce dependency flow where each layer only depends on the layer directly below it
- **FR-026**: System MUST implement business logic in the Service layer, data access logic in the Repository layer, and API communication in the Client layer
- **FR-027**: System MUST expose MCP tools as thin entry points that instantiate and delegate to Service layer

**Testing Requirements**
- **FR-028**: System MUST provide AI-compatible test descriptions that clearly state what is being tested and expected behavior
- **FR-029**: System MUST organize tests by architectural layer (Tool, Service, Repository, Client)
- **FR-030**: System MUST record VCR cassettes separately and generate mocks from those cassettes for use in tests
- **FR-031**: System MUST NOT use VCR directly in tests - all tests use mocks derived from VCR cassettes
- **FR-032**: System MUST use test fixtures and factories to simplify test data creation for AI understanding
- **FR-033**: System MUST test each layer independently with mocked dependencies from the layer below

### Key Entities

- **Agent**: Represents a Claude Code instance running in a Coder workspace
  - Attributes: name (unique identifier), workspace_id (infrastructure reference), status (lifecycle state), role (capability type), project (template reference), last_task (recent work), created_at, updated_at
  - Business rules: Names must be unique, alphanumeric+hyphens only, 1-20 characters; agents can only accept tasks when idle; agents in any state can be deleted

- **Task**: Represents a work assignment given to an agent
  - Attributes: message (work description), uri (optional resource reference), needs_user_attention (flag for human intervention), created_at
  - Business rules: Tasks cannot be empty; only one task can run on an agent at a time; tasks can be canceled via interrupt signal

- **Project**: Represents a template configuration for creating agents
  - Attributes: name (identifier), display_name (human-readable), has_required_parameters (validation flag)
  - Business rules: Projects must have ai_prompt and system_prompt parameters to be valid fleet-mcp projects

- **Role**: Represents a workspace preset that defines agent capabilities
  - Attributes: name (identifier), display_name (human-readable), project (association)
  - Business rules: Roles are defined per-project and must exist in the project template

- **TaskHistory**: Collection of task records for an agent
  - Attributes: tasks (ordered list), total_count, page, page_size
  - Business rules: Ordered newest-first; pagination required for large histories

- **LogEntry**: A single log entry from an agent's conversation history
  - Attributes: timestamp (when logged), content (log message), level (info/error/debug)
  - Business rules: Immutable once created; ordered by timestamp

- **ConversationLog**: Collection of LogEntry records for an agent
  - Attributes: logs (ordered list of LogEntry), total_count, page, page_size
  - Business rules: Ordered newest-first; default page size is 1 (latest only); each log is a LogEntry

## Success Criteria *(mandatory)*

### Measurable Outcomes

**Terminology**: An "online" agent means an agent in either `idle` or `busy` status (i.e., workspace is running and agent is connected). An "offline" agent has status other than idle/busy (e.g., `starting`, `stopped`, `failed`).

- **SC-001**: Fleet managers can create a new agent and have it become online (status=idle, workspace.latest_build.status="running") within 60 seconds
- **SC-002**: Fleet managers can discover all agents in a fleet of 100+ agents in under 2 seconds
- **SC-003**: Fleet managers can assign tasks to idle agents with 100% success rate when agents are online (status=idle)
- **SC-004**: Fleet managers can cancel running tasks and have agents return to idle status within 5 seconds
- **SC-005**: Fleet managers can delete agents in any state (busy, idle, starting) with 100% success rate
- **SC-006**: Developers can understand the purpose and expected behavior of any test by reading its description in under 10 seconds
- **SC-007**: The codebase maintains clear architectural boundaries verified by: (a) No import statements cross layer boundaries (Tool imports only Service, Service imports only Repository, Repository imports only Client), and (b) Static analysis via import-linter configuration passes in CI
- **SC-008**: All tests use mocks derived from VCR cassettes, ensuring 100% reproducibility without requiring a live Coder instance
- **SC-009**: Fleet managers receive clear, actionable error messages for all failure scenarios (duplicate names, offline agents, busy agents)
- **SC-010**: The system handles pagination correctly for histories with 1000+ entries without performance degradation

## Assumptions *(optional but recommended)*

### Technology Assumptions
- The system will continue to use FastMCP as the MCP server framework
- The system will continue to use the Coder API for workspace management
- Python will remain the implementation language with Pydantic for data validation
- pytest will be used as the testing framework
- pytest-vcr will be used for one-time cassette recording, but NOT directly in tests (tests use generated mocks)

### Architecture Assumptions
- Clean architecture means: 5 layers with unidirectional dependencies: Tool → Service → Repository → Client → Coder API
- Each layer instantiates the layer below it (dependency injection through constructor, not through interfaces)
- Business logic lives in Service layer, data transformation in Repository layer, API communication in Client layer
- Tools are thin MCP entry points that delegate immediately to Services
- No dependency inversion containers - each layer creates instances of the next layer directly

### Testing Strategy Assumptions
- "AI-compatible testing" means: clear test names, explicit arrange-act-assert structure, clear mocking, descriptive error messages
- VCR cassettes are recorded separately (one-time operation) and stored as reference data
- All tests use mocks generated from VCR cassettes - no test directly uses VCR
- Each layer is tested independently with mocked dependencies for the layer below it
- Mock factories are based on actual VCR cassette data to ensure realistic test data
- Tests are organized by layer: `tests/tools/`, `tests/services/`, `tests/repositories/`, `tests/clients/`
- Test factories provide clear, readable test data creation with sensible defaults matching VCR data

### Operational Assumptions
- Agent workspaces are provisioned and managed entirely by Coder
- Task state is persisted by Coder's experimental task API
- Log data is retrieved from Coder's task logs API
- The system does not need to maintain its own database - all state lives in Coder
- PR URL tracking (from original fleet-mcp) will be excluded from this implementation for simplicity

### Compatibility Assumptions
- No backwards compatibility required with original fleet-mcp implementation
- Existing fleet-mcp will continue to exist; this is an alternative implementation
- Both implementations can coexist in the monorepo without conflicts

## Architecture Overview *(optional but recommended for this feature)*

### Clean Architecture: 5-Layer Design

The system follows a strict 5-layer architecture where each layer has a single responsibility and depends only on the layer directly below it:

**Layer 1: Tool** (MCP Entry Point)
- Purpose: Expose MCP tool interface to external callers
- Dependencies: Service layer only
- Responsibilities:
  - Receive MCP tool requests with validated parameters
  - Instantiate the appropriate Service
  - Delegate request to Service
  - Convert Service response to MCP response format
  - Handle MCP-specific errors and formatting

**Layer 2: Service** (Business Logic)
- Purpose: Implement business operations and orchestrate workflows
- Dependencies: Repository layer only
- Responsibilities:
  - Validate business rules (agent name uniqueness, status checks)
  - Orchestrate multi-step operations
  - Instantiate and call Repository layer
  - Transform repository data into business entities
  - Handle business-level exceptions

**Layer 3: Repository** (Data Access)
- Purpose: Abstract data access and provide entity-level operations
- Dependencies: Client layer only
- Responsibilities:
  - Define entity-level data operations (create agent, get agent, list agents)
  - Instantiate and call Client layer
  - Transform API responses into domain entities
  - Handle data-level errors and retries

**Layer 4: Client** (API Communication)
- Purpose: Communicate with external Coder API
- Dependencies: Coder API only (external)
- Responsibilities:
  - Make HTTP requests to Coder API
  - Handle authentication and headers
  - Parse API responses
  - Handle network-level errors and timeouts

**Layer 5: Coder API** (External System)
- Purpose: Workspace and agent management platform
- Provided by: Coder (external service)

### Dependency Flow

```
Tool → Service → Repository → Client → Coder API
```

Each layer only knows about the layer directly below it:
- Tools don't know about Repositories or Clients
- Services don't know about Clients or Coder API
- Repositories don't know about Coder API details

### Testing Structure

**VCR Cassette Recording** (separate from tests):
- Record real Coder API interactions once using pytest-vcr
- Cassettes stored in `tests/cassettes/`
- Used as source of truth for generating mocks

**Test Organization** (all use mocks, no VCR):
- `tests/tools/`: Test Tool layer with mocked Service
- `tests/services/`: Test Service layer with mocked Repository
- `tests/repositories/`: Test Repository layer with mocked Client
- `tests/clients/`: Test Client layer with mocked HTTP responses (from VCR cassettes)
- `tests/fixtures/`: Mock factories based on VCR cassette data

**Mock Generation**:
- Mocks are created by analyzing VCR cassettes
- Each layer's tests use mocks for the layer below
- No test directly uses VCR - all use pre-generated mocks

### Data Flow Example: Create Agent

1. **Tool** (`create_agent` MCP tool) receives request: `{name, project, role, task}`
2. **Tool** instantiates `AgentService` and calls `service.create_agent(name, project, role, task)`
3. **Service** validates business rules (name format, uniqueness)
4. **Service** instantiates `AgentRepository` and calls `repository.create(name, project, role, task)`
5. **Repository** instantiates `CoderClient` and calls `client.create_workspace(...)`
6. **Client** makes HTTP POST to Coder API: `/api/v2/workspaces`
7. **Coder API** creates workspace and returns response
8. **Client** parses response and returns workspace data
9. **Repository** transforms workspace data into Agent entity
10. **Service** adds any business-level enrichment
11. **Tool** converts Agent entity to MCP response format

Each layer is independently testable with mocks for the layer below.