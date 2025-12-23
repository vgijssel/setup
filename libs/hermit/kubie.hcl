description = "A more powerful alternative to kubectx and kubens"
binaries = ["kubie"]
source = "https://github.com/sbstp/kubie/releases/download/v${version}/kubie-${os}-${arch}"
homepage = "https://blog.sbstp.ca/introducing-kubie/"

on unpack {
    rename { from = "${root}/kubie-${os}-${arch}" to = "${root}/kubie" }
}

version "0.24.1" {
  auto-version {
    github-release = "sbstp/kubie"
  }
}

sha256sums = {
  "https://github.com/sbstp/kubie/releases/download/v0.24.1/kubie-linux-amd64": "5135683bd544284468d46951ba91febfea55d19db914863c479b9c0fcc9b8da1",
  "https://github.com/sbstp/kubie/releases/download/v0.24.1/kubie-darwin-amd64": "03763534cc442e90833b1a5e4ef98dd2f85cb81a7e6a366d7d77e95806eed1d9",
  "https://github.com/sbstp/kubie/releases/download/v0.24.1/kubie-darwin-arm64": "b485539a2fe2cd97c498f14f29a158e059880b330774c029d5668bc19acd2e39",
}