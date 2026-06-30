output "server_id" {
  description = "Hetzner Cloud server ID."
  value       = hcloud_server.this.id
}

output "server_name" {
  description = "Server name (also the Tailscale hostname)."
  value       = hcloud_server.this.name
}

output "ipv4_address" {
  description = "Public IPv4 address (target of the *-public DNS records)."
  value       = hcloud_server.this.ipv4_address
}

output "ipv6_address" {
  description = "Public IPv6 address."
  value       = hcloud_server.this.ipv6_address
}

output "datacenter" {
  description = "Server datacenter."
  value       = hcloud_server.this.datacenter
}

output "volume_id" {
  description = "Persistent data Volume ID (retained across server recreates)."
  value       = hcloud_volume.data.id
}

output "omada_admin_url" {
  description = "Omada admin UI (over Tailscale only)."
  value       = "https://${local.omada_fqdn}"
}

output "unifi_admin_url" {
  description = "UniFi OS Server GUI (over Tailscale only)."
  value       = "https://${local.unifi_fqdn}"
}

output "omada_public_hostname" {
  description = "Hostname devices use to inform to Omada (resolves to public IP)."
  value       = local.omada_public_fqdn
}

output "unifi_public_hostname" {
  description = "Hostname devices use to inform to UniFi (resolves to public IP)."
  value       = local.unifi_public_fqdn
}
