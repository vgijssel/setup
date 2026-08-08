# Build Plan — OpenBao NetBird Plugin

## Task 1: Project scaffold

Create `libs/openbao-netbird-plugin/` with `moon.yml`, `src/go.mod`, and `src/main.go` (minimal `ServeMultiplex` entry point that compiles).

**Acceptance criteria:**
- `moon run openbao-netbird-plugin:build` produces a binary at `src/openbao-plugin-secrets-netbird`
- `moon run openbao-netbird-plugin:test` runs (passes with no tests yet)
- `go.mod` pins the OpenBao SDK v2

**Dependencies:** none

---

## Task 2: NetBird HTTP client

Implement `src/client.go` — a thin HTTP client wrapping the three NetBird API operations (create PAT, create proxy token, create setup key) plus corresponding delete operations for revocation.

**Acceptance criteria:**
- `client_test.go` exercises all 6 operations against `httptest.Server` mocks
- Requests include correct Authorization header, Content-Type, and URL paths
- Timeout is configurable (defaults to 30s)
- All tests pass via `moon run openbao-netbird-plugin:test`

**Dependencies:** Task 1

---

## Task 3: Backend factory + root config path

Implement `src/backend.go` (Backend factory registering paths) and `src/path_config_root.go` (CRUD for `/config/root` storing `api_url` + `service_account_token`).

**Acceptance criteria:**
- `backend_test.go` tests write and read of root config via in-memory storage
- Writing root config stores values; reading returns them (minus the token for security)
- Delete clears config
- All tests pass

**Dependencies:** Task 2

---

## Task 4: PAT role config + credential generation

Implement `src/path_config_pat.go` (CRUD for `/config/pat/:name`) and `src/path_pat.go` (read-only path that mints a PAT and attaches a lease).

**Acceptance criteria:**
- Config CRUD tested: create/read/update/delete a PAT role
- Credential generation tested: reading `/pat/:name` calls the NetBird API mock, returns `token_id` + `access_token`, and sets a lease with the configured TTL
- Revocation tested: revoking the secret calls `DELETE /api/users/:user_id/tokens/:token_id`
- All tests pass

**Dependencies:** Task 3

---

## Task 5: Proxy token role config + credential generation

Implement `src/path_config_proxy_token.go` and `src/path_proxy_token.go`.

**Acceptance criteria:**
- Config CRUD tested
- Credential generation tested: returns `token_id` + `token`, lease attached
- Revocation tested: DELETE called on revoke
- All tests pass

**Dependencies:** Task 3

---

## Task 6: Setup key role config + credential generation

Implement `src/path_config_setup_key.go` and `src/path_setup_key.go`.

**Acceptance criteria:**
- Config CRUD tested
- Credential generation tested: returns `key_id` + `setup_key` + `expires_at`, lease attached
- Revocation tested: DELETE called on revoke
- All tests pass

**Dependencies:** Task 3

---

## Task 7: Dockerfile + build integration

Add `libs/openbao-netbird-plugin/Dockerfile` (multi-stage: Go build → scratch with just the binary). Ensure `moon run openbao-netbird-plugin:docker` builds the image.

**Acceptance criteria:**
- Dockerfile builds successfully via `docker build`
- Resulting image contains only `/openbao-plugin-secrets-netbird`
- Moon task `docker` defined and runnable
- Binary targets `linux/amd64`

**Dependencies:** Task 1
