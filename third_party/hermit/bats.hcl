description = "Bash Automated Testing System"
binaries = ["bin/bats"]
strip = 1
source = "https://github.com/bats-core/bats-core/archive/refs/tags/v${version}.tar.gz"

version "1.11.0" {
  auto-version {
    github-release = "bats-core/bats-core"
  }
}

on "unpack" {
  # Remove test fixtures to avoid symlink security issues
  run {
    cmd = "/bin/bash"
    args = ["-c", "rm -rf test/fixtures/suite/recursive_with_symlinks"]
  }
}

env = {
  "BATS_ROOT": "${root}",
}
