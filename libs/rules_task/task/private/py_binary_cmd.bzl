load("@bazel_skylib//rules:expand_template.bzl", "expand_template")
load("@pip//:requirements.bzl", "requirement")
load("@rules_python//python:defs.bzl", "py_binary")

def py_binary_cmd(name, code):
    main_name = "{}_main".format(name)
    main_name_file = "{}.py".format(main_name)

    expand_template(
        name = main_name,
        template = Label("py_binary_cmd_main.tpl.py"),
        out = main_name_file,
        substitutions = {
            "{{python_code}}": code,
        },
    )

    py_binary(
        name = name,
        srcs = [main_name_file],
        main = main_name_file,
        deps = [requirement("deepdiff")],
    )
