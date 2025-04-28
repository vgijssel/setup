binaries = ["hubble"]
description = "Hubble - Network, Service & Security Observability for Kubernetes using eBPF"
source = "https://github.com/cilium/hubble/releases/download/v${version}/hubble-${os}-${arch}.tar.gz"

version "1.17.2" {
  auto-version {
    github-release = "cilium/hubble"
  }
}

sha256sums = {
  "https://github.com/cilium/hubble/releases/download/v1.17.2/hubble-linux-amd64.tar.gz": "b048e73ee39ce1a46730460362afb14e08cf9edf2c541ab9dd8f2aadcb350ddc",
  "https://github.com/cilium/hubble/releases/download/v1.17.2/hubble-darwin-amd64.tar.gz": "e4a661f95a5473aed31840142014948c9e2e1cc8778b37e00ad21c9bf413f570",
  "https://github.com/cilium/hubble/releases/download/v1.17.2/hubble-darwin-arm64.tar.gz": "d84be9c81ab9452841c10559b8e1674ddf1aec9acdb3ef3bad9c1d2a2f231ba6",
  "https://github.com/cilium/hubble/releases/download/v1.17.2/hubble-linux-arm64.tar.gz": "0d2252b80ef5bb956dc8ae86c9a96b45ed85200b2818cbd69249a5a3a3b33e40",
}
