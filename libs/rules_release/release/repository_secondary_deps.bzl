"""Secondary repository dependencies for rules_release."""

load("@npm//:repositories.bzl", "npm_repositories")
load("@rules_nodejs//nodejs:repositories.bzl", "DEFAULT_NODE_VERSION", "nodejs_register_toolchains")
load("@rules_oci//oci:repositories.bzl", "LATEST_CRANE_VERSION", "oci_register_toolchains")
load("@rules_python//python:pip.bzl", "pip_parse")

def install_secondary_deps():
    """Install secondary dependencies for rules_release."""

    # ------------------------------------ aspect_rules_js ------------------------------------ #
    nodejs_register_toolchains(
        name = "nodejs",
        node_version = DEFAULT_NODE_VERSION,
    )

    # ------------------------------------ rules_task ------------------------------------ #
    pip_parse(
        name = "pip",
        requirements_lock = "@rules_task//:requirements.txt",
    )

    # ------------------------------------ rules_release ------------------------------------ #
    npm_repositories()

    # ------------------------------------ rules_oci ------------------------------------ #
    oci_register_toolchains(
        name = "oci",
        crane_version = LATEST_CRANE_VERSION,
    )
