# Feature Specification: Internal DNS Service for Kubernetes Ingresses

**Feature Branch**: `001-build-a-dns`
**Created**: 2025-10-02
**Status**: Draft
**Input**: User description: "Build a DNS service which enables lookups of Kubernetes ingresses. Every ingress needs to be queryable and reachable through the DNS service. The DNS records should be internal only and not published on a managed service like Cloudflare. This is necessary to enable routing of Kubernetes services when connected to the Tailnet using Tailscale."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## Clarifications

### Session 2025-10-02
- Q: Which Kubernetes namespaces should the DNS service discover ingresses from? → A: All namespaces in the cluster
- Q: What should happen when two ingresses in different namespaces claim the same hostname? → A: Both fail; require unique hostnames
- Q: What is the acceptable DNS query response time target? → A: < 500ms (acceptable for internal)
- Q: Within what time period should a newly created ingress become queryable via DNS? → A: Within 2 minutes (eventual consistency)
- Q: Should ingresses use arbitrary hostnames or a specific domain suffix pattern? → A: Must use specific suffix (e.g., *.internal.domain)

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a developer or service connected to the Tailscale network, I need to resolve DNS names for Kubernetes ingresses so that I can access internal services by hostname rather than IP address. The DNS service automatically discovers all ingresses in the cluster and makes them available for lookup, ensuring that anyone connected to the Tailnet can reliably route to these services.

### Acceptance Scenarios
1. **Given** a Kubernetes ingress exists with hostname "app.internal.example.com", **When** a client connected to the Tailnet performs a DNS lookup for "app.internal.example.com", **Then** the DNS service returns the correct IP address for routing to that ingress
2. **Given** a new ingress is created in the Kubernetes cluster, **When** the ingress becomes active, **Then** the DNS service automatically makes it queryable within 2 minutes
3. **Given** an ingress is deleted from the Kubernetes cluster, **When** the deletion is complete, **Then** the DNS service stops resolving that hostname within 2 minutes
4. **Given** multiple ingresses exist in the cluster, **When** a client queries the DNS service, **Then** all ingress hostnames are resolvable
5. **Given** a client is not connected to the Tailscale network, **When** they attempt to query the DNS service, **Then** [NEEDS CLARIFICATION: should queries fail, timeout, or be rejected? Security posture not specified]

### Edge Cases
- What happens when an ingress hostname conflicts with an existing DNS record? The system must reject the conflicting ingress and maintain global hostname uniqueness across all namespaces.
- How does the system handle ingresses with multiple hostnames or wildcard domains?
- What happens when the Kubernetes cluster is unreachable or the DNS service loses connectivity?
- How does the system handle DNS queries for non-existent hostnames?
- What happens when an ingress is updated (hostname change, IP change)?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST automatically discover all Kubernetes ingresses in the cluster
- **FR-002**: System MUST resolve DNS queries for all ingress hostnames
- **FR-003**: System MUST provide DNS records that are internal-only and not published to external DNS services
- **FR-004**: System MUST integrate with Tailscale network to make DNS resolution available to Tailnet clients
- **FR-005**: System MUST update DNS records within 2 minutes when ingresses are created, modified, or deleted
- **FR-006**: System MUST return the correct routing address for each ingress hostname
- **FR-007**: System MUST handle DNS queries only for clients connected to the Tailscale network
- **FR-008**: System MUST respond to DNS queries within 500 milliseconds
- **FR-009**: System MUST handle [NEEDS CLARIFICATION: scale not specified - how many ingresses should be supported?]
- **FR-010**: System MUST [NEEDS CLARIFICATION: logging/monitoring requirements not specified - should DNS queries be logged? Should service health be monitored?]
- **FR-011**: System MUST discover and resolve ingresses from all namespaces in the cluster
- **FR-012**: System MUST only resolve ingress hostnames that use a specific internal domain suffix pattern
- **FR-013**: System MUST reject ingresses with duplicate hostnames across namespaces and require globally unique hostnames
- **FR-014**: System MUST [NEEDS CLARIFICATION: high availability not specified - should the DNS service have redundancy? What happens during DNS service downtime?]

### Key Entities *(include if feature involves data)*
- **Ingress**: A Kubernetes ingress resource that exposes HTTP/HTTPS routes to services within the cluster. Key attributes include hostname(s), routing target address, namespace, and active/inactive status.
- **DNS Record**: A mapping between an ingress hostname and its routing address, maintained by the DNS service for query resolution.
- **Tailnet Client**: A device or service connected to the Tailscale network that can perform DNS lookups against the internal DNS service.

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [x] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed (WARN: Spec has uncertainties)

---
