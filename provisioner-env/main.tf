terraform {
  backend "local" {
    path = "{{ backend.tf_location }}/provisioner-env.tfstate"
  }
}

provider "docker" {
  host = "ssh://provisioner"
}

resource "docker_image" "registry" {
  name = "registry:latest"
}

# TODO: push the digitalrebar image to registry in the provisioner
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
