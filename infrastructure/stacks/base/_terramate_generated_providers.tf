// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

terraform {
  required_version = "1.4.2"
  required_providers {
    helm = {
      version = "2.9.0"
    }
    tfe = {
      version = "0.42.0"
    }
  }
}
provider "helm" {
  kubernetes {
    config_path = "/workspaces/setup/tmp/provisioner_kube_config"
  }
}
provider "tfe" {
}
