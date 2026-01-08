locals {
  # Coder OIDC configuration
  coder_callback_url = "https://coder.enigma.vgijssel.nl/api/v2/users/oidc/callback"
  coder_origin       = "https://coder.enigma.vgijssel.nl"
  issuer_url         = "${var.keycloak_url}/realms/${var.keycloak_realm}"
}

# Keycloak OIDC Client for Coder authentication
resource "keycloak_openid_client" "coder" {
  realm_id              = var.keycloak_realm
  client_id             = "coder"
  name                  = "Coder"
  enabled               = true
  access_type           = "CONFIDENTIAL"
  standard_flow_enabled = true
  valid_redirect_uris   = [local.coder_callback_url]
  web_origins           = [local.coder_origin]
}

# 1Password vault for storing Coder OIDC credentials
data "onepassword_vault" "coder_prod" {
  name = "setup-coder-prod"

  lifecycle {
    postcondition {
      condition     = can(self.uuid)
      error_message = "The 'setup-coder-prod' vault must exist in 1Password."
    }
  }
}

# Write OIDC client credentials to 1Password for Coder to consume
resource "onepassword_item" "keycloak_oidc" {
  vault    = data.onepassword_vault.coder_prod.uuid
  title    = "keycloak-oidc"
  category = "login"

  url      = local.issuer_url
  username = keycloak_openid_client.coder.client_id

  section {
    label = "OIDC Configuration"

    field {
      label = "issuer_url"
      type  = "STRING"
      value = local.issuer_url
    }

    field {
      label = "client_id"
      type  = "STRING"
      value = keycloak_openid_client.coder.client_id
    }

    field {
      label = "client_secret"
      type  = "CONCEALED"
      value = keycloak_openid_client.coder.client_secret
    }
  }
}
