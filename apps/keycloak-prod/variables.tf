# Keycloak API credentials - passed via -var-file from vault-shell
variable "keycloak_url" {
  description = "Keycloak server URL"
  type        = string
}

variable "keycloak_user" {
  description = "Keycloak admin username"
  type        = string
}

variable "keycloak_password" {
  description = "Keycloak admin password"
  type        = string
  sensitive   = true
}

variable "keycloak_realm" {
  description = "Keycloak realm name"
  type        = string
}
