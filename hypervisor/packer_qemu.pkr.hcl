variable "output_image" {
  type = string
}

locals {
    vm_name = basename(var.output_image)
    output_directory = dirname(var.output_image)
}

variable "iso_file" {
  type = string
}

variable "iso_checksum" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "ssh_password" {
  type = string
}

variable "cloud_init_meta_data_file" {
  type = string
}

variable "cloud_init_user_data_file" {
  type = string
}

source "qemu" "image" {
  vm_name           = local.vm_name
  output_directory  = local.output_directory

  iso_url           = var.iso_file
  iso_checksum      = var.iso_checksum

  format            = "qcow2"
  accelerator       = "hax"

  headless = true
  use_default_display = true
  display = "none"

  communicator = "ssh"
  ssh_username      = var.ssh_username
  ssh_password      = var.ssh_password
  ssh_clear_authorized_keys = true
  cd_files = [
      var.cloud_init_meta_data_file,
      var.cloud_init_user_data_file,
  ]
  cd_label = "cidata"

  disk_image = true
  use_backing_file = false

  net_device        = "virtio-net"
  disk_interface    = "virtio"

  memory = 1024

  qemuargs = [
    ["-serial", "file:/tmp/${local.vm_name}.packer.log"],
  ]
}