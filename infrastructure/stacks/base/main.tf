resource "tfe_workspace" "provisioner" {
  name           = var.provisioner_workspace_name
  organization   = "home-production"
  execution_mode = "local"
}
