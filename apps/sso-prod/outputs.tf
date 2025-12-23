# Outputs for Keycloak OIDC Client

output "client_id" {
  description = "The OIDC client ID for Coder"
  value       = keycloak_openid_client.coder.client_id
}

output "client_secret" {
  description = "The OIDC client secret for Coder (use 'nx output' to view)"
  value       = keycloak_openid_client.coder.client_secret
  sensitive   = true
}

output "issuer_url" {
  description = "The OIDC issuer URL for the cozy realm"
  value       = "https://keycloak.enigma.vgijssel.nl/realms/cozy"
}

output "onepassword_item_id" {
  description = "The 1Password item ID where credentials are stored"
  value       = onepassword_item.coder_oidc_credentials.id
}
