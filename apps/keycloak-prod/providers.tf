terraform {
  required_version = ">= 1.0"

  required_providers {
    keycloak = {
      source  = "keycloak/keycloak"
      version = "5.6.0"
    }
    onepassword = {
      source  = "1Password/onepassword"
      version = "2.1.2"
    }
  }
}

provider "keycloak" {
  client_id = "admin-cli"
  username  = local.keycloak_username
  password  = local.keycloak_password
  url       = local.keycloak_url
}

provider "onepassword" {
}
