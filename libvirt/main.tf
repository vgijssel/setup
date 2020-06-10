provider "libvirt" {
  uri = "qemu+ssh://vagrant@libvirt/system?socket=/run/libvirt/libvirt-sock&command=ssh_vagrant_jump.sh"
}

resource "libvirt_pool" "data" {
  name = "data"
  type = "dir"
  path = "/data"
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

resource "libvirt_network" "kube_network" {
  name      = "kube_network"
  mode      = "bridge"
  bridge    = "kube_network_br"
  autostart = true
}

resource "libvirt_volume" "master" {
  name   = "master"
  pool   = libvirt_pool.data.name
  source = "../kubernetes/images/kubernetes/kubernetes_buster.qcow2"
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
    type        = "pty"
    target_port = "0"
    target_type = "serial"
  }
}
