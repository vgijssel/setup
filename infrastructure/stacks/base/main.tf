# resource "tfe_organization" "home-production" {
#   name  = "home-production"
#   email = ""
# }

resource "tfe_workspace" "provisioner" {
  name         = "provisioner"
  organization = "home-production"
}
