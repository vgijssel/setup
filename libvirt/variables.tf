variable "qemu_uri" {
  type        = string
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

variable "workers_count" {
  type = number
  default = 1
  description = "Number of kubernetes workers to create"
}
