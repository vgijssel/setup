subinclude("//tools/template")

template_value(
    name = "base_image",
    value = "some:image",
)

template_value(
    name = "output_file",
    value = "some content",
)

template(
    name = "dockerfile-test",
    srcs = ["Dockerfile"],
    subs = {
        "base_image": "//tools/template/test:base_image",
        "version": "10.0.0",
        "output_file": ":output_file",
    },
    deps = [
        ":output_file",
        "//tools/template/test:base_image",
    ],
)

python_test(
    name = "template_test",
    srcs = ["template_test.py"],
    data = [
        "Dockerfile.expected",
        ":dockerfile-test",
    ],
)


