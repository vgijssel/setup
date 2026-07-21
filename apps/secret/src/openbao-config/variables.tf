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
# The network cluster is always part of this setup, so the jwt-network backend is
# always created. OpenBao fetches the network cluster's public signing keys LIVE from
# its OIDC JWKS endpoint over the tailnet (the network cluster's kube-apiserver reverse
# proxy at api.network.vgijssel.nl, valid public LE cert), rather than caching a static
# copy. The api-network Service VIP + DNS name are stable across vind recreation, so
# these defaults are set once and committed — no per-recreate key extraction. Both the
# local secret:configure apply and the in-cluster terranetes reconcile use these values.

variable "network_oidc_issuer" {
  description = "OIDC issuer (iss claim) of the network cluster's projected ServiceAccount tokens."
  type        = string
  default     = "https://kubernetes.default.svc.cluster.local"
}

variable "network_jwks_url" {
  description = "Tailnet-reachable JWKS URL of the network cluster (served by the cluster's kube-apiserver reverse proxy behind a valid public LE cert). OpenBao fetches network SA-token signing keys from here live."
  type        = string
  default     = "https://api.network.vgijssel.nl/openid/v1/jwks"
}

variable "network_jwks_ca_pem" {
  description = "Optional PEM CA bundle OpenBao trusts when fetching network_jwks_url. Leave empty when the endpoint presents a publicly-trusted cert (api.network.vgijssel.nl serves a Let's Encrypt cert)."
  type        = string
  default     = ""
}
