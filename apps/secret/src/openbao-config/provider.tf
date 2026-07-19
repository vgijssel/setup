# OpenBao speaks the Vault API, so the hashicorp/vault provider drives it. The
# provider authenticates one of two ways depending on var.auth_method — the same
# module, two runners, one shared state:
#
#   token      -> local `secret:configure`. The provider reads the root token from
#                 the VAULT_TOKEN env var (exported from 1Password by configure.sh).
#                 No auth_login block is rendered; no token is written to state/git.
#   kubernetes -> the in-cluster terranetes runner. auth_login_kubernetes exchanges
#                 the runner pod's ServiceAccount JWT for a short-lived token via the
#                 `terranetes` role — no root token in the cluster.
provider "vault" {
  address = var.bao_address

  # Kubernetes login via the generic auth_login block (method = "kubernetes"); the
  # provider reads the runner pod's ServiceAccount JWT from the default in-cluster
  # path. The login path is the literal "auth/kubernetes/login" (not a reference to
  # the managed vault_auth_backend below) — the provider authenticates before any
  # resource is read, so a managed-resource reference here would be a config cycle.
  # The first local root-token apply creates that auth backend + the terranetes role,
  # so the SA login path already exists by the time this runs in-cluster.
  dynamic "auth_login" {
    for_each = var.auth_method == "kubernetes" ? [1] : []
    content {
      path   = "auth/kubernetes/login"
      method = "kubernetes"
      parameters = {
        role = var.k8s_auth_role
      }
    }
  }
}
