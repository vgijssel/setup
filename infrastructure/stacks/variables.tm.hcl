generate_hcl "_terramate_generated_variables.tf" {
  content {
    variable "provisioner_workspace_name" {
      type    = string
      default = global.provisioner_workspace_name
    }
  }
}