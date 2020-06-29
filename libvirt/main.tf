provider "libvirt" {
  uri = var.qemu_uri
}

resource "libvirt_pool" "data" {
  name = "data"
  type = "dir"
  path = "/data/vms/storage"
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
  bridge    = var.network_bridge
  autostart = true
}

resource "libvirt_volume" "kubernetes" {
  name   = "kubernetes"
  pool   = libvirt_pool.data.name
  source = local.kubernetes_image
}

resource "ansible_group" "all" {
  inventory_group_name = "all"
  vars = {
    ansible_user     = "vagrant"
    master_ip = libvirt_domain.master.network_interface[0].addresses[0]
    ansible_ssh_private_key_file="/tmp/id_rsa"
  }
}

resource "libvirt_cloudinit_disk" "master" {
  name           = "master_cloudinit.iso"
  user_data      = data.template_file.user_data.rendered
  network_config = data.template_file.network_config.rendered
  meta_data = "local-hostname: master"
  pool           = libvirt_pool.data.name
}

resource "libvirt_volume" "master" {
  name           = "master.qcow2"
  pool           = libvirt_pool.data.name
  base_volume_id = libvirt_volume.kubernetes.id
}

resource "libvirt_domain" "master" {
  name       = "master"
  memory     = "1536"
  vcpu       = 1
  qemu_agent = true
  autostart  = true

  disk {
    volume_id = libvirt_volume.master.id
  }

  cloudinit = libvirt_cloudinit_disk.master.id

  network_interface {
    network_id     = libvirt_network.kube_network.id
    wait_for_lease = true
    bridge         = libvirt_network.kube_network.bridge
  }

  console {
    type        = "pty"
    target_port = "0"
    # target_type = "serial"
    # source_path = "/data/vms/logs/master.log"
  }
}

resource "ansible_host" "master" {
  inventory_hostname = libvirt_domain.master.name
  groups             = ["master"]
}

resource "libvirt_cloudinit_disk" "worker" {
  name           = "worker${count.index}_cloudinit.iso"
  user_data      = data.template_file.user_data.rendered
  network_config = data.template_file.network_config.rendered
  meta_data = "local-hostname: worker${count.index}"
  pool           = libvirt_pool.data.name
  count = var.workers_count
}

resource "libvirt_volume" "worker" {
  name           = "worker${count.index}.qcow2"
  pool           = libvirt_pool.data.name
  base_volume_id = libvirt_volume.kubernetes.id
  count = var.workers_count
}

resource "libvirt_domain" "worker" {
  count = var.workers_count
  name       = "worker${count.index}"
  memory     = "1536"
  vcpu       = 1
  qemu_agent = true
  autostart  = true

  disk {
    volume_id = libvirt_volume.worker[count.index].id
  }

  cloudinit = libvirt_cloudinit_disk.worker[count.index].id

  network_interface {
    network_id     = libvirt_network.kube_network.id
    wait_for_lease = true
    bridge         = libvirt_network.kube_network.bridge
  }

  console {
    type        = "pty"
    target_port = "0"
  }
}

resource "ansible_host" "worker" {
  inventory_hostname = libvirt_domain.worker[count.index].name
  groups             = ["worker"]
  count = var.workers_count
}
