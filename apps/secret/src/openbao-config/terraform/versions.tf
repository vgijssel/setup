# Provider pins for the openbao-config module. Source of truth for the inline HCL
# that `moon run secret:generate` embeds into ../component/openbao-config.yaml.
#
# No `backend {}` block: terraform-controller injects a kubernetes-backend Secret
# (tfstate-<workspace>-openbao-config, inside the child that runs the Configuration)
# with Lease locking. A committed backend would collide with the injected one.
#
# No `null` provider anymore: the old terranetes trick injected a provider block
# from the referenced Provider CR (hence a throwaway `null`). KubeVela's
# terraform-controller with a `custom` Provider injects ENV VARS only (VAULT_ADDR,
# VAULT_TOKEN during bootstrap) — it does NOT inject a provider block — so this
# module owns its single `provider "vault"` block with no duplication (SPEC §3.3).
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
