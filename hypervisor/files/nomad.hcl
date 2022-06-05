data_dir  = "/opt/nomad"

bind_addr = "127.0.0.1"
log_level = "INFO"

advertise {
  http = "127.0.0.1"
  rpc  = "127.0.0.1"
  serf = "127.0.0.1"
}

server {
  enabled          = true
  bootstrap_expect = 1
}

client {
  enabled       = true
  servers = ["127.0.0.1"]
}

plugin "raw_exec" {
  config {
    enabled = true
  }
}