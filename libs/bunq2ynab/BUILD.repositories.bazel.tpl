load("@rules_python//python:defs.bzl", "py_library")

package(default_visibility = ["//visibility:public"])

py_library(
    name = "lib",
    srcs = glob(["lib/**/*.py"]),
)

exports_files([
    "list_user.py",
    "list_budget.py",
    "bunq2ynab.py",
    "generate_oauth_token.py",
])
