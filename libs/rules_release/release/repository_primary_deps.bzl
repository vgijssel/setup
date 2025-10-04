load("@aspect_bazel_lib//lib:repositories.bzl", "aspect_bazel_lib_dependencies", "aspect_bazel_lib_register_toolchains")
load("@aspect_rules_js//js:repositories.bzl", "rules_js_dependencies")
load("@aspect_rules_js//npm:repositories.bzl", "npm_translate_lock")
load("@bazel_features//:deps.bzl", "bazel_features_deps")
load("@bazel_skylib//:workspace.bzl", "bazel_skylib_workspace")
load("@rules_oci//oci:dependencies.bzl", "rules_oci_dependencies")
load("@rules_python//python:repositories.bzl", "py_repositories")

def install_primary_deps():
    # ------------------------------------ bazel_features ------------------------------------ #
    bazel_features_deps()

    # ------------------------------------ bazel_skylib ------------------------------------ #
    bazel_skylib_workspace()

    # ------------------------------------ aspect_bazel_lib ------------------------------------ #
    aspect_bazel_lib_dependencies()
    aspect_bazel_lib_register_toolchains()

    # ------------------------------------ aspect_rules_js ------------------------------------ #
    rules_js_dependencies()

    # ------------------------------------ rules_python ------------------------------------ #
    py_repositories()

    # ------------------------------------ rules_release ------------------------------------ #
    npm_translate_lock(
        name = "npm",
        pnpm_lock = "@rules_release//:pnpm-lock.yaml",
        verify_node_modules_ignored = "@rules_release//:.bazelignore",
    )

    # ------------------------------------ rules_oci ------------------------------------ #
    rules_oci_dependencies()
