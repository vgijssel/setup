# Keycloak OIDC Client Configuration for Coder

# Data source to reference the existing cozy realm
data "keycloak_realm" "cozy" {
  realm = "cozy"
}

# OIDC Client for Coder
resource "keycloak_openid_client" "coder" {
  realm_id  = data.keycloak_realm.cozy.id
  client_id = "coder"
  name      = "Coder"
  enabled   = true

  access_type              = "CONFIDENTIAL"
  standard_flow_enabled    = true
  direct_access_grants_enabled = false
  service_accounts_enabled = false

  valid_redirect_uris = [
    "https://coder.enigma.vgijssel.nl/*"
  ]

  web_origins = [
    "https://coder.enigma.vgijssel.nl"
  ]

  login_theme = "keycloak"
}

# Data source for the target vault
data "onepassword_vault" "coder_prod" {
  name = "setup-coder-prod"
}

# Store OIDC credentials in 1Password for Coder deployment
resource "onepassword_item" "coder_oidc_credentials" {
  vault = data.onepassword_vault.coder_prod.uuid
  title = "coder-oidc-credentials"

  category = "login"

  section {
    label = "OIDC Configuration"

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

    field {
      label = "issuer_url"
      type  = "STRING"
      value = "https://keycloak.enigma.vgijssel.nl/realms/cozy"
    }
  }
}
