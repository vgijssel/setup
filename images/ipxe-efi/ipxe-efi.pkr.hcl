packer {
  required_plugins {
    docker = {
      version = ">= 1.1.1"
      source  = "github.com/hashicorp/docker"
    }
  }
}

variable "output_dir" {
  type    = string
  default = "output"
}

locals {
  output_path = "${path.root}/${var.output_dir}"
  ipxe_target = "bin-arm64-efi/ipxe.efi"
  ipxe_output_path = "${local.output_path}/ipxe.efi"
}

source "docker" "ipxe" {
  # We're going to throw away the container afterwards because
  # we're only interested in the generated artifact. 
  discard = true
  build {
    path = "Dockerfile"
  }
}

build {
  name = "build_image"
  sources = ["source.docker.ipxe"]

  provisioner "shell" {
    inline = [
      "make EMBED=embedded.ipxe CROSS=aarch64-linux-gnu- ${local.ipxe_target}",
    ]
  }

  provisioner "file" {
    source = "/opt/ipxe/src/${local.ipxe_target}"
    destination = local.ipxe_output_path
    direction = "download"
  }

  post-processors {
    post-processor "artifice" {
      files = [
        local.ipxe_output_path,
      ]
    }
  }
}