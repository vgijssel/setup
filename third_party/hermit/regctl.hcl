binaries = ["regctl"]

platform "darwin" "amd64" {
  source = "https://github.com/regclient/regclient/releases/download/v${version}/regctl-${os}-${arch}"
}

platform "darwin" "arm64" {
  source = "https://github.com/regclient/regclient/releases/download/v${version}/regctl-${os}-${arch}"
}

platform "linux" "amd64" {
  source = "https://github.com/regclient/regclient/releases/download/v${version}/regctl-${os}-${arch}"
}

platform "linux" "arm64" {
  source = "https://github.com/regclient/regclient/releases/download/v${version}/regctl-${os}-${arch}"
}

on unpack {
  rename { from = "${root}/regctl-${os}-${arch}" to = "${root}/regctl" }
}

description = "Docker and OCI Registry Client in Go and tooling using those libraries."
homepage = "https://regclient.org"

version "0.11.1" {
  auto-version {
    github-release = "regclient/regclient"
  }
}

sha256sums = {
  "https://github.com/regclient/regclient/releases/download/v0.11.1/regctl-linux-amd64": "d3de5d4e1bc4d771a56a835294f597815b67bb6c0c32462a8aa880e2ba831620",
  "https://github.com/regclient/regclient/releases/download/v0.11.1/regctl-darwin-amd64": "9769b3b9cf86d188b4c3bb116a9f58260daff634552e7934c2f32e284947af82",
  "https://github.com/regclient/regclient/releases/download/v0.11.1/regctl-darwin-arm64": "c7adabf87acdb029e49b74346ec4860b1b4a5aa6ca7113acfc51a3497d0bf854",
  "https://github.com/regclient/regclient/releases/download/v0.11.1/regctl-linux-arm64": "7caec09213a98e9e1b3c5f8aa4cfa1b6c12b5e3e96bfbb441b2289a4e6ba9758",
}
