description = "Publisher for MkDocs - a set of plugins for content creators"
binaries = [
    ".pipx/venvs/mkdocs-publisher/bin/mkdocs",
]
# test = "relocate.sh"
# source = "https://github.com/pypa/pipx/releases/download/${version}/pipx.pyz"
# source  "https://github.com/pypa/pipx/releases/download/${version}/pipx.pyz"
source = "https://files.pythonhosted.org/packages/c8/48/6334c850f7e4953a2dc330904a136b91e53b5c053dda094df5779dfe4da5/mkdocs_publisher-1.4.4-py3-none-any.whl"

requires = ["pipx"]
dont-extract = true

on "unpack" {
    copy {
        from = "pipx_install.sh"
        to = "${root}/pipx_install.sh"
    }

    chmod {
        file = "${root}/pipx_install.sh"
        mode = 493
    }

    run {
        cmd = "${root}/pipx_install.sh ${root} mkdocs_publisher-1.4.4-py3-none-any.whl"
    }
}

version "1.4.4" {
  auto-version {
    github-release = "mkdocs-publisher/mkdocs-publisher"
  }
}

sha256sums = {
"https://files.pythonhosted.org/packages/c8/48/6334c850f7e4953a2dc330904a136b91e53b5c053dda094df5779dfe4da5/mkdocs_publisher-1.4.4-py3-none-any.whl": "714f683f7875cf07ca0a14277daf1c0def2d6e629aed99862a123fc8c9b7b104"
}