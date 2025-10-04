packer {
  required_plugins {
    docker = {
      version = ">= 1.1.1"
      source  = "github.com/hashicorp/docker"
    }
  }
}

variable "pikvm_image" {
  type    = string
  default = "https://files.pikvm.org/images/v3-hdmi-rpi4-box-20240904.img.xz"
}

variable "output_dir" {
  type    = string
  default = "output"
}

locals {
  output_path = "${path.root}/${var.output_dir}"
  partition_path = "${local.output_path}/partitions"
  partition_paths = [
    "${local.partition_path}/0.fat",
    "${local.partition_path}/2.img",
  ]
  image_path = "${local.output_path}/image"
  image_distribution = "pikvm-v3-hdmi-rpi4-box"
  image_release = "20240904"
  image_description = "PiKVM Incus image."
  image_architecture = "arm64"
  image_serial = formatdate("YYYYMMDD_hhmm", timestamp())
  image_alias = "${local.image_distribution}/${local.image_release}"
  image_alias_latest = "${local.image_distribution}/latest"

  # Following naming convention from https://linuxcontainers.org/distrobuilder/docs/latest/reference/image/
  image_name = "${local.image_distribution}-${local.image_release}-${local.image_architecture}-${local.image_serial}"
  image_compressed_file_name = "${local.image_name}.tar.xz"

  distrobuilder_content = templatefile("${path.root}/pikvm.yaml.pkrtpl.hcl", {
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
    path = "Dockerfile"
  }
  container_dir = "/build"

  # Needs to be privileged to do a loop mount on the partitions
  privileged = true
}

build {
  name = "prepare_disk"
  sources = ["source.docker.distrobuilder"]

  provisioner "shell" {
    inline = [
      "wget ${var.pikvm_image} -O pikvm.img.xz",
      "unxz pikvm.img.xz",
      "7z x pikvm.img",
    ]
  }
  
  provisioner "file" {
    # Only interested in 0.fat which is the boot partition
    # And 2.img which is the rootfs partition
    sources = [
      "/build/0.fat",
      "/build/2.img",
    ]
    destination = "${local.partition_path}/"
    direction = "download"
  }

  post-processors {
    post-processor "artifice" {
      files = local.partition_paths
    }
  }
}

build {
  name = "build_image"
  sources = ["source.docker.distrobuilder"]

  provisioner "file" {
    destination = "/build/"
    sources = local.partition_paths
  }

  provisioner "file" {
    content = local.distrobuilder_content
    destination = "/build/pikvm.yaml"
  }

  # Loop mount the extracted partitions from the PiKVM image
  # Use these mounts as the rootfs and boot partitions for distrobuilder
  provisioner "shell" {
    inline = [
      "mkdir -p /mnt/rootfs",
      "mkdir -p /mnt/rootfs/boot",
      "mount -o loop 2.img /mnt/rootfs",
      "mount -o loop 0.fat /mnt/rootfs/boot",
    ]
  }

  provisioner "shell" {
    inline = [
      "distrobuilder pack-incus --type=unified pikvm.yaml /mnt/rootfs /build"
    ]
  }

  provisioner "file" {
    source = "/build/${local.image_compressed_file_name}"
    destination = "${local.image_path}/"
    direction = "download"
  }

  post-processors {
    post-processor "artifice" {
      files = [
        "${local.image_path}/${local.image_compressed_file_name}",
      ]
    }

    post-processor "shell-local" {
      inline = [
        "incus image import ${local.image_path}/${local.image_compressed_file_name} --alias ${local.image_alias} --alias ${local.image_alias_latest}", 
      ]
    }
  }
}