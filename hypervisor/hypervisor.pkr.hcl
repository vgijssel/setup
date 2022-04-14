variable "provision_script" {
  type = string
}

build {
  name = "hypervisor"
  sources = ["source.qemu.image"]

  provisioner "shell" {
    inline = ["/usr/bin/cloud-init status --wait"]
  }

  provisioner "shell-local" {
    inline = [var.provision_script]
    # todo: add comment about shebang
    inline_shebang = "/usr/bin/env bash"
    env = {
      SETUP_ENV = "build"
      ssh_host = build.Host
      ssh_port = build.Port
      ssh_user = build.User
      ssh_password = build.Password
    }
  }

  # Ensure we reset cloud-init so it's re-run the next time the image is loaded.
  provisioner "shell" {
    inline = ["sudo /usr/bin/cloud-init clean"]
  }
}