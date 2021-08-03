terraform {
  required_providers {
    vagrant = {
      source  = "bmatcuk/vagrant"
      version = "4.0.0"
    }
  }
}

variable "provisioner_box_path" {
    type = string
    # TODO: relative to the root of the terraform root?
    default = "_modules/vagrant_machine/box.box"
}

locals {
  vagrantfile_dir = "."
  provisioner_box_file = "file://${var.provisioner_box_path}"
  vagrantfile_sha      = md5(file("${local.vagrantfile_dir}/Vagrantfile"))
  box_sha              = filemd5(var.provisioner_box_path)
  box_name             = "provisioner-${local.box_sha}"
}

resource "null_resource" "clear_vagrant_boxes" {
  triggers = {
    box_sha = local.box_sha
  }

  provisioner "local-exec" {
    command = "vagrant box remove -f ${local.provisioner_box_file} || true"
    environment = {
      PROVISIONER_BOX_PATH = var.provisioner_box_path
    }
  }
}

resource "vagrant_vm" "provisioner" {
  name = local.box_name
  depends_on = [
    null_resource.clear_vagrant_boxes
  ]
  env = {
    VAGRANTFILE_HASH     = local.box_sha
    PROVISIONER_BOX_PATH = var.provisioner_box_path
  }
  get_ports       = false
  vagrantfile_dir = local.vagrantfile_dir
}