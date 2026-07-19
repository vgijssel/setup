# No `backend {}` block on purpose. State lives in a kubernetes-backend Secret
# with a deterministic name (tfstate-default-openbao-config, ns secret) resolved
# two ways that MUST agree:
#   - in-cluster: terranetes-controller injects the backend from its backend
#     template (apps/platform/src/terranetes/values.yaml).
#   - local:      secret:configure writes an identical git-ignored zz_backend.tf.
# A committed backend here would collide with the terranetes-injected one, so it
# is deliberately omitted. See SPEC.md → "Configuration management".
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
