provider "docker" {
  host = "ssh://${var.provisioner_fqdn}"
}

resource "docker_container" "digitalrebar" {
  image        = docker_image.digitalrebar.latest
  name         = "digitalrebar"
  restart      = "always"
  start        = "true"
  network_mode = "host"

  volumes {
    volume_name    = docker_volume.digitalrebar.name
    container_path = "/provision/drp-data"
  }
}

resource "docker_image" "digitalrebar" {
  name = "digitalrebar/provision:latest"
}

resource "docker_volume" "digitalrebar" {
  name = "digitalrebar"
}
