terraform {
  backend "kubernetes" {
    secret_suffix    = "state"
    config_path      = "./kubeconfig"
  }
}