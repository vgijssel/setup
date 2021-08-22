terraform {
  backend "local" {
    path = "{{ backend.tf_location }}/provisioner-env.tfstate"
  }
}

provider "docker" {
  host = "ssh://provisioner"
}

resource "docker_image" "registry" {
  name = "registry:latest"
}

# TODO: push the digitalrebar image to registry in the provisioner
