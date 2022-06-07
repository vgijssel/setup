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

# https://cloud-images.ubuntu.com/focal/current/unpacked/
http_file(
    name = "ubuntu_focal_kernel",
    sha256 = "4048507b8db0705fead6b09030d967910bb6b6b8c348c389b7cdeb045860e628",
    urls = [
        "https://cloud-images.ubuntu.com/focal/current/unpacked/focal-server-cloudimg-amd64-vmlinuz-generic",
    ],
)

http_file(
    name = "ubuntu_focal_initrd",
    sha256 = "c04fb677eb710eebda14e17ae23958e08a14ebe6ac7cf88fd1f71a6692a6a329",
    urls = [
        "https://cloud-images.ubuntu.com/focal/current/unpacked/focal-server-cloudimg-amd64-initrd-generic",
    ],
)

# https://cloud-images.ubuntu.com/focal/current/
http_file(
    name = "ubuntu_focal",
    sha256 = "103ae8982d79891e7fb5321260dbd7e924ec2021d7357872d0c65e3231466d23",
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
    sha256 = "e7261ac9f49b7800036ead1c9f660b7fc4adf9b1dca3e20ef526468f73a199a6",
    strip_prefix = "pulumi",
    url = "https://get.pulumi.com/releases/sdk/pulumi-v3.33.2-darwin-x64.tar.gz",
)

nomad_version = "1.3.1"

arch = "amd64"

os = "darwin"

# TODO: implement select for different os using platforms?
# os = select({
#         "//:setup_debug": {
#             "SETUP_DEBUG": "true",
#         },
#         "//conditions:default": {
#             "SETUP_DEBUG": "false",
#         },
#     }),

http_archive(
    name = "nomad",
    build_file_content = """
package(default_visibility = ["//visibility:public"])
sh_binary(
    name = "nomad.sh",
    srcs = ["nomad"],
)
    """,
    sha256 = "96454c7cbf136979a7b0eefb32d428abef41331b62afd1abd2e0a8f8e89e42da",
    url = "https://releases.hashicorp.com/nomad/{nomad_version}/nomad_{nomad_version}_{os}_{arch}.zip".format(
        arch = arch,
        nomad_version = nomad_version,
        os = os,
    ),
)

consul_version = "1.12.2"

http_archive(
    name = "consul",
    build_file_content = """
package(default_visibility = ["//visibility:public"])
sh_binary(
    name = "consul.sh",
    srcs = ["consul"],
)
    """,
    sha256 = "60548927c73a1c0698a400560c48660d105be60d19c0766865d6be32ba841f38",
    url = "https://releases.hashicorp.com/consul/{consul_version}/consul_{consul_version}_{os}_{arch}.zip".format(
        arch = arch,
        consul_version = consul_version,
        os = os,
    ),
)
