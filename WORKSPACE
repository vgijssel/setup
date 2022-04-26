workspace(name = "setup")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

http_archive(
    name = "bazel_skylib",
    sha256 = "f7be3474d42aae265405a592bb7da8e171919d74c16f082a5457840f06054728",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.2.1/bazel-skylib-1.2.1.tar.gz",
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.2.1/bazel-skylib-1.2.1.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")
load("//tools/packer:repositories.bzl", "rules_packer_toolchains")

bazel_skylib_workspace()

rules_packer_toolchains(
    version = "1.8.0",
)

# https://cloud-images.ubuntu.com/focal/current/
http_file(
    name = "ubuntu_focal",
    sha256 = "6e3ce31fe3a5523023650ba988c12d5fc2544bd0a95f435474841e2dec5836d9",
    urls = [
        "https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img",
    ],
)

http_file(
    name = "ubuntu_focal_kernel",
    sha256 = "09bb705df1fb743524bbb5521c1dcd51d6249844ebffc4fd8b56da9257dea1ee",
    urls = [
        "https://cloud-images.ubuntu.com/focal/current/unpacked/focal-server-cloudimg-amd64-vmlinuz-generic",
    ],
)

http_file(
    name = "ubuntu_focal_initrd",
    sha256 = "f8401efabd2546b9c22dec3969b2856e355c91e9d195668216fb0949681639b9",
    urls = [
        "https://cloud-images.ubuntu.com/focal/current/unpacked/focal-server-cloudimg-amd64-initrd-generic",
    ],
)

http_archive(
    name = "rules_python",
    patch_args = ["-p1"],
    patches = ["@//tools/python:fix-chmod.patch"],
    sha256 = "9fcf91dbcc31fde6d1edb15f117246d912c33c36f44cf681976bd886538deba6",
    strip_prefix = "rules_python-0.8.0",
    url = "https://github.com/bazelbuild/rules_python/archive/refs/tags/0.8.0.tar.gz",
)

load("@rules_python//python:repositories.bzl", "python_register_toolchains")

python_register_toolchains(
    name = "python3_9",
    python_version = "3.9",
)

load("@python3_9//:defs.bzl", "interpreter")
load("@rules_python//python:pip.bzl", "pip_parse")

pip_parse(
    name = "hypervisor_deps",
    python_interpreter_target = interpreter,
    requirements_lock = "//hypervisor:requirements_lock.txt",
)

load("@hypervisor_deps//:requirements.bzl", hypervisor_install_deps = "install_deps")

hypervisor_install_deps()

pip_parse(
    name = "infrastructure_deps",
    python_interpreter_target = interpreter,
    requirements_lock = "//infrastructure:requirements_lock.txt",
)

load("@infrastructure_deps//:requirements.bzl", infrastructure_install_deps = "install_deps")

infrastructure_install_deps()

http_archive(
    name = "pulumi",
    build_file_content = """
package(default_visibility = ["//visibility:public"])

sh_binary(
    name = "pulumi.sh",
    srcs = ["pulumi"],
)
    """,
    sha256 = "f1afc2b7fa0b1c78b1a668add6e1d9b58c7c7246372c39be4d2af9a58a656d41",
    strip_prefix = "pulumi",
    url = "https://get.pulumi.com/releases/sdk/pulumi-v3.30.0-darwin-x64.tar.gz",
)

git_repository(
    name = "bazelruby_rules_ruby",
    branch = "master",
    remote = "https://github.com/bazelruby/rules_ruby.git",
)

load(
    "@bazelruby_rules_ruby//ruby:deps.bzl",
    "rules_ruby_dependencies",
    "rules_ruby_select_sdk",
)

rules_ruby_dependencies()

rules_ruby_select_sdk(version = "host")

load(
    "@bazelruby_rules_ruby//ruby:defs.bzl",
    "ruby_bundle",
)

ruby_bundle(
    name = "hypervisor_bundle",
    bundler_version = "2.3.6",
    gemfile = "//hypervisor:Gemfile",
    gemfile_lock = "//hypervisor:Gemfile.lock",
    includes = {
        "addressable": ["data"],
    },
)
