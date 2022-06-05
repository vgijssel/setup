datacenter = "dc1"
data_dir  = "/opt/consul"

bind_addr = "127.0.0.1"
client_addr = "127.0.0.1"

log_level = "INFO"

server = true
bootstrap_expect = 1

connect {
  enabled = true
}

ui_config {
  enabled          = true
}

addresses {
  grpc = "127.0.0.1"
}

ports {
  grpc  = 8502
}
