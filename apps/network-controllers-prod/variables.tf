# --- Server / location -------------------------------------------------------

variable "server_name" {
  description = "Name of the Hetzner Cloud server (also the Tailscale hostname)."
  type        = string
  default     = "network-controllers-prod"
}

variable "server_type" {
  description = "Hetzner Cloud server type. Must be x86-64 (cx/cpx) — UniFi OS Server is x86-64 only. Bump for more RAM/disk if Omada+UniFi+Netdata create pressure."
  type        = string
  default     = "cx23"
}

variable "location" {
  description = "Hetzner Cloud location (Hetzner deprecated the per-datacenter field on 2025-12-16; use location)."
  type        = string
  default     = "nbg1"
}

variable "ssh_public_key" {
  description = "SSH public key installed for the Flatcar 'core' user."
  type        = string
  default     = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAvXN6EpJc9+19awLUuqdVvvjZ1v/ofx9dee9UzM3xXp"
}

# --- Storage -----------------------------------------------------------------

variable "volume_size" {
  description = "Size in GB of the Hetzner Volume mounted at /var/lib/data (persistent controller data)."
  type        = number
  default     = 10
}

# --- Flatcar image -----------------------------------------------------------

variable "flatcar_snapshot_id" {
  description = "Hetzner snapshot ID of the uploaded Flatcar image (see ignition/README.md, Task 0). Uploaded via hcloud-upload-image (Flatcar stable 4593.2.3, amd64)."
  type        = string
  default     = "403540555"
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
  description = "The node's Tailscale 100.x IPv4. Empty on first apply; set TF_VAR_tailscale_ip after the node joins the tailnet to publish the private admin DNS records."
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

# --- Container images (pinned) -----------------------------------------------

variable "omada_image" {
  description = "Pinned Omada controller image."
  type        = string
  default     = "mbentley/omada-controller:6.2.10.17"
}

variable "unifi_image" {
  description = "Pinned UniFi OS Server image (ghcr.io/lemker, x86-64). Runs systemd-in-container: needs cgroupns=host + tmpfs + NET_ADMIN/NET_RAW (not full privileged)."
  type        = string
  default     = "ghcr.io/lemker/unifi-os-server:v1.3.0"
}

variable "caddy_image" {
  description = "Pinned Caddy image that includes the Cloudflare DNS provider module (for ACME DNS-01)."
  type        = string
  default     = "caddybuilds/caddy-cloudflare:2.9.1"
}

variable "tailscale_image" {
  description = "Pinned Tailscale image."
  type        = string
  default     = "ghcr.io/tailscale/tailscale:v1.80.3"
}

variable "netdata_image" {
  description = "Pinned Netdata image. Run as a container (the static kickstart install fails on immutable Flatcar); claims into Netdata Cloud via env vars."
  type        = string
  default     = "netdata/netdata:v2.10.3"
}
