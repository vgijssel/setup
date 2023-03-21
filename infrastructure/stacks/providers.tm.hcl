generate_hcl "_terramate_generated_providers.tf" {
  content {
    terraform {
      required_version = global.terraform_version
    }
  }
}