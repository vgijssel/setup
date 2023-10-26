"""
Bazel macro for creating a py_test that runs pytest.
"""

load("@rules_python//python:defs.bzl", "py_test")
load("//tools/python:defs.bzl", "requirement")

def py_pytest_test(name, srcs, deps = [], args = [], **kwargs):
    py_test(
        name = name,
        srcs = [
            "//tools/pytest:pytest_wrapper.py",
        ] + srcs,
        main = "//tools/pytest:pytest_wrapper.py",
        args = [
            "-ra",
            "-vv",
        ] + args + ["$(location :%s)" % x for x in srcs],
        python_version = "PY3",
        srcs_version = "PY3",
        deps = deps + [
            requirement("pytest"),
            requirement("pytest-cov"),
        ],
        **kwargs
    )
