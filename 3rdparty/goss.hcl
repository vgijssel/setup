source = "https://github.com/goss-org/goss/releases/download/v${version}/goss-${os}-${arch}"
description = "Quick and Easy server testing/validation"
homepage = "https://goss.rocks"
binaries = ["goss"]
dont-extract = true

version "0.4.9" {
  auto-version {
    github-release = "goss-org/goss"
  }
}

on "unpack" {
  rename {
    from = "${root}/goss-${os}-${arch}"
    to = "${root}/goss"
  }

  chmod {
    file = "${root}/goss"
    mode = 448
  }
}

sha256sums = {
  "https://github.com/goss-org/goss/releases/download/v0.4.9/goss-linux-amd64": "87dd36cfa1b8b50554e6e2ca29168272e26755b19ba5438341f7c66b36decc19",
  "https://github.com/goss-org/goss/releases/download/v0.4.9/goss-darwin-amd64": "e0c1b22360ced9f5394e64244877dfe1d3488aee9de75c56b9e02ae72c3fe4ff",
  "https://github.com/goss-org/goss/releases/download/v0.4.9/goss-darwin-arm64": "111d2ada89f8787838d176011de2fd0cfe8959c64c2698ce28feb587337d01fc",
  "https://github.com/goss-org/goss/releases/download/v0.4.9/goss-linux-arm64": "14fd24ac08236559f4809e6a627792d1b947ed98654bba1662ef1d6122d77e18",
}
