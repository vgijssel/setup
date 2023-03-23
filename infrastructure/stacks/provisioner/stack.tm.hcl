stack {
  name = "provisioner"

  after = [
    "/infrastructure/stacks/base"
  ]

  tags = [
    "provisioner",
  ]
}

globals {
  cloud_workspace_name = global.provisioner_workspace_name
}