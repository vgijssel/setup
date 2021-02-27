load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file")

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "a139e494d955fa133acb48bd7adc1a0b803139c0649f690c60b711700a24ec30",
    strip_prefix = "rules_docker-0.15.1-alpha",
    urls = ["https://github.com/dmayle/rules_docker/releases/download/v0.15.1-alpha/rules_docker-v0.15.1-alpha.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load("@io_bazel_rules_docker//contrib:dockerfile_build.bzl", "dockerfile_image")
load("@io_bazel_rules_docker//container:pull.bzl", "container_pull")

dockerfile_image(
    name = "packer-builder-arm",
    dockerfile = "//provisioner:Dockerfile",
)

container_pull(
    name = "alpine_linux_amd64",
    registry = "index.docker.io",
    repository = "library/alpine",
    tag = "3.8",
)

http_file(
    name = "ubuntu_arm",
    downloaded_file_path = "ubuntu_arm.img.xz",
    # file_checksum_url "http://cdimage.ubuntu.com/releases/20.04.1/release/SHA256SUMS"
    sha256 = "31884b07837099a5e819527af66848a9f4f92c1333e3ef0693d6d77af66d6832",
    urls = [
        "http://cdimage.ubuntu.com/releases/20.04.1/release/ubuntu-20.04.2-preinstalled-server-arm64+raspi.img.xz",
    ],
)
