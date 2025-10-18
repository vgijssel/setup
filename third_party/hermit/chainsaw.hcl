binaries = ["chainsaw"]
description = "Chainsaw - Stronger Kubernetes tests"
homepage = "https://kyverno.github.io/chainsaw/"

platform "darwin" "amd64" {
  source = "https://github.com/kyverno/chainsaw/releases/download/v${version}/chainsaw_${os}_${xarch}.tar.gz"
}

platform "darwin" "arm64" {
  source = "https://github.com/kyverno/chainsaw/releases/download/v${version}/chainsaw_${os}_${arch}.tar.gz"
}

platform "linux" "amd64" {
  source = "https://github.com/kyverno/chainsaw/releases/download/v${version}/chainsaw_${os}_${xarch}.tar.gz"
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
  "https://github.com/kyverno/chainsaw/releases/download/v0.2.13/chainsaw_linux_x86_64.tar.gz": "0019dfc4b32d63c1392aa264aed2253c1e0c2fb09216f8e2cc269bbfb8bb49b5",
  "https://github.com/kyverno/chainsaw/releases/download/v0.2.13/chainsaw_darwin_x86_64.tar.gz": "0019dfc4b32d63c1392aa264aed2253c1e0c2fb09216f8e2cc269bbfb8bb49b5",
  "https://github.com/kyverno/chainsaw/releases/download/v0.2.13/chainsaw_darwin_arm64.tar.gz": "45ce392cece57a7db28760d5c73243acd59090805eb013a304e4ac9e52217092",
  "https://github.com/kyverno/chainsaw/releases/download/v0.2.13/chainsaw_linux_arm64.tar.gz": "f0bbbd1d4b6090bec8ad82305251098b7e9e5069dc67b328d68aeb57dc2974f7",
}
