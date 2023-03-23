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
        config_path = "${terramate.stack.path.to_root}/tmp/provisioner_kube_config"
      }
    }

    provider "tfe" {
    }
  }
}