description = "Krew plugin to run kubectl commands with rook-ceph"
binaries = [
    "kubectl-rook-ceph"
]
source = "https://github.com/rook/kubectl-rook-ceph/releases/download/v${version}/kubectl-rook-ceph_v${version}_${os}_${arch}.tar.gz"

version "0.9.4" {
  auto-version {
    github-release = "rook/kubectl-rook-ceph"
  }
}
