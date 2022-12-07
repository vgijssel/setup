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

# ------------------------------------ rules_python ------------------------------------ #

http_archive(
    name = "rules_python",
    sha256 = "b593d13bb43c94ce94b483c2858e53a9b811f6f10e1e0eedc61073bd90e58d9c",
    strip_prefix = "rules_python-0.12.0",
    url = "https://github.com/bazelbuild/rules_python/archive/refs/tags/0.12.0.tar.gz",
)

load("@rules_python//python:repositories.bzl", "python_register_toolchains")

python_register_toolchains(
    name = "python3",
    python_version = "3.10",
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
    sha256 = "16e9fca53ed6bd4ff4ad76facc9b7b651a89db1689a2877d6fd7b82aa824e366",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.34.0/rules_go-v0.34.0.zip",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.34.0/rules_go-v0.34.0.zip",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains(version = "1.18.3")

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

# ------------------------------------ rules_pkg ------------------------------------ #

http_archive(
    name = "rules_pkg",
    sha256 = "8a298e832762eda1830597d64fe7db58178aa84cd5926d76d5b744d6558941c2",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_pkg/releases/download/0.7.0/rules_pkg-0.7.0.tar.gz",
        "https://github.com/bazelbuild/rules_pkg/releases/download/0.7.0/rules_pkg-0.7.0.tar.gz",
    ],
)

load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")

rules_pkg_dependencies()

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

# ------------------------------------ buildifier ------------------------------------ #

http_archive(
    name = "buildifier_prebuilt",
    sha256 = "ecef8f8c39eaf4f1c1604c677d232ade33818f898e35e7826e7564a648751350",
    strip_prefix = "buildifier-prebuilt-5.1.0.2",
    urls = [
        "http://github.com/keith/buildifier-prebuilt/archive/5.1.0.2.tar.gz",
    ],
)

load("@buildifier_prebuilt//:deps.bzl", "buildifier_prebuilt_deps")

buildifier_prebuilt_deps()

load("@buildifier_prebuilt//:defs.bzl", "buildifier_prebuilt_register_toolchains")

buildifier_prebuilt_register_toolchains()

# ------------------------------------ black ------------------------------------ #

pip_parse(
    name = "black",
    python_interpreter_target = interpreter,
    requirements_lock = "@//tools/black:requirements.lock",
)

load("@black//:requirements.bzl", install_black_deps = "install_deps")

install_black_deps()
