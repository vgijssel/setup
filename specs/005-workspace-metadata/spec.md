# Feature Specification: Workspace Metadata for Fleet-MCP

**Feature Branch**: `005-workspace-metadata`
**Created**: 2025-11-12
**Status**: Draft
**Input**: User description: "This is feature number 005. Extend the fleet-mcp MCP server to return metadata from the running workspace on both the show and list agent tools. The metadata returned will be defined in a separate Taskfile yml file. Examples of metadata would be the current git branch, git sha and github pr number. This metadata is necessary to allow for fleet-mcp workflows like PR tracking to work."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Agent Workspace Context (Priority: P1)

Fleet operators need to quickly identify which git branch and commit each agent is working on without manually inspecting individual workspaces. This allows them to track progress, identify which agents are working on which features, and coordinate work across multiple agents.

**Why this priority**: This is the core value proposition - enabling fleet operators to see what each agent is working on at a glance. Without this, the feature has no value.

**Independent Test**: Can be fully tested by querying a single agent's metadata through the show_agent tool and verifying that git branch, commit SHA, and other workspace metadata are returned accurately.

**Acceptance Scenarios**:

1. **Given** an agent is running in a workspace on branch "feature-123", **When** an operator queries the agent details, **Then** the response includes the current git branch "feature-123"
2. **Given** an agent's workspace has uncommitted changes, **When** an operator queries the agent details, **Then** the response includes the current commit SHA
3. **Given** an agent is working on a pull request, **When** an operator queries the agent details, **Then** the response includes the PR number if available

---

### User Story 2 - Track Multiple Agents at Once (Priority: P2)

Fleet operators managing multiple agents need to see workspace metadata for all agents in a single list view. This enables quick identification of which agents are working on which features, which PRs are in progress, and overall fleet status.

**Why this priority**: This builds on P1 to provide fleet-wide visibility, which is essential for managing multiple agents but depends on the single-agent metadata working first.

**Independent Test**: Can be tested by listing all agents through list_agents tool and verifying that each agent's metadata is included in the response.

**Acceptance Scenarios**:

1. **Given** multiple agents running on different branches, **When** an operator lists all agents, **Then** each agent's entry includes its workspace metadata (branch, SHA, PR number)
2. **Given** a mix of agents with and without PR associations, **When** an operator lists all agents, **Then** PR number is shown for agents with PRs and omitted for those without
3. **Given** an agent's workspace metadata cannot be retrieved, **When** an operator lists all agents, **Then** that agent's metadata fields show appropriate status indicators

---

### User Story 3 - PR Workflow Integration (Priority: P3)

Fleet operators need to correlate agents with their GitHub pull requests to track PR progress, review status, and coordinate code reviews across the fleet. This enables workflows like "show me all agents working on PRs that need review" or "which agent is working on PR #123".

**Why this priority**: This enables advanced workflows but requires the foundational metadata retrieval from P1 and P2 to be working first.

**Independent Test**: Can be tested by creating an agent in a workspace with an associated PR, querying the agent, and verifying the PR number is correctly extracted and returned.

**Acceptance Scenarios**:

1. **Given** an agent's workspace is linked to PR #456, **When** an operator queries the agent, **Then** the metadata includes PR number 456
2. **Given** an agent's workspace has no associated PR, **When** an operator queries the agent, **Then** the PR number field is absent or null
3. **Given** multiple agents working on the same PR, **When** an operator filters agents by PR number, **Then** all relevant agents are identified

---

### Edge Cases

- What happens when the workspace's git repository is in a detached HEAD state?
- How does the system handle workspaces that are not git repositories?
- What happens when git commands fail or timeout while gathering metadata?
- How does the system handle workspaces with corrupted git metadata?
- What happens when the Taskfile.yml defining metadata collection is missing or malformed?
- How does the system handle metadata fields that cannot be determined (e.g., no PR associated)?
- What happens when the workspace is in the middle of a rebase or merge conflict?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST extend the show_agent tool to return workspace metadata in the response
- **FR-002**: System MUST extend the list_agents tool to return workspace metadata for each agent in the response
- **FR-003**: System MUST define metadata collection commands in a separate Taskfile YAML file
- **FR-004**: Metadata MUST include current git branch name
- **FR-005**: Metadata MUST include current git commit SHA
- **FR-006**: Metadata MUST include GitHub pull request number when available
- **FR-007**: System MUST handle cases where metadata cannot be retrieved without failing the entire request
- **FR-008**: System MUST execute metadata collection commands within the context of the agent's workspace
- **FR-009**: Metadata collection MUST not modify the workspace state (read-only operations)
- **FR-010**: System MUST support extensible metadata fields defined in the Taskfile
- **FR-011**: System MUST handle workspaces that are not git repositories gracefully
- **FR-012**: Metadata retrieval MUST complete within a reasonable timeout to avoid blocking agent queries

### Key Entities

- **Workspace Metadata**: Represents contextual information about an agent's workspace, including:
  - Git branch name (string, current branch the workspace is on)
  - Git commit SHA (string, current commit hash)
  - Pull request number (optional integer, associated GitHub PR)
  - Additional extensible fields as defined in Taskfile

- **Taskfile Configuration**: Defines the commands and structure for collecting workspace metadata:
  - Metadata field names
  - Commands to execute for each field
  - Timeout settings
  - Error handling behavior

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Operators can view complete workspace metadata (branch, SHA, PR) for any agent in under 3 seconds
- **SC-002**: Metadata retrieval succeeds for 99% of queries when workspace is in valid git state
- **SC-003**: Fleet operators can identify which agents are working on which PRs through a single list query
- **SC-004**: System correctly handles and reports status for 100% of edge cases (non-git repos, detached HEAD, git errors) without crashing
- **SC-005**: Metadata collection adds less than 2 seconds overhead to agent query response time
- **SC-006**: Operators can extend metadata fields by modifying only the Taskfile without code changes

## Assumptions

- The fleet-mcp server has access to execute commands within agent workspaces
- Agent workspaces are typically git repositories (though non-git workspaces must be handled gracefully)
- GitHub is the primary version control platform (PR number refers to GitHub PRs)
- Operators have permissions to read workspace metadata
- The Taskfile.yml format is standard YAML and follows Task/Taskfile conventions
- Metadata is collected on-demand when agents are queried (not cached or pre-collected)
- Workspace metadata changes relatively infrequently compared to query frequency
