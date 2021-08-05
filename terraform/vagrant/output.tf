output "ssh_config" {
  value       = vagrant_vm.server.ssh_config[0]
  description = "The Vagrant box SSH config"
}