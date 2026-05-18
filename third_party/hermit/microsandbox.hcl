binaries = ["msb"]
test = "msb --version"

platform "darwin" "arm64" {
  source = "https://github.com/superradcompany/microsandbox/releases/download/v${version}/microsandbox-darwin-aarch64.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/superradcompany/microsandbox/releases/download/v${version}/microsandbox-linux-aarch64.tar.gz"

  on "unpack" {
    symlink {
      from = "${root}/libkrunfw.so.5.2.1"
      to = "${root}/libkrunfw.so.5"
    }
  }
}

platform "linux" "amd64" {
  source = "https://github.com/superradcompany/microsandbox/releases/download/v${version}/microsandbox-linux-x86_64.tar.gz"

  on "unpack" {
    symlink {
      from = "${root}/libkrunfw.so.5.2.1"
      to = "${root}/libkrunfw.so.5"
    }
  }
}

description = "A self-hosted platform for securely running AI-generated code in microVMs."
homepage = "https://microsandbox.dev"

version "0.4.6" {
  auto-version {
    github-release = "superradcompany/microsandbox"
  }
}

sha256sums = {
  "https://github.com/superradcompany/microsandbox/releases/download/v0.4.6/microsandbox-linux-x86_64.tar.gz": "8026fccb290904d27c634bf5f6185d38fbbe515c941281e46767d0f7726f6da7",
  "https://github.com/superradcompany/microsandbox/releases/download/v0.4.6/microsandbox-darwin-aarch64.tar.gz": "4667c5b14f777fbf6ae2c5b0d7a1642c6d736cc6e9b9f581bfe37bfe025dd1de",
  "https://github.com/superradcompany/microsandbox/releases/download/v0.4.6/microsandbox-linux-aarch64.tar.gz": "e4b147a827d295b18954f3094248da34b49d7fef277a0b9a8449695241cd46d3",
}
