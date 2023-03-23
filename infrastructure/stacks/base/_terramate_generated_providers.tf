// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

terraform {
  required_version = "1.4.2"
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
data "ssh_tunnel" "kubernetes" {
  user = "ubuntu"
  auth {
    private_key {
      content = var.provisioner_private_key
    }
  }
  local {
    host = "127.0.0.1"
    port = 3001
  }
  server {
    host = var.provisioner_host
    port = var.provisioner_port
  }
  remote {
    host = "192.168.1.31"
    port = 16443
  }
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
    host                   = "https://${data.ssh_tunnel.kubernetes.local[0].address}"
    token                  = local.provisioner_kube_config.users[0].user.token
  }
}
provider "tfe" {
}
