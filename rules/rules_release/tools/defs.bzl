load("//tools/private:publish_github_release.bzl", _publish_github_release = "publish_github_release")
load("//tools/private:publish_oci_image.bzl", _publish_oci_image = "publish_oci_image")
load("//tools/private:bazel_diff_release.bzl", _bazel_diff_release = "bazel_diff_release")

publish_github_release = _publish_github_release
bazel_diff_release = _bazel_diff_release
publish_oci_image = _publish_oci_image
