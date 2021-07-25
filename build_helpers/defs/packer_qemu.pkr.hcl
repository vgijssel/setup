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

variable "output_directory" {
  type = string
}

variable "ansible_playbook" {
  type = string
}

variable "ansible_arguments" {
  type = list(string)
  default = []
}

variable "awd" {
  type = string
  description = "The Ansible working directory defined by $PDW."
}

variable "cd_files" {
  type = list(string)
  default = []
}

variable "arch" {
  type = string
  default = "amd64"
}

source "qemu" "image" {
  vm_name           = "${var.vm_name}.qcow2"
  iso_url           = var.iso_file
  iso_checksum      = "file:${var.iso_checksum}"

  output_directory  = var.output_directory
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

  cd_files = var.cd_files
  cd_label = "cidata"

  memory = 512

  qemuargs = [
    ["-serial", "file:${var.output_directory}/${var.vm_name}.packer.log"],
  ]
}

build {
  sources = ["source.qemu.image"]

  provisioner "shell" {
    inline = ["/usr/bin/cloud-init status --wait"]
  }

  provisioner "ansible" {
    playbook_file = var.ansible_playbook
    extra_arguments = concat([
      "--extra-vars", "architecture=${var.arch}",
      "--extra-vars", "awd=${var.awd}",
    ], var.ansible_arguments)
  }

  # provisioner "breakpoint" {
  #   disable = false
  #   note    = "this is a breakpoint"
  # }

  # post-processors {
  #   # post-processor "shell-local" {
  #   #   inline = ["cp -v ../scripts/qcow_to_vagrant/box.ovf ${var.output_directory}/box.ovf"]
  #   # }

  #   # post-processor "shell-local" {
  #   #   inline = ["qemu-img convert -f qcow2 -O vmdk ${var.output_directory}/provisioner.qcow2 ${var.output_directory}/box-disk001.vmdk"]
  #   # }

  #   # post-processor "artifice" {
  #   #   files = [
  #   #     "${var.output_directory}/box-disk001.vmdk",
  #   #     "${var.output_directory}/box.ovf",
  #   #   ]
  #   # }

  #   # post-processor "vagrant" {
  #   #   keep_input_artifact = true
  #   #   provider_override = "virtualbox"
  #   #   output = local.provisioner_box_path
  #   # }

  #   # Try to remove the locally box stored in Vagrant
  #   # so the next time "vagrant up" is run the new box is being used.
  #   post-processor "shell-local" {
  #     inline = ["vagrant box remove -f file://${local.provisioner_box_path}"]
  #     valid_exit_codes = [
  #       0,
  #       1,
  #     ]
  #   }
  # }
}
