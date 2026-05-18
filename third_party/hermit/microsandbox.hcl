binaries = ["msb"]
test = "msb --version"

platform "darwin" "arm64" {
  source = "https://github.com/superradcompany/microsandbox/releases/download/v${version}/msb-darwin-aarch64"

  on "unpack" {
    rename {
      from = "${root}/msb-darwin-aarch64"
      to = "${root}/msb"
    }
  }
}

platform "linux" "arm64" {
  source = "https://github.com/superradcompany/microsandbox/releases/download/v${version}/msb-linux-aarch64"

  on "unpack" {
    rename {
      from = "${root}/msb-linux-aarch64"
      to = "${root}/msb"
    }
  }
}

platform "linux" "amd64" {
  source = "https://github.com/superradcompany/microsandbox/releases/download/v${version}/msb-linux-x86_64"

  on "unpack" {
    rename {
      from = "${root}/msb-linux-x86_64"
      to = "${root}/msb"
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
  "https://github.com/superradcompany/microsandbox/releases/download/v0.4.6/msb-linux-x86_64": "7c7c107785d71fb43bab26b049a75caf1b4c8c8b98388abe5d08888b95f6e45e",
  "https://github.com/superradcompany/microsandbox/releases/download/v0.4.6/msb-darwin-aarch64": "ffca49cd5cc691cab8743d57134ce083e2f48c0f06186d9fd94bf59a57128f9f",
  "https://github.com/superradcompany/microsandbox/releases/download/v0.4.6/msb-linux-aarch64": "97528cbf9a4f32498c038ea7adf4e30d1d1e14fb0e94be2e8007f34327169bb9",
}
