python_requirements(
    name = "reqs",
    source = "requirements.txt",
)

# From https://github.com/mkdocs/mkdocs/blob/master/pyproject.toml#L80C11-L80C30
pex_binary(
    name = "mkdocs",
    dependencies = [
        "3rdparty/python:reqs#mkdocs",
        "3rdparty/python:reqs#mkdocs-publisher",
    ],
    entry_point = "mkdocs.__main__:cli",
)
