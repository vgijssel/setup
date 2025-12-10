binaries = ["hcloud"]

platform "darwin" "amd64" {
  source = "https://github.com/hetznercloud/cli/releases/download/v${version}/hcloud-${os}-${arch}.tar.gz"
}

platform "darwin" "arm64" {
  source = "https://github.com/hetznercloud/cli/releases/download/v${version}/hcloud-${os}-${arch}.tar.gz"
}

platform "linux" "amd64" {
  source = "https://github.com/hetznercloud/cli/releases/download/v${version}/hcloud-${os}-${arch}.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/hetznercloud/cli/releases/download/v${version}/hcloud-${os}-${arch}.tar.gz"
}

description = "A command-line interface for Hetzner Cloud"

version "1.57.0" {
  auto-version {
    github-release = "hetznercloud/cli"
  }
}

sha256sums = {
  "https://github.com/hetznercloud/cli/releases/download/v1.57.0/hcloud-linux-amd64.tar.gz": "d32bc3419f528784425db947b490a31f70d86f30b2d7b1333f2d35cf969a546b",
  "https://github.com/hetznercloud/cli/releases/download/v1.57.0/hcloud-darwin-amd64.tar.gz": "4a4d476f822efe739a758675a5456a91b6aff9cb2329eb7b47bfe44e5c30a573",
  "https://github.com/hetznercloud/cli/releases/download/v1.57.0/hcloud-darwin-arm64.tar.gz": "6eac60f93e3985d3908b4f6b62958a34a720412e06da888ede2ed93034b2a66b",
  "https://github.com/hetznercloud/cli/releases/download/v1.57.0/hcloud-linux-arm64.tar.gz": "9e9ea78f3c15178fab5d054b74f7e331638781e947e926e144a04fb1467a3f14",
}
