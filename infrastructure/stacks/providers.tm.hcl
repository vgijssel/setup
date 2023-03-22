generate_hcl "_terramate_generated_providers.tf" {
  content {
    terraform {
      required_version = global.terraform_version
      
      required_providers {
        tfe = {
          version = "0.42.0"
        }

        helm = {
          version = "2.9.0"
        }
      }
    }

    provider "helm" {
      kubernetes {
        config_path = "/workspaces/setup/tmp/provisioner_kube_config"
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

    provider "tfe" {
    }
  }
}