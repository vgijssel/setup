terraform {
  required_version = ">= 0.13.0"

  required_providers {
    # TODO: https://github.com/dmacvicar/terraform-provider-libvirt/issues/747
    libvirt = {
      source = "local/setup/libvirt"
      version = "0.0.1"
    }
  }
}

provider "libvirt" {
  uri = "qemu+ssh://${var.libvirt_fqdn}/system?socket=/run/libvirt/libvirt-sock"
}

resource "libvirt_pool" "data" {
  name = "data"
  type = "dir"
  path = "/data/vms/storage"
}

resource "libvirt_network" "kube_network" {
  name      = "kube_network"
  mode      = "bridge"
  bridge    = var.network_bridge
  autostart = true
}

module "kubernetes" {
  source = "../kubernetes"

  public_key_path = var.public_key_path
  parent_domain = var.parent_domain
  libvirt_pool_name = libvirt_pool.data.name
  network_bridge = var.network_bridge

  worker_count = var.worker_count
  worker_memory = var.worker_memory
  worker_cpu_count = var.worker_cpu_count
  master_cpu_count = var.master_cpu_count
  master_memory = var.master_memory
}

# data "template_file" "kubeadm_init_sh" {
#   template = file("${path.module}/kubeadm_init.sh.tmpl")
#   vars = {
#     kubeadm_bootstrap_token = var.kubeadm_bootstrap_token
#     control_plane_endpoint = libvirt_domain.master.name
#   }
# }

# data "template_file" "kubeadm_join_sh" {
#   template = file("${path.module}/kubeadm_join.sh.tmpl")
#   vars = {
#     kubeadm_bootstrap_token = var.kubeadm_bootstrap_token
#     control_plane_endpoint = libvirt_domain.master.name
#   }
# }



# resource "shell_script" "master" {
#   depends_on = [
#     libvirt_domain.master
#   ]

#   lifecycle_commands {
#     create = "echo CREATE"
#     # update = file("${path.module}/scripts/kubeadm_init.sh")
#     delete = "echo 'GONERS'"
#   }

#   environment = {
#     CONTROL_PLANE_ENDPOINT = "master.dev"
#   }
# }

# resource "null_resource" "master" {
#   # Only re-run provisioner when the master changed or when the script changed
#   triggers = {
#     # TODO: use filemd5?
#     master_id = libvirt_domain.master.id
#     template = data.template_file.kubeadm_init_sh.rendered
#   }

#   # provisioner "file" {
#   #   content      = data.template_file.kubeadm_init_sh.rendered
#   #   destination = "/tmp/kubeadm_init.sh"
#   # }

#   # provisioner "remote-exec" {
#   #   inline = [
#   #     "chmod +x /tmp/kubeadm_init.sh",
#   #     "/tmp/kubeadm_init.sh",
#   #   ]
#   # }
# }

# resource "libvirt_cloudinit_disk" "worker" {
#   name           = "worker${count.index}_cloudinit.iso"
#   user_data      = data.template_file.user_data.rendered
#   network_config = data.template_file.network_config.rendered
#   meta_data      = "local-hostname: worker${count.index}"
#   pool           = libvirt_pool.data.name
#   count          = var.worker_count
# }

# resource "libvirt_volume" "worker" {
#   name           = "worker${count.index}.qcow2"
#   pool           = libvirt_pool.data.name
#   base_volume_id = libvirt_volume.kubernetes.id
#   count          = var.worker_count
# }

# resource "libvirt_domain" "worker" {
#   count      = var.worker_count
#   name       = "worker${count.index}"
#   memory     = var.worker_memory
#   vcpu       = var.worker_cpu_count
#   qemu_agent = true
#   autostart  = true

#   disk {
#     volume_id = libvirt_volume.worker[count.index].id
#   }

#   cloudinit = libvirt_cloudinit_disk.worker[count.index].id

#   network_interface {
#     hostname = "worker.dev"
#     wait_for_lease = true
#     bridge         = libvirt_network.kube_network.bridge
#   }

#   console {
#     type        = "pty"
#     target_port = "0"
#   }
# }

# resource "null_resource" "worker" {
#   count          = var.worker_count

#   # We can only start joining worker nodes once the master node is ready!
#   depends_on = [
#     null_resource.master,
#   ]

#   connection {
#     type = "ssh"
#     host = "worker${count.index}.dev"
#   }

#   # Only re-run provisioner when the worker changed or when the script changed
#   triggers = {
#     worker_id = libvirt_domain.worker[count.index].id
#     template = data.template_file.kubeadm_join_sh.rendered
#   }

#   provisioner "file" {
#     content      = data.template_file.kubeadm_join_sh.rendered
#     destination = "/tmp/kubeadm_join.sh"
#   }

#   provisioner "remote-exec" {
#     inline = [
#       "chmod +x /tmp/kubeadm_join.sh",
#       "/tmp/kubeadm_join.sh",
#     ]
#   }
# }
