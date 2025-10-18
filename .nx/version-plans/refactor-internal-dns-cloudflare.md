---
internal-dns: major
---

Refactor internal-dns to use Cloudflare backend with external-dns instead of PowerDNS. Migrate test suite from kuttl to Chainsaw.

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
