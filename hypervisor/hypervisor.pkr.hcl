variable "provision_script" {
  type = string
}

locals {
  # As the root user remove the packer user and shutdown the vm.
  # This will disconnect the ssh session and will prevent packer from
  # removing the uploaded provisioner script in the /tmp directory
  # therefore the /tmp directory is wiped in this script.
  cleanup_script = <<EOF
  set -ex 

  /usr/bin/cloud-init clean -l -s
  rm -f /etc/sudoers.d/90-cloud-init-users
  killall --user packer 
  userdel -rf packer
  rm -rf /tmp/*
  shutdown -P now
  EOF
}

build {
  name = "hypervisor"
  sources = ["source.qemu.image"]

  provisioner "shell" {
    inline = ["/usr/bin/cloud-init status --wait"]
  }

  provisioner "shell-local" {
    inline = [var.provision_script]
    # The default shebang is /bin/sh -e which causes the runfiles.bash
    # script to immediately exit on the first error encountered despite setting an 
    # exlicit set +e afterwards.
    inline_shebang = "/usr/bin/env bash"
    env = {
      SETUP_ENV = "build"
      ssh_host = build.Host
      ssh_port = build.Port
      ssh_user = build.User
      ssh_password = build.Password
    }
  }

  provisioner "shell" {
    expect_disconnect = true
    skip_clean = true
    inline = [
      "sudo su root -c '${local.cleanup_script}'"
    ]
  }
}