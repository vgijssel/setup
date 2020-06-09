provider "libvirt" {
  uri = "qemu+ssh://vagrant@localhost:2222/system?socket=/run/libvirt/libvirt-sock&keyfile=../razor-server/keys/id_rsa&no_verify=1&known_hosts=/dev/null"
}

resource "libvirt_pool" "data" {
  name = "data"
  type = "dir"
  path = "/data"
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

  disk {
    volume_id = libvirt_volume.master.id
  }
}

resource "libvirt_volume" "worker" {
  name   = "worker"
  pool   = libvirt_pool.data.name
  source = "../kubernetes/images/kubernetes/kubernetes_buster.qcow2"
}

resource "libvirt_domain" "worker" {
  name       = "worker"
  memory     = "1024"
  vcpu       = 1
  qemu_agent = true

  disk {
    volume_id = libvirt_volume.worker.id
  }
}
