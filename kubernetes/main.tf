data "external" "kubernetes_digest" {
  program = ["terraform_digest.sh", "${path.module}/image.cfg"]
}

locals {
  kubernetes_image = "../${data.external.kubernetes_digest.result.result}/kubernetes_buster.qcow2"
}

module "master" {
  source = "./modules/node"

  name = "${var.master_hostname}.${var.parent_domain}"
  public_key_path = var.public_key_path
  image_path = local.kubernetes_image
  libvirt_pool_name = var.libvirt_pool_name
  network_bridge = var.network_bridge
  memory = var.worker_memory
  cpu_count = var.worker_cpu_count
}

module "worker" {
  source = "./modules/node"

  count = var.worker_count
  name = "${var.worker_hostname}${count.index}.${var.parent_domain}"
  public_key_path = var.public_key_path
  image_path = local.kubernetes_image
  libvirt_pool_name = var.libvirt_pool_name
  network_bridge = var.network_bridge
  memory = var.worker_memory
  cpu_count = var.worker_cpu_count
}
