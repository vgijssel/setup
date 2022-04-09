load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_file")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository", "new_git_repository")
load("//tools/packer:repositories.bzl", "rules_packer_toolchains")
load("//tools/lima:repositories.bzl", "rules_lima_toolchains")

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

rules_lima_toolchains()

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

load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")

bazel_skylib_workspace()

rules_ruby_select_sdk(version = "3.0.2")

load(
    "@bazelruby_rules_ruby//ruby:defs.bzl",
    "ruby_bundle",
)

new_git_repository(
    name = "vagrant",
    build_file_content = """
    """,
    commit = "379dd20cf91865c97f8dd5bb2c8e7f69fd1c00f2",
    remote = "https://github.com/hashicorp/vagrant.git",
    shallow_since = "1636146944 -0700",
    # tag = "v2.2.19",
)

ruby_bundle(
    name = "vagrant_bundle",
    gemfile = "@vagrant//:Gemfile",
)
