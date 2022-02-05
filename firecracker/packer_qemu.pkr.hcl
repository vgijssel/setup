variable "iso_file" {
  type = string
}

variable "iso_checksum" {
  type = string
}

variable "ssh_private_key_file" {
  type = string
}

variable "vm_name" {
  type = string
}

variable "cloud_init_meta_data" {
  type = string
}

variable "cloud_init_user_data" {
  type = string
}

source "qemu" "image" {
  vm_name           = "${var.vm_name}.qcow2"
  iso_url           = var.iso_file
  iso_checksum      = "file:${var.iso_checksum}"

  output_directory  = "output"
  shutdown_command  = "sudo shutdown -P now"
  format            = "qcow2"
  accelerator       = "hax"

  headless = true
  use_default_display = true
  display = "none"

  communicator = "ssh"
  ssh_username      = "ubuntu"
  ssh_private_key_file = var.ssh_private_key_file
  ssh_clear_authorized_keys = true

  disk_image = true
  use_backing_file = false

  net_device        = "virtio-net"
  disk_interface    = "virtio"

  cd_files = [
      "${var.cloud_init_meta_data}",
      "${var.cloud_init_user_data}",
  ]
  cd_label = "cidata"

  memory = 1024

  qemuargs = [
    ["-serial", "file:${var.vm_name}.packer.log"],
  ]
}