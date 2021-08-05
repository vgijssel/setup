variable "box_path" {
  type = string
}

# TODO: needs validator that the string ends with Vagrantfile
variable "vagrantfile_path" {
  type = string
}

variable "environment" {
  type        = map(any)
  default     = {}
  description = "Environment variables to set in the vagrant runtime"
}
