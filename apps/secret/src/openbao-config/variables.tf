variable "bao_address" {
  description = "OpenBao API address. Defaults to the in-cluster ClusterIP (terranetes runner); secret:configure overrides to the local port-forward."
  type        = string
  default     = "http://openbao.secret.svc:8200"
}

variable "auth_method" {
  description = <<-EOT
    How the vault provider authenticates to OpenBao:
      token      - local secret:configure; provider reads the root token from VAULT_TOKEN (1Password).
      kubernetes - in-cluster terranetes runner; posts its ServiceAccount JWT + k8s_auth_role.
  EOT
  type        = string
  default     = "kubernetes"

  validation {
    condition     = contains(["token", "kubernetes"], var.auth_method)
    error_message = "auth_method must be either \"token\" or \"kubernetes\"."
  }
}

variable "k8s_auth_role" {
  description = "kubernetes auth role used when auth_method = kubernetes (the terranetes runner's own login role, created by this module)."
  type        = string
  default     = "terranetes"
}

# ── network cluster JWT grant (consumer of this OpenBao) ─────────────────────
# Produced by `network:bootstrap` (git-ignored *.auto.tfvars.json) and, on the ref
# flip, mirrored into the terranetes Configuration variables so both runners agree.
# Both default empty so this module still applies on the secret cluster BEFORE the
# network cluster exists (empty issuer/keys -> the jwt-network resources count to 0).

variable "network_oidc_issuer" {
  description = "OIDC issuer (iss claim) of the network cluster's projected ServiceAccount tokens. Empty disables the jwt-network backend."
  type        = string
  default     = ""
}

variable "network_jwks_pubkeys" {
  description = "PEM-encoded public keys from the network cluster's JWKS. OpenBao can't reach the network API, so it validates network SA-token signatures against these static keys. Empty disables the jwt-network backend."
  type        = list(string)
  default     = []
}
