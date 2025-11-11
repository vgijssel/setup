# Feature Specification: Fleet Metadata Server

**Feature Branch**: `004-fleet-metadata`
**Created**: 2025-11-11
**Status**: Draft
**Input**: User description: "Create a server which returns metadata for the fleet-mcp MCP server. The fleet-mcp MCP server will call the fleet-metadata server and collect metadata keys and values for a single agent. Every agent in the fleet will run an instanace of the metadata server and each server will be stateless. This is server is needed to implement custom workflows onto the fleet-mcp MCP server like PR tracking in GitHub or merge request tracking in GitLab."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agent Metadata Query (Priority: P1)

The fleet-mcp MCP server queries an individual agent's metadata server to retrieve current workflow metadata (such as PR status, merge request state, task progress) for display or decision-making purposes.

**Why this priority**: This is the core functionality that enables the fleet-mcp server to collect agent-specific metadata. Without this, the entire metadata system cannot function.

**Independent Test**: Can be fully tested by deploying a single agent with its metadata server, sending an HTTP request to retrieve metadata, and verifying the response contains the expected key-value pairs. This delivers immediate value by enabling basic metadata collection from any agent.

**Acceptance Scenarios**:

1. **Given** an agent is running with its metadata server active, **When** the fleet-mcp server sends a metadata query request, **Then** the metadata server returns all current metadata key-value pairs in the response
2. **Given** an agent has no metadata stored, **When** the fleet-mcp server queries for metadata, **Then** the metadata server returns an empty collection with a successful status
3. **Given** an agent's metadata server is unreachable, **When** the fleet-mcp server attempts to query metadata, **Then** the request times out or fails with an appropriate error response

---

### User Story 2 - GitHub PR Tracking (Priority: P2)

An agent working on GitHub pull requests stores PR metadata (PR number, status, URL, branch name) that the fleet-mcp server can query to track workflow progress across multiple agents.

**Why this priority**: This demonstrates a concrete workflow use case and validates the metadata schema design with real-world data. It provides immediate business value for teams using GitHub.

**Independent Test**: Can be tested by having an agent update its metadata with PR information, then querying that metadata through the fleet-mcp server to verify PR tracking works end-to-end. This scenario stands alone and doesn't require GitLab or other workflows.

**Acceptance Scenarios**:

1. **Given** an agent creates a GitHub PR, **When** the agent updates its metadata with PR details (number, status, URL, branch), **Then** the fleet-mcp server can query and retrieve the PR metadata
2. **Given** an agent has multiple active PRs, **When** the metadata is queried, **Then** all PR metadata is returned with clear identifiers for each PR
3. **Given** a PR is merged or closed, **When** the agent updates its metadata, **Then** the fleet-mcp server retrieves the updated status on the next query

---

### User Story 3 - GitLab Merge Request Tracking (Priority: P3)

An agent working on GitLab merge requests stores MR metadata (MR ID, status, URL, source branch, target branch) that the fleet-mcp server can query to track workflow progress.

**Why this priority**: This extends the metadata system to support GitLab workflows, demonstrating platform flexibility. Lower priority because it follows the same pattern as GitHub PR tracking.

**Independent Test**: Can be tested independently by configuring an agent to work with GitLab, updating metadata with MR information, and querying through the fleet-mcp server to verify GitLab-specific tracking. This doesn't require GitHub functionality to work.

**Acceptance Scenarios**:

1. **Given** an agent creates a GitLab merge request, **When** the agent updates its metadata with MR details, **Then** the fleet-mcp server can query and retrieve the MR metadata
2. **Given** an agent works on both GitHub and GitLab, **When** metadata is queried, **Then** both PR and MR metadata are returned with clear platform identifiers
3. **Given** an MR pipeline status changes, **When** the agent updates its metadata, **Then** the fleet-mcp server retrieves the updated pipeline status

---

### User Story 4 - Multi-Agent Metadata Aggregation (Priority: P2)

The fleet-mcp server queries metadata from multiple agents simultaneously and aggregates the results to provide a fleet-wide view of workflow states.

**Why this priority**: This enables fleet-level visibility and is essential for managing multiple agents effectively. Positioned at P2 because it builds on P1 but is critical for fleet operations.

**Independent Test**: Can be tested by deploying 2-3 agents with different metadata, querying all agents through the fleet-mcp server, and verifying the aggregated response contains metadata from each agent with proper agent identification. This scenario validates the fleet-wide coordination without requiring any specific workflow type.

**Acceptance Scenarios**:

1. **Given** multiple agents are running with active metadata servers, **When** the fleet-mcp server queries all agents, **Then** metadata from each agent is returned with agent identifiers
2. **Given** some agents are offline or unreachable, **When** the fleet-mcp server queries all agents, **Then** metadata from reachable agents is returned and unreachable agents are marked as unavailable
3. **Given** agents have different metadata schemas (GitHub vs GitLab), **When** aggregating metadata, **Then** the fleet-mcp server returns all metadata with appropriate type/platform identifiers

---

### Edge Cases

- What happens when an agent's metadata server is restarted (stateless requirement) - does metadata need to be repopulated?
- How does the system handle large metadata payloads (e.g., agents with many PRs/MRs)?
- What happens when network latency causes slow metadata responses from some agents?
- How does the fleet-mcp server handle authentication/authorization when querying agent metadata servers?
- What happens if two agents try to update metadata for the same PR/MR (conflict resolution)?
- How does the system handle malformed metadata updates from agents?
- What happens when an agent's metadata server returns partial or corrupted data?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each agent MUST run a stateless metadata server instance that can be queried independently
- **FR-002**: The metadata server MUST expose an endpoint that returns all current metadata key-value pairs for its agent
- **FR-003**: The fleet-mcp MCP server MUST be able to query any agent's metadata server and retrieve metadata
- **FR-004**: The metadata server MUST support storing and retrieving arbitrary key-value pairs to accommodate different workflow types (GitHub PRs, GitLab MRs, custom workflows)
- **FR-005**: The metadata server MUST handle concurrent query requests without data corruption
- **FR-006**: The metadata server MUST provide metadata in a structured, parseable format (e.g., JSON)
- **FR-007**: The fleet-mcp server MUST be able to identify which agent's metadata is being returned in each query response
- **FR-008**: The metadata server MUST support updates to metadata values while maintaining stateless operation
- **FR-009**: The metadata server MUST handle missing or empty metadata gracefully (return empty collection, not error)
- **FR-010**: The system MUST support GitHub PR metadata including at minimum: PR number, status, URL, branch name
- **FR-011**: The system MUST support GitLab MR metadata including at minimum: MR ID, status, URL, source branch, target branch
- **FR-012**: The fleet-mcp server MUST be able to query multiple agents' metadata servers concurrently for fleet-wide aggregation
- **FR-013**: The metadata server MUST respond to health check requests to enable monitoring and availability detection
- **FR-014**: Metadata servers MUST operate independently without requiring coordination between instances

### Key Entities

- **Agent Metadata**: Represents the collection of key-value pairs stored by a single agent. Key attributes include: agent identifier, metadata key, metadata value, timestamp of last update, metadata category (e.g., "github-pr", "gitlab-mr", "custom")
- **Workflow Metadata**: Specific metadata related to PRs, MRs, or custom workflows. For GitHub PRs: PR number, status (open/merged/closed), URL, branch name, created/updated timestamps. For GitLab MRs: MR ID, status, URL, source branch, target branch, pipeline status
- **Metadata Server Instance**: A stateless server running on each agent that stores and serves metadata. Related to exactly one agent. Has a queryable endpoint and health check endpoint

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The fleet-mcp server can successfully query and retrieve metadata from any agent's metadata server within 500ms under normal network conditions
- **SC-002**: Each metadata server can handle at least 100 concurrent query requests without errors or timeouts
- **SC-003**: The metadata server can restart and become operational within 10 seconds, with metadata being repopulated through normal agent operations
- **SC-004**: The fleet-mcp server can query 10 agents' metadata servers concurrently and receive all responses within 2 seconds
- **SC-005**: Metadata updates are reflected in query responses within 100ms of the update being applied
- **SC-006**: The system successfully tracks GitHub PR workflows with 100% accuracy in metadata retrieval (no lost or corrupted PR information)
- **SC-007**: The system successfully tracks GitLab MR workflows with 100% accuracy in metadata retrieval
- **SC-008**: Agents can operate their metadata servers with less than 5% CPU overhead and less than 50MB memory footprint per instance

## Assumptions

- The fleet-mcp MCP server has network access to all agent metadata servers
- Agents have a mechanism to update their own metadata server (not specified in requirements but implied)
- HTTP/HTTPS is an acceptable protocol for metadata queries (assumed based on standard server patterns)
- Authentication and authorization between fleet-mcp and metadata servers will use standard methods (assumed not to be a critical clarification)
- Metadata persistence across restarts is not required since servers are stateless (agents repopulate as needed)
- A reasonable maximum metadata size per agent is approximately 1-10MB to handle multiple PRs/MRs
- Network failures between fleet-mcp and agents are transient and will be retried
- Metadata schema will be flexible JSON to support current and future workflow types

## Dependencies

- The fleet-mcp MCP server must be modified or extended to add metadata querying capabilities
- Each agent deployment must include the metadata server as part of the agent runtime
- Network connectivity between fleet-mcp server and all agent instances
- Agents must have a method to detect and report their metadata server endpoint to the fleet-mcp server (service discovery)

## Scope Boundaries

### In Scope
- Stateless metadata server running on each agent
- HTTP/HTTPS endpoint for metadata queries
- Support for arbitrary key-value metadata
- Specific support for GitHub PR and GitLab MR metadata schemas
- Health check endpoint for monitoring
- Concurrent query handling
- Fleet-wide metadata aggregation by fleet-mcp server

### Out of Scope
- Long-term metadata persistence (servers are stateless, agents repopulate on restart)
- Metadata synchronization between agents
- Metadata analytics or historical tracking
- Direct agent-to-agent metadata queries (only fleet-mcp queries agents)
- Metadata change notifications or webhooks
- Fine-grained access control per metadata key (assumed server-level auth is sufficient)
- Metadata backup and recovery mechanisms
- User interface for viewing metadata (fleet-mcp handles presentation)
