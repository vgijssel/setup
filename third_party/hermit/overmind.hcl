description = "Process manager for Procfile-based applications and tmux"
homepage = "https://github.com/DarthSim/overmind"
binaries = ["overmind"]
test = "overmind --version"

platform "darwin" "amd64" {
  source = "https://github.com/DarthSim/overmind/releases/download/v${version}/overmind-v${version}-darwin-amd64.gz"
}

platform "darwin" "arm64" {
  source = "https://github.com/DarthSim/overmind/releases/download/v${version}/overmind-v${version}-darwin-arm64.gz"
}

platform "linux" "amd64" {
  source = "https://github.com/DarthSim/overmind/releases/download/v${version}/overmind-v${version}-linux-amd64.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/DarthSim/overmind/releases/download/v${version}/overmind-v${version}-linux-arm64.gz"
}

version "2.5.1" {
  auto-version {
    github-release = "DarthSim/overmind"
  }
}

on "unpack" {
  rename {
    from = "${root}/overmind-v${version}-${os}-${arch}"
    to = "${root}/overmind"
  }

  chmod {
    file = "${root}/overmind"
    mode = 493
  }
}

sha256sums = {
  "https://github.com/DarthSim/overmind/releases/download/v2.5.1/overmind-v2.5.1-darwin-amd64.gz": "0019dfc4b32d63c1392aa264aed2253c1e0c2fb09216f8e2cc269bbfb8bb49b5",
  "https://github.com/DarthSim/overmind/releases/download/v2.5.1/overmind-v2.5.1-darwin-arm64.gz": "0019dfc4b32d63c1392aa264aed2253c1e0c2fb09216f8e2cc269bbfb8bb49b5",
  "https://github.com/DarthSim/overmind/releases/download/v2.5.1/overmind-v2.5.1-linux-amd64.gz": "a17159b8e97d13f3679a4e8fbc9d4747f82d5af9f6d32597b72821378b5d0b6f",
  "https://github.com/DarthSim/overmind/releases/download/v2.5.1/overmind-v2.5.1-linux-arm64.gz": "42cb6d79c8adcf4c68dfb2ddf09e63a0803b023af5b17d42e05ccbfa4b86bee2",
}
