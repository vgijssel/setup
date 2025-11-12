# Feature Specification: Fleet Metadata Server

**Feature Branch**: `005-fleet-metadata-server`
**Created**: 2025-11-11
**Status**: Draft
**Input**: User description: "This is feature number 005. Create a server which returns metadata for the fleet-mcp MCP server. The fleet-mcp MCP server will call the fleet-metadata server and collect metadata keys and values for a single agent. Every agent in the fleet will run an instance of the metadata server and each server will be stateless. This server is needed to implement custom workflows onto the fleet-mcp MCP server like PR tracking in GitHub or merge request tracking in GitLab."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Query Agent Metadata (Priority: P1)

A fleet-mcp MCP server operator needs to retrieve current metadata about a specific agent in the fleet to understand its operational state and track workflow progress.

**Why this priority**: Core functionality - without the ability to query metadata, the server has no purpose. This is the minimum viable product that enables all downstream workflows.

**Independent Test**: Can be fully tested by starting a metadata server instance, storing sample metadata, and making HTTP requests to retrieve it. Delivers immediate value by exposing agent state.

**Acceptance Scenarios**:

1. **Given** a metadata server is running for an agent, **When** fleet-mcp queries for all metadata, **Then** the server returns all current key-value pairs for that agent
2. **Given** a metadata server has metadata stored, **When** fleet-mcp queries for a specific metadata key, **Then** the server returns the value for that key
3. **Given** a metadata server with no metadata stored, **When** fleet-mcp queries for metadata, **Then** the server returns an empty result set without errors

---

### User Story 2 - Store and Update Metadata (Priority: P2)

An agent needs to record and update its operational metadata (such as current PR number, branch name, or task status) so that fleet-mcp can track workflow progress across the fleet.

**Why this priority**: Enables workflows - agents must be able to write metadata before meaningful tracking can occur. Builds on P1 to create a complete read-write system.

**Independent Test**: Can be tested by making HTTP POST/PUT requests to store metadata, then verifying persistence through GET requests. Delivers value by enabling workflow state tracking.

**Acceptance Scenarios**:

1. **Given** a metadata server is running, **When** an agent stores a new key-value pair, **Then** the metadata is persisted and retrievable via query
2. **Given** existing metadata for a key, **When** an agent updates that key with a new value, **Then** the new value replaces the old value
3. **Given** multiple metadata keys, **When** an agent updates one key, **Then** other keys remain unchanged
4. **Given** a metadata server restart, **When** the server comes back online, **Then** previously stored metadata is available (persistence between restarts)

---

### User Story 3 - Delete Metadata (Priority: P3)

An agent or fleet-mcp operator needs to remove obsolete or completed workflow metadata to maintain clean operational state.

**Why this priority**: Data hygiene - important for long-running agents but not critical for initial workflows. Can be deferred until P1 and P2 are working.

**Independent Test**: Can be tested by storing metadata, issuing delete requests, and verifying removal through GET requests. Delivers value by preventing metadata accumulation.

**Acceptance Scenarios**:

1. **Given** metadata exists for a specific key, **When** a delete request is made for that key, **Then** the key is removed and subsequent queries return empty results
2. **Given** multiple metadata keys exist, **When** a delete request is made for one key, **Then** only that key is removed and others remain
3. **Given** a non-existent key, **When** a delete request is made, **Then** the server responds with success (idempotent operation)

---

### User Story 4 - Health and Status Monitoring (Priority: P2)

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
- How does the system handle concurrent updates to the same metadata key from multiple sources?
- What happens when metadata values exceed reasonable size limits?
- How does the system handle special characters or encoding issues in metadata keys or values?
- What happens when an agent attempts to store metadata before the server is fully initialized?
- How does the system handle clock skew or timestamp inconsistencies across distributed agents?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each agent in the fleet MUST run its own independent instance of the metadata server
- **FR-002**: The metadata server MUST be stateless (no shared state between server instances)
- **FR-003**: The metadata server MUST support storing key-value pairs for a single agent
- **FR-004**: The metadata server MUST support retrieving all metadata for its agent
- **FR-005**: The metadata server MUST support retrieving specific metadata by key
- **FR-006**: The metadata server MUST support updating existing metadata values
- **FR-007**: The metadata server MUST support deleting metadata by key
- **FR-008**: The metadata server MUST provide an HTTP interface that fleet-mcp can call
- **FR-009**: The metadata server MUST respond to health check requests
- **FR-010**: The metadata server MUST handle concurrent requests safely
- **FR-011**: The metadata server MUST persist metadata across server restarts using file-based storage (JSON or YAML format)
- **FR-012**: The metadata server MUST validate metadata keys and values to prevent injection attacks
- **FR-013**: Fleet-mcp MUST be able to query metadata servers for all agents in the fleet
- **FR-014**: The metadata server MUST support workflow-specific metadata such as PR numbers, branch names, and task status
- **FR-015**: The metadata server MUST enforce size limits on metadata: maximum 256 characters for keys, 4KB for values, and 1MB total per agent

### Key Entities

- **Agent**: A member of the fleet that runs its own metadata server instance. Each agent has a unique identifier and maintains its own metadata collection.
- **Metadata Entry**: A key-value pair associated with an agent. Keys are strings that identify the metadata type (e.g., "github_pr_number", "current_branch"). Values are strings containing the metadata content.
- **Fleet-MCP Server**: The orchestration system that queries metadata servers across the fleet to enable custom workflows like PR tracking and merge request tracking.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fleet-mcp can successfully retrieve metadata from all running agents in under 5 seconds for fleets up to 100 agents
- **SC-002**: Metadata queries return results in under 100 milliseconds for 95% of requests
- **SC-003**: The metadata server handles at least 100 concurrent requests without errors
- **SC-004**: Metadata updates are reflected in subsequent queries within 1 second
- **SC-005**: The metadata server has 99.9% uptime over a 7-day period during normal operation
- **SC-006**: Zero data loss occurs for stored metadata during planned server restarts
- **SC-007**: Fleet-mcp can successfully implement PR tracking workflow using stored metadata without manual intervention
