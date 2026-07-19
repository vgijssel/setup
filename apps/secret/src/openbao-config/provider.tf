# The module owns the vault provider block. terranetes requires a providerRef and
# always injects a provider block from the referenced Provider CR — so that Provider
# uses a throwaway `null` type (injecting a harmless `provider "null" {}`), NOT vault,
# to avoid a duplicate vault configuration here. This module is therefore the single
# source of the vault provider config for BOTH runners.
#
# Two auth modes by var.auth_method:
#   token      -> local secret:configure. No auth_login; the provider reads the root
#                 token from VAULT_TOKEN (exported from 1Password). No token in git/state.
#   kubernetes -> in-cluster terranetes runner. auth_login (method=kubernetes) posts the
#                 runner pod's ServiceAccount JWT — read from the projected token file —
#                 plus the `terranetes` role, exchanging them for a short-lived token. The
#                 v5 provider has no dedicated kubernetes block and its generic auth_login
#                 does not auto-read the token, so the jwt is supplied explicitly here.
provider "vault" {
  address = var.bao_address

  # The vault provider creates a short-lived CHILD token after auth by default; the
  # terranetes login token isn't granted auth/token/create, so that 403s. The token from
  # auth_login (and the local root token) is already suitable, so use it directly.
  skip_child_token = true

  dynamic "auth_login" {
    for_each = var.auth_method == "kubernetes" ? [1] : []
    content {
      path   = "auth/kubernetes/login"
      method = "kubernetes"
      parameters = {
        role = var.k8s_auth_role
        jwt  = file("/var/run/secrets/kubernetes.io/serviceaccount/token")
      }
    }
  }
}
