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
    # network cluster JWT auth method config + role (network-eso)
    path "auth/jwt-network/*" {
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

# ── network cluster: remote JWT auth (a REMOTE consumer of this OpenBao) ──────
# The network cluster runs no OpenBao of its own; its external-secrets reads kv/*
# from THIS OpenBao over the tailnet (secret.vgijssel.nl) using JWT auth. OpenBao
# can't reach the network API to fetch its JWKS live, so it validates network
# SA-token signatures against STATIC public keys (jwt_validation_pubkeys) captured by
# `network:bootstrap`. All three resources are gated on the issuer + keys being
# present, so this module still applies cleanly on the secret cluster before the
# network cluster is bootstrapped (SPEC: JWT auth, static JWKS).
locals {
  network_enabled = var.network_oidc_issuer != "" && length(var.network_jwks_pubkeys) > 0
}

resource "vault_jwt_auth_backend" "network" {
  count                  = local.network_enabled ? 1 : 0
  path                   = "jwt-network"
  type                   = "jwt"
  description            = "JWT auth for the network cluster's external-secrets (static JWKS)"
  bound_issuer           = var.network_oidc_issuer
  jwt_validation_pubkeys = var.network_jwks_pubkeys

  # Enabling the backend uses sys/auth/* (already granted), but configuring it writes
  # auth/jwt-network/config — a path this very apply is adding to the terranetes policy.
  # Force that policy broadening to land first so the in-cluster terranetes runner (whose
  # token re-reads the policy live) isn't 403'd on its own first apply.
  depends_on = [vault_policy.terranetes]
}

# Read-only over kv, mirroring external-secrets. Least privilege: the network cluster
# gets NOTHING beyond read on kv/* (SPEC Boundaries → Always / Never).
resource "vault_policy" "network_read" {
  count  = local.network_enabled ? 1 : 0
  name   = "network-read"
  policy = <<-EOT
    path "kv/data/*" {
      capabilities = ["read"]
    }
    path "kv/metadata/*" {
      capabilities = ["read", "list"]
    }
  EOT
}

# The login role bound to the network cluster's external-secrets ServiceAccount.
# ESO mints a projected SA token with audience "openbao" and posts it to jwt-network;
# OpenBao checks the signature (static JWKS), issuer, audience, and subject, then
# issues a token carrying network-read.
resource "vault_jwt_auth_backend_role" "network_eso" {
  count           = local.network_enabled ? 1 : 0
  backend         = vault_jwt_auth_backend.network[0].path
  role_name       = "network-eso"
  role_type       = "jwt"
  bound_audiences = ["openbao"]
  bound_subject   = "system:serviceaccount:external-secrets:external-secrets"
  user_claim      = "sub"
  token_policies  = ["network-read"]
  token_ttl       = 3600

  # Writing auth/jwt-network/role/network-eso needs the broadened terranetes policy;
  # depend on it (and implicitly on the backend) so ordering is correct on first apply.
  depends_on = [vault_policy.terranetes]
}

# Login role for the network cluster's terranetes runner (executor SA). It reconciles
# apps/network/src/tailscale-config, whose module reads the tailscale OAuth client from
# kv/network-tailscale-config — so it needs the same read-only network-read policy. Bound
# to the executor's subject. The runner presents its DEFAULT ServiceAccount token (not an
# audience-scoped projected token like ESO), whose `aud` is the cluster's default API
# audience. OpenBao rejects a JWT carrying an `aud` claim unless the role binds audiences,
# so bind it: in this cluster the default API audience equals the OIDC issuer
# (https://kubernetes.default.svc.cluster.local), so reuse network_oidc_issuer.
resource "vault_jwt_auth_backend_role" "network_terranetes" {
  count           = local.network_enabled ? 1 : 0
  backend         = vault_jwt_auth_backend.network[0].path
  role_name       = "network-terranetes"
  role_type       = "jwt"
  bound_audiences = [var.network_oidc_issuer]
  bound_subject   = "system:serviceaccount:terranetes-system:terranetes-executor"
  user_claim      = "sub"
  token_policies  = ["network-read"]
  token_ttl       = 3600

  depends_on = [vault_policy.terranetes]
}
