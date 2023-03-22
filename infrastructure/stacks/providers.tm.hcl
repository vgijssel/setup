generate_hcl "_terramate_generated_providers.tf" {
  content {
    terraform {
      required_version = global.terraform_version
    }

    provider "helm" {
      kubernetes {
        config_path = "~/.kube/config"
      }

      # localhost registry with password protection
      # registry {
      #   url = "oci://localhost:5000"
      #   username = "username"
      #   password = "password"
      # }

      # # private registry
      # registry {
      #   url = "oci://private.registry"
      #   username = "username"
      #   password = "password"
      # }
    }

  }
}