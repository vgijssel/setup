binaries = ["chainsaw"]
description = "Chainsaw - Stronger Kubernetes tests"
homepage = "https://kyverno.github.io/chainsaw/"

platform "darwin" "amd64" {
  source = "https://github.com/kyverno/chainsaw/releases/download/v${version}/chainsaw_${os}_${arch}.tar.gz"
}

platform "darwin" "arm64" {
  source = "https://github.com/kyverno/chainsaw/releases/download/v${version}/chainsaw_${os}_${arch}.tar.gz"
}

platform "linux" "amd64" {
  source = "https://github.com/kyverno/chainsaw/releases/download/v${version}/chainsaw_${os}_${arch}.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/kyverno/chainsaw/releases/download/v${version}/chainsaw_${os}_${arch}.tar.gz"
}

version "0.2.13" {
  auto-version {
    github-release = "kyverno/chainsaw"
  }
}

sha256sums = {
  "https://github.com/kyverno/chainsaw/releases/download/v0.2.13/chainsaw_linux_amd64.tar.gz": "6c8d4cdccacbea7100a8354893b3176d874eecfe70c930fbe0496b7967d61ca4",
  "https://github.com/kyverno/chainsaw/releases/download/v0.2.13/chainsaw_darwin_amd64.tar.gz": "265ff7cd8ff45295da91de3e1f31ebc4552e2b389bd5af137214d82ee99bbc2a",
  "https://github.com/kyverno/chainsaw/releases/download/v0.2.13/chainsaw_darwin_arm64.tar.gz": "45ce392cece57a7db28760d5c73243acd59090805eb013a304e4ac9e52217092",
  "https://github.com/kyverno/chainsaw/releases/download/v0.2.13/chainsaw_linux_arm64.tar.gz": "f0bbbd1d4b6090bec8ad82305251098b7e9e5069dc67b328d68aeb57dc2974f7",
}
