locals {
  omada_fqdn        = "omada.${var.base_domain}"
  unifi_fqdn        = "unifi.${var.base_domain}"
  omada_public_fqdn = "omada-public.${var.base_domain}"
  unifi_public_fqdn = "unifi-public.${var.base_domain}"

  # Hetzner exposes an attached Volume at this stable device path (by Volume ID).
  # Passed to network-mount-data.sh via cloud-config as ${data_device}.
  volume_device = "/dev/disk/by-id/scsi-0HC_Volume_${hcloud_volume.data.id}"

  # Boot image: an explicit override wins; otherwise the newest snapshot the deploy
  # pipeline uploaded (discovered by label below).
  image_id = var.image_snapshot_id != "" ? var.image_snapshot_id : data.hcloud_image.network.id
}

# The bootable image is discovered by label rather than pinned by id: `moon run
# network:deploy` builds the amd64 raw and uploads it as a snapshot labelled
# role=network,arch=amd64 (see image/upload.sh), and this data source selects the most
# recent one — so build/upload and apply fully decouple with no hand-copied id.
# NOTE: reads at plan/apply time and errors if no matching snapshot exists yet, so the
# first `apply` must be preceded by an upload (the deploy task does exactly that).
data "hcloud_image" "network" {
  with_selector     = "role=network,arch=amd64"
  with_architecture = "x86"
  most_recent       = true
}

# NOTE: SSH access is provisioned via the Kairos cloud-config (the `kairos` admin
# user's ssh_authorized_keys, rendered from var.ssh_public_key) and Tailscale SSH.
# Kairos consumes Hetzner's native user_data datasource, so there is no
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

  # Tailscale: pinned UDP port for a direct (non-DERP) tunnel path. Without this
  # the node's only path is DERP relay, which does not carry TCP to host services
  # (admin UIs unreachable over the tailnet).
  rule {
    direction  = "in"
    protocol   = "udp"
    port       = "41641"
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

# Persistent data Volume. NOT formatted by Hetzner (no `format` arg) —
# network-mount-data.sh formats it non-destructively (only a blank disk), so a VM
# recreate reuses the existing filesystem and all controller data survives.
resource "hcloud_volume" "data" {
  name     = "${var.server_name}-data"
  size     = var.volume_size
  location = var.location

  labels = {
    environment = "production"
    role        = "network"
    managed_by  = "opentofu"
  }
}

# Kairos VM (amd64, cx type). `user_data` is the rendered cloud-config; there is
# intentionally NO `ignore_changes`, so a cloud-config OR image change recreates the
# server. Data lives on the retained Volume, so a recreate is the routine rollout path
# (a fresh `deploy` uploads a newer snapshot -> new image id -> replace, data preserved).
resource "hcloud_server" "this" {
  name         = var.server_name
  server_type  = var.server_type
  location     = var.location
  image        = local.image_id
  firewall_ids = [hcloud_firewall.this.id]
  user_data    = local.cloud_config

  labels = {
    environment = "production"
    role        = "network"
    managed_by  = "opentofu"
  }
}

# Attach the Volume. The attachment is recreated with the server, but the Volume
# itself persists (it is a separate resource).
resource "hcloud_volume_attachment" "data" {
  volume_id = hcloud_volume.data.id
  server_id = hcloud_server.this.id
  automount = false # network-mount-data.sh (cloud-config boot stage) handles mounting.
}

# Render the Kairos cloud-config. Secrets and dynamic values are injected via
# templatefile() so nothing rendered is written to disk or committed — they land
# only in user_data + private TF state (same model as the old app's Butane).
locals {
  cloud_config = templatefile("${path.module}/cloud-config/config.yaml", {
    ssh_public_key       = var.ssh_public_key
    data_device          = local.volume_device
    tailscale_authkey    = var.tailscale_authkey
    tailscale_hostname   = var.server_name
    tailscale_tag        = var.tailscale_tag
    netdata_claim_url    = var.netdata_claim_url
    netdata_claim_token  = var.netdata_claim_token
    netdata_claim_rooms  = var.netdata_claim_rooms
    base_domain          = var.base_domain
    omada_fqdn           = local.omada_fqdn
    unifi_fqdn           = local.unifi_fqdn
    cloudflare_api_token = var.cloudflare_api_token
  })
}
