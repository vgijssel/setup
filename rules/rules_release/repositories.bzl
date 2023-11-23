load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive", "http_jar")
load("@rules_multitool//multitool:multitool.bzl", "multitool")

def dependencies():
    http_jar(
        name = "bazel_diff",
        sha256 = "7943790f690ad5115493da8495372c89f7895b09334cb4fee5174a8f213654dd",
        urls = [
            "https://github.com/Tinder/bazel-diff/releases/download/5.0.0/bazel-diff_deploy.jar",
        ],
    )

    http_archive(
        name = "github_cli_linux_arm64",
        build_file = "//tools/github_cli:BUILD.repositories.bazel.tpl",
        sha256 = "e29e51efae58693cab394b983771bc0c73b400e429dd1d7339fc62c8b257c74a",
        url = "https://github.com/cli/cli/releases/download/v2.39.1/gh_2.39.1_linux_arm64.tar.gz",
    )

    http_archive(
        name = "github_cli_linux_amd64",
        build_file = "//tools/github_cli:BUILD.repositories.bazel.tpl",
        sha256 = "18a1bc97eb72305ff20e965d3c67aee7e1ac607fabc6251c7374226d8c41422b",
        url = "https://github.com/cli/cli/releases/download/v2.39.1/gh_2.39.1_linux_amd64.tar.gz",
    )

    http_archive(
        name = "github_cli_darwin_arm64",
        build_file = "//tools/github_cli:BUILD.repositories.bazel.tpl",
        sha256 = "f854225778b7215480c442cd2e3eeec1a56d33876bbbad19daf557c1b00d6913",
        url = "https://github.com/cli/cli/releases/download/v2.39.1/gh_2.39.1_macOS_arm64.zip",
    )

    multitool(
        name = "github_cli",
        linux_x86_64_binary = "@github_cli_linux_amd64//:files",
        linux_arm64_binary = "@github_cli_linux_arm64//:files",
        macos_arm64_binary = "@github_cli_darwin_arm64//:files",
    )
