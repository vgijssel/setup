# Neither a `backend {}` block nor a `provider "vault"` block is committed here —
# each of the two runners injects BOTH, so they never collide:
#   - in-cluster (terranetes): backend from the controller's backend template
#     (apps/platform/src/terranetes/values.yaml); provider from the terranetes
#     Provider CR's `configuration` (address + kubernetes auth_login) — terranetes
#     requires a providerRef and always renders provider.tf.json, so a committed
#     provider block would be a duplicate.
#   - local (secret:configure): an identical git-ignored zz_backend.tf, plus a
#     zz_provider.tf (`provider "vault" {}`) that reads VAULT_ADDR/VAULT_TOKEN (root
#     token) from the environment.
# State lives in the deterministic Secret tfstate-default-openbao-config (ns secret)
# both resolve to. See SPEC.md → "Configuration management".
terraform {
  required_version = ">= 1.10.0"

  required_providers {
    # OpenBao is API-compatible with HashiCorp Vault; there is no OpenBao-native
    # provider, so the hashicorp/vault provider manages it. Pinned exactly.
    vault = {
      source  = "hashicorp/vault"
      version = "5.10.1"
    }
  }
}
