description = "Kubernetes in Kubernetes - CLI tool for managing k3k clusters"
binaries = ["k3kcli"]
source = "https://github.com/rancher/k3k/releases/download/v${version}/k3kcli-${os}-${arch}"
homepage = "https://rancher.github.io/k3k-product-docs"
dont-extract = true

on "unpack" {
  rename {
    from = "${root}/k3kcli-${os}-${arch}"
    to = "${root}/k3kcli"
  }

  chmod {
    file = "${root}/k3kcli"
    mode = 493
  }
}

platform "linux" "arm64" {
}

version "1.0.2" {
  auto-version {
    github-release = "rancher/k3k"
  }
}

sha256sums = {
  "https://github.com/rancher/k3k/releases/download/v1.0.2/k3kcli-linux-amd64": "3a2404e7782505ed52e4a6410dbfc1d457d8b8d70697278079937e062b0f7984",
  "https://github.com/rancher/k3k/releases/download/v1.0.2/k3kcli-darwin-amd64": "81ef43dae1b0ae21b3accb3b41b533682377c122c99ad7373c9f3b521252a83f",
  "https://github.com/rancher/k3k/releases/download/v1.0.2/k3kcli-darwin-arm64": "59b10d011fb4c46ee052f8dc97dd618d91dfc74fdfa947ecf9b5fc25922d8566",
  "https://github.com/rancher/k3k/releases/download/v1.0.2/k3kcli-linux-arm64": "3a588ee2ad81dea6f9ca725a3fb1cd1764527679a77bff0e4ecb9691df6ddf46",
}
