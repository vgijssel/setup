// TERRAMATE: GENERATED AUTOMATICALLY DO NOT EDIT

terraform {
  required_version = "1.4.2"
  required_providers {
    helm = {
      version = "2.9.0"
    }
    ssh = {
      source  = "AndrewChubatiuk/ssh"
      version = "0.1.5"
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
  server {
    host = var.provisioner_host
    port = var.provisioner_port
  }
  remote {
    host = "192.168.1.31"
    port = 16443
  }
}
provider "helm" {
  alias = "provisioner"
  kubernetes {
    config_path = "../../../tmp/provisioner_kube_config"
    host        = "https://${data.ssh_tunnel.kubernetes.local[0].address}"
  }
}
provider "tfe" {
}
