description = "Bash Automated Testing System"
repository = "https://github.com/bats-core/bats-core"
homepage = "https://bats-core.readthedocs.io"
source = "https://github.com/bats-core/bats-core/archive/refs/tags/v${version}.zip"
strip = 1
binaries = ["bin/bats"]
test = "bats --version"

version "1.13.0" {
  auto-version {
    github-release = "bats-core/bats-core"
  }
}

sha256sums = {
  "https://github.com/bats-core/bats-core/archive/refs/tags/v1.13.0.zip": "e7da1327c00de5a889293c04e22a26f1e05493eec46478f4c64442e3d8f7586d",
}
