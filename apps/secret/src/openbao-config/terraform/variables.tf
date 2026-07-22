variable "bao_address" {
  description = "OpenBao API address. Defaults to the in-cluster ClusterIP service co-located with this module in the secret child."
  type        = string
  default     = "http://openbao.secret.svc:8200"
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
  description = "Namespace the terraform-controller executor pod runs in (the Configuration's namespace in the secret child)."
  type        = string
  default     = "secret"
}
