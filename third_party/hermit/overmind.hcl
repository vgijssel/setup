description = "Process manager for Procfile-based applications and tmux"
homepage = "https://github.com/DarthSim/overmind"
binaries = ["overmind"]
test = "overmind --version"
strip = 1

platform "darwin" "amd64" {
  source = "https://github.com/DarthSim/overmind/releases/download/v${version}/overmind-v${version}-macos-amd64.gz"
}

platform "darwin" "arm64" {
  source = "https://github.com/DarthSim/overmind/releases/download/v${version}/overmind-v${version}-macos-arm64.gz"
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

sha256sums = {
  "https://github.com/DarthSim/overmind/releases/download/v2.5.1/overmind-v2.5.1-macos-amd64.gz": "58cc613d08bcb9b6c92b8b70e815d5dbb2ab9a30cfa6aa295ea796dc46ef1361",
  "https://github.com/DarthSim/overmind/releases/download/v2.5.1/overmind-v2.5.1-macos-arm64.gz": "04aa1dcf64b3d0272b51f49fd300ee346d0bd96e5cfc245121c8d56f2ffaac97",
  "https://github.com/DarthSim/overmind/releases/download/v2.5.1/overmind-v2.5.1-linux-amd64.gz": "a17159b8e97d13f3679a4e8fbc9d4747f82d5af9f6d32597b72821378b5d0b6f",
  "https://github.com/DarthSim/overmind/releases/download/v2.5.1/overmind-v2.5.1-linux-arm64.gz": "42cb6d79c8adcf4c68dfb2ddf09e63a0803b023af5b17d42e05ccbfa4b86bee2",
}
