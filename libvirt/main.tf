provider "libvirt" {
  uri = var.qemu_uri
}

resource "libvirt_pool" "data" {
  name = "data"
  type = "dir"
  path = "/data/vms/storage"
}

data "template_file" "kubeadm_init_sh" {
  template = file("${path.module}/kubeadm_init.sh.tmpl")
  vars = {
    kubeadm_bootstrap_token = var.kubeadm_bootstrap_token
    control_plane_endpoint = libvirt_domain.master.name
  }
}

data "template_file" "user_data" {
  template = file("${path.module}/cloud-init/kubernetes-user-data.yml")
  vars = {
    public_key = file(local.key_pair_paths.public_key_path)
  }
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

resource "libvirt_cloudinit_disk" "master" {
  name           = "master_cloudinit.iso"
  user_data      = data.template_file.user_data.rendered
  network_config = data.template_file.network_config.rendered
  meta_data      = "local-hostname: master"
  pool           = libvirt_pool.data.name
}

resource "libvirt_volume" "master" {
  name           = "master.qcow2"
  pool           = libvirt_pool.data.name
  base_volume_id = libvirt_volume.kubernetes.id
}

resource "libvirt_domain" "master" {
  name       = "master"
  memory     = var.master_memory
  vcpu       = var.master_cpu_count
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

resource "null_resource" "master" {
  connection {
    host = libvirt_domain.master.name
    user = var.ssh_user
    private_key = file(local.key_pair_paths.private_key_path)

    bastion_host = var.bastion_host
    bastion_port = var.bastion_port
    bastion_user = var.ssh_user
    bastion_private_key = file(local.key_pair_paths.private_key_path)
  }

  # Only re-run provisioner when the master changed or when the script changed
  triggers = {
    master_id = libvirt_domain.master.id
    template = data.template_file.kubeadm_init_sh.rendered
  }

  provisioner "file" {
    content      = data.template_file.kubeadm_init_sh.rendered
    destination = "/tmp/kubeadm_init.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/kubeadm_init.sh",
      "/tmp/kubeadm_init.sh",
    ]
  }
}

resource "libvirt_cloudinit_disk" "worker" {
  name           = "worker${count.index}_cloudinit.iso"
  user_data      = data.template_file.user_data.rendered
  network_config = data.template_file.network_config.rendered
  meta_data      = "local-hostname: worker${count.index}"
  pool           = libvirt_pool.data.name
  count          = var.worker_count
}

resource "libvirt_volume" "worker" {
  name           = "worker${count.index}.qcow2"
  pool           = libvirt_pool.data.name
  base_volume_id = libvirt_volume.kubernetes.id
  count          = var.worker_count
}

resource "libvirt_domain" "worker" {
  count      = var.worker_count
  name       = "worker${count.index}"
  memory     = var.worker_memory
  vcpu       = var.worker_cpu_count
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
