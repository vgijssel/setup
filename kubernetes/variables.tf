variable "public_key_path" {
  type        = string
  description = "File path to public key to be added to node"
}

variable "worker_hostname" {
  type = string
  description = "Prefix of the worker hostname, based on the number of workers the index will be added to the name."
  default = "worker"
}

variable "master_hostname" {
  type = string
  description = "Prefix of the master hostname"
  default = "master"
}

variable "parent_domain" {
  type = string
  description = "Suffix of the FQDN of hosts"
}

variable "libvirt_pool_name" {
  type = string
  description = "Name of the libvirt pool where to store the imported disk images."
}

variable "network_bridge" {
  type = string
  description = "Name of the network bridge to attach the nodes to."
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
