build {
  name = "hypervisor"
  sources = ["source.qemu.image"]

  provisioner "shell" {
    inline = ["/usr/bin/cloud-init status --wait"]
  }

  provisioner "shell-local" {
    inline = ["env"]
    env = {
      ssh_host = build.Host
      ssh_port = build.Port
      ssh_user = build.User
      ssh_password = build.Password
    }
  }
}