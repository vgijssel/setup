provider "vagrant" {
}

module "vagrant" {
  source           = "{{ data[':vagrant'].tf_location }}"
  box_path         = "{{ data[':box'].tf_location }}"
  vagrantfile_path = "{{ Vagrantfile.tf_location }}"
}

resource "null_resource" "provision_docker_swarm" {
  triggers = {
    machine_name = module.vagrant.name
  }

  provisioner "local-exec" {
    command = "{{ provision.tf_location }}"
  }
}
