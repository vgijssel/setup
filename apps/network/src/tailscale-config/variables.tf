variable "bao_address" {
  description = "OpenBao API address. In-cluster terranetes reaches the remote OpenBao over the tailnet (secret.vgijssel.nl); network:configure overrides to a local reach as needed."
  type        = string
  default     = "https://secret.vgijssel.nl"
}

variable "auth_method" {
  description = <<-EOT
    How the vault provider authenticates to OpenBao:
      token - local network:configure first apply; provider reads the root token from
              VAULT_TOKEN (from 1Password). No token in git/state.
      jwt   - in-cluster terranetes runner; posts its ServiceAccount JWT to the remote
              jwt-network backend (role = var.jwt_role) and exchanges it for a token.
  EOT
  type        = string
  default     = "jwt"

  validation {
    condition     = contains(["token", "jwt"], var.auth_method)
    error_message = "auth_method must be either \"token\" or \"jwt\"."
  }
}

variable "jwt_role" {
  description = "jwt-network auth role used when auth_method = jwt (the terranetes runner's login role, created on the secret side by apps/secret/src/openbao-config)."
  type        = string
  default     = "network-terranetes"
}

variable "jwt_mount" {
  description = "Mount path of the remote OpenBao JWT auth backend the network cluster logs in through."
  type        = string
  default     = "jwt-network"
}

variable "tailscale_kv_mount" {
  description = "OpenBao kv v2 mount the tailscale OAuth client lives under."
  type        = string
  default     = "kv"
}

variable "tailscale_kv_path" {
  description = <<-EOT
    Path within the kv mount holding the tailscale OAuth client for ACL management.
    The referenced client MUST have the `policy_file` (write) OAuth scope — the operator
    client used for device auth typically does NOT, so seed a dedicated client (see
    network:configure docs). Reads keys oauth_client_id + oauth_client_secret.
  EOT
  type        = string
  default     = "network-tailscale-config"
}

variable "tailscale_oauth_scopes" {
  description = "OAuth scopes the tailscale provider requests for its token. ACL management needs policy_file write."
  type        = list(string)
  default     = ["all:write"]
}

variable "tailnet" {
  description = "Target tailnet. \"-\" means the default tailnet of the authenticated OAuth client."
  type        = string
  default     = "-"
}
