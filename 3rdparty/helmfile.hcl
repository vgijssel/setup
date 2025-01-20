description = "Helmfile is a declarative spec for deploying helm charts."
binaries = ["helmfile"]
test = "helmfile --version"
source = "https://github.com/helmfile/helmfile/releases/download/v${version}/helmfile_${version}_${os}_${arch}.tar.gz"

version "0.158.0" "0.169.2" {
  auto-version {
    ignore-invalid-versions = true
    version-pattern = "v(.*)"
  }
}

sha256sums = {
  "https://github.com/helmfile/helmfile/releases/download/v0.158.0/helmfile_0.158.0_linux_amd64.tar.gz": "dc4b437b830d9b181ba994faa21f194cfbdb4ea8527ea3dbbd1e8c153e45bdf1",
  "https://github.com/helmfile/helmfile/releases/download/v0.158.0/helmfile_0.158.0_darwin_amd64.tar.gz": "f28bb5fc93b6c208de670c932603c9f860c59be31e97385461726bb0b1e058f4",
  "https://github.com/helmfile/helmfile/releases/download/v0.158.0/helmfile_0.158.0_darwin_arm64.tar.gz": "3889cb7b4649e571cb1f4875ad89652a82ff0879160289bbc759a1d214fae3f1",
  "https://github.com/helmfile/helmfile/releases/download/v0.169.2/helmfile_0.169.2_linux_amd64.tar.gz": "34a5ca9c5fda733f0322f7b12a2959b7de4ab125bcf6531337751e263b027d58",
  "https://github.com/helmfile/helmfile/releases/download/v0.169.2/helmfile_0.169.2_darwin_amd64.tar.gz": "477c1e8badf63af1189e898994de9309d808613f49a058e904c2a46b0cdf70e4",
  "https://github.com/helmfile/helmfile/releases/download/v0.169.2/helmfile_0.169.2_darwin_arm64.tar.gz": "f049e4e4c8d484a66e0179caf3895728167920d2f9202f24c28280ef17a739e0",
}
