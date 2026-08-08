# OpenBao NetBird Plugin — Specification

## 1. Objective

Build a custom OpenBao secret engine plugin (Go) that dynamically generates and manages NetBird credentials. The plugin replaces the current manual token-creation workflows with on-demand, lease-tracked, auto-rotating secrets that are hard-revoked in NetBird when leases expire.

### Target Users

- **Platform operators** — request credentials via OpenBao policies (ExternalSecrets, Crossplane, scripts)
- **Kubernetes workloads** — consume generated secrets via ESO → Kubernetes Secrets
- **Device provisioning** (PiKVM) — pyinfra reads setup keys from OpenBao at deploy time

### Success Criteria

- All three token types (PAT, proxy token, setup key) are mintable on-demand via `bao read netbird/<path>`
- Leases are tracked; expired credentials are deleted in NetBird via API
- Existing consumers (`netbird-mgmt-api-key`, `netbird-proxy-token`, pyinfra `kv/pikvm:netbird_setup_key`) migrate to plugin paths with no downstream changes
- Plugin binary deployed as a sidecar/init-container in the OpenBao pod

---

## 2. Token Types & API Paths

### 2.1 Personal Access Token (PAT)

| Field | Value |
|-------|-------|
| **Read path** | `netbird/pat/:name` |
| **Purpose** | Admin-level management API access for operators and Terraform |
| **NetBird API** | `POST /api/users/:user_id/tokens` |
| **Lease** | Configurable TTL (default 720h / 30d), renewable |
| **Revocation** | `DELETE /api/users/:user_id/tokens/:token_id` |
| **Returned fields** | `token_id`, `access_token` |

**Configuration** (written to `netbird/config/pat/:name`):

```json
{
  "user_id": "abc-123",
  "token_name_prefix": "openbao-secret-operator",
  "ttl": "720h",
  "max_ttl": "8760h"
}
```

### 2.2 Reverse Proxy Token

| Field | Value |
|-------|-------|
| **Read path** | `netbird/proxy-token/:name` |
| **Purpose** | Authenticate BYOP reverse-proxy instances to NetBird management |
| **NetBird API** | `POST /api/reverse-proxies/proxy-tokens` |
| **Lease** | Configurable TTL (default 8760h / 1 year), renewable |
| **Revocation** | `DELETE /api/reverse-proxies/proxy-tokens/:token_id` |
| **Returned fields** | `token_id`, `token` |

**Configuration** (written to `netbird/config/proxy-token/:name`):

```json
{
  "proxy_name": "secret.vgijssel.nl",
  "ttl": "8760h",
  "max_ttl": "43800h"
}
```

### 2.3 Setup Key

| Field | Value |
|-------|-------|
| **Read path** | `netbird/setup-key/:name` |
| **Purpose** | Enroll devices (PiKVM, standalone peers) into the NetBird mesh |
| **NetBird API** | `POST /api/setup-keys` |
| **Lease** | Configurable TTL (default 168h / 7d), renewable |
| **Revocation** | `DELETE /api/setup-keys/:key_id` |
| **Returned fields** | `key_id`, `setup_key`, `expires_at` |

**Configuration** (written to `netbird/config/setup-key/:name`):

```json
{
  "name_prefix": "openbao-pikvm",
  "type": "reusable",
  "ephemeral": false,
  "auto_groups": ["homelab", "pikvm"],
  "usage_limit": 0,
  "ttl": "168h",
  "max_ttl": "720h"
}
```

---

## 3. Plugin Configuration

### 3.1 Root Configuration (`netbird/config/root`)

Written once at mount time to bootstrap the plugin:

```json
{
  "api_url": "https://api.netbird.io",
  "service_account_token": "<admin-scoped NetBird service account token>"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `api_url` | Yes | NetBird management API base URL |
| `service_account_token` | Yes | Admin-scoped service account token for all API operations |

### 3.2 Role Configuration

Each token type has named roles at `netbird/config/<type>/:name` that define generation parameters. Reading `netbird/<type>/:name` uses the matching role config to mint a credential.

---

## 4. Project Structure

```
libs/openbao-netbird-plugin/
├── moon.yml                        # Moon tasks (build, test, docker)
├── Dockerfile                      # Multi-stage build → scratch binary
└── src/
    ├── main.go                     # Plugin entry point (ServeMultiplex)
    ├── go.mod
    ├── go.sum
    ├── backend.go                  # Backend factory, mount setup, paths registration
    ├── path_config_root.go         # Root config CRUD (/config/root)
    ├── path_config_pat.go          # PAT role config CRUD (/config/pat/:name)
    ├── path_config_proxy_token.go  # Proxy token role config CRUD
    ├── path_config_setup_key.go    # Setup key role config CRUD
    ├── path_pat.go                 # PAT credential generation + lease
    ├── path_proxy_token.go         # Proxy token generation + lease
    ├── path_setup_key.go           # Setup key generation + lease
    ├── client.go                   # NetBird HTTP API client
    ├── client_test.go              # Client unit tests (mock HTTP)
    ├── secret_pat.go               # PAT secret type + revocation handler
    ├── secret_proxy_token.go       # Proxy token secret type + revocation
    ├── secret_setup_key.go         # Setup key secret type + revocation
    └── backend_test.go             # Integration tests (full backend lifecycle)
```

---

## 5. Code Style & Conventions

- **Language**: Go 1.23+
- **SDK**: `github.com/openbao/openbao/sdk/v2` (OpenBao plugin SDK)
- **Plugin protocol**: gRPC multiplexed (`ServeMultiplex`)
- **Naming**: snake_case for API fields, camelCase for Go internals
- **Error handling**: Wrap with `fmt.Errorf("...: %w", err)`, never swallow
- **HTTP client**: `net/http` stdlib with configurable timeout (30s default)
- **Testing**: `testing` + `github.com/openbao/openbao/sdk/v2/logical/testing` for backend tests; `net/http/httptest` for client mocks
- **No external dependencies** beyond the OpenBao SDK and stdlib
- **Binary name**: `openbao-plugin-secrets-netbird`

---

## 6. Testing Strategy

| Layer | What | How |
|-------|------|-----|
| **Unit** | NetBird API client | Mock HTTP server, verify request/response mapping |
| **Unit** | Config path handlers | In-memory storage backend, verify CRUD |
| **Integration** | Full credential lifecycle | `logical.TestBackend` — configure → generate → renew → revoke |
| **Integration** | Revocation correctness | Verify DELETE calls hit NetBird API on lease expiry |
| **E2E** | Plugin in OpenBao | Register plugin in dev-mode OpenBao, read credentials, verify lease |

Tests run via `moon run openbao-netbird-plugin:test`.

---

## 7. Deployment Model

1. **Build**: `moon run openbao-netbird-plugin:build` → Linux amd64 binary
2. **Container**: Multi-stage Dockerfile produces a scratch image with just the binary
3. **Registration**: OpenBao Helm values mount the plugin binary via init-container and register via `plugin_directory`
4. **Mount**: Crossplane MR mounts the engine at path `netbird/`
5. **Configuration**: Crossplane MR writes root config with the service account token (from KV or 1Password)

### Helm Integration (apps/secret/src/openbao/values.yaml)

```yaml
server:
  volumes:
    - name: plugins
      emptyDir: {}
  volumeMounts:
    - name: plugins
      mountPath: /openbao/plugins
  extraInitContainers:
    - name: plugin-netbird
      image: ghcr.io/vgijssel/openbao-plugin-secrets-netbird:<version>
      command: [cp, /openbao-plugin-secrets-netbird, /plugins/]
      volumeMounts:
        - name: plugins
          mountPath: /plugins
  extraArgs:
    - -plugin-directory=/openbao/plugins
```

---

## 8. Boundaries

### Always Do

- Hard-revoke tokens in NetBird on lease expiry/manual revocation
- Validate root config (connectivity check) on write
- Use structured logging (`hclog`)
- Pin all dependencies to exact versions
- Return `logical.ErrorResponse` for user errors, `nil, err` for system errors

### Ask First

- Adding new token types beyond PAT/proxy-token/setup-key
- Changing the mount path from `netbird/`
- Adding OAuth2 or alternative auth methods to root config
- Breaking changes to role config schema

### Never Do

- Store the service account token in plaintext outside OpenBao storage
- Log credential values at any log level
- Make NetBird API calls without the configured timeout
- Use `npx`, `uvx`, or unpinned dependencies
- Skip lease tracking (every generated credential MUST have a lease)

---

## 9. Migration Path

Once the plugin is deployed, migrate existing consumers:

| Current Source | New Source | Consumer Change |
|---|---|---|
| `kv/secret-netbird-operator#access_token` | `netbird/pat/secret-operator#access_token` | Update ExternalSecret `remoteRef` |
| `kv/network-netbird-operator#access_token` | `netbird/pat/network-operator#access_token` | Update ExternalSecret `remoteRef` |
| `kv/secret-netbird-proxy#token` | `netbird/proxy-token/secret#token` | Update ExternalSecret `remoteRef` |
| `kv/network-netbird-pikvm-proxy#token` | `netbird/proxy-token/pikvm#token` | Update ExternalSecret `remoteRef` |
| `kv/pikvm#netbird_setup_key` | `netbird/setup-key/pikvm#setup_key` | Update pyinfra OpenBaoSecret path |

The KV paths remain as fallback until all consumers are migrated. No breaking change to downstream Kubernetes Secrets (field names stay the same via ESO `secretKey` mapping).
