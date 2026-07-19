# No `backend {}` block on purpose. State lives in a kubernetes-backend Secret with a
# deterministic name (tfstate-default-openbao-config, ns secret) resolved two ways that
# MUST agree: the terranetes backend template in-cluster, and an identical git-ignored
# zz_backend.tf that secret:configure writes locally. A committed backend would collide
# with the terranetes-injected one. See SPEC.md → "Configuration management".
terraform {
  required_version = ">= 1.10.0"

  required_providers {
    # OpenBao is API-compatible with HashiCorp Vault; there is no OpenBao-native
    # provider, so the hashicorp/vault provider manages it. Pinned exactly.
    vault = {
      source  = "hashicorp/vault"
      version = "5.10.1"
    }
    # terranetes requires a providerRef and always injects a provider block from that
    # Provider CR. To avoid duplicating the vault provider this module owns, the CR uses
    # a `null` type, injecting a harmless (unused) provider "null" {}. Declared here so
    # the injected block is a recognised, pinned requirement.
    null = {
      source  = "hashicorp/null"
      version = "3.3.0"
    }
  }
}
