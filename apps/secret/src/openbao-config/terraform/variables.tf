variable "bao_address" {
  description = "OpenBao API address. Defaults to the pod's headless-service DNS (openbao-internal), which is stable for the single-node HA raft; the `openbao` active Service flaps during leader-election settle."
  type        = string
  default     = "http://openbao-0.openbao-internal.secret.svc:8200"
}

variable "use_token" {
  description = <<-EOT
    Auth mode for the vault provider:
      false (default, steady state) - in-cluster kubernetes auth (§3.2); the
             executor logs in with k8s_auth_role using its ServiceAccount token.
      true  (one-shot bootstrap)    - no auth_login; the provider reads the
             temporary root VAULT_TOKEN injected by the `vault` Provider Secret.
             The OpenBao bring-up Workflow (Task 2.4) uses this for the FIRST apply
             (the kubernetes auth backend does not exist yet), then deletes the
             token; subsequent reconciles run with use_token=false.
  EOT
  type        = bool
  default     = false
}

variable "k8s_auth_role" {
  description = "kubernetes auth role the terraform executor logs in with (the executor's own login role, created by this module)."
  type        = string
  default     = "openbao-config"
}

variable "executor_service_account" {
  description = "ServiceAccount name the terraform-controller executor pod runs as; bound by the executor's kubernetes auth role."
  type        = string
  default     = "tf-executor"
}

variable "executor_namespace" {
  description = "Namespace the terraform-controller executor pod runs in — the child's vela-system, co-located with the child terraform-controller and its kubernetes-backend state Secret."
  type        = string
  default     = "vela-system"
}
