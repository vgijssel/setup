binaries = ["cilium"]
test = "cilium version"
source = "https://github.com/cilium/cilium-cli/releases/download/v${version}/cilium-${os}-${arch}.tar.gz"
description = "CLI to install, manage & troubleshoot Kubernetes clusters running Cilium"
homepage = "https://cilium.io"

version "0.18.3" {
  auto-version {
    github-release = "cilium/cilium-cli"
  }
}

sha256sums = {
  "https://github.com/cilium/cilium-cli/releases/download/v0.18.3/cilium-darwin-arm64.tar.gz": "183471d178649b4e83e96a6f247acac8b3615c5ad91f023beb22d53ccd6fda5a",
  "https://github.com/cilium/cilium-cli/releases/download/v0.18.3/cilium-linux-arm64.tar.gz": "e0588268fc9ab6e0b7a363c4e15ecf69ed2a4cade956ab272745262e456f0e54",
  "https://github.com/cilium/cilium-cli/releases/download/v0.18.3/cilium-linux-amd64.tar.gz": "5fe565f3b98b5846b867319aa76bc057fca37894d80db56edc20e4e809d10b25",
  "https://github.com/cilium/cilium-cli/releases/download/v0.18.3/cilium-darwin-amd64.tar.gz": "9729b746d6bd16fb325d4d1d588fc69ee22078bef877531ccff25046e8ac4f2b",
}
