package(default_visibility = ["PUBLIC"])

subinclude("//tools/python")

python_toolchain(
    name = "python",
    version = "3.8.12",
)

pip_library(
    name = "Jinja2",
    version = "3.0.1",
)

# TODO: Jinja2 requires MarkupSafe but this is not automatically installed using pip_library?
pip_library(
    name = "MarkupSafe",
    version = "2.0.1",
)