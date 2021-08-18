terraform {
  backend "local" {
    path = "/tmp/provisioner/terraform.tfstate"
  }
}

provider "vagrant" {
}

provider "docker" {
  host = "ssh://${local.ssh_config.user}@${local.ssh_config.host}:${local.ssh_config.port}"
}

locals {
  box_path   = "{{ data[':box'].tf_file_location }}"
  ssh_config = module.vagrant.ssh_config
}

module "vagrant" {
  source           = "{{ data[':vagrant'].tf_module_location }}"
  box_path         = local.box_path
  vagrantfile_path = "{{ Vagrantfile.tf_file_location }}"
}

resource "docker_image" "nginx" {
  name = "nginx:latest"
}

# TODO: provision docker on the vagrant box created using the vagrant created ssh credentials
