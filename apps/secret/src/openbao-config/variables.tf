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
# OpenBao fetches the network cluster's public signing keys LIVE from its OIDC JWKS
# endpoint over the tailnet (network-operator's noauth API-server proxy), rather than
# caching a static copy. The network-operator device hostname is stable across vind
# recreation, so this URL is set once and committed — no per-recreate key extraction.
# Both default empty so this module still applies on the secret cluster BEFORE the
# network cluster exists (empty issuer/url -> the jwt-network resources count to 0).

variable "network_oidc_issuer" {
  description = "OIDC issuer (iss claim) of the network cluster's projected ServiceAccount tokens. Empty disables the jwt-network backend."
  type        = string
  default     = ""
}

variable "network_jwks_url" {
  description = "Tailnet-reachable JWKS URL of the network cluster (e.g. https://network-operator.<tailnet>.ts.net/openid/v1/jwks, served by the operator's noauth API-server proxy). OpenBao fetches network SA-token signing keys from here live. Empty disables the jwt-network backend."
  type        = string
  default     = ""
}

variable "network_jwks_ca_pem" {
  description = "Optional PEM CA bundle OpenBao trusts when fetching network_jwks_url. Leave empty when the endpoint presents a publicly-trusted cert (Tailscale ts.net MagicDNS certs are Let's Encrypt-backed)."
  type        = string
  default     = ""
}
