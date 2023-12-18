load("@rules_nodejs//nodejs:repositories.bzl", "DEFAULT_NODE_VERSION", "nodejs_register_toolchains")
load("@pip//:requirements.bzl", install_pip_deps = "install_deps")
load("@npm//:repositories.bzl", "npm_repositories")
load("@rules_oci//oci:repositories.bzl", "LATEST_CRANE_VERSION", "oci_register_toolchains")

def install_secondary_deps():
    # ------------------------------------ aspect_rules_js ------------------------------------ #
    nodejs_register_toolchains(
        name = "nodejs",
        node_version = DEFAULT_NODE_VERSION,
    )

    # ------------------------------------ rules_task ------------------------------------ #
    install_pip_deps()

    # ------------------------------------ rules_release ------------------------------------ #
    npm_repositories()

    # ------------------------------------ rules_oci ------------------------------------ #
    oci_register_toolchains(
        name = "oci",
        crane_version = LATEST_CRANE_VERSION,
    )
