binaries = ["fleet"]
source = "https://github.com/rancher/fleet/releases/download/v${version}/fleet-${os}-${arch}"
description = "Rancher Fleet - GitOps at scale. CLI to create/apply Bundles from Helm charts, manifests, and fleet.yaml."
test = "fleet --help"
dont-extract = true
homepage = "https://fleet.rancher.io"

on "unpack" {
  rename {
    from = "${root}/fleet-${os}-${arch}"
    to = "${root}/fleet"
  }

  chmod {
    file = "${root}/fleet"
    mode = 493
  }
}

version "0.15.4" {
  auto-version {
    github-release = "rancher/fleet"
  }
}

sha256sums = {
  "https://github.com/rancher/fleet/releases/download/v0.15.4/fleet-linux-amd64": "1c4ad5ab30b7da5a45e093be58aa1efe27893a91ae302b7d5ae7250658be4f69",
  "https://github.com/rancher/fleet/releases/download/v0.15.4/fleet-linux-arm64": "e9e51734af674c9d2e89b56f82a4e727626e9676141d0bbf81e5bdf930841e37",
  "https://github.com/rancher/fleet/releases/download/v0.15.4/fleet-darwin-arm64": "5ac8563684d54398b8ff630f9beaf004cfbb1239e88cb08a3be923225584ea39",
}
