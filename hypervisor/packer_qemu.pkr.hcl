variable "output_image" {
  type = string
}

locals {
    vm_name = basename(var.output_image)
    output_directory = dirname(var.output_image)

    # Once the packer provisioning is done the packer user needs to be removed.
    # Because the packer user is also used to execute commands over ssh,
    # we need to let the root user remove the packer user.
    # Packer needs a friendly disconnect after giving the shutdown command
    # which means we need to run the user deletion script in the background 
    # once ssh is disconnected (wait 5 seconds). 
    # To implement this we use screen run as root.
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

variable "kernel" {
  type = string
}

variable "initrd" {
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
  iso_target_extension = "qcow2"

  format            = "qcow2"
  disk_compression  = true
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
    ["-serial", "file:/tmp/setup-bazel-${local.vm_name}-packer.log"],
    ["-kernel", var.kernel],
    ["-initrd", var.initrd],
    ["-append", "root=LABEL=cloudimg-rootfs ro console=tty1 console=ttyS0 no_timer_check"],
  ]
}