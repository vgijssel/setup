provider "docker" {
  host = "ssh://provisioner"
}

resource "docker_image" "registry" {
  name         = "registry:latest"
  keep_locally = true
}

resource "docker_volume" "registry" {
  name = "registry"
}

resource "tls_private_key" "registry" {
  algorithm   = "ECDSA"
  ecdsa_curve = "P384"
}

resource "tls_self_signed_cert" "registry" {
  key_algorithm   = "ECDSA"
  private_key_pem = tls_private_key.registry.private_key_pem

  subject {
    common_name  = "localhost"
    organization = "setup"
  }

  validity_period_hours = 12

  allowed_uses = [
    "key_encipherment",
    "digital_signature",
    "server_auth",
  ]
}

resource "docker_secret" "domain-crt" {
  name = "domain-crt"
  data = base64encode(tls_self_signed_cert.registry.cert_pem)
}

resource "docker_secret" "domain-key" {
  name = "domain-key"
  data = base64encode(tls_private_key.registry.private_key_pem)
}

resource "docker_service" "registry" {
  name = "registry"

  task_spec {
    container_spec {
      image = docker_image.registry.latest

      mounts {
        target = "/var/lib/registry"
        source = docker_volume.registry.name
        type   = "volume"
      }

      secrets {
        file_name   = "/certs/domain.crt"
        secret_id   = docker_secret.domain-crt.id
        secret_name = docker_secret.domain-crt.name
      }

      secrets {
        file_name   = "/certs/domain.key"
        secret_id   = docker_secret.domain-key.id
        secret_name = docker_secret.domain-key.name
      }

      env = {
        REGISTRY_HTTP_TLS_CERTIFICATE = "/certs/domain.crt"
        REGISTRY_HTTP_TLS_KEY         = "/certs/domain.key"
      }
    }
  }

  endpoint_spec {
    ports {
      target_port    = 5000
      publish_mode   = "host"
      published_port = 5000
    }
  }
}

locals {
  docker_tag             = replace(file("{{ data[':digitalrebar|tag'].tf_location }}"), ":", "_")
  docker_archive         = abspath("{{ data[':digitalrebar|archive'].tf_location }}")
  docker_image           = "localhost:5000/digitalrebar:${local.docker_tag}"
  skopeo                 = abspath("{{ bin.tf_location }}")
  digitalrebar_provision = "{{ provision.tf_location }}"
}

resource "null_resource" "push_digitalrebar" {
  depends_on = [
    docker_service.registry
  ]
  triggers = {
    docker_tag = local.docker_tag
  }

  provisioner "local-exec" {
    command = "${local.skopeo} --override-os=linux copy --dest-tls-verify=false docker-archive:${local.docker_archive} docker://${local.docker_image}"
  }
}

resource "docker_volume" "digitalrebar" {
  name = "digitalrebar"
}

resource "docker_image" "digitalrebar" {
  depends_on = [
    null_resource.push_digitalrebar,
  ]
  name          = local.docker_image
  pull_triggers = [local.docker_image]
  keep_locally  = true
}

data "docker_network" "host_network" {
  name = "host"
}

resource "docker_service" "digitalrebar" {
  name = "digitalrebar"

  task_spec {
    networks = [data.docker_network.host_network.id]

    container_spec {
      image = docker_image.digitalrebar.repo_digest

      mounts {
        target = "/provision/drp-data"
        source = docker_volume.digitalrebar.name
        type   = "volume"
      }
    }
  }
}

resource "null_resource" "provision_digitalrebar" {
  triggers = {
    digitalrebar_server        = docker_service.digitalrebar.id
    digitalrebar_provision_sha = filemd5(local.digitalrebar_provision)
  }

  provisioner "local-exec" {
    command = local.digitalrebar_provision
  }
}