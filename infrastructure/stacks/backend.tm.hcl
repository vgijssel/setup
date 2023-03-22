generate_hcl "_terramate_generated_backend.tf" {
  content {
    terraform {
        cloud {
          organization = "home-production"

          workspaces {
            name = global.cloud_workspace_name
          }
      }
    }
  }
}