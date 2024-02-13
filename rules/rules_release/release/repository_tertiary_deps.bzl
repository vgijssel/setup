load("@pip//:requirements.bzl", install_pip_deps = "install_deps")

def install_tertiary_deps():
    # ------------------------------------ rules_task ------------------------------------ #
    install_pip_deps()
