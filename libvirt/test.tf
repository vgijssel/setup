provider "libvirt" {
  uri = "qemu+ssh://debian@192.168.64.101/system?socket=/run/libvirt/libvirt-sock&keyfile=../scripts/keys/id_rsa"
}

resource "libvirt_volume" "os_image" {
  name   = "os_image"
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
