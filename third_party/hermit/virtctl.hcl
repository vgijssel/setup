binaries = ["virtctl"]
source = "https://github.com/kubevirt/kubevirt/releases/download/v${version}/virtctl-v${version}-${os}-${arch}"
description = "Kubernetes Virtualization API and runtime in order to define and manage virtual machines."
test = "virtctl --help"
dont-extract = true
homepage = "https://kubevirt.io"

on "unpack" {
    rename {
        from = "${root}/virtctl-v${version}-${os}-${arch}"
        to = "${root}/virtctl"
    }

    chmod {
        file = "${root}/virtctl"
        mode = 493
    }
}

version "1.5.0" {
  auto-version {
    github-release = "kubevirt/kubevirt"
  }
}

sha256sums = {
  "https://github.com/kubevirt/kubevirt/releases/download/v1.5.0/virtctl-v1.5.0-linux-amd64": "100fc12f13f4bdbcf32a2d74c1f4ed7cfd98404496f7b5d2d2ba48b3683aeffa",
  "https://github.com/kubevirt/kubevirt/releases/download/v1.5.0/virtctl-v1.5.0-darwin-amd64": "4389ae141f6feab2596bbc0a4cb58e31e5212d0c35b27502c98f0b3ae618faad",
  "https://github.com/kubevirt/kubevirt/releases/download/v1.5.0/virtctl-v1.5.0-darwin-arm64": "9a2ae65d385a90bd906abeafff0e53230c552e73edc9de1a9a30a957f0f297f5",
  "https://github.com/kubevirt/kubevirt/releases/download/v1.5.0/virtctl-v1.5.0-linux-arm64": "aabcf1571639aa5b9bdbaf005d78b5b2c21ebcf1b2f9f7bdc43caff693077549",
}
