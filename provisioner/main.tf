provider "docker" {
  host = "ssh://${var.provisioner_fqdn}"
}

resource "docker_container" "digital-rebar" {
  image        = docker_image.digital-rebar.latest
  name         = "digital-rebar"
  restart      = "always"
  start        = "true"
  network_mode = "host"

  volumes {
    volume_name    = docker_volume.digital-rebar.name
    container_path = "/provision/drp-data"
  }
}

data "external" "docker_build_info" {
  program = ["docker_build_info.sh"]
}

data "docker_registry_image" "digital-rebar" {
  name = "${var.docker_registry}/${var.digital_rebar_image}:${data.external.docker_build_info.result.ref}"
}

resource "docker_image" "digital-rebar" {
  name          = data.docker_registry_image.digital-rebar.name
  pull_triggers = [data.docker_registry_image.digital-rebar.sha256_digest]
}

resource "docker_volume" "digital-rebar" {
  name = "digital-rebar"
}
