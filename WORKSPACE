load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file")
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

http_archive(
    name = "lima",
    build_file_content = """
package(default_visibility = ["//visibility:public"])

sh_binary(
    name = "limactl",
    srcs = ["@//tools/lima:wrapper.sh"],
    args = ["$(rootpath bin)/limactl"],
    data = [
        "share",
        "bin",
    ]
)
    """,

    # TODO: use select to download binary for different platform
    sha256 = "820f86d1486f70993cdcb535c93442a8d362f3992602c57a3cf0a8789090a802",
    urls = ["https://github.com/lima-vm/lima/releases/download/v0.9.2/lima-0.9.2-Darwin-x86_64.tar.gz"],
)
