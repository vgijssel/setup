binaries = ["devpod"]
source = "https://github.com/loft-sh/devpod/releases/download/v${version}/devpod-${os}-${arch}"
test = "devpod version"
dont-extract = true

on "unpack" {
  rename {
    from = "${root}/devpod-${os}-${arch}"
    to = "${root}/devpod"
  }

  chmod {
    file = "${root}/devpod"
    mode = 493
  }
}

description = "Codespaces but open-source, client-only and unopinionated: Works with any IDE and lets you use any cloud, kubernetes or just localhost docker."
homepage = "https://devpod.sh"

version "0.6.15" {
  auto-version {
    github-release = "loft-sh/devpod"
  }
}

sha256sums = {
  "https://github.com/loft-sh/devpod/releases/download/v0.6.15/devpod-linux-amd64": "cc50bce09229d5a6d448ac1d4494327f4b8f7a20321e5fcee3bfec1aef0d20c5",
  "https://github.com/loft-sh/devpod/releases/download/v0.6.15/devpod-darwin-amd64": "1205fc8626d9daa011479ded3ce7271359714f0d011acfcf739adf90901a6ee8",
  "https://github.com/loft-sh/devpod/releases/download/v0.6.15/devpod-darwin-arm64": "0c50934f4199732ff37e89708bc5c028ecda75d854a151cb2644e4ba39f4d7f7",
  "https://github.com/loft-sh/devpod/releases/download/v0.6.15/devpod-linux-arm64": "9226161e0c9f5a45d0f8d1778f940498e787b650f0e0fcf3c29f1f67e7a3f272",
}
