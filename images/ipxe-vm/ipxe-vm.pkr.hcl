packer {
  required_plugins {
    docker = {
      version = ">= 1.1.1"
      source  = "github.com/hashicorp/docker"
    }
  }
}

variable "ipxe_efi" {
    type    = string
}

variable "output_dir" {
  type    = string
  default = "output"
}

locals {
  output_path = "${path.root}/${var.output_dir}"
  ipxe_efi_path = var.ipxe_efi

  image_distribution = "ubuntu"
  image_release = "noble"
  image_description = "Image for iPXE booting."
  image_architecture = "arm64"
  image_serial = formatdate("YYYYMMDD_hhmm", timestamp())

  # Following naming convention from https://linuxcontainers.org/distrobuilder/docs/latest/reference/image/
  image_name = "${local.image_distribution}-${local.image_release}-${local.image_architecture}-${local.image_serial}"
  image_file_name = "disk.qcow2"

  output_image_path = "${local.output_path}/${local.image_file_name}"
  build_image_path = "/build/${local.image_file_name}"

  distrobuilder_content = templatefile("${path.root}/ipxe-vm.yml.pkrtpl.hcl", {
    image_settings = {
      distribution = local.image_distribution,
      release = local.image_release,
      description = local.image_description,
      architecture = local.image_architecture,
      serial = local.image_serial,
      name = local.image_name,
    },
  })
}

source "docker" "distrobuilder" {
  # We're going to throw away the container afterwards because
  # we're only interested in the generated artifact. 
  discard = true
  build {
    path = "../distrobuilder-image/Dockerfile"
  }
  container_dir = "/build"

  # Needs to be privileged to do a loop mount on the partitions
  privileged = true
}

build {
  name = "build_image"
  sources = ["source.docker.distrobuilder"]

  provisioner "file" {
    destination = "/build/ipxe.efi"
    source = local.ipxe_efi_path
  }

  provisioner "file" {
    content = local.distrobuilder_content
    destination = "/build/ipxe-vm.yml"
  }

  provisioner "shell" {
    inline = [
      "distrobuilder build-incus --disable-overlay --type split --vm /build/ipxe-vm.yml /build/",
    ]
  }

  provisioner "file" {
    source = local.build_image_path
    destination = local.output_image_path
    direction = "download"
  }

  post-processors {
    post-processor "artifice" {
        files = [local.output_image_path]
    }
  }
}