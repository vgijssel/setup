locals {
  omada_fqdn        = "omada.${var.base_domain}"
  unifi_fqdn        = "unifi.${var.base_domain}"
  omada_public_fqdn = "omada-public.${var.base_domain}"
  unifi_public_fqdn = "unifi-public.${var.base_domain}"

  # Hetzner exposes an attached Volume at this stable device path (by Volume ID).
  volume_device = "/dev/disk/by-id/scsi-0HC_Volume_${hcloud_volume.data.id}"
}

# NOTE: SSH access is provisioned via Ignition (the `core` user's
# ssh_authorized_keys in ignition/butane.yaml) and Tailscale SSH. Flatcar/Ignition
# images do not consume Hetzner's ssh_keys metadata, and Hetzner rejects a second
# key with an already-registered public key (uniqueness_error), so there is no
# hcloud_ssh_key resource here.

# Firewall: ONLY device provisioning/adoption ports are public. SSH, admin UIs,
# and Netdata are reachable only over Tailscale (no public 22/80/443).
resource "hcloud_firewall" "this" {
  name = "${var.server_name}-firewall"

  # --- Omada device provisioning ---
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "29810-29817"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "29810-29817"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "27001"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "8088"
    source_ips = ["0.0.0.0/0", "::/0"]
  }

  # --- UniFi device provisioning ---
  rule {
    direction  = "in"
    protocol   = "tcp"
    port       = "8080"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "3478"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "10001"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "10003"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

# Persistent data Volume. NOT formatted by Hetzner (no `format` arg) — Ignition
# formats it non-destructively (wipe_filesystem=false) so a VM recreate reuses
# the existing filesystem and controller data survives.
resource "hcloud_volume" "data" {
  name     = "${var.server_name}-data"
  size     = var.volume_size
  location = "nbg1"

  labels = {
    environment = "production"
    role        = "network-controllers"
    managed_by  = "opentofu"
  }
}

# Flatcar VM. `user_data` is the compiled Ignition; there is intentionally NO
# `ignore_changes`, so a Butane/Ignition change recreates the server. Data lives
# on the retained Volume, so a recreate is the routine config-change path.
resource "hcloud_server" "this" {
  name         = var.server_name
  server_type  = var.server_type
  datacenter   = var.datacenter
  image        = var.flatcar_snapshot_id
  firewall_ids = [hcloud_firewall.this.id]
  user_data    = data.ct_config.ignition.rendered

  labels = {
    environment = "production"
    role        = "network-controllers"
    managed_by  = "opentofu"
  }
}

# Attach the Volume. The attachment is recreated with the server, but the Volume
# itself persists (it is a separate resource).
resource "hcloud_volume_attachment" "data" {
  volume_id = hcloud_volume.data.id
  server_id = hcloud_server.this.id
  automount = false # Ignition's var-lib-data.mount unit handles mounting.
}

# Compile the Butane config to Ignition. Secrets and dynamic values are injected
# via templatefile() so nothing rendered is written to disk or committed.
data "ct_config" "ignition" {
  strict = true
  content = templatefile("${path.module}/ignition/butane.yaml", {
    ssh_public_key       = var.ssh_public_key
    volume_device        = local.volume_device
    volume_label         = "ncdata"
    tailscale_authkey    = var.tailscale_authkey
    tailscale_hostname   = var.server_name
    tailscale_image      = var.tailscale_image
    omada_image          = var.omada_image
    unifi_image          = var.unifi_image
    caddy_image          = var.caddy_image
    cloudflare_api_token = var.cloudflare_api_token
    cloudflare_zone_name = var.cloudflare_zone_name
    omada_fqdn           = local.omada_fqdn
    unifi_fqdn           = local.unifi_fqdn
    netdata_claim_url    = var.netdata_claim_url
    netdata_claim_token  = var.netdata_claim_token
    netdata_claim_rooms  = var.netdata_claim_rooms
  })
}
