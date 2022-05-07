# TODO: change this to logical directory
data_dir  = "/tmp/nomad"

bind_addr = "127.0.0.1"

log_level = "DEBUG"

advertise {
  # Defaults to the first private IP address.
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