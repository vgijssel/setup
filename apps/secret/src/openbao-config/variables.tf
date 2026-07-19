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
