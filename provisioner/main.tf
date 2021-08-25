terraform {
  backend "local" {
    path = "{{ backend.tf_location }}/provisioner.tfstate"
  }
}

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
    command = "ansible-playbook -i provisioner, {{ data['provision.yml'].tf_location }}"
  }
}
