output "ssh_config" {
  value       = vagrant_vm.server.ssh_config[0]
  description = "The Vagrant box SSH config"
}

output "name" {
  value       = vagrant_vm.server.machine_names[0]
  description = "The name of the Vagrant box"
}
