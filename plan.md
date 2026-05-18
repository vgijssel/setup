CHANGE: no longer running windmill, but restate instead! SQL transformations will be done using SQLmesh. Claude Code CLI will run inside Alibaba Opensandbox AI sandbox containers. Coder will be removed as everything agentic will move the OpenSandbox. "zero token" / "phantom token" pattern is implemented by running https://getkloak.io/ inside a kubernetes cluster.


# Agentic Workflow Platform — Build Plan

End-to-end goal: ingest WhatsApp messages via Matrix, stream them through schema-validated Kafka into RisingWave, expose scoped views to a Claude-Agent-SDK-driven Windmill workflow via a ContextForge MCP gateway, and write outputs to AnyType.

## Platform shape: one `agentic` platform, two-directory split

All six capabilities deploy into a **single shared platform** named `agentic`, mirroring the existing `secrets-proxy` / `secrets-proxy-infra` pattern:

```
apps/agentic-infra/                # cluster: enigma  (root / cozystack control plane)
├── tenant/                        # cozystack Tenant CR → owns tenant-prod-agentic namespace
├── vcluster/                      # vCluster control plane (api-agentic-infra-vcluster.enigma.vgijssel.nl)
└── kafka/                         # cozystack-managed Kafka CR (NOT inside the vCluster)

apps/agentic/                      # cluster: agentic-vcluster  (inside the platform vCluster)
├── apicurio/                      # schema registry, talks to Kafka across the tenant boundary
├── synapse/                       # Matrix homeserver
├── whatsapp-bridge/               # mautrix-whatsapp (or chosen alternative)
├── bento/                         # Matrix → Kafka pipeline
├── risingwave/                    # streaming SQL + scoped views + agent_reader user
├── contextforge/                  # MCP gateway
└── windmill/                      # agentic workflow runtime
```

### Why one platform, not six

All six capabilities form one cohesive data plane (records flow through every layer end-to-end). Six separate platforms would mean six vClusters that all need to talk to each other and six tenant boundaries to traverse — pure overhead with no isolation benefit. The `secrets-proxy` precedent (one platform, multiple apps inside it) is the right shape here.

### Why Kafka lives at infra level (outside the vCluster)

CozyStack ships a managed `Kafka` CR that provisions a Strimzi-backed cluster in the tenant-root namespace. Running it via the cozystack CR (rather than installing Strimzi by hand inside the vCluster) gets us: cozystack-managed upgrades, durable storage already wired through the platform, and integration with the tenant's networking. The trade-off is that vCluster apps must reach Kafka via cross-namespace DNS / synced Services — that's a one-time wiring concern handled in change #1's `vcluster/values.yaml` (`sync.fromHost.services`).

## Capability split & dependency order

Each row is one OpenSpec change. The boundary is "this capability lands in a demonstrably-working state on its own and freezes a contract the next layer can rely on".

| # | Change id | Adds to `agentic-infra/` | Adds to `agentic/` | Hard deps | Freezes contract |
|---|---|---|---|---|---|
| 1 | `add-kafka-schema-platform` | `tenant/`, `vcluster/`, `kafka/` | `apicurio/` | — | Platform skeleton, Kafka bootstrap (cross-namespace), Apicurio URL, AVRO+BACKWARD convention |
| 2 | `add-matrix-whatsapp-ingest` | — | `synapse/`, `whatsapp-bridge/` | 1 (vCluster only) | Matrix homeserver URL, bridge bot account, room IDs |
| 3 | `add-bento-matrix-to-kafka` | — | `bento/` | 1, 2 | WhatsApp Kafka topic + AVRO schema |
| 4 | `add-risingwave-streaming` | — | `risingwave/` | 1 (3 for real data) | Allowlisted view names, `agent_reader` SQL user |
| 5 | `add-contextforge-mcp-gateway` | — | `contextforge/` | 4 | Single MCP endpoint, per-client auth, tool surface |
| 6 | `add-windmill-agentic-workflows` | — | `windmill/` | 5 | — (top of stack) |

Suggested execution order: **1 → (2 and 4 in parallel) → 3 → 5 → 6.** Change #1 must merge first because it bootstraps the platform skeleton everything else attaches to.

### Pattern every prompt enforces (from `apps/CLAUDE.md` + secrets-proxy)

- `apps/agentic-infra/<thing>/config.yaml` uses `cluster: enigma`, `appType: tenant|infra`, `platform: agentic`, `namespace: tenant-prod-agentic` (or `tenant-prod` for the Tenant itself), `createNamespace: false` (the Tenant owns namespace creation — never self-created), `prUpdateNamespace: true` for infra (PRs render `tenant-prod-agenticpr<N>`), `prOverrides` for any per-PR identifiers
- `apps/agentic/<thing>/config.yaml` uses `cluster: agentic-vcluster`, `appType: apps`, `platform: agentic`, `createNamespace: false` (no `namespace/` chart, no per-app namespace creation), `prUpdateCluster: true` (so PRs target `agenticpr<N>-vcluster`), `namespace: default` (or another namespace already provisioned by the Tenant inside the vCluster)
- **Namespaces are only ever created by a cozystack `Tenant` CR.** No `namespace/` chart, no `createNamespace: true`, no inline `kind: Namespace` manifests in any app.
- Each app is an umbrella Helm chart: `Chart.yaml` depends on a vendored upstream under `third_party/vendir/charts/<name>` (exact `version:` pin), `Chart.lock` committed
- ArgoCD ApplicationSets at `apps/argocd-apps/manifests/applicationset-prod.yaml` and `applicationset-pr.yaml` discover everything via `apps/agentic*/*/config.yaml`
- PR previews require both `values-pr.yaml` (at minimum `{}`) and label `apps:agentic` (or `apps:agentic-infra`) on the PR
- All secrets via 1Password / External Secrets — never inlined in committed values

## How to use this plan

Paste each `/opsx:propose` prompt below into a fresh Claude Code instance, in dependency order. The skill will create `openspec/changes/<change-id>/{proposal.md,design.md,tasks.md,specs/<capability>/spec.md}`.

---

## Prompt 1 — Platform skeleton + cozystack Kafka + Apicurio

```
/opsx:propose "Add a `kafka-schema-platform` capability that bootstraps the shared `agentic` platform (mirroring `apps/secrets-proxy` + `apps/secrets-proxy-infra`) and stands up cozystack-managed Kafka plus Apicurio Registry on it, with AVRO as the canonical wire format and enforced schema evolution.

Why: this change creates the platform skeleton every later capability attaches to. Bento, RisingWave, ContextForge, and Windmill all need typed Kafka records and a single source of truth for schema evolution; Apicurio + Kafka must land together so producers never publish raw JSON we'd later have to migrate.

Platform layout to create (study `apps/secrets-proxy-infra/{tenant,vcluster}` and `apps/secrets-proxy/onepassword-operator` as the precedent). **Namespaces are created exclusively by the cozystack `Tenant` CR — no `namespace/` chart, no `createNamespace: true` on any app, no inline `kind: Namespace` manifests.**

`apps/agentic-infra/` (cluster: enigma):
- `tenant/` — cozystack `Tenant` CR `agentic` (this is the SOLE creator of the `tenant-prod-agentic` namespace). `appType: tenant`, `platform: agentic`, `prOverrides.tenant.name: agentic%s` so PRs get `tenant-prod-agenticpr<N>`.
- `vcluster/` — vCluster via vendored `third_party/vendir/charts/vcluster`. Ingress host `api-agentic-infra-vcluster.enigma.vgijssel.nl`, PR override `api-agentic-vcluster-%s.enigma.vgijssel.nl`. `appType: infra`, `createNamespace: false` (Tenant owns it), `prUpdateNamespace: true`. **In `vcluster/values.yaml` configure `sync.fromHost.services` (or sync the Kafka bootstrap Secret) so vCluster apps can reach the Kafka bootstrap Service in the tenant-root namespace.**
- `kafka/` — **use cozystack's native Kafka CRD** (the cozystack-managed offering, which provisions a Strimzi-backed cluster underneath). The CR lives in `tenant-prod-agentic` at root cluster level; **not inside the vCluster**. Persistent storage, replication.factor>=2, in-cluster bootstrap Service. `appType: infra`, `cluster: enigma`, `createNamespace: false` (Tenant owns the namespace), `prUpdateNamespace: true`.

`apps/agentic/` (cluster: agentic-vcluster):
- `apicurio/` — Apicurio Registry as an umbrella Helm chart vendoring the upstream chart via `third_party/vendir/charts/apicurio-registry`. Persistent backend (Kafka topic-storage against the cozystack Kafka, or a Postgres dependency — design.md picks one with rationale). REST endpoint `/apis/registry/v2`. `appType: apps`, `cluster: agentic-vcluster`, `createNamespace: false` (deploys into a namespace already present inside the vCluster — typically `default`), `prUpdateCluster: true`. State survives pod restart.

Capability requirements to lock in the spec:
- Kafka bootstrap reachable from inside the vCluster via the synced Service. `kafka-topics.sh --list` works from a vCluster pod within 5s. Broker pod restart does not lose committed offsets when replication.factor>=2.
- Apicurio health endpoint returns 200; an artifact registered before a pod kill is still retrievable by globalId after.
- AVRO is the canonical value format for all domain topics. Producers MUST use registry-aware AVRO serdes (Apicurio Confluent-compatible API). Records start with the AVRO magic byte + schema ID; no raw JSON on the wire. A consumer without registry access fails deserialization with a clear error.
- Each topic's schema artifact has an explicit compatibility level (default BACKWARD). Adding an optional field with a default succeeds; removing a required field or changing a type is rejected with HTTP 409 and the existing latest version is unchanged.
- AVRO schemas live in Git under `apps/agentic/apicurio/schemas/<topic>-value.avsc` and are synced into Apicurio by a deterministic init-job/CI step. Wiping Apicurio's persistent storage and re-running the sync rebuilds every artifact identically from `main` with matching artifactIds.

Other constraints:
- All secrets via 1Password / External Secrets. No tokens in `values.yaml`.
- ArgoCD ApplicationSets at `apps/argocd-apps/manifests/applicationset-{prod,pr}.yaml` must learn the new `apps:agentic-infra` and `apps:agentic` PR generators.
- PR previews: every chart has `values-pr.yaml` (at minimum `{}`).

Produce: change id `add-kafka-schema-platform`, capability id `kafka-schema-platform`. Include proposal.md, design.md (decisions: which cozystack Kafka CR variant, Apicurio storage backend, vCluster→Kafka connectivity mechanism, schema-sync job mechanism, compatibility default, registry auth), tasks.md, specs/kafka-schema-platform/spec.md."
```

---

## Prompt 2 — Synapse + WhatsApp bridge (vCluster apps)

```
/opsx:propose "Add a `matrix-whatsapp-ingest` capability that deploys Synapse and a WhatsApp↔Matrix bridge as apps inside the existing `agentic` platform vCluster, so a paired WhatsApp account's messages appear in Matrix rooms in real time. This is the source layer for the WhatsApp-driven agentic pipeline.

Hard dep: `add-kafka-schema-platform` is merged (the `agentic` platform skeleton — tenant, namespace, vcluster — already exists, mirroring `apps/secrets-proxy-infra`).

Where it lives (mirrors `apps/secrets-proxy/onepassword-operator/` precedent):
- `apps/agentic/synapse/` — umbrella chart vendoring upstream (e.g. `ananace-charts/matrix-synapse` via `third_party/vendir`).
- `apps/agentic/whatsapp-bridge/` — umbrella chart vendoring the chosen bridge (e.g. mautrix-whatsapp).
- Both use `appType: apps`, `cluster: agentic-vcluster`, `platform: agentic`, `createNamespace: false`, `prUpdateCluster: true`, `prUpdateNamespace: false`. **No `kind: Namespace` manifests — deploy into a namespace already provisioned by the Tenant inside the vCluster (typically `default`).** `values.yaml` has prod config; `values-pr.yaml` carries lightweight PR overrides (single replica, smaller storage, unique hostnames via `prNumber`).

Capability requirements:
- Synapse reachable in-cluster on its Service AND from outside on a stable hostname under `*.enigma.vgijssel.nl` (so WhatsApp's QR-pairing flow can complete). `/_matrix/client/versions` returns 200 over TLS. Synapse Postgres / SQLite backend on a PVC; survives pod restart.
- WhatsApp bridge runs in the same vCluster, registered with the local Synapse via its appservice registration. Bridge bot user (e.g. `@whatsappbot:<server>`) is online and reachable from a Matrix client. After QR-pairing, an inbound WhatsApp message appears within 10 seconds in the corresponding Matrix room as `m.room.message`.
- Bridge state (session keys, pairing, room mappings, crypto state) persists across pod restarts and rescheduling — no re-pairing required after a pod kill.
- All bridge secrets (`as_token`, `hs_token`, DB creds, encryption keys) come from 1Password via External Secrets. `git grep -E '(as_token|hs_token|password):' apps/agentic/` returns no plaintext.
- PR generator on `applicationset-pr.yaml` already has the `apps:agentic` matrix entry from change #1 — no ApplicationSet changes needed unless a new sync option is required.

Produce: change id `add-matrix-whatsapp-ingest`, capability id `matrix-whatsapp-ingest`. Include proposal.md, design.md (decisions: choice of Synapse chart + Postgres-vs-SQLite, choice of bridge implementation, federation on/off, ingress hostname pattern, bridge encryption mode, PVC sizing, secrets layout), tasks.md, specs/matrix-whatsapp-ingest/spec.md."
```

---

## Prompt 3 — Bento pipeline (Matrix → Kafka, AVRO)

```
/opsx:propose "Add a `whatsapp-kafka-pipeline` capability that deploys Bento as an app in the existing `agentic` platform vCluster, consuming Matrix events from the local Synapse and producing them onto a Kafka topic on the cozystack-managed Kafka cluster (running at infra level, outside the vCluster), AVRO-serialized via the Apicurio-registered schema.

Hard deps: `add-kafka-schema-platform` (Kafka bootstrap reachable from inside the vCluster via synced Service, Apicurio URL, AVRO+BACKWARD convention) and `add-matrix-whatsapp-ingest` (Synapse + paired bridge bot whose rooms Bento can read).

Where it lives:
- `apps/agentic/bento/` — umbrella chart vendoring upstream Bento via `third_party/vendir`. `appType: apps`, `cluster: agentic-vcluster`, `platform: agentic`, `createNamespace: false` (deploys into a Tenant-provisioned namespace inside the vCluster — no inline `kind: Namespace`), `prUpdateCluster: true`. `values.yaml` and `values-pr.yaml` follow precedent.

Capability requirements:
- Bento Deployment running continuously, self-healing on failure. Input: Matrix events from Synapse (appservice push, /sync long-poll with a service account, or a webhook bot — design.md picks one with rationale). Output: a Kafka topic on the cozystack Kafka cluster, reached via the bootstrap Service synced from the tenant-root namespace.
- An inbound WhatsApp message ends up on the Kafka topic within 15 seconds end-to-end (counterparty → bridge → Matrix room → Bento → topic). A `kafka-console-consumer` from a vCluster pod sees it.
- Bento persists its Matrix sync token (or equivalent input cursor) so a pod restart resumes without re-emitting already-published messages and without skipping new ones.
- Producer uses registry-aware AVRO serdes against Apicurio. Records start with the AVRO magic byte + schema ID. Records that fail schema validation route to a dead-letter destination — never the main topic as malformed bytes.
- The AVRO schema for the topic includes (at minimum): `matrix_event_id`, `room_id`, `sender`, `timestamp`, plus message body fields. First-class typed columns, not free-form headers.
- Bento config (inputs, processors, outputs, registry URL, topic name) lives in Git under `apps/agentic/bento/` as values/ConfigMap. Secrets via 1Password / External Secrets.

The schema for the WhatsApp event topic is committed as part of THIS change under `apps/agentic/apicurio/schemas/<topic>-value.avsc` (the schema-sync job created in change #1 picks it up automatically).

Produce: change id `add-bento-matrix-to-kafka`, capability id `whatsapp-kafka-pipeline`. Include proposal.md, design.md (decisions: Matrix input mode, sync-token storage location, exact AVRO field set, DLQ destination, replica count for hot/cold), tasks.md, specs/whatsapp-kafka-pipeline/spec.md."
```

---

## Prompt 4 — RisingWave + scoped views

```
/opsx:propose "Add a `risingwave-streaming-views` capability that deploys RisingWave as an app inside the existing `agentic` platform vCluster, consumes the WhatsApp Kafka topic with AVRO+Apicurio decoding, exposes use-case materialized views, and creates a least-privilege SQL user that can read only an allowlist of those views.

Hard dep: `add-kafka-schema-platform` (Kafka + Apicurio + the platform skeleton). Becomes useful end-to-end once `whatsapp-kafka-pipeline` is producing real data, but RisingWave SOURCEs and views can be authored against the schema before Bento exists.

Where it lives:
- `apps/agentic/risingwave/` — umbrella chart vendoring the upstream RisingWave chart via `third_party/vendir`. `appType: apps`, `cluster: agentic-vcluster`, `platform: agentic`, `createNamespace: false` (deploys into a Tenant-provisioned namespace inside the vCluster — no inline `kind: Namespace`), `prUpdateCluster: true`. PR previews use a smaller compute footprint via `values-pr.yaml`.

Capability requirements:
- RisingWave deployed (meta + compute + frontend + persistence backend — MinIO or an existing object store, design.md picks one). Postgres-compatible SQL endpoint reachable in-cluster. State survives meta/compute pod restarts: existing sources and materialized views still produce rows where they left off.
- One or more `SOURCE` declarations consume Kafka topics with `format avro` + Apicurio (Confluent-compatible) schema-registry config. The Kafka bootstrap is the cozystack-Kafka Service reachable from inside the vCluster via the host-sync set up in change #1.
- Adding a backward-compatible AVRO field in Apicurio makes it queryable via `SELECT <new_field>` without dropping/recreating the source.
- For each downstream use case (`summarize_unread_chats`, `tag_action_items`, etc.) a `MATERIALIZED VIEW` exposes only the columns that use case needs. New rows on the underlying topic flow into the view incrementally without manual REFRESH.
- A dedicated SQL user `agent_reader` exists with `SELECT` on a named allowlist of materialized views and **no** privileges on raw sources or other views. Credentials in 1Password / External Secrets so the MCP gateway can pick them up.
  - SELECT on allowlisted views succeeds.
  - SELECT on raw sources or unlisted views is denied.
  - INSERT/UPDATE/DELETE/CREATE/DROP all denied.
- Every materialized view DDL and every GRANT is SQL committed under `apps/agentic/risingwave/sql/`, applied by a deterministic apply-job on deploy. PR diff shows the agent's exact accessible surface.

Produce: change id `add-risingwave-streaming`, capability id `risingwave-streaming-views`. Include proposal.md, design.md (decisions: persistence backend, meta/compute sizing, schema-on-source vs schema-on-table, SQL apply-job mechanism, agent_reader credential rotation), tasks.md, specs/risingwave-streaming-views/spec.md."
```

---

## Prompt 5 — ContextForge MCP gateway

```
/opsx:propose "Add a `contextforge-mcp-gateway` capability that deploys ContextForge as the single in-cluster MCP gateway inside the existing `agentic` platform vCluster, fronting a RisingWave-read MCP server scoped to the `agent_reader` user's allowlisted views and an AnyType-write MCP server scoped to a configured space/page set. All agentic-workflow MCP traffic must go through ContextForge — direct connections to backend MCP servers are blocked.

Hard dep: `add-risingwave-streaming` (provides the `agent_reader` user, the allowlisted views, and the credential the gateway connects with).

Where it lives:
- `apps/agentic/contextforge/` — umbrella chart vendoring the upstream ContextForge chart via `third_party/vendir`. `appType: apps`, `cluster: agentic-vcluster`, `platform: agentic`, `createNamespace: false` (deploys into a Tenant-provisioned namespace inside the vCluster — no inline `kind: Namespace`), `prUpdateCluster: true`. PR previews via `values-pr.yaml`.

Capability requirements:
- ContextForge deployed; single MCP entrypoint reachable in-cluster. Authenticated MCP `initialize` returns a tool list scoped to the calling principal. Anonymous access disabled. Per-client revocable credentials (token / mTLS / OIDC) — revoking one client's token cuts off only that client.
- A NetworkPolicy in the vCluster denies workloads from reaching backend MCP server Services directly; ContextForge is the only path. (Take care to make this work under the cozystack vCluster's networking model — design.md must call out the policy mechanism.)
- RisingWave MCP server connects to RisingWave **as `agent_reader` only**. Tool surface is allowlisted view names, not arbitrary SELECT. If a parameterized-query tool is exposed, it allowlists view names, blocks DDL, enforces a hard row-limit.
  - Allowlisted view → returns rows.
  - Unlisted view name OR a SQL string referencing raw sources → refused with auth error, not forwarded to RisingWave.
- AnyType MCP server writes only to a configured space/page set. AnyType backend creds held by the gateway (1Password / External Secrets), never by the agent. Writes outside the configured scope refused at the gateway, never sent upstream.
- Every tool invocation produces a structured audit log entry: principal/client id, tool name, redacted parameter summary, upstream backend, outcome, duration. Logs ship to the cluster's existing log destination.

Produce: change id `add-contextforge-mcp-gateway`, capability id `contextforge-mcp-gateway`. Include proposal.md, design.md (decisions: auth mechanism, NetworkPolicy mechanism under cozystack vCluster networking, RisingWave tool shape — fixed views vs parameterized, AnyType scope model, audit-log destination), tasks.md, specs/contextforge-mcp-gateway/spec.md."
```

---

## Prompt 6 — Windmill + Claude Agent SDK

```
/opsx:propose "Add a `windmill-agentic-workflows` capability that deploys Windmill (server + workers + Postgres dependency) as an app inside the existing `agentic` platform vCluster, wires a workflow that triggers off a RisingWave materialized view, and runs a Claude Agent SDK step whose ONLY MCP servers are obtained via the ContextForge gateway. The canonical end-to-end workflow reads context from a RisingWave view via MCP and writes output to AnyType via MCP.

Hard dep: `add-contextforge-mcp-gateway` (single MCP endpoint + per-client credential), which transitively requires the lower stack.

Where it lives:
- `apps/agentic/windmill/` — umbrella chart vendoring upstream Windmill via `third_party/vendir`. `appType: apps`, `cluster: agentic-vcluster`, `platform: agentic`, `createNamespace: false` (deploys into a Tenant-provisioned namespace inside the vCluster — no inline `kind: Namespace`), `prUpdateCluster: true`. UI ingress on a stable hostname under `*.enigma.vgijssel.nl`.

Capability requirements:
- Windmill deployed (server + workers + Postgres). UI reachable on a stable hostname with valid TLS; login succeeds. A trivial Python script runs to completion via a worker. Postgres on a PVC; survives pod restart with state intact. Decision (in design.md): use Windmill chart's bundled Postgres OR provision a separate Postgres (cozystack-managed at infra level if appropriate).
- Windmill is triggered by changes in a designated RisingWave materialized view — either via RisingWave's native sink to a transport Windmill consumes (Kafka/webhook/Redis stream) OR via a Windmill scheduled trigger polling a `_changelog` view. design.md picks one with rationale. New rows trigger exactly one workflow run within ≤30 seconds, identifiable by the row's primary key.
- Triggered runs are idempotent: replaying the same trigger row (e.g. after RisingWave state replay) does NOT cause duplicate externally-visible side effects, keyed off the row's primary key.
- The agent step uses the Claude Agent SDK configured with MCP servers obtained ONLY via the ContextForge endpoint (single URL + credential). Tool-list logged on workflow start contains zero entries pointing at backend MCP servers directly.
- End-to-end happy path: counterparty WhatsApp message → Synapse → Bento → Kafka → RisingWave allowlisted view → Windmill trigger → agent reads context via ContextForge RisingWave-read tool → agent produces output → agent writes to configured AnyType page via ContextForge AnyType-write tool → page reflects the update.
- ContextForge authorization errors mid-workflow mark the run failed (not 'completed with warnings') and surface the rejected tool + principal in the error message.
- Workflow definition (scripts, prompts, MCP endpoint, model id) lives in Git under `apps/agentic/windmill/`, deployed via Windmill GitSync or equivalent declarative path. Anthropic API key, ContextForge credential, any other secrets via 1Password / External Secrets, referenced by Windmill variable name only. `git grep -E '(sk-ant-|sk_live_|password):' apps/agentic/windmill/` returns nothing.

Produce: change id `add-windmill-agentic-workflows`, capability id `windmill-agentic-workflows`. Include proposal.md, design.md (decisions: bundled-Postgres vs separate, RisingWave→Windmill trigger transport, idempotency key strategy, Claude model id, GitSync vs declarative apply, secret-rotation story), tasks.md, specs/windmill-agentic-workflows/spec.md."
```
