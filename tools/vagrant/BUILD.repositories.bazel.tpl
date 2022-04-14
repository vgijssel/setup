load("@{rules_vagrant_repo_name}//tools/vagrant:vagrant_toolchain.bzl", "vagrant_toolchain")

package(default_visibility = ["//visibility:public"])

toolchain_type(
    name = "toolchain_type",
)

vagrant_toolchain(
    name = "toolchain",
    binary_path = "{binary_path}",
)
