load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_file")
load("//tools/packer:repositories.bzl", "rules_packer_toolchains")

rules_packer_toolchains(
    version = "1.8.0",
)

# https://cloud-images.ubuntu.com/focal/20220404/
http_file(
    name = "ubuntu_focal",
    sha256 = "8c8b5acb521f53a32e6ee53505e85d43958e42794c77dbb54dbe797097a63c5d",
    urls = [
        "https://cloud-images.ubuntu.com/focal/20220404/focal-server-cloudimg-amd64.img",
    ],
)
