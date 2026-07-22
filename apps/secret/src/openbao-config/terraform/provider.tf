# The module owns the single `vault` provider block. Steady state uses plain
# in-cluster Kubernetes auth — the child's own ServiceAccount — exactly like the
# original terranetes `kubernetes` mode (SPEC §3.2). The old `var.auth_method`
# token/kubernetes dual-mode is gone: openbao-config now runs ONLY child-local,
# next to OpenBao, so there is a single auth path.
#
# Bootstrap ordering (SPEC §4, Task 2.4): the kubernetes auth backend + this
# module's executor login role are seeded by the OpenBao bring-up Workflow with a
# temporary root token BEFORE this Configuration first reconciles, so the executor
# can log in here. The Workflow deletes that token afterwards; steady-state
# reconciles carry no long-lived credential.
provider "vault" {
  address = var.bao_address

  # The vault provider mints a short-lived CHILD token after auth by default; the
  # executor's kubernetes-auth login token is not granted auth/token/create, so
  # that 403s. The login token is already suitable, so use it directly.
  skip_child_token = true

  # The v5 vault provider has no dedicated kubernetes block, so kubernetes auth uses
  # the generic auth_login: post the executor pod's projected ServiceAccount token
  # plus the executor's login role to auth/kubernetes/login.
  auth_login {
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
