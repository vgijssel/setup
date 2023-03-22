// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

terraform {
  required_version = "1.4.2"
}
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}
