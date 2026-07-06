# Records live in the existing vgijssel.nl zone (no subdomain delegation). All
# DNS-only (proxied = false): the *-public names point at the VM public IP for
# device adoption, and the private admin names point at the node's Tailscale IP.
data "cloudflare_zone" "this" {
  name = var.cloudflare_zone_name
}

# --- Public plane: device provisioning (-> VM public IPv4) -------------------

resource "cloudflare_record" "omada_public" {
  zone_id = data.cloudflare_zone.this.id
  name    = local.omada_public_fqdn
  type    = "A"
  content = hcloud_server.this.ipv4_address
  proxied = false
  ttl     = 300
  comment = "network-controllers-prod: Omada device inform (managed by OpenTofu)"
}

resource "cloudflare_record" "unifi_public" {
  zone_id = data.cloudflare_zone.this.id
  name    = local.unifi_public_fqdn
  type    = "A"
  content = hcloud_server.this.ipv4_address
  proxied = false
  ttl     = 300
  comment = "network-controllers-prod: UniFi device inform (managed by OpenTofu)"
}

# --- Private plane: admin UIs (-> node Tailscale IP) -------------------------
# Skipped while var.tailscale_ip is empty (first apply). Set TF_VAR_tailscale_ip
# after the node joins the tailnet, then re-apply to publish these.

resource "cloudflare_record" "omada_private" {
  count   = var.tailscale_ip == "" ? 0 : 1
  zone_id = data.cloudflare_zone.this.id
  name    = local.omada_fqdn
  type    = "A"
  content = var.tailscale_ip
  proxied = false
  ttl     = 300
  comment = "network-controllers-prod: Omada admin UI over Tailscale (managed by OpenTofu)"
}

resource "cloudflare_record" "unifi_private" {
  count   = var.tailscale_ip == "" ? 0 : 1
  zone_id = data.cloudflare_zone.this.id
  name    = local.unifi_fqdn
  type    = "A"
  content = var.tailscale_ip
  proxied = false
  ttl     = 300
  comment = "network-controllers-prod: UniFi admin UI over Tailscale (managed by OpenTofu)"
}
