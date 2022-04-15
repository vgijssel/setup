variable "output_image" {
  type = string
}

locals {
    vm_name = basename(var.output_image)
    output_directory = dirname(var.output_image)

    # As the root user remove the packer user and shutdown the vm.
    # This will disconnect the ssh session and will prevent packer from
    # removing the uploaded provisioner script in the /tmp directory
    # therefore the /tmp directory is wiped in this script.
    cleanup_and_shutdown_command = <<EOF
    set -ex
    sleep 5;
    /usr/bin/cloud-init clean -l -s;
    rm -f /etc/sudoers.d/90-cloud-init-users;
    userdel -rf packer;
    shutdown -P now;
    EOF
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
  shutdown_command = "sudo screen -d -m /bin/sh -c '${local.cleanup_and_shutdown_command}'"

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