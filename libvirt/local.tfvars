qemu_uri       = "qemu+ssh://vagrant@libvirt/system?socket=/run/libvirt/libvirt-sock&command=ssh_vagrant_jump.sh"
network_bridge = "kube_network"
key_pair_files = {
  public_key_file  = "id_rsa.development.pub"
  private_key_file = "id_rsa.development"
}
kubeadm_bootstrap_token = "6nssif.sqlgtwudx90hs8lr"
worker_count            = 1
worker_memory           = 1536
worker_cpu_count        = 1
master_memory           = 1536
master_cpu_count        = 1
