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

http_file(
    name = "ubuntu_focal_kernel",
    sha256 = "09bb705df1fb743524bbb5521c1dcd51d6249844ebffc4fd8b56da9257dea1ee",
    urls = [
        "https://cloud-images.ubuntu.com/focal/current/unpacked/focal-server-cloudimg-amd64-vmlinuz-generic",
    ],
)

http_file(
    name = "ubuntu_focal_initrd",
    sha256 = "61503fe6ef01ae4801d52a5529bc81efd373375d013148e2b2e1c18a0f4ec8a8",
    urls = [
        "https://cloud-images.ubuntu.com/focal/current/unpacked/focal-server-cloudimg-amd64-initrd-generic",
    ],
)

# https://cloud-images.ubuntu.com/focal/current/
http_file(
    name = "ubuntu_focal",
    sha256 = "9a0f100258640fa68ee13e33f4ea636ee3f82e2b9991381553be65121ce3657b",
    urls = [
        "https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img",
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

load("@hypervisor_deps//:requirements.bzl", "install_deps")

install_deps()

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

# Need master version to fix macOS bug https://github.com/bazelbuild/rules_foreign_cc/commit/cac46994c9db9531813c9a80b5b1ca9c26f05240
http_archive(
    name = "rules_foreign_cc",
    sha256 = "7caed4039f442fceed5b80a7b247d4bebdf9745b05c620811855397b54d73052",
    strip_prefix = "rules_foreign_cc-324dbd13cf2716af4e3979fdde7e7cd6eea8d41c",
    url = "https://github.com/bazelbuild/rules_foreign_cc/archive/324dbd13cf2716af4e3979fdde7e7cd6eea8d41c.tar.gz",
)

load("@rules_foreign_cc//foreign_cc:repositories.bzl", "rules_foreign_cc_dependencies")

rules_foreign_cc_dependencies()

_ALL_CONTENT = """\
filegroup(
    name = "all_srcs",
    srcs = glob(["**"]),
    visibility = ["//visibility:public"],
)
"""

# qemu source code repository
http_archive(
    name = "qemu",
    build_file_content = _ALL_CONTENT,
    sha256 = "f6b375c7951f728402798b0baabb2d86478ca53d44cedbefabbe1c46bf46f839",
    strip_prefix = "qemu-7.0.0",
    urls = [
        "https://download.qemu.org/qemu-7.0.0.tar.xz",
    ],
)

# TODO:
# what we want is to build a vm using packer on macOS, but the output platform of the target is Linux
# let's first try to configure packer such that we're copying a binary file downloaded using bazel for the right target platform
# as a next step we can then look into cross compiling or multi platform builds
# so we can compile qemu in docker and link it in the vm when building through packer.
