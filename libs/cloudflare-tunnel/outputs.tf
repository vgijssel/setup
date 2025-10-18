output "available_zones" {
  description = "List of available Cloudflare zones"
  value       = data.cloudflare_zones.available.result
}

output "tunnel_id" {
  description = "The ID of the created Cloudflare tunnel"
  value       = cloudflare_zero_trust_tunnel_cloudflared.tunnel.id
}

output "tunnel_token" {
  description = "The authentication token for the Cloudflare tunnel"
  value       = data.cloudflare_zero_trust_tunnel_cloudflared_token.tunnel_token.token
  sensitive   = true
}

output "tunnel_cname" {
  description = "The CNAME record for the tunnel"
  value       = cloudflare_dns_record.tunnel_cname.name
}
