## 0.2.2 (2025-12-23)

### 🩹 Fixes

- chore: monorepo migration cleanup ([#861](https://github.com/vgijssel/setup/pull/861))

### 🧱 Updated Dependencies

- Updated dev-cluster-stack to 0.2.1

## 0.2.1 (2025-10-26)

### 🩹 Fixes

- Refactor internal-dns to use Cloudflare backend with external-dns instead of PowerDNS. Migrate test suite from kuttl to Chainsaw. ([#768](https://github.com/vgijssel/setup/pull/768))

  ## Breaking Changes
  - Removed PowerDNS backend entirely
  - Changed from PowerDNS API to Cloudflare API
  - Removed LoadBalancer service (no longer needed)
  - Removed PersistentVolumeClaim (no longer needed)
  - Changed configuration values structure
  ## New Features
  - Added Cloudflare backend support via external-dns
  - Added OnePasswordItem integration for secure credential management
  - Migrated test suite from kuttl to Chainsaw for better testing experience
  ## Other Changes
  - dev-cluster: Added 1Password operator wait step to Chainsaw tests for improved reliability

## 0.2.0 (2025-10-22)

### 🚀 Features

- Add CLI tool for local Kubernetes cluster orchestration with Flux, 1Password, and kind integration ([#773](https://github.com/vgijssel/setup/pull/773))

### 🧱 Updated Dependencies

- Updated dev-cluster-stack to 0.2.0