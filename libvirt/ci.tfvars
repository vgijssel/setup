qemu_uri       = "qemu:///system"
network_bridge = "ci_network"
key_pair_files= {
  public_key_file= "id_rsa.development.pub"
  private_key_file= "id_rsa.development"
}
worker_count = 1
worker_memory = 1536
worker_cpu_count = 1
master_memory = 1536
master_cpu_count = 1
