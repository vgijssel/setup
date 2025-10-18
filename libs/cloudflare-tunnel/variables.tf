variable "cloudflare_api_token" {
  description = "Cloudflare API token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
  sensitive   = true
}

variable "tunnel_name" {
  description = "Cloudflare tunnel name prefix (a unique suffix will be appended)"
  type        = string
}

variable "tunnel_service" {
  description = "Service URL for the tunnel"
  type        = string
}

variable "zone_name" {
  description = "Cloudflare zone name"
  type        = string
}
