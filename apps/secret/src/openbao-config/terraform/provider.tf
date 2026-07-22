# The module owns the single `vault` provider block. Steady state uses plain
# in-cluster Kubernetes auth — the child's own ServiceAccount — like the original
# terranetes `kubernetes` mode (SPEC §3.2). A single BOOTSTRAP escape hatch
# (var.use_token) remains for the one-shot first apply, where the kubernetes auth
# backend this module itself creates does not exist yet: the OpenBao bring-up
# Workflow (Task 2.4) applies once with use_token=true and a temporary root token
# (injected by the `vault` Provider Secret), then deletes the token and lets
# steady-state reconciles fall back to kubernetes auth (use_token=false).
provider "vault" {
  address = var.bao_address

  # The vault provider mints a short-lived CHILD token after auth by default; the
  # executor's kubernetes-auth login token is not granted auth/token/create, so
  # that 403s. The login/root token is already suitable, so use it directly.
  skip_child_token = true

  # Kubernetes auth (steady state). The v5 vault provider has no dedicated
  # kubernetes block, so use the generic auth_login. Gated OFF during bootstrap so
  # the provider falls back to the VAULT_TOKEN env the Provider Secret injects.
  dynamic "auth_login" {
    for_each = var.use_token ? [] : [1]
    content {
      path   = "auth/kubernetes/login"
      method = "kubernetes"
      parameters = {
        role = var.k8s_auth_role
        # `try(file(...), "")` so `tofu validate` (which eagerly evaluates this and
        # runs off-cluster where the token file is absent) does not error; the
        # provider is not configured at validate, so an empty jwt is harmless. At
        # apply the executor pod mounts the token and the real value is read.
        jwt = try(file("/var/run/secrets/kubernetes.io/serviceaccount/token"), "")
      }
    }
  }
}
