# resource "helm_release" "vault" {
#   provider   = helm.legacy
#   name       = "vault"
#   repository = "https://helm.releases.hashicorp.com"
#   chart      = "vault"
#   # Version copied from https://github.com/hashicorp/vault-helm/releases
#   version = "0.23.0"
# }

resource "helm_release" "vault" {
  provider   = helm.provisioner
  name       = "vault"
  repository = "https://helm.releases.hashicorp.com"
  chart      = "vault"
  # Version copied from https://github.com/hashicorp/vault-helm/releases
  version = "0.23.0"
}

# module "ssh_tunnel" {
#   source = "../../modules/ssh_tunnel"

#   target_host = var.provisioner_host
#   target_port = 22

#   # gateway_host = data.aws_instances.bastions.public_ips[0]
# }
