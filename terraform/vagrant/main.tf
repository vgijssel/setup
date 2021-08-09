terraform {
  required_providers {
    vagrant = {
      source  = "bmatcuk/vagrant"
      version = "4.1.0"
    }
  }
}

locals {
  vagrantfile_dir = dirname(var.vagrantfile_path)
  vagrantfile_sha = md5(file(var.vagrantfile_path))
  box_sha         = filemd5(var.box_path)
  box_name        = local.box_sha

  # TODO: the vagrant box terraform module should set an environment variable for
  # VAGRANT_DOTFILE_PATH to not lose the vagrant state when rebuilding
  # see https://www.vagrantup.com/docs/other/environmental-variables
  environment = merge({
    VAGRANTFILE_SHA = local.vagrantfile_sha
    BOX_PATH        = var.box_path
  }, var.environment)
}

resource "null_resource" "clear_vagrant_box" {
  triggers = {
    box_name = local.box_name
  }

  provisioner "local-exec" {
    command     = "vagrant box remove -f ${var.box_path} || true"
    environment = local.environment
  }
}

resource "vagrant_vm" "server" {
  name = local.box_name
  depends_on = [
    null_resource.clear_vagrant_box
  ]
  env             = local.environment
  get_ports       = false
  vagrantfile_dir = local.vagrantfile_dir
}
