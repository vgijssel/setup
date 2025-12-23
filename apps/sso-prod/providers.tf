provider "keycloak" {
  url       = "https://keycloak.enigma.vgijssel.nl"
  client_id = "admin-cli"
  username  = "admin"
  password  = var.keycloak_admin_password
}

provider "onepassword" {
  # Uses OP_SERVICE_ACCOUNT_TOKEN from environment
}
