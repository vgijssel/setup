binaries = [
    "talm"
]
source = "https://github.com/cozystack/talm/releases/download/v${version}/talm-${os}-${arch}.tar.gz"
description = "Manage Talos Linux the GitOps Way!"

version "0.16.0" {
  auto-version {
    github-release = "cozystack/talm"
  }
}
