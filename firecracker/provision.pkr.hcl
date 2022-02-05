variable "ansible_playbook_binary" {
  type = string
}

variable "ansible_playbook" {
  type = string
}

variable "kernel_file" {
  type = string
}

build {
  sources = ["source.qemu.image"]

  provisioner "shell" {
    inline = ["/usr/bin/cloud-init status --wait"]
  }

  provisioner "ansible" {
    command = var.ansible_playbook_binary
    playbook_file = var.ansible_playbook
  }

  # provisioner "breakpoint" {
  #   disable = false
  #   note    = "this is a breakpoint"
  # }

  # https://github.com/firecracker-microvm/firecracker/blob/main/docs/rootfs-and-kernel-setup.md#use-the-provided-recipe
  # CTRL+C after the kernel has been downloaded and extracted to enter 
  # make menuconfig if you want to make changes.
  provisioner "shell" {
    inline = [
      "cd /opt/firecracker",
      "sudo ./tools/devtool build_kernel -c kernel.config -n 8"
    ]
  }

  provisioner "file" {
    source = "/opt/firecracker/build/kernel/linux-4.19.155/vmlinux-4.19.155-x86_64.bin"
    direction = "download"
    destination = var.kernel_file
  }
}
