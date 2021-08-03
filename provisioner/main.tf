terraform {
  backend "local" {
    path = "/tmp/provisioner/terraform.tfstate"
  }
}

locals {
  box = filemd5("{{ Vagrantfile.tf_location }}")
  vagrantfile = filemd5("{{ data[':box'].tf_location }}")
}

// module "vagrant" {
//   source = "data['vagrant'].tf_location"
// }

provider "vagrant" {
}

// provider "docker" {
//   // host = "ssh://"
//   // henkie brappas
// }

// variable "provisioner_box_path" {
//   type    = string
// }

// module "vagrant_machine" {
//   source = "//provisioner:vagrant_machine"
//   // provisioner_box_path = var.provisioner_box_path
// }

# TODO: provision docker on the vagrant box created (or hostname for pi)
