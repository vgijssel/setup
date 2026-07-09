description = "OpenBao CLI (bao) - open source fork of HashiCorp Vault"
binaries = ["bao"]
test = "bao version"
homepage = "https://openbao.org"

platform "darwin" "arm64" {
  source = "https://github.com/openbao/openbao/releases/download/v${version}/bao_${version}_Darwin_arm64.tar.gz"
}

platform "darwin" "amd64" {
  source = "https://github.com/openbao/openbao/releases/download/v${version}/bao_${version}_Darwin_x86_64.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/openbao/openbao/releases/download/v${version}/bao_${version}_Linux_arm64.tar.gz"
}

platform "linux" "amd64" {
  source = "https://github.com/openbao/openbao/releases/download/v${version}/bao_${version}_Linux_x86_64.tar.gz"
}

version "2.5.5" {
  auto-version {
    github-release = "openbao/openbao"
  }
}

sha256sums = {
  "https://github.com/openbao/openbao/releases/download/v2.5.5/bao_2.5.5_Darwin_arm64.tar.gz": "944c8f18068305944edaa7d4a8b1d2895d2f2e7b0b09a2635210b0e5b4de84c9",
  "https://github.com/openbao/openbao/releases/download/v2.5.5/bao_2.5.5_Darwin_x86_64.tar.gz": "be712aafda1170a05dcc66af7066dc724b6b8a13c4976c74cc677233e4278329",
  "https://github.com/openbao/openbao/releases/download/v2.5.5/bao_2.5.5_Linux_arm64.tar.gz": "9b133729e503ecf4d52f1d4e062954b9fd3798f14335ad8af5f7435f5b8ebd16",
  "https://github.com/openbao/openbao/releases/download/v2.5.5/bao_2.5.5_Linux_x86_64.tar.gz": "2c5577707e97fc95c2086950f39880ead5e45b356c94388e5cb606f5a5c2b697",
}
