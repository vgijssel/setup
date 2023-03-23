generate_hcl "_terramate_generated_providers.tf" {
  content {
    terraform {
      required_version = global.terraform_version

      required_providers {
        tfe = {
          version = "0.42.0"
        }

        helm = {
          version = "2.9.0"
        }

        ssh = {
          source  = "AndrewChubatiuk/ssh"
          version = "0.1.5"
        }
      }
    }

    variable "provisioner_private_key" {
      type        = string
      description = "Private key of the provisioner machine"
      sensitive   = true
    }

    variable "provisioner_host" {
      type        = string
      description = "Host name of the provisioner machine"
      sensitive   = true
    }

    variable "provisioner_port" {
      type        = string
      description = "Port number of the provisioner machine"
      sensitive   = true
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

    # this module generates a host and port which represent a local tunnel to the actual kubernetes cluster
    # module "kubernetes_tunnel" {
    #   source = "${terramate.stack.path.to_root}/infrastructure/modules/ssh_tunnel"

    #   # connect to the 
    #   target_host = "192.168.1.31"
    #   target_port = 16443

    #   gateway_user           = "ubuntu"
    #   gateway_host           = var.provisioner_host
    #   gateway_port           = var.provisioner_port
    #   ssh_tunnel_check_sleep = "10s"

    #   # gateway_host = data.aws_instances.bastions.public_ips[0]
    # }

    # provider "helm" {
    #   alias    = "legacy"

    #   kubernetes {
    #     config_path = "${terramate.stack.path.to_root}/tmp/provisioner_kube_config"
    #     # config = file("~/.kube/config")
    #   }
    # }

    provider "helm" {
      alias = "provisioner"

      kubernetes {
        # so this connects to https://localhost:<PORT> which forwards the requests using the SSH tunnel to the actual kubernetes cluster
        host = "https://${data.ssh_tunnel.kubernetes.local.0.address}"
        # username = "admin"
        config_path = "${terramate.stack.path.to_root}/tmp/provisioner_kube_config"
      }
    }

    provider "tfe" {
    }
  }
}