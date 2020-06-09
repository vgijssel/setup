provider "libvirt" {
  uri = "qemu+ssh://vagrant@localhost:2222/system?socket=/run/libvirt/libvirt-sock&keyfile=../razor-server/keys/id_rsa"
}

resource "libvirt_pool" "data" {
  name = "data"
  type = "dir"
  path = "/data"
}

resource "libvirt_volume" "os_image" {
  name   = "os_image"
  pool   = libvirt_pool.data.name
  source = "../kubernetes/images/kubernetes/kubernetes_buster.qcow2"
}

resource "libvirt_domain" "master" {
  name       = "master"
  memory     = "1024"
  vcpu       = 1
  qemu_agent = true

  disk {
    volume_id = libvirt_volume.os_image.id
  }
}
