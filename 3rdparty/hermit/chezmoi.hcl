description = "Manage your dotfiles across multiple diverse machines, securely."
homepage = "https://www.chezmoi.io/"
binaries = ["chezmoi"]
source = "https://github.com/twpayne/chezmoi/releases/download/v${version}/chezmoi_${version}_${os}_${arch}.tar.gz"

version "2.62.5" {
  auto-version {
    github-release = "twpayne/chezmoi"
  }
}

sha256sums = {
  "https://github.com/twpayne/chezmoi/releases/download/v2.62.5/chezmoi_2.62.5_linux_amd64.tar.gz": "a8a8dc36ff5b84889e855793dabdee45f93d747e6d795f12d443ca9359f30775",
  "https://github.com/twpayne/chezmoi/releases/download/v2.62.5/chezmoi_2.62.5_darwin_amd64.tar.gz": "a5b37a0484c1099424c0f282e3c252cd031f6e844acec4202cf2e33aeee7e385",
  "https://github.com/twpayne/chezmoi/releases/download/v2.62.5/chezmoi_2.62.5_darwin_arm64.tar.gz": "e5c4af7c6d3cf9a1b945e83e68e5b15746045f29ba773c15e0aabe0aff2dca3b",
  "https://github.com/twpayne/chezmoi/releases/download/v2.62.5/chezmoi_2.62.5_linux_arm64.tar.gz": "e3443d4f8cc21b35e3954c5c7af00017682d9bc1892100e7c0ef6366d71c7b53",
}