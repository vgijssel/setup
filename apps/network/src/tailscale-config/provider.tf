# This module owns BOTH provider blocks (terranetes injects only a throwaway
# provider "null" {} from the Provider CR). The vault provider reads the tailscale
# OAuth client from OpenBao; the tailscale provider is then configured from that read.
# So the only external dependency is a reachable OpenBao holding the credential.
#
# Two vault auth modes by var.auth_method:
#   token -> local network:configure first apply. Provider reads the root token from
#            VAULT_TOKEN (exported from 1Password). No token in git/state.
#   jwt   -> in-cluster terranetes runner. auth_login_jwt posts the executor pod's
#            ServiceAccount JWT to the remote jwt-network backend (role
#            network-terranetes), exchanging it for a short-lived token. This is why
#            the tailnet egress + JWT grant must already exist — hence the out-of-band
#            first apply that establishes them (chicken-and-egg).
provider "vault" {
  address = var.bao_address

  # The provider creates a short-lived CHILD token after auth by default; the jwt login
  # token isn't granted auth/token/create, so that 403s. The login/root token is already
  # suitable, so use it directly.
  skip_child_token = true

  dynamic "auth_login_jwt" {
    for_each = var.auth_method == "jwt" ? [1] : []
    content {
      mount = var.jwt_mount
      role  = var.jwt_role
      jwt   = file("/var/run/secrets/kubernetes.io/serviceaccount/token")
    }
  }
}

# The tailscale OAuth client used to manage the policy file. Read at plan/apply time
# from OpenBao (kv v2 -> nested under .data.data).
data "vault_kv_secret_v2" "tailscale" {
  mount = var.tailscale_kv_mount
  name  = var.tailscale_kv_path
}

provider "tailscale" {
  oauth_client_id     = data.vault_kv_secret_v2.tailscale.data["oauth_client_id"]
  oauth_client_secret = data.vault_kv_secret_v2.tailscale.data["oauth_client_secret"]
  scopes              = var.tailscale_oauth_scopes
  tailnet             = var.tailnet
}
