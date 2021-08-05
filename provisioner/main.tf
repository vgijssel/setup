terraform {
  backend "local" {
    path = "/tmp/provisioner/terraform.tfstate"
  }
}

provider "vagrant" {
}

provider "docker" {
  // host = "ssh://"
}

locals {
  box_path = "{{ data[':box'].tf_file_location }}"
}



# module "vagrant" {
#   source           = "vagrant.tf_file_location"
#   box_path         = local.box_path
#   vagrantfile_path = "Vagrantfile.tf_file_location"
# }

# TODO: provision docker on the vagrant box created (or hostname for pi)
