output "server_id" {
  description = "Hetzner Cloud server ID"
  value       = hcloud_server.gateway.id
}

output "server_name" {
  description = "Hetzner Cloud server name"
  value       = hcloud_server.gateway.name
}

output "ipv4_address" {
  description = "Public IPv4 address"
  value       = hcloud_server.gateway.ipv4_address
}

output "ipv6_address" {
  description = "Public IPv6 address"
  value       = hcloud_server.gateway.ipv6_address
}

output "datacenter" {
  description = "Server datacenter"
  value       = hcloud_server.gateway.datacenter
}

output "talos_endpoint" {
  description = "Talos API endpoint (use after boot-to-talos completes)"
  value       = "https://${hcloud_server.gateway.ipv4_address}:50000"
}
