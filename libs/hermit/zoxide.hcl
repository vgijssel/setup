description = "A smarter cd command"
homepage = "https://github.com/ajeetdsouza/zoxide"
binaries = ["zoxide"]

platform "darwin" "amd64" {
  source = "https://github.com/ajeetdsouza/zoxide/releases/download/v${version}/zoxide-${version}-x86_64-apple-darwin.tar.gz"
}

platform "darwin" "arm64" {
  source = "https://github.com/ajeetdsouza/zoxide/releases/download/v${version}/zoxide-${version}-aarch64-apple-darwin.tar.gz"
}

platform "linux" "amd64" {
  source = "https://github.com/ajeetdsouza/zoxide/releases/download/v${version}/zoxide-${version}-x86_64-unknown-linux-musl.tar.gz"
}

platform "linux" "arm64" {
  source = "https://github.com/ajeetdsouza/zoxide/releases/download/v${version}/zoxide-${version}-aarch64-unknown-linux-musl.tar.gz"
}

version "0.9.8" {
}

sha256sums = {
  "https://github.com/ajeetdsouza/zoxide/releases/download/v0.9.8/zoxide-0.9.8-x86_64-apple-darwin.tar.gz": "cfa865ffd1ba87df2962f40ebd80c366f1d2b484f0c05b6da6b0104f50822f86",
  "https://github.com/ajeetdsouza/zoxide/releases/download/v0.9.8/zoxide-0.9.8-aarch64-apple-darwin.tar.gz": "3d1ec4af7f3d351629f500b432e6c735caf3216ab3eaa76dbe8ffbc8f3006f5a",
  "https://github.com/ajeetdsouza/zoxide/releases/download/v0.9.8/zoxide-0.9.8-aarch64-unknown-linux-musl.tar.gz": "078cc9cc8cedb6c45edb84c0f5bad53518c610859c73bdb3009a52b89652c103",
  "https://github.com/ajeetdsouza/zoxide/releases/download/v0.9.8/zoxide-0.9.8-x86_64-unknown-linux-musl.tar.gz": "4092ee38aa1efde42e4efb2f9c872df5388198aacae7f1a74e5eb5c3cc7f531c",
}
