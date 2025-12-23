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
