load("@{rules_packer_repo_name}//tools/packer:packer_toolchain.bzl", "packer_toolchain")

package(default_visibility = ["//visibility:public"])

sh_binary(
    name = "packer_binary",
    srcs = ["packer/packer"],
)

packer_toolchain(
    name = "packer",
    host_cpu = "{host_cpu}",
    host_os = "{host_os}",
    packer_binary = ":packer_binary",
)
