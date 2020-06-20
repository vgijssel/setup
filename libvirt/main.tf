provider "libvirt" {
  uri = var.qemu_uri
}

resource "libvirt_pool" "data" {
  name = "data"
  type = "dir"
  path = "/data/vms/storage"
}

resource "libvirt_cloudinit_disk" "commoninit" {
  name           = "commoninit.iso"
  user_data      = data.template_file.user_data.rendered
  network_config = data.template_file.network_config.rendered
  pool           = libvirt_pool.data.name
}

data "template_file" "user_data" {
  template = file("${path.module}/cloud-init/kubernetes-user-data.yml")
}

data "template_file" "network_config" {
  template = file("${path.module}/cloud-init/kubernetes-network-config.yml")
}

data "external" "kubernetes_digest" {
  program = ["terraform_digest.sh", "${var.setup_kubernetes_dir}/image.cfg"]
}

locals {
  kubernetes_image = "${var.setup_root_dir}/${data.external.kubernetes_digest.result.result}/kubernetes_buster.qcow2"
}

resource "libvirt_network" "kube_network" {
  name      = "kube_network"
  mode      = "bridge"
  bridge    = "kube_network_br"
  autostart = true
}

resource "libvirt_volume" "master" {
  name   = "master"
  pool   = libvirt_pool.data.name
  source = local.kubernetes_image

  # create associated log file because otherwise libvirt will cry :/
  provisioner "file" {
    content     = "file-provisioner-needs-some-content"
    destination = "/data/vms/logs/master.log"

    connection {
      type     = "ssh"
      user     = "vagrant"
      password = "vagrant"
      host     = "libvirt"

      bastion_host     = "localhost"
      bastion_port     = 2222
      bastion_user     = "vagrant"
      bastion_password = "vagrant"
    }
  }
}

resource "libvirt_domain" "master" {
  name       = "master"
  memory     = "1024"
  vcpu       = 1
  qemu_agent = true
  autostart  = true

  disk {
    volume_id = libvirt_volume.master.id
  }

  cloudinit = libvirt_cloudinit_disk.commoninit.id

  network_interface {
    network_id     = libvirt_network.kube_network.id
    wait_for_lease = true
    bridge         = libvirt_network.kube_network.bridge
  }

  console {
    type        = "file"
    target_port = "0"
    target_type = "serial"
    source_path = "/data/vms/logs/master.log"
  }
}
