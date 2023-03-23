// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

terraform {
  required_version = ">=1.0.0"
  required_providers {
    helm = {
      version = "2.9.0"
    }
    ssh = {
      source  = "thecadams/ssh"
      version = "0.1.12"
    }
    tfe = {
      version = "0.42.0"
    }
  }
}
variable "provisioner_private_key" {
  description = "Private key of the provisioner machine"
  sensitive   = true
  type        = string
}
variable "provisioner_host" {
  description = "Host name of the provisioner machine"
  sensitive   = true
  type        = string
}
variable "provisioner_port" {
  description = "Port number of the provisioner machine"
  sensitive   = true
  type        = string
}
locals {
  provisioner_private_key_file = abspath("${path.module}/provisioner_private_key")
}
resource "local_sensitive_file" "provisioner_private_key" {
  content         = var.provisioner_private_key
  file_permission = "0600"
  filename        = local.provisioner_private_key_file
}
module "kubernetes_tunnel" {
  depends_on = [
    local_sensitive_file.provisioner_private_key,
  ]
  gateway_host           = var.provisioner_host
  gateway_port           = var.provisioner_port
  gateway_user           = "ubuntu"
  source                 = "../../modules/ssh_tunnel"
  ssh_cmd                = "ssh -o StrictHostKeyChecking=no -i ${local.provisioner_private_key_file}"
  ssh_tunnel_check_sleep = "10s"
  target_host            = "192.168.1.31"
  target_port            = 16443
}
variable "provisioner_kube_config" {
  description = "Kube config of the provisioner machine"
  sensitive   = true
  type        = string
}
locals {
  provisioner_kube_config = yamldecode(var.provisioner_kube_config)
}
provider "helm" {
  alias = "provisioner"
  kubernetes {
    cluster_ca_certificate = base64decode(local.provisioner_kube_config.clusters[0].cluster.certificate-authority-data)
    host                   = "https://${module.kubernetes_tunnel.host}:${module.kubernetes_tunnel.port}"
    token                  = local.provisioner_kube_config.users[0].user.token
  }
}
provider "tfe" {
}
