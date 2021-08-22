terraform {
  backend "local" {
    path = "/tmp/provisioner/terraform.tfstate"
  }
}

provider "vagrant" {
}

provider "docker" {
  host = "ssh://provisioner"
}

locals {
  box_path   = "{{ data[':box'].tf_file_location }}"
  ssh_config = module.vagrant.ssh_config
}

module "vagrant" {
  please_root      = var.please_root
  source           = "{{ data[':vagrant'].tf_module_location }}"
  box_path         = local.box_path
  vagrantfile_path = "{{ Vagrantfile.tf_file_location }}"
}

resource "docker_image" "nginx" {
  name = "nginx:latest"
}

# TODO: provision docker on the vagrant box created using the vagrant created ssh credentials
