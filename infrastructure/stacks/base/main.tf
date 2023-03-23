resource "tfe_workspace" "provisioner" {
  name           = var.provisioner_workspace_name
  organization   = "home-production"
  execution_mode = "remote"
}

module "ssh_tunnel" {
  source = "../../modules/ssh_tunnel"

  target_host = var.provisioner_host
  target_port = 22

  # gateway_host = data.aws_instances.bastions.public_ips[0]
}
