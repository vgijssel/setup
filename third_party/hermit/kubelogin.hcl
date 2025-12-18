binaries = ["kubectl-oidc_login"]

on unpack {
  rename { from = "${root}/kubelogin" to = "${root}/kubectl-oidc_login" }
}

platform "darwin" "amd64" {
  source = "https://github.com/int128/kubelogin/releases/download/v${version}/kubelogin_${os}_${arch}.zip"
}

platform "darwin" "arm64" {
  source = "https://github.com/int128/kubelogin/releases/download/v${version}/kubelogin_${os}_${arch}.zip"
}

platform "linux" "amd64" {
  source = "https://github.com/int128/kubelogin/releases/download/v${version}/kubelogin_${os}_${arch}.zip"
}

platform "linux" "arm64" {
  source = "https://github.com/int128/kubelogin/releases/download/v${version}/kubelogin_${os}_${arch}.zip"
}

description = "kubectl plugin for Kubernetes OpenID Connect authentication (kubectl oidc-login)"

version "1.35.0" {
  auto-version {
    github-release = "int128/kubelogin"
  }
}

sha256sums = {
  "https://github.com/int128/kubelogin/releases/download/v1.35.0/kubelogin_linux_amd64.zip": "3397a9153e980178a83af72ae4646b8b9a1e9d61b30bbcac463881a148c81ccc",
  "https://github.com/int128/kubelogin/releases/download/v1.35.0/kubelogin_darwin_amd64.zip": "8237c7eb45b2fe752690903d10b9cddb505c655c5191421acb15652b90162860",
  "https://github.com/int128/kubelogin/releases/download/v1.35.0/kubelogin_darwin_arm64.zip": "24216995b3ba2eee1302bce5e323cfc5029045940b031f0631c81c4404d67098",
  "https://github.com/int128/kubelogin/releases/download/v1.35.0/kubelogin_linux_arm64.zip": "e4d4976ae991b7e25edd2f38aaec6dfa8e3f65d5e6eac7b87032dbb3e6dd01f8",
}
