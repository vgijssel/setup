binaries = ["bin/code-server"]
strip = 1
test = "code-server --version"

platform "darwin" "amd64" {
  source = "https://github.com/coder/code-server/releases/download/v${version}/code-server-${version}-macos-amd64.tar.gz"
}

platform "darwin" "arm64" {
  source = "https://github.com/coder/code-server/releases/download/v${version}/code-server-${version}-macos-arm64.tar.gz"
}

platform "linux" "amd64" {
  source = "https://github.com/coder/code-server/releases/download/v${version}/code-server-${version}-linux-amd64.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/coder/code-server/releases/download/v${version}/code-server-${version}-linux-arm64.tar.gz"
}

description = "VS Code in the browser"
homepage = "https://github.com/coder/code-server"

version "4.108.1" {
  auto-version {
    github-release = "coder/code-server"
  }
}

sha256sums = {
  "https://github.com/coder/code-server/releases/download/v4.108.1/code-server-4.108.1-linux-amd64.tar.gz": "5a191adde4d34d403d180bf29f13424b34961e80d31411b2112a18102f3b55f3",
  "https://github.com/coder/code-server/releases/download/v4.108.1/code-server-4.108.1-macos-amd64.tar.gz": "239a1305a4d6bf72aba912d1033b744d981e083de21b6a903d5d6e3832467703",
  "https://github.com/coder/code-server/releases/download/v4.108.1/code-server-4.108.1-macos-arm64.tar.gz": "33854eb31fccdc7db594de5bac76e93614c8a9cd4cd8d36d934dbf6c54ccdf00",
  "https://github.com/coder/code-server/releases/download/v4.108.1/code-server-4.108.1-linux-arm64.tar.gz": "92069dbb2ed99a204fca65d3ebbec893287147e46906cd8605b14fb92b450072",
}
