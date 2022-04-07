load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

def rules_lima_toolchains():
    http_archive(
        name = "lima",
        build_file = "@//tools/lima:BUILD.repositories.bazel",
        sha256 = "820f86d1486f70993cdcb535c93442a8d362f3992602c57a3cf0a8789090a802",
        urls = ["https://github.com/lima-vm/lima/releases/download/v0.9.2/lima-0.9.2-Darwin-x86_64.tar.gz"],
    )
