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
  docker_tag = file("{{ data[':digitalrebar|tag'].tf_location }}")
  docker_archive = abspath("{{ data[':digitalrebar|archive'].tf_location }}")
  docker_image = "localhost:5000/digitalrebar:latest"
  skopeo = abspath("{{ bin.tf_location }}")
}

resource "null_resource" "push_digitalrebar" {
  triggers = {
    docker_tag = local.docker_tag
  }

  provisioner "local-exec" {
    command = "${local.skopeo} --override-os=linux copy --dest-tls-verify=false docker-archive:${local.docker_archive} docker://${local.docker_image}"
  }
}

resource "docker_image" "digitalrebar" {
  depends_on = [
    null_resource.push_digitalrebar,
  ]
  name = local.docker_image
}

# VOLUME ["/provision/drp-data"]

data "docker_network" "host_network" {
  name = "host"
}

# resource "docker_service" "digitalrebar" {
#   name = "digitalrebar"

#   task_spec {
#     networks = [data.docker_network.host_network.id]

#     container_spec {
#       image = docker_image.digitalrebar.latest

#       # mounts {
#       #   target = "/var/lib/digitalrebar"
#       #   source = docker_volume.digitalrebar.name
#       #   type   = "volume"
#       # }

#       # secrets {
#       #   file_name   = "/certs/domain.crt"
#       #   secret_id   = docker_secret.domain-crt.id
#       #   secret_name = docker_secret.domain-crt.name
#       # }

#       # secrets {
#       #   file_name   = "/certs/domain.key"
#       #   secret_id   = docker_secret.domain-key.id
#       #   secret_name = docker_secret.domain-key.name
#       # }

#       # env = {
#       #   REGISTRY_HTTP_TLS_CERTIFICATE = "/certs/domain.crt"
#       #   REGISTRY_HTTP_TLS_KEY         = "/certs/domain.key"
#       # }
#     }
#   }

# endpoint_spec {
#   ports {
#     target_port    = 8091
#     publish_mode   = "host"
#     published_port = 8091
#   }

#   ports {
#     target_port    = 8092
#     publish_mode   = "host"
#     published_port = 8092
#   }
# }
# }

# locals {
#   kerk = "{{ data[':digitalrebar|tag'].content }}"
# }


# resource "docker_container" "digitalrebar" {
#   name  = "digitalrebar"
#   image = docker_image.digitalrebar.latest
#   # ports {
#   #   internal = 5000
#   #   external = 5000
#   # }
# }

# resource "null_resource" "push_digitalrebar" {
#   triggers = {
#     master_id = docker_container.registry.id,
#   }

#   connection {
#     host = "provisioner"
#   }

#   provisioner "file" {
#     source      = "{{ data[':digitalrebar|archive'].tf_location }}"
#     destination = "/tmp/kerk"
#   }

#   # provisioner "local-exec" {
#   #   command = "ls -la"
#   # }
# }

# Create the buildkit builder
# docker buildx create

# Build the docker image using buildx
# docker buildx --builder objective_merkle build -o type=oci,dest=digital-rebar-test.tar --platform linux/amd64,darwin/amd64 -t digital-rebar-test .

# Following https://docs.docker.com/registry/insecure/
# generate a self-signed certificate and mount in the registry container
# should be done with Terraform

# Push the linux/amd64 image to the registry
# plz skopeo --override-os=linux copy --dest-tls-verify=false oci-archive:$PWD/digital-rebar-test.tar docker://localhost:5000/digital-rebar-test:latest
