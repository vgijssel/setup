variable "server_name" {
  description = "Name of the Hetzner Cloud server"
  type        = string
  default     = "gateway-prod"
}

variable "server_type" {
  description = "Hetzner Cloud server type"
  type        = string
  default     = "cx23"
}

variable "datacenter" {
  description = "Hetzner Cloud datacenter"
  type        = string
  default     = "nbg1-dc3"
}

variable "ssh_public_key" {
  description = "SSH public key for server access"
  type        = string
  default     = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAvXN6EpJc9+19awLUuqdVvvjZ1v/ofx9dee9UzM3xXp"
}

variable "talos_image" {
  description = "Cozystack Talos image to use"
  type        = string
  default     = "ghcr.io/cozystack/cozystack/talos:v1.10.5"
}
