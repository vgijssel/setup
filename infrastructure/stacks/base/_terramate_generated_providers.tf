// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

terraform {
  required_version = "1.4.2"
  required_providers {
    helm = {
      version = "2.9.0"
    }
    tfe = {
      version = "0.42.0"
    }
  }
}
variable "provisioner_host" {
  description = "Host name of the provisioner machine"
  type        = string
}
variable "provisioner_port" {
  description = "Port number of the provisioner machine"
  type        = string
}
module "kubernetes_tunnel" {
  gateway_host           = var.provisioner_host
  gateway_port           = var.provisioner_port
  gateway_user           = "ubuntu"
  source                 = "../../../infrastructure/modules/ssh_tunnel"
  ssh_tunnel_check_sleep = "10s"
  target_host            = "192.168.1.31"
  target_port            = 16443
}
provider "helm" {
  alias = "provisioner"
  kubernetes {
    config_path = "../../../tmp/provisioner_kube_config"
    host        = "https://${module.kubernetes_tunnel.host}:${module.kubernetes_tunnel.port}"
  }
}
provider "tfe" {
}
