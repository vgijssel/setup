description = "A build system and repo management tool for the web ecosystem, written in Rust"
homepage = "https://moonrepo.dev"
binaries = ["moon"]
test = "moon --version"
strip = 1

platform "darwin" "arm64" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon_cli-aarch64-apple-darwin.tar.xz"
}

platform "linux" "amd64" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon_cli-x86_64-unknown-linux-gnu.tar.xz"
}

platform "linux" "arm64" {
  source = "https://github.com/moonrepo/moon/releases/download/v${version}/moon_cli-aarch64-unknown-linux-gnu.tar.xz"
}

version "2.0.0" {
  auto-version {
    github-release = "moonrepo/moon"
  }
}

sha256sums = {
  "https://github.com/moonrepo/moon/releases/download/v2.0.0/moon_cli-x86_64-unknown-linux-gnu.tar.xz": "1429955d39f307834b91de80a762c013f11c582dc33c94d063281fb460e47f16",
  "https://github.com/moonrepo/moon/releases/download/v2.0.0/moon_cli-aarch64-apple-darwin.tar.xz": "f7bf54bf162198ab2347f392107ef8445598bb8368b4730fa15f5c13416c94f0",
  "https://github.com/moonrepo/moon/releases/download/v2.0.0/moon_cli-aarch64-unknown-linux-gnu.tar.xz": "4aae990032e0454baf7365e17352aaf09e1e52d0fe50f78b91664d68a94f546e",
}
