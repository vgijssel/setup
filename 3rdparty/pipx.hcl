
description = "Install and Run Python Applications in Isolated Environments"
binaries = ["pipx"]
# test = "pre-commit --version"
source = "https://github.com/pypa/pipx/releases/download/${version}/pipx.pyz"
runtime-dependencies = ["python3@3.10"]
dont-extract = true

on "unpack" {
  rename {
    from = "${root}/pipx.pyz"
    to = "${root}/pipx"
  }

  chmod {
    file = "${root}/pipx"
    mode = 448
  }
}

version "1.7.1" {
  auto-version {
    github-release = "pypa/pipx"
  }
}

sha256sums = {
"https://github.com/pypa/pipx/releases/download/1.7.1/pipx.pyz": "1d4f46f86830640f1d7c4e29b280a7a42265d6e8af2c063f40baed4513f03ae8"
}
