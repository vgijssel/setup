resource "random_integer" "ssh_port" {
  min = "10000"
  max = "60000"
}

data "external" "ssh_tunnel" {
  program = [
    var.shell_cmd,
    "${path.module}/tunnel.sh"
  ]

  query = {
    timeout                = var.timeout,
    ssh_cmd                = var.ssh_cmd,
    local_host             = var.local_host,
    local_port             = random_integer.ssh_port.result,
    target_host            = var.target_host,
    target_port            = var.target_port,
    gateway_host           = var.gateway_host,
    gateway_port           = var.gateway_port,
    gateway_user           = var.gateway_user,
    shell_cmd              = var.shell_cmd,
    ssh_tunnel_check_sleep = var.ssh_tunnel_check_sleep
    create                 = ((var.create && var.putin_khuylo) ? "y" : "")
  }
}
