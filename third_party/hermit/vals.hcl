description = "Helm-like configuration values loader with support for various sources"
binaries = ["vals"]
test = "vals --help"
source = "https://github.com/helmfile/vals/releases/download/v${version}/vals_${version}_${os}_${arch}.tar.gz"

version "0.38.0" {
  auto-version {
    github-release = "helmfile/vals"
  }
}

sha256sums = {
  "https://github.com/helmfile/vals/releases/download/v0.38.0/vals_0.38.0_darwin_arm64.tar.gz": "bd3237eeac3a4641cb77fb1be8e77783500e2d3195db1d6dd7028c3a5add1126",
  "https://github.com/helmfile/vals/releases/download/v0.38.0/vals_0.38.0_linux_amd64.tar.gz": "2f49d4f493b3470545a8afe021196aa8559a965a81ce6d3d1bd1db84aaed977e",
  "https://github.com/helmfile/vals/releases/download/v0.38.0/vals_0.38.0_darwin_amd64.tar.gz": "727df65307a1dcf3de9720886ec59a4a7e86aea27422e66133dab309545734c1",
}
