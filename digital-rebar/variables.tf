variable "setup_box_dir" {
  type        = string
  description = "Directory which stores box files"
}

variable "local_network_bridge_interface" {
  type        = string
  description = "Name of the local bridge interface to connect vm to"
}
