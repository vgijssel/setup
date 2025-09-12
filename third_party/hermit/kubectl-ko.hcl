description = "Krew plugin to run kubectl commands with Kube-OVN"
binaries = ["kubectl-ko"]
source = "https://raw.githubusercontent.com/kubeovn/kube-ovn/refs/tags/v${version}/dist/images/kubectl-ko"
dont-extract = true
homepage = "https://kubeovn.github.io/docs/v1.13.x/en/ops/kubectl-ko/"

version "1.13.14" {
  auto-version {
    github-release = "kubeovn/kube-ovn"
  }
}

on "unpack" {
  chmod {
    file = "${root}/kubectl-ko"
    mode = 448
  }
}

sha256sums = {
  "https://raw.githubusercontent.com/kubeovn/kube-ovn/refs/tags/v1.13.14/dist/images/kubectl-ko": "4734220416482fbde189a04a8089f17efa3ca33aacc3b19b2948b19bdfc94303",
}
