"""
Bazel macro to install the command toolchain dependencies.
"""

load("@command-requirements//:requirements.bzl", "install_deps")

def toolchains():
    install_deps()
