description = "Multithreaded PNG optimizer written in Rust"
binaries = ["oxipng"]
test = "oxipng --help"
source = "https://github.com/helmfile/vals/releases/download/v${version}/vals_${version}_${os}_${arch}.tar.gz"
strip = 1

linux {
  source = "https://github.com/shssoichiro/oxipng/releases/download/v${version}/oxipng-${version}-${xarch}-unknown-linux-gnu.tar.gz"
}

darwin {
  source = "https://github.com/shssoichiro/oxipng/releases/download/v${version}/oxipng-${version}-${xarch}-apple-darwin.tar.gz"
}

version "9.1.3" {
  auto-version {
    github-release = "shssoichiro/oxipng"
  }
}

sha256sums = {
  "https://github.com/shssoichiro/oxipng/releases/download/v9.1.3/oxipng-9.1.3-x86_64-unknown-linux-gnu.tar.gz": "85ef83cfe0b2e7c762509c47a89908f001d37895b4bb7f3732fb3a5427735d62",
  "https://github.com/shssoichiro/oxipng/releases/download/v9.1.3/oxipng-9.1.3-x86_64-apple-darwin.tar.gz": "06943c9f564ffe51f43c6c291875413fc4ffb9254e22260fdd228d9daacd3025",
  "https://github.com/shssoichiro/oxipng/releases/download/v9.1.3/oxipng-9.1.3-aarch64-apple-darwin.tar.gz": "cc1efd5867339369c3bda082750f05e3748973575efcbbeff885625d5159cca8",
}