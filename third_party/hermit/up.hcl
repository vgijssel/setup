binaries = ["up"]
description = "Upbound CLI for managing Universal Crossplane (UXP) and Upbound Cloud"

platform "darwin" "amd64" {
  source = "https://cli.upbound.io/stable/v${version}/bin/${os}_${arch}/up"
}

platform "darwin" "arm64" {
  source = "https://cli.upbound.io/stable/v${version}/bin/${os}_${arch}/up"
}

platform "linux" "amd64" {
  source = "https://cli.upbound.io/stable/v${version}/bin/${os}_${arch}/up"
}

platform "linux" "arm64" {
  source = "https://cli.upbound.io/stable/v${version}/bin/${os}_${arch}/up"
}

version "0.41.0" {
  auto-version {
    github-release = "upbound/up"
  }
}

sha256sums = {
  "https://cli.upbound.io/stable/v0.41.0/bin/linux_arm64/up": "b8a78d5aa3a7faa1b2d1316c518788ee2a61d3626804842ca67f83bb096208a9",
  "https://cli.upbound.io/stable/v0.41.0/bin/linux_amd64/up": "8cf19440cab26bcb1d581fa21d6e200ad3d06c79c97a74847edc842e2d9eba89",
  "https://cli.upbound.io/stable/v0.41.0/bin/darwin_amd64/up": "e9d31618af7669c23151b89c1ddd9056f27cc8a5ed805cad85ed052fc2b45894",
  "https://cli.upbound.io/stable/v0.41.0/bin/darwin_arm64/up": "7009fa5d580e8a3821b5cf8608170d2d2739a52b743d0ee62f45fc4f69b8fa3c",
}
