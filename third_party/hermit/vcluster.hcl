binaries = ["vcluster"]
source = "https://github.com/loft-sh/vcluster/releases/download/v${version}/vcluster-${os}-${arch}"
description = "vCluster - Create fully functional virtual Kubernetes clusters - Each vcluster runs inside a namespace of the underlying k8s cluster. It's cheaper than creating separate full-blown clusters and it offers better multi-tenancy and isolation than regular namespaces."
test = "vcluster --help"
dont-extract = true
homepage = "https://www.vcluster.com"

on "unpack" {
  rename {
    from = "${root}/vcluster-${os}-${arch}"
    to = "${root}/vcluster"
  }

  chmod {
    file = "${root}/vcluster"
    mode = 493
  }
}

version "0.32.1" {
  auto-version {
    github-release = "loft-sh/vcluster"
  }
}

sha256sums = {
  "https://github.com/loft-sh/vcluster/releases/download/v0.32.1/vcluster-linux-amd64": "f5d23f17e6bcb5b8c8d21570d51a424c7582927ada6d3e899a9e02bd9e244821",
  "https://github.com/loft-sh/vcluster/releases/download/v0.32.1/vcluster-darwin-amd64": "1eaf720220309de163220860ac12aff80a1878ea07536404b40f0d2bcd94aebd",
  "https://github.com/loft-sh/vcluster/releases/download/v0.32.1/vcluster-darwin-arm64": "636db23a400b7912e3bf0ae9494caaf8bc7a07681678f24046a9db10e06e5504",
  "https://github.com/loft-sh/vcluster/releases/download/v0.32.1/vcluster-linux-arm64": "90d4de0bdd68a5a8d524e9cab1371190f30ae4d3769760eba046497a40cac7a6",
}
