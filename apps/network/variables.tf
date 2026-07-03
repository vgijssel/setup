# --- Server / location -------------------------------------------------------

variable "server_name" {
  description = "Name of the Hetzner Cloud server (also the Tailscale hostname)."
  type        = string
  default     = "network"
}

variable "server_type" {
  description = "Hetzner Cloud server type. MUST be arm64 (cax) — the Kairos image ships linux/arm64 (decision 2026-07-03; see SPEC §1). cax21 = 4 vCPU / 8 GB, headroom for Omada + UniFi OS Server + Netdata."
  type        = string
  default     = "cax21"
}

variable "location" {
  description = "Hetzner Cloud location. Must offer cax (Ampere) servers — nbg1/fsn1/hel1 do. (Hetzner deprecated the per-datacenter field on 2025-12-16; use location.)"
  type        = string
  default     = "nbg1"
}

variable "ssh_public_key" {
  description = "SSH public key installed for the Kairos 'kairos' admin user (via cloud-config)."
  type        = string
  default     = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAvXN6EpJc9+19awLUuqdVvvjZ1v/ofx9dee9UzM3xXp"
}

# --- Storage -----------------------------------------------------------------

variable "volume_size" {
  description = "Size in GB of the Hetzner Volume mounted at /var/lib/data (persistent controller data)."
  type        = number
  default     = 10
}

# --- Kairos image ------------------------------------------------------------

variable "image_snapshot_id" {
  description = "Hetzner snapshot ID of the uploaded Kairos arm64 image (set by `moon run network:upload`, hcloud-upload-image --architecture arm). Empty until the first upload."
  type        = string
  default     = ""
}

# --- DNS / Cloudflare --------------------------------------------------------

variable "cloudflare_zone_name" {
  description = "Existing Cloudflare zone that hosts the records (no subdomain delegation)."
  type        = string
  default     = "vgijssel.nl"
}

variable "base_domain" {
  description = "Base domain for this app's records, as a subdomain of the Cloudflare zone."
  type        = string
  default     = "hc.vgijssel.nl"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token scoped to the zone (Zone:Read + DNS:Edit). Used by the provider and templated into Caddy for DNS-01."
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID."
  type        = string
}

# --- Tailscale ---------------------------------------------------------------

variable "tailscale_authkey" {
  description = "Reusable Tailscale auth key for this node (from 1Password). Reusable so a VM recreate re-joins under the stable hostname."
  type        = string
  sensitive   = true
}

variable "tailscale_tag" {
  description = "Tailscale ACL tag advertised by this node (must be in the tailnet's tagOwners, owned by an admin). The tailnet ACL grants access to this tag."
  type        = string
  default     = "tag:network-controllers"
}

variable "tailscale_ip" {
  description = "The node's Tailscale 100.x IPv4 (stable via persistent tagged state). Drives the private admin DNS records; leave empty on the first apply and set after the node joins the tailnet."
  type        = string
  default     = ""
}

# --- Netdata Cloud -----------------------------------------------------------

variable "netdata_claim_url" {
  description = "Netdata Cloud claim URL (e.g. https://app.netdata.cloud)."
  type        = string
  default     = "https://app.netdata.cloud"
}

variable "netdata_claim_token" {
  description = "Netdata Cloud claim token (from 1Password)."
  type        = string
  sensitive   = true
}

variable "netdata_claim_rooms" {
  description = "Netdata Cloud room ID(s) to claim the node into."
  type        = string
}

# --- S3 backend --------------------------------------------------------------

variable "s3_bucket" {
  description = "Hetzner Object Storage bucket for OpenTofu state. Injected at init via -backend-config; declared here so secrets/.env validates."
  type        = string
}
