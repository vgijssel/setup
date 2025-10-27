## 2.1.0 (2025-10-27)

### 🚀 Features

- feat(internal-dns): add cleanup hook for DNS records on chart deletion ([#778](https://github.com/vgijssel/setup/pull/778))

# 2.0.0 (2025-10-26)

### ⚠️  Breaking Changes

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

## 1.1.0 (2025-09-17)

### 🚀 Features

- Migrate from project.json to package.json configuration for consistency ([#719](https://github.com/vgijssel/setup/pull/719))