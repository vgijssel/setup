# OpenBao configuration as one flat OpenTofu module — the declarative definition of
# the secret child's OpenBao: the kv engine external-secrets reads, the kubernetes
# auth method, and the ACL policies/roles for its two in-cluster consumers (ESO and
# this module's own terraform executor). Reconciled child-local by the KubeVela
# terraform-controller against a kubernetes-backend state Secret (SPEC §3.2).
#
# Cross-cluster access (the network child reading this OpenBao over the tailnet) is
# re-established in Phase 3 (Task 3.1) with the new tailnet mechanism — it is NOT
# part of this module now that the api.<cluster>.vgijssel.nl kube-API proxy (and the
# live-JWKS-over-proxy JWT auth it enabled) is removed (SPEC §3).

# ── kv v2 secret engine ──────────────────────────────────────────────────────
# The engine external-secrets reads from. Mounts at `kv/`; version "2" matches the
# ClusterSecretStore's `version: v2`.
resource "vault_mount" "kv" {
  path        = "kv"
  type        = "kv"
  options     = { version = "2" }
  description = "kv v2 engine external-secrets reads cloudflare/tailscale/netdata from"
}

# ── kubernetes auth method ───────────────────────────────────────────────────
# OpenBao runs in-cluster and reviews tokens with its own ServiceAccount
# (system:auth-delegator), so kubernetes_host is all that is required.
resource "vault_auth_backend" "kubernetes" {
  type = "kubernetes"
  path = "kubernetes"
}

resource "vault_kubernetes_auth_backend_config" "kubernetes" {
  backend         = vault_auth_backend.kubernetes.path
  kubernetes_host = "https://kubernetes.default.svc:443"
}

# ── external-secrets: read-only over kv ──────────────────────────────────────
# Policy + login role for ESO's ClusterSecretStore (mountPath kubernetes, role
# external-secrets). ESO reads kv/* to sync Secrets in the child.
resource "vault_policy" "external_secrets" {
  name   = "external-secrets"
  policy = <<-EOT
    path "kv/data/*" {
      capabilities = ["read"]
    }
    path "kv/metadata/*" {
      capabilities = ["read", "list"]
    }
  EOT
}

resource "vault_kubernetes_auth_backend_role" "external_secrets" {
  backend                          = vault_auth_backend.kubernetes.path
  role_name                        = "external-secrets"
  bound_service_account_names      = ["external-secrets"]
  bound_service_account_namespaces = ["external-secrets"]
  token_policies                   = ["external-secrets"]
}

# ── terraform executor: the runner's own login ───────────────────────────────
# The admin policy + login role the KubeVela terraform-controller executor uses to
# reconcile THIS module child-local (kubernetes auth). Scoped to exactly what the
# module manages: the kv + kubernetes auth-method mounts, ACL policies
# (external-secrets AND this policy itself), and the kubernetes auth method's config
# + roles. It grants NO kv data access — ESO reads that, not the executor.
#
# Because the executor manages the very role/policy it logs in with, this policy MUST
# stay broad enough to always re-grant itself (sys/policies/acl/* + auth/kubernetes/*):
# a narrower policy could lock the executor out on a bad apply. The OpenBao bring-up
# Workflow (Task 2.4), holding the root token, is the recovery / seeding path.
resource "vault_policy" "openbao_config" {
  name   = "openbao-config"
  policy = <<-EOT
    # secret engine mounts (kv)
    path "sys/mounts" {
      capabilities = ["read", "list"]
    }
    path "sys/mounts/*" {
      capabilities = ["create", "read", "update", "delete"]
    }
    # auth method mounts (kubernetes)
    path "sys/auth" {
      capabilities = ["read", "list"]
    }
    path "sys/auth/*" {
      capabilities = ["create", "read", "update", "delete", "sudo"]
    }
    # ACL policies (external-secrets, and this policy itself). Grant the legacy
    # sys/policy endpoint plus the modern sys/policies/acl alias.
    path "sys/policy" {
      capabilities = ["read", "list"]
    }
    path "sys/policy/*" {
      capabilities = ["create", "read", "update", "delete", "list"]
    }
    path "sys/policies/acl" {
      capabilities = ["list"]
    }
    path "sys/policies/acl/*" {
      capabilities = ["create", "read", "update", "delete", "list"]
    }
    # kubernetes auth method config + roles (external-secrets + this executor)
    path "auth/kubernetes/*" {
      capabilities = ["create", "read", "update", "delete", "list"]
    }
  EOT
}

resource "vault_kubernetes_auth_backend_role" "openbao_config" {
  backend                          = vault_auth_backend.kubernetes.path
  role_name                        = var.k8s_auth_role
  bound_service_account_names      = [var.executor_service_account]
  bound_service_account_namespaces = [var.executor_namespace]
  token_policies                   = ["openbao-config"]
}
