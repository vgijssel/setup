"""Repository rules and dependencies for rules_release."""

load("@bazel_tools//tools/build_defs/repo:http.bzl", _http_archive = "http_archive", _http_file = "http_file", _http_jar = "http_jar")
load("@bazel_tools//tools/build_defs/repo:utils.bzl", "maybe")

# Copied from https://groups.google.com/g/bazel-discuss/c/xpsg3mWQPZg
def _starlarkified_local_repository_impl(repository_ctx):
    relative_path = repository_ctx.attr.path
    workspace_root = repository_ctx.path(repository_ctx.attr._root_file).dirname

    absolute_path = workspace_root
    for segment in relative_path.split("/"):
        absolute_path = absolute_path.get_child(segment)

    repository_ctx.symlink(absolute_path, ".")

starlarkified_local_repository = repository_rule(
    implementation = _starlarkified_local_repository_impl,
    attrs = {
        "path": attr.string(mandatory = True),
        "_root_file": attr.label(default = Label("//:MODULE.bazel")),
    },
)

def http_archive(**kwargs):
    maybe(_http_archive, **kwargs)

def http_jar(**kwargs):
    maybe(_http_jar, **kwargs)

def http_file(**kwargs):
    maybe(_http_file, **kwargs)

def rules_release_bazel_dependencies():
    """Load Bazel-level dependencies for rules_release."""
    http_archive(
        name = "bazel_features",
        sha256 = "62c26e427e5cbc751024446927622e398a9dcdf32c64325238815709d11c11a8",
        strip_prefix = "bazel_features-1.1.1",
        url = "https://github.com/bazel-contrib/bazel_features/releases/download/v1.1.1/bazel_features-v1.1.1.tar.gz",
    )

    http_archive(
        name = "bazel_skylib",
        sha256 = "cd55a062e763b9349921f0f5db8c3933288dc8ba4f76dd9416aac68acee3cb94",
        urls = [
            "https://mirror.bazel.build/github.com/bazelbuild/bazel-skylib/releases/download/1.5.0/bazel-skylib-1.5.0.tar.gz",
            "https://github.com/bazelbuild/bazel-skylib/releases/download/1.5.0/bazel-skylib-1.5.0.tar.gz",
        ],
    )

    http_archive(
        name = "aspect_bazel_lib",
        sha256 = "4b32cf6feab38b887941db022020eea5a49b848e11e3d6d4d18433594951717a",
        strip_prefix = "bazel-lib-2.0.1",
        url = "https://github.com/aspect-build/bazel-lib/releases/download/v2.0.1/bazel-lib-v2.0.1.tar.gz",
    )

    http_archive(
        name = "aspect_rules_js",
        sha256 = "76a04ef2120ee00231d85d1ff012ede23963733339ad8db81f590791a031f643",
        strip_prefix = "rules_js-1.34.1",
        url = "https://github.com/aspect-build/rules_js/releases/download/v1.34.1/rules_js-v1.34.1.tar.gz",
    )

    http_archive(
        name = "rules_python",
        sha256 = "d71d2c67e0bce986e1c5a7731b4693226867c45bfe0b7c5e0067228a536fc580",
        strip_prefix = "rules_python-0.29.0",
        url = "https://github.com/bazelbuild/rules_python/releases/download/0.29.0/rules_python-0.29.0.tar.gz",
    )

    http_archive(
        name = "rules_oci",
        sha256 = "d41d0ba7855f029ad0e5ee35025f882cbe45b0d5d570842c52704f7a47ba8668",
        strip_prefix = "rules_oci-1.4.3",
        url = "https://github.com/bazel-contrib/rules_oci/releases/download/v1.4.3/rules_oci-v1.4.3.tar.gz",
    )

def rules_release_dependencies():
    """Load repository dependencies for rules_release."""
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

    # From https://app-updates.agilebits.com/product_history/CLI2
    http_archive(
        name = "onepassword_linux_arm64",
        build_file = "//libs/onepassword:BUILD.repositories.bazel.tpl",
        sha256 = "b93a8e0dc42c0979bb13047ac4412bd73092be57bb84ad223eeca295151159fa",
        url = "https://cache.agilebits.com/dist/1P/op2/pkg/v2.18.0/op_linux_arm64_v2.18.0.zip",
    )

    http_archive(
        name = "onepassword_linux_amd64",
        build_file = "//libs/onepassword:BUILD.repositories.bazel.tpl",
        sha256 = "2baf610b476727f24c62cc843419f55b157e1a05521a698c1c8b4ed676a766aa",
        url = "https://cache.agilebits.com/dist/1P/op2/pkg/v2.18.0/op_linux_amd64_v2.18.0.zip",
    )

    http_archive(
        name = "onepassword_darwin_arm64",
        build_file = "//libs/onepassword:BUILD.repositories.bazel.tpl",
        sha256 = "b9ae52df3003216b454f6ac0a402c71bcfb4804eafb3ee3593a84a2002930d27",
        url = "https://cache.agilebits.com/dist/1P/op2/pkg/v2.22.0/op_darwin_arm64_v2.22.0.zip",
    )

    # ------------------------------------ regctl ------------------------------------ #
    # From https://github.com/regclient/regclient/releases
    http_file(
        name = "regctl_linux_arm64",
        downloaded_file_path = "regctl",
        executable = True,
        sha256 = "380105c05c6c69ea3d35a8efeec0ccfa1bdfc38a876bf7d473be06d7267bae99",
        url = "https://github.com/regclient/regclient/releases/download/v0.5.3/regctl-linux-arm64",
    )

    http_file(
        name = "regctl_linux_amd64",
        downloaded_file_path = "regctl",
        executable = True,
        sha256 = "5141569cd0ef6e52a9dc67391c432f1bdd0cfd2d3b82d3f22d56f94feab7203e",
        url = "https://github.com/regclient/regclient/releases/download/v0.5.3/regctl-linux-amd64",
    )

    http_file(
        name = "regctl_darwin_arm64",
        downloaded_file_path = "regctl",
        executable = True,
        sha256 = "4705d5068f946a75606494400c811b9f3f34c89dc495a372462eef02d372fe4d",
        url = "https://github.com/regclient/regclient/releases/download/v0.5.3/regctl-darwin-arm64",
    )

    # ------------------------------------ bazel-differ ------------------------------------ #
    http_file(
        name = "bazel-differ_linux_arm64",
        downloaded_file_path = "bazel-differ",
        executable = True,
        # sha256 = "380105c05c6c69ea3d35a8efeec0ccfa1bdfc38a876bf7d473be06d7267bae99",
        url = "https://github.com/ewhauser/bazel-differ/releases/download/v0.0.7/bazel-differ-linux-arm64",
    )

    http_file(
        name = "bazel-differ_linux_amd64",
        downloaded_file_path = "bazel-differ",
        executable = True,
        # sha256 = "5141569cd0ef6e52a9dc67391c432f1bdd0cfd2d3b82d3f22d56f94feab7203e",
        url = "https://github.com/ewhauser/bazel-differ/releases/download/v0.0.7/bazel-differ-linux-x86_64",
    )

    http_file(
        name = "bazel-differ_darwin_arm64",
        downloaded_file_path = "bazel-differ",
        executable = True,
        sha256 = "d1d6c92895c7cd3af4ff8de727114efb119b08f886604a958abbdedb9497b2ce",
        url = "https://github.com/ewhauser/bazel-differ/releases/download/v0.0.7/bazel-differ-darwin-arm64",
    )

    starlarkified_local_repository(
        name = "examples_workspace",
        path = "examples/workspace",
    )
