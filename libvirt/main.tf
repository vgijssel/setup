terraform {
  required_version = ">= 0.13.0"

  required_providers {
    drp = {
      source  = "local/setup/drp"
      version = "0.0.1"
    }
  }
}

provider "drp" {
  username = "rocketskates"
  password = "r0cketsk8ts"
}

# TODO: how to recover machines in building state in resource pool?
# TODO: failed machine does not show up as failing in terraform

data "external" "libvirt_digest" {
  program = ["terraform_digest.sh", "${path.module}/image.cfg"]
}

locals {
  libvirt_image        = "../${data.external.libvirt_digest.result.result}/libvirt.tgz"
  remote_libvirt_image = "images/libvirt.tgz"
}

resource "null_resource" "upload_image" {
  triggers = {
    image_sha = local.libvirt_image
  }

  provisioner "local-exec" {
    command = "drpcli files upload ${local.libvirt_image} as ${local.remote_libvirt_image}"
  }
}

resource "drp_machine" "libvirt" {
  pool = "base"
  add_parameters = [
    "image-deploy/image-file: files/${local.remote_libvirt_image}",
    "image-deploy/image-sha: ${null_resource.upload_image.triggers.image_sha}",
  ]
  timeout = "3m"
}
