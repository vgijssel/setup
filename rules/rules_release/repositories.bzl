load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_jar")

def dependencies():
    http_jar(
        name = "bazel_diff",
        sha256 = "7943790f690ad5115493da8495372c89f7895b09334cb4fee5174a8f213654dd",
        urls = [
            "https://github.com/Tinder/bazel-diff/releases/download/5.0.0/bazel-diff_deploy.jar",
        ],
    )
