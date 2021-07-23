python_binary(
    name = "jinja",
    main = "main.py",
    visibility = ["//tools/template/..."],
    deps = [
        "//third_party/python:Jinja2",
        "//third_party/python:MarkupSafe",
    ],
)

filegroup(
    name = "template",
    srcs = ["template.build_defs"],
    visibility = ["PUBLIC"],
)
