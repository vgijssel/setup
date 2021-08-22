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

module "vagrant" {
  source           = "{{ data[':vagrant'].tf_location }}"
  box_path         = "{{ data[':box'].tf_location }}"
  vagrantfile_path = "{{ Vagrantfile.tf_location }}"
}

resource "docker_image" "nginx" {
  name = "nginx:latest"
}

# TODO: push the digitalrebar image to registry in the provisioner
