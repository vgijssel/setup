output "oidc_issuer_url" {
  description = "Keycloak OIDC issuer URL for Coder"
  value       = local.issuer_url
  sensitive   = true
}

output "oidc_client_id" {
  description = "OIDC client ID for Coder"
  value       = keycloak_openid_client.coder.client_id
}

output "onepassword_item_id" {
  description = "1Password item ID containing OIDC credentials"
  value       = onepassword_item.keycloak_oidc.uuid
}
