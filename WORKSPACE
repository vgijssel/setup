workspace(name = "setup")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_file", "http_jar")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

# ------------------------------------ skylib ------------------------------------ #

http_archive(
    name = "bazel_skylib",
    sha256 = "f7be3474d42aae265405a592bb7da8e171919d74c16f082a5457840f06054728",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.2.1/bazel-skylib-1.2.1.tar.gz",
        "https://github.com/bazelbuild/bazel-skylib/releases/download/1.2.1/bazel-skylib-1.2.1.tar.gz",
    ],
)

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

# ------------------------------------ rules_pkg ------------------------------------ #

http_archive(
    name = "rules_pkg",
    sha256 = "eea0f59c28a9241156a47d7a8e32db9122f3d50b505fae0f33de6ce4d9b61834",
    urls = [
        "https://github.com/bazelbuild/rules_pkg/releases/download/0.8.0/rules_pkg-0.8.0.tar.gz",
    ],
)

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()

# ------------------------------------ rules_python ------------------------------------ #

http_archive(
    name = "rules_python",
    sha256 = "497ca47374f48c8b067d786b512ac10a276211810f4a580178ee9b9ad139323a",
    strip_prefix = "rules_python-0.16.1",
    url = "https://github.com/bazelbuild/rules_python/archive/refs/tags/0.16.1.tar.gz",
)

load("@rules_python//python:repositories.bzl", "python_register_toolchains")

python_register_toolchains(
    name = "python3",
    python_version = "3.10.8",
)

load("@python3//:defs.bzl", "interpreter")
load("@rules_python//python:pip.bzl", "pip_parse")

# ------------------------------------ hypervisor ------------------------------------ #

pip_parse(
    name = "hypervisor_deps",
    python_interpreter_target = interpreter,
    requirements_lock = "//hypervisor:requirements_lock.txt",
)

load("@hypervisor_deps//:requirements.bzl", "install_deps")

install_deps()

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

# git_repository(
#     name = "bazelruby_rules_ruby",
#     branch = "master",
#     remote = "https://github.com/bazelruby/rules_ruby.git",
# )

# load(
#     "@bazelruby_rules_ruby//ruby:deps.bzl",
#     "rules_ruby_dependencies",
#     "rules_ruby_select_sdk",
# )

# rules_ruby_dependencies()

# rules_ruby_select_sdk(version = "host")

# load(
#     "@bazelruby_rules_ruby//ruby:defs.bzl",
#     "ruby_bundle",
# )

# ruby_bundle(
#     name = "hypervisor_bundle",
#     bundler_version = "2.3.6",
#     gemfile = "//hypervisor:Gemfile",
#     gemfile_lock = "//hypervisor:Gemfile.lock",
#     includes = {
#         "addressable": ["data"],
#     },
# )

# ------------------------------------ bazel-diff ------------------------------------ #

http_jar(
    name = "bazel_diff",
    sha256 = "fe01c3500af3a724d2e6355f70c0ec5b11a8a9057f196efa8ff574f88cc379de",
    urls = [
        "https://github.com/Tinder/bazel-diff/releases/download/4.0.8/bazel-diff_deploy.jar",
    ],
)

# ------------------------------------ rules_docker ------------------------------------ #

http_archive(
    name = "io_bazel_rules_go",
    sha256 = "f2dcd210c7095febe54b804bb1cd3a58fe8435a909db2ec04e31542631cf715c",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.31.0/rules_go-v0.31.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.31.0/rules_go-v0.31.0.zip",
    ],
)

http_archive(
    name = "bazel_gazelle",
    sha256 = "5982e5463f171da99e3bdaeff8c0f48283a7a5f396ec5282910b9e8a49c0dd7e",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/bazel-gazelle/releases/download/v0.25.0/bazel-gazelle-v0.25.0.tar.gz",
        "https://github.com/bazelbuild/bazel-gazelle/releases/download/v0.25.0/bazel-gazelle-v0.25.0.tar.gz",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")
load("@bazel_gazelle//:deps.bzl", "gazelle_dependencies", "go_repository")

############################################################
# Define your own dependencies here using go_repository.
# Else, dependencies declared by rules_go/gazelle will be used.
# The first declaration of an external repository "wins".
############################################################

go_rules_dependencies()

go_register_toolchains(version = "1.18")

gazelle_dependencies()

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = "b1e80761a8a8243d03ebca8845e9cc1ba6c82ce7c5179ce2b295cd36f7e394bf",
    urls = ["https://github.com/bazelbuild/rules_docker/releases/download/v0.25.0/rules_docker-v0.25.0.tar.gz"],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load("@io_bazel_rules_docker//repositories:deps.bzl", container_deps = "deps")

container_deps()

load(
    "@io_bazel_rules_docker//container:container.bzl",
    "container_pull",
)
load(
    "@io_bazel_rules_docker//python3:image.bzl",
    _py3_image_repos = "repositories",
)

_py3_image_repos()

# ------------------------------------ workstation ------------------------------------ #

container_pull(
    name = "ubuntu_base",
    digest = "sha256:b18dbe0837fd555c7028af6a1281ffa4fd1b5ffd835968f1009fd4cf9dfeaec3",
    registry = "index.docker.io",
    repository = "library/ubuntu:focal",
)

http_file(
    name = "inspec_arm64",
    downloaded_file_path = "inspec.deb",
    sha256 = "79a496d2467f579c6533bcf42c663d96d830af42ba2f32769ddf6ef879d7d3b5",
    url = "https://packages.chef.io/files/stable/inspec/5.18.14/ubuntu/20.04/inspec_5.18.14-1_arm64.deb",
)

http_file(
    name = "inspec_amd64",
    downloaded_file_path = "inspec.deb",
    sha256 = "b4e8b11478cd2c930b24edcf5c24ef49fe83452f08f6cedc13deae5ce7b0c757",
    url = "https://packages.chef.io/files/stable/inspec/5.18.14/ubuntu/20.04/inspec_5.18.14-1_amd64.deb",
)

# ------------------------------------ multirun ------------------------------------ #

git_repository(
    name = "com_github_ash2k_bazel_tools",
    commit = "8ec69576f63c254a089a63ebf7385e7ee1a871e9",
    remote = "https://github.com/ash2k/bazel-tools.git",
    shallow_since = "1662117149 +1000",
)

load("@com_github_ash2k_bazel_tools//multirun:deps.bzl", "multirun_dependencies")

multirun_dependencies()

# ------------------------------------ pytest ------------------------------------ #

pip_parse(
    name = "pytest",
    python_interpreter_target = interpreter,
    requirements_lock = "@//tools/pytest:requirements.lock",
)

load("@pytest//:requirements.bzl", install_pytest_deps = "install_deps")

install_pytest_deps()

# ------------------------------------ occupancy_component ------------------------------------ #

pip_parse(
    name = "occupancy_component",
    python_interpreter_target = interpreter,
    requirements_lock = "@//occupancy_component:requirements.lock",
)

load("@occupancy_component//:requirements.bzl", install_occupancy_component_deps = "install_deps")

install_occupancy_component_deps()

# ------------------------------------ tilt ------------------------------------ #

http_archive(
    name = "tilt_arm64",
    build_file = "//tools/tilt:BUILD.repositories.bazel.tpl",
    # downloaded_file_path = "inspec.deb",
    sha256 = "1535891f128613b967f52fa635e0620b20cb2a849c6fa9655a27bbdaf905e20a",
    url = "https://github.com/tilt-dev/tilt/releases/download/v0.31.1/tilt.0.31.1.linux.arm64.tar.gz",
)

# ------------------------------------ command ------------------------------------ #
load("//tools/command:deps.bzl", command_deps = "deps")

command_deps(python_interpreter_target = interpreter)

load("//tools/command:toolchains.bzl", command_toolchains = "toolchains")

command_toolchains()

# ------------------------------------ python_image ------------------------------------ #

# https://hub.docker.com/layers/library/python/3.10.8-bullseye/images/sha256-de501d4dbc12f846ee78ee76629b7524ec07f10c121832a190a1ecb7b9a119bb?context=explore
container_pull(
    name = "python_base_arm64",
    digest = "sha256:fa109a6d1100a4e6382950ab1f7f94563268e537b1619f1969b9b33a9c1a99fb",
    registry = "index.docker.io",
    repository = "library/python:3.10.8-bullseye",
)

container_pull(
    name = "python_base_amd64",
    digest = "sha256:de501d4dbc12f846ee78ee76629b7524ec07f10c121832a190a1ecb7b9a119bb",
    registry = "index.docker.io",
    repository = "library/python:3.10.8-bullseye",
)

# ------------------------------------ pulumi ------------------------------------ #

http_archive(
    name = "pulumi_arm64",
    build_file = "//tools/pulumi:BUILD.repositories.bazel.tpl",
    sha256 = "a1987df74cc4bffe19a746644e9ca5e41ccd5ff50732b5fc80f34c6dd345f811",
    url = "https://github.com/pulumi/pulumi/releases/download/v3.61.0/pulumi-v3.61.0-linux-arm64.tar.gz",
)

http_archive(
    name = "pulumi_amd64",
    build_file = "//tools/pulumi:BUILD.repositories.bazel.tpl",
    sha256 = "19c240ab4589dde018f99f12ff671c66e91c80855c5ce80d306a43b2a9f47970",
    url = "https://github.com/pulumi/pulumi/releases/download/v3.61.0/pulumi-v3.61.0-linux-x64.tar.gz",
)

# ------------------------------------ infrastructure ------------------------------------ #

pip_parse(
    name = "infrastructure-requirements",
    python_interpreter_target = interpreter,
    requirements_lock = "//infrastructure:requirements.lock",
)

load("@infrastructure-requirements//:requirements.bzl", "install_deps")

install_deps()

# ------------------------------------ lefthook ------------------------------------ #

http_file(
    name = "lefthook_arm64",
    downloaded_file_path = "lefthook",
    executable = True,
    sha256 = "10c7c283918f52f0ba112b3834967949177e4084e5468fa9a9c3ce88878dda26",
    url = "https://github.com/evilmartians/lefthook/releases/download/v1.3.9/lefthook_1.3.9_Linux_arm64",
)

http_file(
    name = "lefthook_amd64",
    downloaded_file_path = "lefthook",
    executable = True,
    # sha256 = "19c240ab4589dde018f99f12ff671c66e91c80855c5ce80d306a43b2a9f47970",
    url = "https://github.com/evilmartians/lefthook/releases/download/v1.3.9/lefthook_1.3.9_Linux_x86_64",
)

# ------------------------------------ black ------------------------------------ #

pip_parse(
    name = "black-requirements",
    python_interpreter_target = interpreter,
    requirements_lock = "//tools/black:requirements.lock",
)

load("@black-requirements//:requirements.bzl", "install_deps")

install_deps()
