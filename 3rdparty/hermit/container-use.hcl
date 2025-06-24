binaries = ["cu"]
source = "https://github.com/dagger/container-use/releases/download/v${version}/container-use_v${version}_${os}_${arch}.tar.gz"
description = "Development environments for coding agents. Enable multiple agents to work safely and independently with your preferred stack."

version "0.0.5" {
  auto-version {
    github-release = "dagger/container-use"
  }
}