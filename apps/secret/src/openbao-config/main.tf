# OpenBao configuration as one flat OpenTofu module — the declarative replacement
# for the vault-config-operator CRs (apps/secret/src/config) plus the bootstrap.sh
# foothold. Reconciled by terranetes-controller in-cluster and by the local
# `secret:configure` root-token apply, both against one shared kubernetes-backend
# state so neither recreates the other's resources.

# ── kv v2 secret engine ──────────────────────────────────────────────────────
# The engine external-secrets reads from. Mounts at `kv/`; version "2" matches the
# ClusterSecretStore's `version: v2`. Replaces SecretEngineMount/kv.
resource "vault_mount" "kv" {
  path        = "kv"
  type        = "kv"
  options     = { version = "2" }
  description = "kv v2 engine external-secrets reads cloudflare/tailscale/netdata from"
}

# ── kubernetes auth method ───────────────────────────────────────────────────
# Replaces AuthEngineMount/kubernetes + the bootstrap.sh `bao auth enable
# kubernetes` + `bao write auth/kubernetes/config`. OpenBao runs in-cluster and
# reviews tokens with its own ServiceAccount (system:auth-delegator), so
# kubernetes_host is all that is required.
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
# external-secrets). Body kept equivalent to policy-external-secrets.yaml so ESO
# keeps working across the operator -> Terraform swap.
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

# ── terranetes: the controller's own login ───────────────────────────────────
# The admin policy + login role terranetes uses to reconcile THIS module in-cluster
# (auth_method = kubernetes). Scoped to exactly what the module manages: secret- and
# auth-engine mounts, ACL policies (external-secrets AND terranetes itself), and the
# kubernetes auth method's config + roles. It grants NO kv data access — ESO reads
# that, not the controller.
#
# Because terranetes manages the very role/policy it logs in with, this policy MUST
# stay broad enough to always re-grant itself (sys/policies/acl/* + auth/kubernetes/*):
# a narrower policy could lock the controller out on a bad apply. The local root-token
# `secret:configure` is the recovery path — it re-creates this role/policy. Replaces
# the vault-config-operator policy/role (the operator is retired in T16).
resource "vault_policy" "terranetes" {
  name   = "terranetes"
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
    # ACL policies (external-secrets, and this terranetes policy itself). Grant the
    # legacy sys/policy endpoint plus the modern sys/policies/acl alias.
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
    # kubernetes auth method config + roles (external-secrets + terranetes)
    path "auth/kubernetes/*" {
      capabilities = ["create", "read", "update", "delete", "list"]
    }
  EOT
}

resource "vault_kubernetes_auth_backend_role" "terranetes" {
  backend                          = vault_auth_backend.kubernetes.path
  role_name                        = "terranetes"
  bound_service_account_names      = ["terranetes-executor"]
  bound_service_account_namespaces = ["terranetes-system"]
  token_policies                   = ["terranetes"]
}
