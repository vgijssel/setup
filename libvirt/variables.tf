variable "qemu_uri" {
  type = string
  # https://libvirt.org/uri.html#URI_remote
  description = "Uri to connect to qemu"
}

variable "setup_kubernetes_dir" {
  type = string
}

variable "setup_root_dir" {
  type = string
}

variable "setup_razor_server_dir" {
  type = string
}

variable "setup_secrets_dir" {
  type = string
}

variable "key_pair_files" {
  description = "Contains file names for the private/public key pair"
  type = object({
    public_key_file  = string
    private_key_file = string
  })
}

locals {
  key_pair_paths = {
    public_key_path  = "${var.setup_secrets_dir}/${var.key_pair_files.public_key_file}"
    private_key_path = "${var.setup_secrets_dir}/${var.key_pair_files.private_key_file}"
  }
}

variable "ssh_user" {
  type = string
  description  = "Username of user used to connect to vms"
  default = "vagrant"

}

variable "worker_count" {
  type        = number
  description = "Number of kubernetes workers to create"
}

variable "worker_memory" {
  type        = number
  description = "Amount of ram for a kubernetes worker vm"
}

variable "worker_cpu_count" {
  type        = number
  description = "Number of vcpus for a kubernetes worker vm"
}

variable "master_memory" {
  type        = number
  description = "Amount of ram for a kubernetes master vm"
}

variable "master_cpu_count" {
  type        = number
  description = "Number of vcpus for a kubernetes master vm"
}

variable "network_bridge" {
  type        = string
  description = "Network bridge to attach vms to"
}
