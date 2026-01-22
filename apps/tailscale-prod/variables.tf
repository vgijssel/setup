# Tailscale OAuth credentials - passed via -var-file from vault-shell
variable "tailscale_oauth_client_id" {
  description = "Tailscale OAuth client ID"
  type        = string
}

variable "tailscale_oauth_client_secret" {
  description = "Tailscale OAuth client secret"
  type        = string
  sensitive   = true
}
