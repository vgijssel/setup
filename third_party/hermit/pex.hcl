description = "A tool for generating .pex (Python EXecutable) files"
homepage = "https://pex.readthedocs.io/"
binaries = ["pex"]
dont-extract = true

platform "darwin" "amd64" {
  source = "https://github.com/pex-tool/pex/releases/download/v${version}/pex-macos-x86_64"

  on "unpack" {
    rename {
      from = "${root}/pex-macos-x86_64"
      to = "${root}/pex"
    }
    chmod {
      file = "${root}/pex"
      mode = 493
    }
  }
}

platform "darwin" "arm64" {
  source = "https://github.com/pex-tool/pex/releases/download/v${version}/pex-macos-aarch64"

  on "unpack" {
    rename {
      from = "${root}/pex-macos-aarch64"
      to = "${root}/pex"
    }
    chmod {
      file = "${root}/pex"
      mode = 493
    }
  }
}

platform "linux" "amd64" {
  source = "https://github.com/pex-tool/pex/releases/download/v${version}/pex-linux-x86_64"

  on "unpack" {
    rename {
      from = "${root}/pex-linux-x86_64"
      to = "${root}/pex"
    }
    chmod {
      file = "${root}/pex"
      mode = 493
    }
  }
}

platform "linux" "arm64" {
  source = "https://github.com/pex-tool/pex/releases/download/v${version}/pex-linux-aarch64"

  on "unpack" {
    rename {
      from = "${root}/pex-linux-aarch64"
      to = "${root}/pex"
    }
    chmod {
      file = "${root}/pex"
      mode = 493
    }
  }
}

version "2.86.1" {
  auto-version {
    github-release = "pex-tool/pex"
  }
}

sha256sums = {
  "https://github.com/pex-tool/pex/releases/download/v2.86.1/pex-linux-x86_64": "263b837d050c3f612e1bf2e395e4077adda9551df20598aed36a771fa0cbcfdc",
  "https://github.com/pex-tool/pex/releases/download/v2.86.1/pex-linux-aarch64": "e948a57ba1453f39ea3ba6d565ec1221109a227ee7d92aef0c543b181098fe7f",
  "https://github.com/pex-tool/pex/releases/download/v2.86.1/pex-macos-x86_64": "f62e4dc1e1ca8a9d4a460b5e568095d0c24b688bbad1ac6835866bb67829e6c0",
  "https://github.com/pex-tool/pex/releases/download/v2.86.1/pex-macos-aarch64": "c2578632d995f94977161dc85e9353014f0a47c6bcf90d9bee39effeade67dd0",
}
