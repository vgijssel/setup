output "tailscale_key_id" {
  description = "Tailscale auth key resource ID"
  value       = tailscale_tailnet_key.peace_at_least.id
}

output "tailscale_key_expires_at" {
  description = "Expiration timestamp for the Tailscale auth key"
  value       = tailscale_tailnet_key.peace_at_least.expires_at
}

output "onepassword_item_id" {
  description = "1Password item ID containing Tailscale auth key"
  value       = onepassword_item.tailscale_auth_key.uuid
}
