# No `backend {}` block on purpose. State lives in a kubernetes-backend Secret with a
# deterministic name (tfstate-default-tailscale-config, ns terranetes-system) resolved
# two ways that MUST agree: the terranetes backend template in-cluster, and an identical
# git-ignored zz_backend.tf that network:configure writes locally. A committed backend
# would collide with the terranetes-injected one. Mirrors apps/secret/src/openbao-config.
terraform {
  required_version = ">= 1.10.0"

  required_providers {
    # Manages the tailnet policy file (ACLs, tags, autoApprovers, grants).
    tailscale = {
      source  = "tailscale/tailscale"
      version = "0.21.1"
    }
    # Reads the tailscale OAuth client out of OpenBao (kv/tailscale) so the ONLY
    # dependency is a reachable OpenBao — no credential passed as a var or on disk.
    # OpenBao is API-compatible with HashiCorp Vault (no OpenBao-native provider).
    vault = {
      source  = "hashicorp/vault"
      version = "5.10.1"
    }
    # terranetes requires a providerRef and always injects a provider block from that
    # Provider CR. To avoid duplicating the providers this module owns, the CR uses a
    # `null` type, injecting a harmless (unused) provider "null" {}.
    null = {
      source  = "hashicorp/null"
      version = "3.3.0"
    }
  }
}
