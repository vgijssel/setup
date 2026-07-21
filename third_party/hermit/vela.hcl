binaries = ["vela"]
source = "https://github.com/kubevela/kubevela/releases/download/v${version}/vela-v${version}-${os}-${arch}.tar.gz"
description = "KubeVela CLI - application delivery and multi-cluster orchestration on Kubernetes."
test = "vela help"
strip = 1
homepage = "https://kubevela.io"

version "1.11.0" {
  auto-version {
    github-release = "kubevela/kubevela"
  }
}

sha256sums = {
  "https://github.com/kubevela/kubevela/releases/download/v1.11.0/vela-v1.11.0-linux-amd64.tar.gz": "ec66f4d10a7a3ebd276573f60bbe20ade0559d6a9a4f04a736bb3125a4d5cd7f",
  "https://github.com/kubevela/kubevela/releases/download/v1.11.0/vela-v1.11.0-linux-arm64.tar.gz": "9b4f4200c0b120e92a84210d82cc89c4a4c7d7cb5c6a6a69f466ba89f644e544",
  "https://github.com/kubevela/kubevela/releases/download/v1.11.0/vela-v1.11.0-darwin-amd64.tar.gz": "d75106761979571f719cc1de11b41bd685e0785ef25a53c1dd3aa957b39bd62a",
  "https://github.com/kubevela/kubevela/releases/download/v1.11.0/vela-v1.11.0-darwin-arm64.tar.gz": "f008bbe3068c6b6e37f735f8b972cd43bf4c9b779bf8dcb335c03e47005bd968",
}
